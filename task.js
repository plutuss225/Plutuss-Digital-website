import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  where,
  Timestamp,
  writeBatch,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { escapeHtml, statusClass, isSameDay } from "./utils/index.js";

// -----------------------
// Firebase config
// -----------------------
const firebaseConfig = {
  apiKey: "AIzaSyArlf_VMvWUUfa9OJxc9Pwpin9ZNo0YPt0",
  authDomain: "task-manager-508c0.firebaseapp.com",
  projectId: "task-manager-508c0",
  storageBucket: "task-manager-508c0.firebasestorage.app",
  messagingSenderId: "558305229551",
  appId: "1:558305229551:web:c88ddefe19f6c5e8c3f91a",
  measurementId: "G-NQJWKZVCE5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let todayLoginLogId = null;

async function loadAllocUsers() {
  const select = document.getElementById("alloc-user");
  if (!select) {
    console.error("❌ alloc-user select not found");
    return;
  }

  select.innerHTML = `<option value="">Select User</option>`;

  try {
    const snap = await getDocs(collection(db, "users"));
    console.log("👥 Users found:", snap.size);

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data?.email) return;

      // Optional: skip admins
      // if (data.role === "admin") return;

      const option = document.createElement("option");
      option.value = docSnap.id; // IMPORTANT: UID (matches your task assignment code)
      option.textContent = data.name || data.email;

      select.appendChild(option);
    });
  } catch (err) {
    console.error("🔥 Error loading alloc users:", err);
  }
}

let authHandled = false;
let todayLogId = null;
let dashboardLoaded = false;
let dashboardTasksCache = [];
let appIsActive = true;
let taskUpdateInProgress = false;

const ratingAllowedUIDs = [
  "tLvUFBcHntYT8jtIZ0oqf2eZQe32",
  "ibhWXrZpM6gbKhBmvDq7hrolLJ33",
  "KyZwFuTQb8Sn66X3EgCn8p1VRXh1",
  "r9SHgeQW5MgGJxDUpInw3uuTgX13",
  "ndQul7yefLVCTTsXWyXlgVgD7hp2",
  "KvGeVKfaLzePd6u3peEeLUsRmXv1",
];

let currentLoggedInEmail = null;
let currentLoggedInUid = null;

const MATRIX_USERS = [
  "Raviraj",
  "Shruti Avhad",
  "Mitali",
  "Vaibhav",
  "Abhi Sutar",
  "Arihant",
  "Anadi Mishra",
  "Mital Admin",
  "Utkarsh",
  "Shraddha Kamble",
  "Tejashri",
  "Akshad Pandav",
  "Shweta Bagaddeo",
  "Pratik Bhagwat Khedekar",
];

const MATRIX_CLIENTS = [
  "All Clients",
  "Appa",
  "Jitendra Nanaware",
  "Shivsena Maval",
  "Vishwajit Sir",
  "Trimortal",
  "Royal Court",
  "Plutuss Digital",
  "Nilesh Nikam",
  "Pramod",
  "Nilesh Taras",
  "Yogesh Babar",
  "Mayur Lande",
  "Prosumers",
  "Other",
];
const MATRIX_TASK_TYPES = [
  "Posting",
  "Graphic design",
  "Reel",
  "Boosting",
  "Outdoor Shooting",
  "Content Writing",
  "Motion Graphics",
  "Website Work",
  "Other",
];

// map stored ids → pretty labels
const TASK_TYPE_LABELS = {
  posting: "Posting",
  graphic_design: "Graphic design", // <-- important
  reel: "Reel",
  boosting: "Boosting",
  outdoor_shoot: "Outdoor Shooting",
  content_writing: "Content Writing",
  motion_graphics: "Motion Graphics",
  website_work: "Website Work",
  other: "Other",
};

// Convert user email/name to consistent matrix key
// 🔹 Convert raw task.user to matrix user name (Arihant, Mitali, etc.)
function normalizeUserForMatrix(task, emailToNameMap) {
  let userName = (task.assignedName || "").trim();
  if (userName) return userName;

  const email = (task.assignedTo || "").toLowerCase();
  if (!email) return "";

  if (emailToNameMap && emailToNameMap[email]) {
    return emailToNameMap[email];
  }

  // fallback – will not match MATRIX_USERS but at least not empty
  return email;
}

// 🔹 Convert raw task.client to matrix client name
function normalizeClientForMatrix(task) {
  const raw = resolveClientName(task); // already in your file
  if (!raw || raw === "-" || !raw.trim()) return "";

  // Map "Others" -> "Other" so it matches MATRIX_CLIENTS
  if (raw.toLowerCase() === "others") return "Other";

  return raw.trim();
}

// 🔹 Convert taskTypeId/taskType to matrix label
// Convert stored task record into the matrix column label.
// Accepts either task object or a raw string (task.taskTypeId / taskType).
function normalizeTaskTypeForMatrix(taskOrRaw) {
  // accept being passed either the task object or the raw id/label
  let raw = "";
  if (!taskOrRaw) raw = "";
  else if (typeof taskOrRaw === "string") raw = taskOrRaw;
  else raw = (taskOrRaw.taskTypeId || taskOrRaw.taskType || "").toString();

  raw = raw.trim();

  if (!raw) return "Other";

  // 1) direct mapping by id
  if (TASK_TYPE_LABELS[raw]) return TASK_TYPE_LABELS[raw];

  // 2) try lower-case key (in case mapping used lowercase keys)
  const lower = raw.toLowerCase();
  if (TASK_TYPE_LABELS[lower]) return TASK_TYPE_LABELS[lower];

  // 3) if raw already looks like a pretty label, canonicalize it
  const pretty = raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  if (MATRIX_TASK_TYPES.includes(pretty)) return pretty;

  // 4) fallback: log unknown for debugging, return Other
  console.warn("Unknown task type for matrix:", raw);
  return "Other";
}

async function backfillDateDoneFromDateAssigned() {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("status", "==", "done"));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.log("No done tasks found for backfill.");
      alert("No done tasks found for backfill.");
      return;
    }

    let batch = writeBatch(db);
    let ops = 0;
    let updatedCount = 0;

    snap.forEach((docSnap) => {
      const data = docSnap.data() || {};

      // Skip if dateDone already exists
      if (data.dateDone) return;

      // Choose which date to use as completion date
      const sourceDate = data.dateAssigned || data.deadline || null;
      if (!sourceDate) return;

      batch.update(doc(db, "tasks", docSnap.id), {
        dateDone: sourceDate,
      });

      updatedCount++;
      ops++;

      // Firestore batch limit safety
      if (ops >= 400) {
        batch.commit();
        batch = writeBatch(db);
        ops = 0;
      }
    });

    if (ops > 0) {
      await batch.commit();
    }

    console.log(
      `✅ Backfill dateDone complete. Updated ${updatedCount} tasks.`
    );
    alert(`Backfill dateDone complete. Updated ${updatedCount} tasks.`);
  } catch (err) {
    console.error("❌ Backfill dateDone error:", err);
    alert("Backfill dateDone failed. Check console for details.");
  }
}
// 🔁 ONE-TIME: Normalize client + assignedName fields in existing tasks
async function backfillNormalizeClientsAndUsers() {
  try {
    const tasksRef = collection(db, "tasks");
    const snap = await getDocs(tasksRef);

    if (snap.empty) {
      console.log("No tasks found for normalization.");
      alert("No tasks found for normalization.");
      return;
    }

    let batch = writeBatch(db);
    let ops = 0;
    let updatedCount = 0;

    snap.forEach((docSnap) => {
      const data = docSnap.data() || {};

      const originalClient =
        data.client || data.clientId || data["client-name"] || "";
      const normalizedClient = normalizeClientForMatrix(originalClient);

      const originalAssignedName = data.assignedName || "";
      const normalizedAssignedName = normalizeUserForMatrix(
        data.assignedName,
        data.assignedTo
      );

      const updates = {};

      // Only update if different
      if (normalizedClient && normalizedClient !== originalClient) {
        updates.client = normalizedClient;
      }

      if (
        normalizedAssignedName &&
        normalizedAssignedName !== originalAssignedName
      ) {
        updates.assignedName = normalizedAssignedName;
      }

      if (Object.keys(updates).length === 0) return; // nothing to change

      batch.update(doc(db, "tasks", docSnap.id), updates);
      updatedCount++;
      ops++;

      if (ops >= 400) {
        batch.commit();
        batch = writeBatch(db);
        ops = 0;
      }
    });

    if (ops > 0) {
      await batch.commit();
    }

    console.log(
      `✅ Normalization backfill complete. Updated ${updatedCount} tasks.`
    );
    alert(`Normalization backfill complete. Updated ${updatedCount} tasks.`);
  } catch (err) {
    console.error("❌ Normalization backfill error:", err);
    alert("Normalization backfill failed. Check console for details.");
  }
}

function safeWhere(field, op, value) {
  if (value === undefined) {
    console.error(`🔥 Firestore where() ERROR → ${field} is undefined`);
  }
  return where(field, op, value);
}

window.auth = auth;
window.db = db;

let currentAdmin = null;

document.addEventListener("DOMContentLoaded", () => {
  const dashboardBtn = document.getElementById("dashboard-btn");
  const adminPanel = document.getElementById("admin-panel");
  const dashboardSection = document.getElementById("dashboard-section");
  const monthInput = document.getElementById("chart-month-filter");

  if (dashboardBtn && adminPanel && dashboardSection) {
    dashboardBtn.addEventListener("click", () => {
      // Show dashboard UI
      adminPanel.style.display = "none";
      dashboardSection.style.display = "block";
      document.getElementById("monthly-task-table").style.display = "none";
      document.querySelector(".daily-tasks-wrapper").style.display = "block";

      // Set default month to current month if empty
      const today = new Date();
      const defaultMonth =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0");

      if (monthInput && !monthInput.value) {
        monthInput.value = defaultMonth; // auto-fill the selector
      }

      // 🔹 Load chart based on selected month
      loadClientTaskChart(monthInput ? monthInput.value : defaultMonth);
    });
  }

  // 🔹 Month selector change listener
  if (monthInput) {
    monthInput.addEventListener("change", () => {
      const newMonth = monthInput.value;
      // reload chart based on selected month
      loadClientTaskChart(newMonth);
    });
  }
});

// Example usage
let currentUserEmail = null;
let currentUser = null;
let userTasksLoaded = false;

const adminEmails = [
  "mitaliplutuss@gmail.com",
  "shwetabagaddeo1996@gmail.com",
  "patilraviraj998@gmail.com",
];

// -----------------------
// UI Elements
// -----------------------
const authSection = document.getElementById("auth-section");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const dashboard = document.getElementById("dashboard");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const toggleToLogin = document.getElementById("toggle-link");
const toggleToSignup = document.getElementById("toggle-link-2");
const welcomeMsg = document.getElementById("welcome-message");
const adminPanel = document.getElementById("admin-panel");
const userPanel = document.getElementById("user-panel");
const userTasksTable = document.getElementById("user-tasks-table");
// -----------------------
// Helpers
// -----------------------

window.addEventListener("DOMContentLoaded", () => {
  authSection.classList.remove("hidden");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");

  adminPanel.classList.add("hidden");
});
if (toggleToSignup) {
  toggleToSignup.addEventListener("click", () => {
    // hide login, show signup
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signupForm.style.display = "block";
  });
}

if (toggleToLogin) {
  toggleToLogin.addEventListener("click", () => {
    // hide signup, show login
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    loginForm.style.display = "block";
  });
}

document
  .getElementById("btn-logout-admin")
  ?.addEventListener("click", async () => {
    await handleLogout(auth.currentUser);
  });
document
  .getElementById("btn-logout-user")
  ?.addEventListener("click", async () => {
    await handleLogout();
  });

// -----------------------
// Render User Tasks
// -----------------------
let tasksRendered = false;

// 🟢 Call this after login

// Update status helper for user tasks
// Update status helper for user tasks — REPLACE YOUR OLD FUNCTION WITH THIS

// Update status helper

// --- Daily report for single user ---

// Helper to parse Firestore string dates
function parseCreatedAt(str) {
  if (!str) return null;
  const cleanStr = str.split(" UTC")[0].replace(" at ", " ");
  const date = new Date(cleanStr);
  return isNaN(date.getTime()) ? null : date;
}

async function createUserRecord(user) {
  const userRef = doc(db, "users", user.uid); // use uid or email
  await setDoc(userRef, {
    name: user.displayName || "",
    email: user.email,
    createdAt: serverTimestamp(),
  });
}
signupBtn.addEventListener("click", async () => {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCred.user;

    // Firestore write wrapped safely
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: "user",
        createdAt: new Date(),
      });
    } catch (fireErr) {
      // Don’t show permission issues to user — silently log
      console.warn("Firestore write issue:", fireErr);
      // continue signup flow, no alert needed
    }

    await sendEmailVerification(user);

    alert(`🎉 Signup successful! Welcome, ${name}.`);
    alert(
      `📩 Verification email has been sent to ${email}. Please check inbox + spam.`
    );
  } catch (err) {
    console.error("Signup error (debug):", err);

    if (err.code === "auth/email-already-in-use") {
      alert("⚠️ This email is already registered.");
    } else if (err.code === "auth/weak-password") {
      alert("⚠️ Password must be at least 6 characters.");
    } else {
      alert("⚠️ Something went wrong. Please try again.");
    }
  }
});
// 📝 Step 1: Define this once at the top

// 🧑‍💻 Step 2: Your existing login event
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // ✅ FIX 2 — CREATE LOGIN LOG IMMEDIATELY
    await ensureTodayLoginLogForUser(user);

    console.log("Login log guaranteed for", user.email);

    // Stop here. UI will be handled by onAuthStateChanged
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

function resetUIAfterLogout() {
  // 🔐 Show login section
  const authSection = document.getElementById("auth-section");
  if (authSection) authSection.style.display = "flex";

  // ❌ Hide ALL app content
  document.getElementById("app-section")?.classList.add("hidden");
  document.getElementById("admin-panel")?.classList.add("hidden");
  document.getElementById("user-panel")?.classList.add("hidden");

  // ❌ Hide logout buttons
  document
    .getElementById("btn-logout-admin")
    ?.style.setProperty("display", "none");
  document
    .getElementById("btn-logout-user")
    ?.style.setProperty("display", "none");

  // ❌ Hide dashboard button
  document
    .getElementById("dashboard-btn")
    ?.style.setProperty("display", "none");

  // ❌ Hide login info bar
  const loginInfo = document.getElementById("login-info");
  if (loginInfo) loginInfo.style.display = "none";

  // 🔄 Reset login info text (safety)
  document.getElementById("login-user-name") &&
    (document.getElementById("login-user-name").textContent = "User");

  document.getElementById("login-time-text") &&
    (document.getElementById("login-time-text").textContent = "—");

  document.getElementById("logout-time-text") &&
    (document.getElementById("logout-time-text").textContent = "—");
}

async function logoutAdmin(user) {
  await handleLogout(user);

  async function logoutUser() {
    await handleLogout();
  }

  // Buttons

  async function getUserByEmail(email) {
    const userDoc = await getDoc(doc(db, "users", email));
    if (userDoc.exists()) return userDoc.data();
    alert("User not found!");
    return null;
  }

  function sendWhatsApp(user, task) {
    console.log("hi");
  }

  toggleToSignup.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signupForm.style.display = "block";
  });

  toggleToLogin.addEventListener("click", () => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  // UPDATE BOTH PANELS SAFELY
  if (infoDivAdmin) infoDivAdmin.innerHTML = html;
  if (infoDivUser) infoDivUser.innerHTML = html;
}

const viewLogsBtn = document.getElementById("view-logs-btn");
const logDateInput = document.getElementById("log-date");
const logsTable = document.getElementById("logs-table"); // 👈 Add this
const logsTableBody = document.querySelector("#logs-table tbody");

function formatDuration(ms) {
  if (!ms || ms < 0) return "-";

  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function toTimeOnly(ts) {
  try {
    if (!ts) return "-";
    if (ts.toDate) return ts.toDate().toLocaleTimeString();
    return "-";
  } catch {
    return "-";
  }
}

// main handler (drop-in replacement)
document.getElementById("view-logs-btn").addEventListener("click", async () => {
  const selectedDate = document.getElementById("log-date").value;
  const tbody = document.querySelector("#logs-table tbody");

  if (!selectedDate) {
    alert("Please select a date");
    return;
  }

  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const logsRef = collection(db, "loginLogs");
    const q = query(logsRef, where("date", "==", selectedDate));
    const snap = await getDocs(q);

    if (snap.empty) {
      tbody.innerHTML =
        "<tr><td colspan='4'>No logs found for this date.</td></tr>";
      return;
    }

    // Cache prevents multiple lookups for same user email
    const nameCache = new Map();

    const rowPromises = snap.docs.map(async (docSnap) => {
      const d = docSnap.data();

      const loginTs = d.loginTime || null;
      const logoutTs = d.logoutTime || null;

      // LOGIN & LOGOUT TIME (time only)
      const loginTimeStr = loginTs ? toTimeOnly(loginTs) : "-";
      const logoutTimeStr = logoutTs ? toTimeOnly(logoutTs) : "-";

      // EXTRA TIME = ONLY the time ABOVE 9 hours
      let extraStr = "-";
      if (loginTs && logoutTs) {
        const totalMs =
          logoutTs.toDate().getTime() - loginTs.toDate().getTime();
        const nineHoursMs = 9 * 60 * 60 * 1000;

        if (totalMs > nineHoursMs) {
          const extraMs = totalMs - nineHoursMs;
          extraStr = formatDuration(extraMs);
        }
      }
      // if logout missing → extra stays "-"

      // LOOKUP USER NAME (via email) — with cache
      let userName = d.email || "-";

      try {
        if (d.email) {
          if (nameCache.has(d.email)) {
            userName = nameCache.get(d.email);
          } else {
            const uq = query(
              collection(db, "users"),
              where("email", "==", d.email)
            );
            const usnap = await getDocs(uq);
            if (!usnap.empty) {
              userName = usnap.docs[0].data().name || d.email;
              nameCache.set(d.email, userName);
            }
          }
        }
      } catch (err) {
        console.warn("User lookup failed:", err);
      }

      return `
        <tr>
          <td>${userName}</td>
          <td>${loginTimeStr}</td>
          <td>${logoutTimeStr}</td>
          <td>${extraStr}</td>
        </tr>
      `;
    });

    const rows = await Promise.all(rowPromises);
    tbody.innerHTML = rows.join("");
  } catch (err) {
    console.error("Error loading logs:", err);
    tbody.innerHTML =
      "<tr><td colspan='4'>Error loading logs. Check console.</td></tr>";
  }
});

async function displayLoginInfo(email, name) {
  const nameEl = document.getElementById("login-user-name");
  const loginTimeEl = document.getElementById("login-time-text");
  const logoutTimeEl = document.getElementById("logout-time-text");

  if (!nameEl || !loginTimeEl || !logoutTimeEl) return;

  // ✅ Set name immediately
  nameEl.textContent = name;

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  let loginTime = "—";
  let logoutTime = "—";

  try {
    const q = query(
      collection(db, "loginLogs"),
      where("email", "==", email),
      where("date", "==", today)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      const data = snap.docs[0].data();

      if (data.loginTime?.toDate) {
        loginTime = data.loginTime.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      if (data.logoutTime?.toDate) {
        logoutTime = data.logoutTime.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
  } catch (err) {
    console.error("Login info error:", err);
  }

  // ✅ Update times
  loginTimeEl.textContent = loginTime;
  logoutTimeEl.textContent = logoutTime;
  document.getElementById("login-info").style.display = "block";
}

async function loadLoginTimes(email, role) {
  if (!appIsActive) return;

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  let spanId = "login-times-user";
  if (role === "admin") spanId = "login-times-admin";
  if (role === "supervisor") spanId = "login-times-supervisor";

  const span = document.getElementById(spanId);
  if (!span) return;

  try {
    const q = query(
      collection(db, "loginLogs"),
      where("email", "==", email),
      where("date", "==", today)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      span.textContent = " | Login info not available";
      return;
    }

    const log = snap.docs[0].data();

    const login = formatTimeAMPM(log.loginTime);
    const logout = log.logoutTime ? formatTimeAMPM(log.logoutTime) : "-";

    span.textContent = ` | Login time: ${login} | Logout time: ${logout}`;
  } catch (err) {
    console.error("Login time load error:", err);
    span.textContent = " | Login info not available";
  }
}

// Task creation button
// Task creation button

let assignTaskInProgress = false;

document.getElementById("btn-add-task").addEventListener("click", async (e) => {
  console.log("AUTH UID:", auth.currentUser?.uid);
  e.preventDefault();

  if (!appIsActive) return;
  if (assignTaskInProgress) return;

  assignTaskInProgress = true;

  const btn = e.target;
  btn.disabled = true;
  btn.textContent = "Assigning...";

  try {
    const deadline = document.getElementById("alloc-deadline").value;
    const assignedToUID = document.getElementById("alloc-user").value;
    const client = document.getElementById("alloc-client").value;
    const taskType = document.getElementById("alloc-task-type").value;
    const count = parseInt(document.getElementById("alloc-count").value, 10);

    if (
      !deadline ||
      !assignedToUID ||
      !client ||
      !taskType ||
      !count ||
      count <= 0
    ) {
      alert("Please fill all fields properly!");
      return;
    }

    // ✅ SEND WHATSAPP FIRST (NOW GUARANTEED)
    await sendWhatsAppNotification(
      assignedToUID,
      taskType,
      currentAdmin?.name || "Admin",
      deadline
    );

    // 🔹 Fetch user
    const userSnap = await getDoc(doc(db, "users", assignedToUID));
    if (!userSnap.exists()) {
      alert("Assigned user not found!");
      return;
    }

    const userData = userSnap.data();
    const assignedToEmail = userData.email || "";
    const assignedName = userData.name || "";

    const creator = auth.currentUser;
    let assignedBy = "Admin";
    let assignedByEmail = "";

    if (creator) {
      const creatorDoc = await getDoc(doc(db, "users", creator.uid));
      if (creatorDoc.exists()) {
        const c = creatorDoc.data();
        assignedBy = c.name || creator.email || "Admin";
        assignedByEmail = c.email || creator.email || "";
      }
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    // 🔹 ATOMIC BATCH
    const batch = writeBatch(db);

    const allocationRef = doc(collection(db, "taskAllocations"));
    batch.set(allocationRef, {
      deadline,
      userId: assignedToUID,
      clientId: client,
      taskTypeId: taskType,
      assignedCount: count,
      status: "to-do",
      createdBy: assignedBy,
      createdAt: serverTimestamp(),
      createdAtDate: todayStr,
      lastUpdatedAt: serverTimestamp(),
    });

    for (let i = 0; i < count; i++) {
      const taskRef = doc(collection(db, "tasks"));
      batch.set(taskRef, {
        allocationId: allocationRef.id,
        userId: assignedToUID,
        clientId: client,
        taskTypeId: taskType,
        status: "to-do",
        assignedTo: assignedToEmail,
        assignedName,
        assignedBy,
        assignedByEmail,
        deadline,
        dateAssigned: todayStr,
        doneAt: null,
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();

    alert(`Assigned ${count} task(s) successfully!`);

    // reset form
    document.getElementById("alloc-deadline").value = "";
    document.getElementById("alloc-user").value = "";
    document.getElementById("alloc-client").value = "";
    document.getElementById("alloc-task-type").value = "";
    document.getElementById("alloc-count").value = "";
  } catch (err) {
    console.error("Task assignment failed:", err);
    alert("Failed to assign tasks.");
  } finally {
    assignTaskInProgress = false;
    btn.disabled = false;
    btn.textContent = "Assign Tasks";
  }
});

const dashboardBtn = document.getElementById("dashboard-btn");
const dashboardSection = document.getElementById("dashboard-section");
const backToAdminBtn = document.getElementById("back-to-admin-btn");

// Hide dashboard initially
if (dashboardSection) dashboardSection.style.display = "none";
// 🟢 Dashboard button click

// 🔙 Back to Admin
if (backToAdminBtn) {
  backToAdminBtn.addEventListener("click", () => {
    dashboardSection.style.display = "none";
    adminPanel.style.display = "block";
    backToAdminBtn.style.display = "none";
    dashboardBtn.style.display = "block";
    document.getElementById("monthly-task-table").style.display = "block";
    document.querySelector(".daily-tasks-wrapper").style.display = "block";
  });
}

let clientChartInstance = null;

function renderClientTasksPieChart(counts) {
  const labels = Object.keys(counts);
  const values = Object.values(counts);

  const canvas = document.getElementById("clientTasksChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (clientChartInstance) {
    clientChartInstance.destroy();
  }

  clientChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 15,
          },
        },
      },
    },
  });
}

dashboardBtn.addEventListener("click", () => {
  loadClientTaskChart();
  console.log("In dashboard");
  dashboardSection.style.display = "block";
  adminPanel.style.display = "none";
  backToAdminBtn.style.display = "block";
  dashboardBtn.style.display = "none";
  loadDashboard();
});
// ✅ Show dashboard button only for admin

// 📊 Dashboard loading logic
async function loadDashboard() {
  if (!appIsActive) return;
  // 🛑 Prevent repeated Firestore reads
  if (dashboardLoaded) {
    processDashboardData(dashboardTasksCache);
    return;
  }

  try {
    dashboardLoaded = true;

    const snapshot = await getDocs(collection(db, "tasks"));

    dashboardTasksCache = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    processDashboardData(dashboardTasksCache);
  } catch (err) {
    console.error("Dashboard load failed:", err);
    dashboardLoaded = false; // allow retry if it failed
  }
}

function processDashboardData(tasks) {
  let totalTasks = 0;
  let completedTasks = 0;
  let pendingTasks = 0;
  const clientCounts = {};

  for (const task of tasks) {
    totalTasks++;

    if (task.status === "done") completedTasks++;
    else pendingTasks++;

    // ✅ Use valid client name only
    const rawClient = task.client || task["client-name"];
    const client = rawClient && rawClient.trim() ? rawClient.trim() : null;

    // ✅ Count only if client exists and status is Done
    if (client && task.status === "Done") {
      if (!clientCounts[client]) clientCounts[client] = 0;
      clientCounts[client]++;
    }
  }

  // Update dashboard numbers
  document.getElementById("total-tasks-count").textContent = totalTasks;
  document.getElementById("completed-tasks-count").textContent = completedTasks;
  document.getElementById("pending-tasks-count").textContent = pendingTasks;

  drawClientChart(clientCounts);
}

// 🥧 Draw pie chart
let clientChart;
function drawClientChart(clientCounts) {
  const ctx = document.getElementById("clientTasksChart").getContext("2d");
  const clients = Object.keys(clientCounts);
  const counts = Object.values(clientCounts);

  if (clientChart) clientChart.destroy();

  clientChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: clients,
      datasets: [
        {
          label: "Completed Tasks per Client",
          data: counts,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Completed Tasks For Each Client",
        },
      },
    },
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const dashboardBtn = document.getElementById("dashboard-btn");
  const backToAdminBtn = document.getElementById("back-to-admin-btn");
  const dashboardSection = document.getElementById("dashboard-section");
  const adminPanel = document.getElementById("admin-panel");
  const allTasksTable = document.getElementById("all-tasks-table");
  const panelContainer = document.querySelector(".panel-container");
  if (dashboardSection) dashboardSection.style.display = "none";

  // Back to Admin
  if (backToAdminBtn) {
    backToAdminBtn.addEventListener("click", () => {
      dashboardSection.style.display = "none";
      adminPanel.style.display = "block";

      backToAdminBtn.style.display = "none";
      dashboardBtn.style.display = "block";
    });
  }

  // Dashboard Button Click
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", () => {
      const taskFilter = document.getElementById("task-filter");
      const filteredMonthTable = document.getElementById(
        "filtered-month-table"
      );
      dashboardBtn.style.display = "none";
      if (taskFilter) taskFilter.style.display = "none";
      if (filteredMonthTable) filteredMonthTable.style.display = "none";
      dashboardSection.style.display = "block";
      adminPanel.style.display = "none";
      backToAdminBtn.style.display = "block";
      dashboardBtn.style.display = "none";
      loadDashboard();
    });
  }
});

// 🟢 Ensure only one click listener is active
const generateBtn = document.getElementById("generateReportBtn");
if (generateBtn) {
  generateBtn.replaceWith(generateBtn.cloneNode(true));
}

function getJSDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  if (typeof value === "string") return new Date(value);
  if (value instanceof Date) return value;
  return null;
}

// DOM elements
const taskFilterDiv = document.getElementById("task-filter");
const filterMonthInput = document.getElementById("filter-month");
const filterBtn = document.getElementById("filter-btn");
const currentMonthTable = document.getElementById("current-month-table");
const filteredMonthTable = document.getElementById("filtered-month-table");

// Hide both tables initially

if (filteredMonthTable) filteredMonthTable.innerHTML = "";

// 🟢 Render tasks into a given table
async function renderTasksForMonth(
  targetTable,
  month,
  year,
  memberEmail = "",
  clientName = ""
) {
  if (!appIsActive) return;
  targetTable.innerHTML = `
  <thead>
    <tr>
      <th>Task Title</th>
      <th>Assigned To</th>
      <th>Client Name</th>
      <th>Deadline</th>
      <th>Status</th>
      <th>Rating</th>
      <th>Assigned By</th>
      <th>Backlog Remark</th>
      <th>Edit / Change Status</th>
      <th>Approve</th>
      <th>Delete</th>
    </tr>
  </thead>
  `;

  const tbody = document.createElement("tbody");
  const tasksSnap = await getDocs(collection(db, "tasks"));
  const tasks = [];

  tasksSnap.forEach((docSnap) => {
    const t = docSnap.data();

    // FIX for Firestore Timestamp (createdAt may be Timestamp or string)
    let createdDate = null;
    if (t.createdAt?.toDate) {
      createdDate = t.createdAt.toDate();
    } else if (typeof t.createdAt === "string") {
      createdDate = new Date(t.createdAt);
    } else if (t.createdAt instanceof Date) {
      createdDate = t.createdAt;
    }

    if (!createdDate || isNaN(createdDate)) return;

    if (
      createdDate.getMonth() === month &&
      createdDate.getFullYear() === year
    ) {
      // Apply member & client filters here (in-memory)
      if (memberEmail) {
        // tasks may store assignedTo as email or assignedUid — prefer assignedTo (email)
        const assignedToEmail = (t.assignedTo || "").toLowerCase();
        const assignedName = (t.assignedName || "").toLowerCase();
        if (
          assignedToEmail !== memberEmail.toLowerCase() &&
          assignedName !== memberEmail.toLowerCase()
        ) {
          return; // skip
        }
      }

      if (clientName) {
        const clientVal = (t.client || t["client-name"] || "")
          .toString()
          .trim();
        if (!clientVal) return;
        if (clientVal.toLowerCase() !== clientName.toLowerCase()) return;
      }

      tasks.push({ id: docSnap.id, ...t });
    }
  });

  if (tasks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No tasks found for these filters.</td></tr>`;
    targetTable.appendChild(tbody);
    return;
  }

  tasks.forEach((t) => {
    const deadline = t.deadline?.toDate
      ? t.deadline.toDate()
      : t.deadline
      ? new Date(t.deadline)
      : null;

    const tr = document.createElement("tr");
    tr.dataset.id = t.id;

    const rating =
      t.rating !== undefined && t.rating !== null && t.rating !== ""
        ? t.rating
        : "—";
    const backlogRemark = t.backlogRemark || "";

    const statusText = (t.status || "").toLowerCase();
    const isPendingDone =
      statusText === "done (pending approval)" ||
      statusText === "done - pending approval";
    const isApprovedDone = statusText === "done";

    tr.innerHTML = `
  <td>${escapeHtml(t.title || "")}</td>
  <td>${escapeHtml(t.assignedName || t.assignedTo || "")}</td>
  <td>${escapeHtml(t.client || t["client-name"] || "")}</td>
  <td class="due-date">${deadline ? deadline.toLocaleDateString() : "—"}</td>
  <td class="col-status">${escapeHtml(t.status || "")}</td>
  <td>${escapeHtml(rating.toString())}</td>
  <td>${escapeHtml(t.assignedBy || "-")}</td>
  <td><span class="remark-text">${escapeHtml(backlogRemark)}</span></td>

  <td>
    <button class="change-status-btn">Change Status</button>
  </td>
    <td>
    ${
      isPendingDone
        ? `<button class="approve-done-btn" data-id="${t.id}">Approve</button>`
        : isApprovedDone
        ? `<span class="approved-label">✔ Approved</span>`
        : `<span style="opacity:0.4;">—</span>`
    }
  </td>

  <td>
    <button class="delete-task-btn" data-id="${t.id}">
      ❌ Delete
    </button>
  </td>
`;

    tbody.appendChild(tr);
  });

  targetTable.appendChild(tbody);

  // Apply status styles after rendering
  document
    .querySelectorAll("#" + targetTable.id + " tbody tr")
    .forEach((row) => {
      const statusCell = row.querySelector(".col-status");
      const statusText = statusCell
        ? statusCell.textContent.trim().toLowerCase()
        : "";
      row.classList.remove("status-backlog", "status-todo", "status-done");
      if (statusText === "backlog") row.classList.add("status-backlog");
      else if (
        ["to-do", "todo", "to do", "pending", "in progress"].includes(
          statusText
        )
      )
        row.classList.add("status-todo");
      else if (statusText === "done") row.classList.add("status-done");
    });
}

function applyStatusStyle(row, status) {
  row.classList.remove("status-backlog", "status-todo", "status-done");

  if (status === "Backlog") row.classList.add("status-backlog");
  else if (status === "To Do") row.classList.add("status-todo");
  else if (status === "Done") row.classList.add("status-done");
}

// 🟢 Load current month tasks automatically (for admin)
async function showCurrentMonthTasksForAdmin() {
  if (taskFilterDiv) taskFilterDiv.style.display = "block";

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (filterMonthInput)
    filterMonthInput.value = `${currentYear}-${String(
      currentMonth + 1
    ).padStart(2, "0")}`;

  await renderTasksForMonth(currentMonthTable, currentMonth, currentYear);
}

let currentLoggedInUser = null;

async function ensureTodayLoginLogForUser(user) {
  const today = new Date().toLocaleDateString("en-CA");

  const q = query(
    collection(db, "loginLogs"),
    where("email", "==", user.email),
    where("date", "==", today)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    todayLoginLogId = snap.docs[0].id;
    return;
  }

  const docRef = await addDoc(collection(db, "loginLogs"), {
    email: user.email,
    date: today,
    loginTime: serverTimestamp(),
    logoutTime: null,
  });

  todayLoginLogId = docRef.id;
}

onAuthStateChanged(auth, async (user) => {
  const authSection = document.getElementById("auth-section");
  const adminPanel = document.getElementById("admin-panel");
  const userPanel = document.getElementById("user-panel");
  const dashboardBtn = document.getElementById("dashboard-btn");
  const dashboardSection = document.getElementById("dashboard-section");
  const logoutAdminBtn = document.getElementById("btn-logout-admin");
  const logoutUserBtn = document.getElementById("btn-logout-user");
  const adminWrapper = document.querySelector(".admin-wrapper");

  /* =========================
     🔴 LOGGED OUT
  ========================== */
  if (!user) {
    resetUIAfterLogout();
    if (authSection) authSection.style.display = "flex";
    return;
  }

  try {
    /* =========================
       🔹 LOAD USER DOC
    ========================== */
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    let userData;
    if (!snap.exists()) {
      userData = {
        name: user.displayName || "",
        email: user.email,
        role: "user",
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, userData);
    } else {
      userData = snap.data();
    }

    const displayName =
      userData.name || user.displayName || user.email.split("@")[0];

    /* =========================
       🟢 RESET UI (GLOBAL)
    ========================== */
    authSection && (authSection.style.display = "none");

    adminPanel?.classList.add("hidden");
    userPanel?.classList.add("hidden");
    adminWrapper?.classList.add("hidden");

    dashboardSection && (dashboardSection.style.display = "none");

    logoutAdminBtn?.style.setProperty("display", "none");
    logoutUserBtn?.style.setProperty("display", "none");
    dashboardBtn?.style.setProperty("display", "none");

    /* =========================
       🔐 ADMIN
    ========================== */
    if (userData.role === "admin") {
      adminPanel?.classList.remove("hidden");
      adminWrapper?.classList.remove("hidden");

      dashboardBtn?.style.setProperty("display", "block");
      logoutAdminBtn?.style.setProperty("display", "block");

      const dailyTasksWrapper = document.querySelector(".daily-tasks-wrapper");
      if (dailyTasksWrapper) dailyTasksWrapper.style.display = "block";

      loadAllocUsers();

      await ensureTodayLoginLogForUser(user);
      displayAdminLoginInfo(user.email, displayName);

      return;
    }

    /* =========================
       👀 SUPERVISOR
    ========================== */
    if (userData.role === "supervisor") {
      adminWrapper?.classList.remove("hidden");

      dashboardSection?.style.setProperty("display", "none");
      logoutAdminBtn?.style.setProperty("display", "block");
      document.getElementById("admin-panel").classList.remove("hidden");
      document
        .querySelector(".daily-tasks-wrapper")
        .style.setProperty("display", "block");
      await ensureTodayLoginLogForUser(user);
      displayAdminLoginInfo(user.email, displayName);
      loadAllocUsers();
      loadDashboard();
      // supervisor sees dashboard by default

      return;
    }

    /* =========================
       👤 NORMAL USER
    ========================== */
    userPanel?.classList.remove("hidden");
    userPanel.style.display = "block";

    logoutUserBtn?.style.setProperty("display", "block");

    document.getElementById("user-task-section")?.classList.remove("hidden");

    document.getElementById("user-tasks-table")?.classList.remove("hidden");

    await ensureTodayLoginLogForUser(user);
    displayLoginInfo(user.email, displayName);

    renderUserTasks(user);
  } catch (err) {
    console.error("🔥 Auth state Firestore error:", err);
  }
});

let sessionStarted = false;

async function startUserSession(user) {
  if (!appIsActive) return;
  if (sessionStarted) return;
  sessionStarted = true;

  const snap = await getDoc(doc(db, "users", user.uid));
  const userData = snap.data();

  setupUIByRole(userData.role, user, userData);
}

function setupUIByRole(role, user, userData) {
  // ---------- COMMON RESET ----------
  const authSection = document.getElementById("auth-section");
  const adminWrapper = document.querySelector(".admin-wrapper");
  const adminPanel = document.getElementById("admin-panel");
  const userPanel = document.getElementById("user-panel");
  const dashboardSection = document.getElementById("dashboard-section");
  const dashboardBtn = document.getElementById("dashboard-btn");
  const panelContainer = document.querySelector(".panel-container");
  const usersTaskTable = document.getElementById("users-task-table");
  const taskFilterWrapper = document.getElementById("task-filter-wrapper");
  const taskFilter = document.getElementById("task-filter");
  const adminContainer = document.getElementById("admin-container");
  const loginInfoAdmin = document.getElementById("login-info-admin");
  const loginTimesList = document.getElementById("login-times-list");

  // Hide auth
  if (authSection) authSection.style.display = "none";

  // Hide everything first
  if (adminWrapper) adminWrapper.style.display = "none";
  if (adminPanel) adminPanel.classList.add("hidden");
  if (userPanel) userPanel.classList.add("hidden");
  if (dashboardSection) dashboardSection.style.display = "none";
  if (dashboardBtn) dashboardBtn.style.display = "none";
  if (panelContainer) panelContainer.style.display = "none";
  if (usersTaskTable) usersTaskTable.style.display = "none";
  if (taskFilterWrapper) taskFilterWrapper.style.display = "none";
  if (taskFilter) taskFilter.style.display = "none";
  if (adminContainer) adminContainer.style.display = "none";
  if (loginInfoAdmin) loginInfoAdmin.style.display = "none";
  if (loginTimesList) loginTimesList.style.display = "none";

  // ---------- ADMIN ----------
  if (role === "admin") {
    loginInfoAdmin.style.display = "block";
    populateUserDropdown("alloc-user", false);
    populateUserDropdown("monthly-user-filter", true);
    if (adminWrapper) adminWrapper.style.display = "block";
    if (adminPanel) {
      adminPanel.classList.remove("hidden");
      adminPanel.style.display = "block";
    }
    if (panelContainer) panelContainer.style.display = "flex";
    if (adminContainer) adminContainer.style.display = "block";
    if (dashboardBtn) dashboardBtn.style.display = "block";

    if (taskFilterWrapper) taskFilterWrapper.style.display = "block";
    if (taskFilter) taskFilter.style.display = "flex";

    if (loginInfoAdmin) loginInfoAdmin.style.display = "block";

    displayLoginInfo(user.email, user.email, "admin");
    return;
  }

  // ---------- SUPERVISOR ----------

  // ---------- NORMAL USER ----------
  if (userPanel) {
    userPanel.classList.remove("hidden");
    userPanel.style.display = "block";
  }

  if (usersTaskTable) {
    usersTaskTable.style.display = "table";
  }
  loadUserLoginInfo(user, userData);
  // Load tasks ONCE (protected by your guard)
  renderUserTasks(user);
}

// Admin-only filter button logic
if (filterBtn) {
  filterBtn.addEventListener("click", async () => {
    try {
      // ✅ Auth + role check
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in as admin to filter tasks.");
        return;
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert("User record missing. Cannot verify role.");
        return;
      }

      const userData = userDocSnap.data();
      if (userData.role !== "admin") {
        alert("You must be an admin to filter tasks.");
        return;
      }

      // ✅ Read filters
      const monthValue = filterMonthInput.value;
      if (!monthValue) {
        alert("Please select a month.");
        return;
      }

      const [year, month] = monthValue.split("-").map(Number);
      const memberUid = document.getElementById("filter-member").value;
      const clientName = document.getElementById("task-client-filter").value;

      // UID → email (because tasks use assignedTo = email)
      let memberEmail = "";
      if (memberUid) {
        const userDoc = await getDoc(doc(db, "users", memberUid));
        if (userDoc.exists()) {
          memberEmail = userDoc.data().email || "";
        }
      }

      // ✅ Render with all filters
      filteredMonthTable.innerHTML = "";
      await renderTasksForMonth(
        filteredMonthTable,
        month - 1,
        year,
        memberEmail,
        clientName
      );

      // status classes + overdue are already handled inside renderTasksForMonth
    } catch (err) {
      console.error("Error filtering tasks:", err);
      alert("An error occurred. Check console for details.");
    }
  });
}

// 🟢 Hide filter + tables before login
function hideTaskFilterBeforeLogin() {
  if (taskFilterDiv) taskFilterDiv.style.display = "none";
  if (currentMonthTable) currentMonthTable.innerHTML = "";
  if (filteredMonthTable) filteredMonthTable.innerHTML = "";
}

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("change-status-btn")) return;

  const btn = e.target;
  const tr = btn.closest("tr");
  const taskId = tr.dataset.id; // ✅ FIX

  if (!taskId) {
    console.error("Task ID missing for change-status");
    return;
  }
  // remove other dropdowns
  document
    .querySelectorAll(".status-dropdown, .rating-dropdown")
    .forEach((el) => el.remove());

  // create status dropdown
  const statusSelect = document.createElement("select");
  statusSelect.classList.add("status-dropdown");
  statusSelect.innerHTML = `
    <option value="">--Select Status--</option>
    <option value="To-Do">To-Do</option>
    <option value="Backlog">Backlog</option>
    <option value="Done">Done</option>
  `;
  btn.insertAdjacentElement("afterend", statusSelect);

  statusSelect.addEventListener("change", async () => {
    if (!appIsActive) return;

    const newStatus = statusSelect.value;
    if (!newStatus) return;

    const taskRef = doc(db, "tasks", taskId);

    // clear old rating dropdown
    document.querySelectorAll(".rating-dropdown").forEach((el) => el.remove());

    // ===========================
    // CASE 1 — DONE (NEEDS RATING)
    // ===========================
    if (newStatus === "Done") {
      const ratingSelect = document.createElement("select");
      ratingSelect.classList.add("rating-dropdown");
      ratingSelect.innerHTML = `
        <option value="">--Select Rating--</option>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐⭐</option>
        <option value="3">3 ⭐⭐⭐</option>
        <option value="4">4 ⭐⭐⭐⭐</option>
        <option value="5">5 ⭐⭐⭐⭐⭐</option>
      `;
      statusSelect.insertAdjacentElement("afterend", ratingSelect);

      ratingSelect.addEventListener("change", async () => {
        if (!appIsActive) return;
        if (taskUpdateInProgress) return; // 🔒 STOP DUPLICATES

        const rating = ratingSelect.value;
        if (!rating) return;

        taskUpdateInProgress = true;

        try {
          await safeUpdateDoc(taskRef, {
            status: "Done",
            rating: parseInt(rating),
            doneAt: serverTimestamp(),
            backlogRemark: "",
          });

          // update UI
          tr.querySelector("td:nth-child(5)").textContent = "Done";
          tr.querySelector("td:nth-child(6)").textContent = rating;
          tr.querySelector("td:nth-child(7)").textContent = "";
          tr.className = "status-done";
        } catch (err) {
          console.error("Failed to mark task done:", err);
        } finally {
          taskUpdateInProgress = false;
          statusSelect.remove();
          ratingSelect.remove();
        }
      });

      return;
    }

    // ===========================
    // CASE 2 — BACKLOG
    // ===========================
    if (newStatus === "Backlog") {
      if (!appIsActive || taskUpdateInProgress) return;

      taskUpdateInProgress = true;

      try {
        await safeUpdateDoc(taskRef, {
          status: "Backlog",
        });

        tr.querySelector("td:nth-child(5)").textContent = "Backlog";
        tr.className = "status-backlog";

        const remarkCell = tr.querySelector("td:nth-child(7)");
        if (remarkCell) {
          remarkCell.innerHTML = `<button class="edit-backlog-btn">Add/Edit Remark</button>`;
        }
      } finally {
        taskUpdateInProgress = false;
        statusSelect.remove();
      }

      return;
    }

    // ===========================
    // CASE 3 — TO-DO (or others)
    // ===========================
    if (!appIsActive || taskUpdateInProgress) return;

    taskUpdateInProgress = true;

    try {
      await safeUpdateDoc(taskRef, {
        status: newStatus,
        rating: null,
        backlogRemark: "",
      });

      tr.querySelector("td:nth-child(5)").textContent = newStatus;
      tr.querySelector("td:nth-child(6)").textContent = "—";
      tr.querySelector("td:nth-child(7)").textContent = "";

      let cssClass = "";
      if (newStatus === "To-Do") cssClass = "status-todo";
      if (newStatus === "Backlog") cssClass = "status-backlog";
      if (newStatus === "Done") cssClass = "status-done";

      tr.className = cssClass;
    } finally {
      taskUpdateInProgress = false;
      statusSelect.remove();
    }

    tr.querySelector("td:nth-child(5)").textContent = newStatus;
    tr.querySelector("td:nth-child(6)").textContent = "—"; // rating cleared
    tr.querySelector("td:nth-child(7)").textContent = ""; // remark removed

    let cssClass = "";

    if (newStatus === "To-Do") cssClass = "status-todo";
    if (newStatus === "Backlog") cssClass = "status-backlog";
    if (newStatus === "Done") cssClass = "status-done";

    tr.className = cssClass;

    statusSelect.remove();
  });
});

async function markOverdueTasksAsBacklog() {
  if (!appIsActive) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = document.querySelectorAll("#filtered-month-table tbody tr");

  for (const row of rows) {
    const taskId = row.dataset.id;
    const dueDateCell = row.querySelector(".due-date");
    const statusCell = row.querySelector(".col-status");
    if (!taskId || !dueDateCell || !statusCell) continue;

    const currentStatus = statusCell.textContent.trim().toLowerCase();

    // ✅ paste your protection HERE
    if (currentStatus === "done" || currentStatus.startsWith("done (pending")) {
      console.log("⛔ Skipping completed/pending approval task:", taskId);
      continue; // ❗ do NOT downgrade this task
    }

    // NOW continue your overdue logic…
    const dueDate = new Date(dueDateCell.textContent.trim());

    if (!isNaN(dueDate) && dueDate < today && currentStatus !== "backlog") {
      statusCell.textContent = "Backlog";
      row.classList.add("backlog");
      try {
      } catch (error) {
        console.error("Error updating backlog:", error);
      }
    }
  }
}

// 🧹 Normalize tasks by adding backlogRemark if missing
async function normalizeBacklogRemarks() {
  if (!appIsActive) return;
  const tasksRef = collection(db, "tasks");
  const snap = await getDocs(tasksRef);

  snap.forEach(async (taskDoc) => {
    const data = taskDoc.data();
    const taskId = taskDoc.id;

    let deadlineDate = null;

    // Convert Firestore Timestamp → JS Date
    if (data.deadline?.toDate) {
      deadlineDate = data.deadline.toDate();
    } else if (data.deadline instanceof Date) {
      deadlineDate = data.deadline;
    } else if (typeof data.deadline === "string") {
      deadlineDate = new Date(data.deadline);
    }

    const now = new Date();
    const statusText = String(data.status || "").toLowerCase();

    // 🛡️ PROTECT done + pending approval
    const isPendingDone =
      statusText.includes("pending") || statusText.includes("approval");
    const isApprovedDone =
      statusText === "done" ||
      statusText.includes("approved") ||
      statusText.includes("completed");

    // If it's done or waiting approval → do nothing
    if (isPendingDone || isApprovedDone) {
      return;
    }

    // ----------------------------------------
    // 1️⃣ Move ONLY other overdue tasks to backlog
    // ----------------------------------------
    if (deadlineDate && deadlineDate < now && statusText !== "backlog") {
      console.log(`⏳ Task ${taskId} moved to backlog (deadline passed)`);
      return; // Stop further checks for this task
    }

    // ----------------------------------------
    // 2️⃣ ENSURE ALL BACKLOG TASKS HAVE backlogRemark FIELD
    // ----------------------------------------
    if (statusText === "backlog" && !data.backlogRemark) {
      await safeUpdateDoc(doc(db, "tasks", taskId), {
        backlogRemark: "",
      });

      console.log(`✅ Added backlogRemark field to ${taskId}`);
    }
  });
}

function processLogs(logDocs) {
  const logMap = new Map();

  logDocs.forEach((doc) => {
    const data = doc.data();
    const email = data.email;

    if (!logMap.has(email)) {
      logMap.set(email, {
        email,
        earliestLogin: null,
        latestLogout: null,
      });
    }

    const entry = logMap.get(email);

    // Process login time
    if (data.loginTime) {
      let loginDate;
      if (data.loginTime.toDate) {
        // Firestore Timestamp
        loginDate = new Date(data.loginTime.toDate());
      } else {
        // Already string
        loginDate = new Date(`1970-01-01T${data.loginTime}`);
        if (isNaN(loginDate)) loginDate = null;
      }

      if (
        loginDate &&
        (!entry.earliestLogin || loginDate < entry.earliestLogin)
      ) {
        entry.earliestLogin = loginDate;
      }
    }

    // Process logout time
    if (data.logoutTime) {
      let logoutDate;
      if (data.logoutTime.toDate) {
        logoutDate = new Date(data.logoutTime.toDate());
      } else {
        logoutDate = new Date(`1970-01-01T${data.logoutTime}`);
        if (isNaN(logoutDate)) logoutDate = null;
      }

      if (
        logoutDate &&
        (!entry.latestLogout || logoutDate > entry.latestLogout)
      ) {
        entry.latestLogout = logoutDate;
      }
    }
  });

  return logMap;
}

async function getManualCorrection(date, email) {
  const ref = doc(db, "manualLogs", `${date}_${email}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

async function saveManualCorrection(date, email, value) {
  const ref = doc(db, "manualLogs", `${date}_${email}`);
  await setDoc(ref, { date, email, value });
}

// ------------------------------------------------------
//    MONTHLY LOG BUTTON CLICK HANDLER
// ------------------------------------------------------
document.getElementById("get-month-log").addEventListener("click", async () => {
  const table = document.getElementById("monthly-logs-table");
  const tbody = table.querySelector("tbody");
  table.style.display = "table";

  const monthInput = document.getElementById("month-log").value;
  if (!monthInput) {
    alert("Select a month");
    return;
  }

  tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  const [year, month] = monthInput.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  /* =========================
     LOAD USERS (ONCE)
  ========================== */
  const usersSnap = await getDocs(collection(db, "users"));
  const users = [];

  usersSnap.forEach((docSnap) => {
    const u = docSnap.data();
    if (!u?.email) return;

    users.push({
      name: u.name || u.email,
      email: u.email,
    });
  });

  tbody.innerHTML = "";

  /* =========================
     LOOP DAYS × USERS
  ========================== */
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    // 🔹 Get all logs for that date
    const logsSnap = await getDocs(
      query(collection(db, "loginLogs"), where("date", "==", dateStr))
    );

    // Map logs by email
    const logMap = new Map();
    logsSnap.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.email) logMap.set(d.email, d);
    });

    // 🔹 Render row per user
    for (const user of users) {
      const log = logMap.get(user.email);

      let login = "-";
      let logout = "-";
      let extra = "-";

      if (log?.loginTime) {
        login = extractTime(log.loginTime);
      }

      if (log?.logoutTime) {
        logout = extractTime(log.logoutTime);
      }

      // Calculate extra time ONLY if both exist
      if (log?.loginTime && log?.logoutTime) {
        const workedMs = log.logoutTime.toDate() - log.loginTime.toDate();

        const extraMs = workedMs - 9 * 60 * 60 * 1000;

        extra = extraMs > 0 ? msToExtraTime(extraMs) : "-";
      }

      tbody.innerHTML += `
        <tr>
          <td>${dateStr}</td>
          <td>${user.name}</td>
          <td>${login}</td>
          <td>${logout}</td>
          <td>${extra}</td>
        </tr>
      `;
    }

    // Divider row (like Excel spacing)
    tbody.innerHTML += `
      <tr style="background:#eee;height:4px;">
        <td colspan="5"></td>
      </tr>
    `;
  }
});

function normalizeTime(value) {
  // If value is already "HH:MM:SS", return it
  if (typeof value === "string" && value.includes(":")) return value;

  // If value is a Date
  if (value instanceof Date) {
    const h = String(value.getHours()).padStart(2, "0");
    const m = String(value.getMinutes()).padStart(2, "0");
    const s = String(value.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  // If value is a number from Excel or timestamp
  if (typeof value === "number") {
    // Convert Excel fraction to time
    const totalSeconds = Math.round(value * 24 * 60 * 60);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  return String(value);
}

async function saveMonthlyLog(date, email, value) {
  await setDoc(doc(db, "monthlyLogs", `${date}_${email}`), {
    date,
    email,
    login: value,
    logout: value,
    extra: value,
  });
}
function getStatusDropdown(value) {
  return `
    <select class="status-dropdown">
      <option value="Absent" ${
        value === "Absent" ? "selected" : ""
      }>Absent</option>
      <option value="Week-Off" ${
        value === "Week-Off" ? "selected" : ""
      }>Week-Off</option>
      <option value="Sick-leave" ${
        value === "Sick-leave" ? "selected" : ""
      }>Sick-leave</option>
    </select>
  `;
}

function applyCellClass(cell, value) {
  cell.classList.remove(
    "absent-cell",
    "weekoff-cell",
    "sickleave-cell",
    "time-cell"
  );

  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
    cell.classList.add("time-cell");
    return;
  }
  if (value === "Absent") cell.classList.add("absent-cell");
  if (value === "Week-Off") cell.classList.add("weekoff-cell");
  if (value === "Sick-leave") cell.classList.add("sickleave-cell");
}

function renderCell(value) {
  const options = ["Absent", "Week-Off", "Sick-leave"];

  if (options.includes(value)) {
    return `
      <select class="status-dropdown">
        ${options
          .map(
            (o) =>
              `<option value="${o}" ${
                o === value ? "selected" : ""
              }>${o}</option>`
          )
          .join("")}
      </select>
    `;
  }

  return value;
}

function activateStatusSync() {
  const rows = document.querySelectorAll("#monthly-logs-table .log-row");

  rows.forEach((row) => {
    const selects = row.querySelectorAll(".status-dropdown");
    if (selects.length === 0) return; // time rows skip

    selects.forEach((sel) => {
      sel.addEventListener("change", async () => {
        const newValue = sel.value;

        // Sync all 3 dropdowns
        selects.forEach((s) => (s.value = newValue));

        // Save to Firestore
        const date = row.dataset.date;
        const email = row.dataset.email;

        await saveMonthlyLog(date, email, newValue);
      });
    });
  });
}

// ------------------------------
// ADD EVENT LISTENER TO DROPDOWNS
// ------------------------------

document
  .getElementById("download-monthly-log")
  .addEventListener("click", () => {
    const originalTable = document.getElementById("monthly-logs-table");

    // Create a clone table that forces everything to text
    const clone = originalTable.cloneNode(true);

    // Convert every cell that contains : (time) into a text node
    clone.querySelectorAll("td, th").forEach((cell) => {
      const v = cell.textContent.trim();

      // Force text by prefixing with a '
      // Excel treats '11:41:14 as TEXT
      if (v.includes(":")) {
        cell.textContent = "'" + v;
      }

      // If Excel would convert to number, also prefix
      if (!isNaN(v) && v !== "") {
        cell.textContent = "'" + v;
      }
    });

    // Generate sheet from the SAFE clone
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(clone);

    XLSX.utils.book_append_sheet(wb, ws, "Monthly Log");

    XLSX.writeFile(
      wb,
      `Monthly_Log_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  });

async function updateLogoutTime(user) {
  const today = new Date().toLocaleDateString("en-CA");

  const q = query(
    collection(db, "loginLogs"),
    where("email", "==", user.email),
    where("date", "==", today)
  );

  const snap = await getDocs(q);

  if (snap.empty) return;

  await updateDoc(snap.docs[0].ref, {
    logoutTime: serverTimestamp(),
  });
}
function timeToMs(timeStr) {
  if (!timeStr || timeStr === "-" || timeStr.toLowerCase() === "absent")
    return null;

  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600000 + m * 60000 + s * 1000;
}
function msToExtraTime(ms) {
  if (ms <= 0) return "-";

  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);

  return `${h}h ${m}m`;
}

function getDropdownHTML(selected) {
  return `
    <select class="status-dropdown">
      <option value="Absent" ${
        selected === "Absent" ? "selected" : ""
      }>Absent</option>
      <option value="Week-Off" ${
        selected === "Week-Off" ? "selected" : ""
      }>Week-Off</option>
      <option value="Sick-leave" ${
        selected === "Sick-leave" ? "selected" : ""
      }>Sick-leave</option>
    </select>
  `;
}
function activateMonthlyLogDropdowns() {
  const rows = document.querySelectorAll("#monthly-logs-table .log-row");

  rows.forEach((row) => {
    const date = row.dataset.date;
    const email = row.dataset.email;

    const loginCell = row.children[2];
    const logoutCell = row.children[3];
    const extraCell = row.children[4];

    const statusValues = ["Absent", "Week-Off", "Sick-leave"];
    const loginVal = loginCell.textContent.trim();

    // Only convert rows with status values
    if (!statusValues.includes(loginVal)) return;

    [loginCell, logoutCell, extraCell].forEach((cell) => {
      const val = cell.textContent.trim();
      cell.innerHTML = getStatusDropdown(val);
      applyCellClass(cell, val); // apply initial color
    });

    const selects = row.querySelectorAll(".status-dropdown");

    selects.forEach((select) => {
      select.addEventListener("change", async (e) => {
        const newValue = e.target.value;

        // Sync all three dropdowns
        selects.forEach((s, i) => {
          s.value = newValue;
          const cell = [loginCell, logoutCell, extraCell][i];
          applyCellClass(cell, newValue); // 🔥 update background
        });

        // Save to Firestore
        await saveMonthlyLog(date, email, newValue);
      });
    });
  });
}

function applyUserRowStatusStyle(tr, status) {
  tr.classList.remove("status-backlog", "status-todo", "status-done");

  if (!status) return;

  const s = status.toLowerCase();
  if (s === "backlog") tr.classList.add("status-backlog");
  if (s === "to do") tr.classList.add("status-todo");
  if (s === "done") tr.classList.add("status-done");
}
console.log("🔥 JS FILE LOADED");
document.querySelectorAll("#monthly-logs-table td").forEach((td) => {
  if (td.textContent.trim() === "-") {
    td.classList.add("time-cell");
  }
});
document.querySelectorAll("#monthly-logs-table td").forEach((td) => {
  if (td.textContent.trim() === "-") {
    td.classList.add("time-cell");
  }
});
let usernameRef = document.getElementById("signup-name");
let usernameRef1 = document.getElementById("login-email");
let usernameRef3 = document.getElementById("signup-name");
let passwordRef = document.getElementById("signup-password");
let passwordRef1 = document.getElementById("login-password");
let eyeL = document.querySelector(".eyeball-l");
let eyeR = document.querySelector(".eyeball-r");
let handL = document.querySelector(".hand-l");
let handR = document.querySelector(".hand-r");

let normalEyeStyle = () => {
  eyeL.style.cssText = `
    left:0.6em;
    top: 0.6em;
  `;
  eyeR.style.cssText = `
  right:0.6em;
  top:0.6em;
  `;
};

let normalHandStyle = () => {
  handL.style.cssText = `
        height: 2.81em;
        top:-0.5em;
        left:7.5em;
        transform: rotate(0deg);
    `;
  handR.style.cssText = `
        height: 2.81em;
        top: -0.5em;
        right: 7.5em;
        transform: rotate(0deg)
    `;
};
function onUsernameFocus() {
  eyeL.style.cssText = `
    left: 0.75em;
    top: 1.12em;  
  `;
  eyeR.style.cssText = `
    right: 0.75em;
    top: 1.12em;
  `;

  normalHandStyle();
}

// add event listeners
[usernameRef, usernameRef1, usernameRef3].forEach((input) => {
  if (input) {
    input.addEventListener("focus", onUsernameFocus);
  }
});

const signupPassword = document.getElementById("signup-password");
const loginPassword = document.getElementById("login-password");

// shared function
function onPasswordFocus() {
  handL.style.cssText = `
    height: 6.56em;
    top: -4.87em;
    left: 11.75em;
    transform: rotate(-155deg);
  `;

  handR.style.cssText = `
    height: 6.56em;
    top: -4.87em;
    right: 11.75em;
    transform: rotate(155deg);
  `;
  normalEyeStyle();
}

// add focus listeners to both password inputs
[signupPassword, loginPassword].forEach((input) => {
  if (input) {
    input.addEventListener("focus", onPasswordFocus);
  }
});

document.addEventListener("click", (e) => {
  let clickedElem = e.target;
  if (
    clickedElem != usernameRef &&
    clickedElem != signupPassword &&
    clickedElem != usernameRef1 &&
    clickedElem != usernameRef3 &&
    clickedElem != loginPassword
  ) {
    normalEyeStyle();
    normalHandStyle();
  }
});
function sendWhatsApp(user, task) {
  if (!user.phone) return;

  const phone = String(user.phone).replace(/\+/g, "").trim();

  // Handle deadline
  let deadlineText = "no deadline provided";

  if (task.dueDate) {
    if (task.dueDate.toDate) {
      deadlineText = task.dueDate.toDate().toLocaleString();
    } else if (task.dueDate instanceof Date) {
      deadlineText = task.dueDate.toLocaleString();
    } else {
      deadlineText = task.dueDate;
    }
  }

  const message = `Hi ${user.name}, you are assigned "${task.title}" by ${task.assignedBy}. Please complete it before ${deadlineText}.`;

  const encodedMessage = encodeURIComponent(message);

  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  window.open(url, "_blank");
}
// ================================================
// HELPER: Render counts to dashboard
// ================================================
// ================================================
// HELPER: Render counts to user dashboard (safe)
// ================================================
function renderCounts(c) {
  const totalEl = document.getElementById("totalCount");
  const pendingEl = document.getElementById("pendingCount");
  const doneEl = document.getElementById("doneCount");
  if (totalEl) totalEl.textContent = c.total ?? 0;
  if (pendingEl) pendingEl.textContent = c.pending ?? 0;
  if (doneEl) doneEl.textContent = c.done ?? 0;
}

// ================================================
// CALL AFTER STATUS CHANGES
// ================================================

function extractTime(value) {
  if (!value) return "-";

  // Firestore Timestamp
  if (value.toDate) {
    return value.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const d = new Date(value);
  if (isNaN(d)) return "-";

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("change-status-btn")) return;

  const newStatus = e.target.dataset.status;
  const tr = e.target.closest("tr");
  if (!tr) return;

  // Update UI (your existing Firestore update stays as it is)
  Array.from(tr.querySelectorAll("td")).forEach((td) => {
    const text = td.textContent.trim().toLowerCase();
    if (["backlog", "pending", "to-do", "todo", "done"].includes(text)) {
      td.textContent = newStatus;
    }
  });

  updateCountsFromUserTable(); // refresh dashboard
});
async function populateMemberDropdown() {
  const select = document.createElement("select");
  select.innerHTML = `<option value="">--Select Member--</option>`;

  const usersSnap = await getDocs(collection(db, "users"));
  usersSnap.forEach((doc) => {
    const u = doc.data();

    const op = document.createElement("option");
    op.value = doc.id; // UID
    op.textContent = u.name || u.email;
    select.appendChild(op);
  });

  return select;
}
async function sendWhatsAppNotification(
  userId,
  taskTitle,
  assignedBy,
  deadline
) {
  // Get assigned user's document
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User not found in Firestore!");
    return;
  }

  const user = snap.data();
  const phone = user.phone; // e.g. "919876543210"

  if (!phone) {
    alert("User has no phone number saved!");
    return;
  }

  // WhatsApp message text
  const message = `
📌 New Task Assigned!

Task: ${taskTitle}
Assigned By: ${assignedBy}
Deadline: ${deadline}

Please check the Task Manager app.
  `.trim();

  // Encode and open WhatsApp Web in browser
  const encodedMessage = encodeURIComponent(message);
  const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
  window.open(url, "_blank");
}
const signupBtnEl = document.getElementById("signup-btn");
if (signupBtnEl) {
  signupBtnEl.addEventListener("click", async (e) => {
    e.preventDefault(); // <-- critical if button is inside a form

    const name = document.getElementById("signup-name")?.value.trim();
    const email = document.getElementById("signup-email")?.value.trim();
    const password = document.getElementById("signup-password")?.value.trim();

    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      // create auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      // send verification
      await sendEmailVerification(user);

      // create user doc in Firestore (use serverTimestamp for consistency)
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      console.log("✅ Signup success for:", email);
      alert("Signup successful! Please verify your email before logging in.");

      // clear form fields (optional)
      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
    } catch (err) {
      console.error("❌ Signup error:", err);
      // Friendly user message but show console for details
      alert("Signup failed: " + (err.message || "Check console for details"));
    }
  });
} else {
  console.warn(
    "signup-btn element not found. Make sure the element with id 'signup-btn' exists and this script runs after DOM loads."
  );
}
// 🟢 USER clicks Mark Done
// USER: Mark task as done (request approval)
// 🟢 USER clicks Mark Done
// USER: Mark task as done (request approval)
// FIXED — User clicks mark done
// USER: Mark task as done (request approval)
// 🟢 USER clicks Mark Done
// USER: Mark task as done (request approval)
// 🟢 USER clicks Mark Done
// USER: Mark task as done (request approval)
// FIXED — User clicks mark done
// USER: Mark task as done (request approval)

// 🟢 ADMIN clicks Approve on filtered/current month table
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("approve-done-btn")) return;

  const btn = e.target;
  const tr = btn.closest("tr");
  const taskId = tr?.dataset?.id;
  if (!taskId) return;

  try {
    // ✅ Save approved state permanently in Firestore
    await safeUpdateDoc(doc(db, "tasks", taskId), {
      status: "Done", // final approved status
      approvedAt: serverTimestamp(),
      approvedBy: currentLoggedInUser?.email || "admin",
    });

    // ✅ Update UI instantly
    const statusCell = tr.querySelector(".col-status");
    if (statusCell) statusCell.textContent = "Done";

    // Replace button with a static Approved label
    btn.outerHTML =
      '<span class="approved-label" style="font-weight:600;">✔ Approved</span>';
  } catch (err) {
    console.error("Failed approving task:", err);
    alert("Error approving task. Please try again.");
  }
});

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("approve-done-btn")) return;

  const btn = e.target;
  const tr = btn.closest("tr");
  const taskId = tr?.dataset?.id;
  if (!taskId) return;

  try {
    // 🔽 SAVE APPROVAL PERMANENTLY IN FIRESTORE
    await safeUpdateDoc(doc(db, "tasks", taskId), {
      status: "Done", // permanent approved state
      approvedAt: serverTimestamp(),
      approvedBy: currentLoggedInUser?.email || "admin",
    });

    // 🔽 UPDATE UI INSTANTLY
    tr.querySelector(".col-status").textContent = "Done";

    btn.outerHTML = `<span style="color:green;font-weight:600;">✔ Approved</span>`;
  } catch (err) {
    console.error("Failed approving task:", err);
    alert("Error approving task. Please try again.");
  }
});
// 🔄 GLOBAL DELETE HANDLER (REPLACE OLD ONE COMPLETELY)
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-task-btn");
  if (!btn) return;

  const tr = btn.closest("tr");

  // ✅ 1) Prefer per-task ids (for daily table)
  const taskId =
    tr?.dataset?.taskId ||
    btn.dataset.taskId ||
    tr?.dataset?.id || // fallback for monthly table
    btn.dataset.id; // fallback for monthly table

  if (!taskId) {
    console.error("❌ No taskId found for delete");
    alert("Cannot delete: task id missing.");
    return;
  }

  // Optional: only allow admins to delete
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert("You must be logged in to delete tasks.");
    return;
  }

  try {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists() || userDocSnap.data().role !== "admin") {
      alert("Only admins can delete tasks.");
      return;
    }
  } catch (err) {
    console.error("❌ Error checking role before delete:", err);
    alert("Could not verify admin role.");
    return;
  }

  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log("✅ Deleted task:", taskId);

    // Remove only THIS row from UI
    if (tr) tr.remove();
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    alert("Failed to delete task. Check console for details.");
  }
});

// Optional cache if you want to reuse user data later
const userCache = {};

/**
 * Populate a user dropdown with all users (admin + supervisors + users)
 * @param {string} selectId - id of the <select> element
 * @param {boolean} includeAllOption - if true → first option is "All Users"
 */
async function populateUserDropdown(
  selectId,
  includeAllOption,
  useMatrix = false,
  force = false
) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl) return;

  // Prevent accidental double-initialization unless force=true
  if (!force && selectEl.dataset.populated === "1") {
    return;
  }

  // Base option
  selectEl.innerHTML = includeAllOption
    ? `<option value="">All Users</option>`
    : `<option value="">Select User</option>`;

  // If using MATRIX_USERS (simple array of names)
  if (useMatrix) {
    const seenNames = new Set();
    MATRIX_USERS.forEach((name) => {
      if (!name || seenNames.has(name)) return;
      seenNames.add(name);

      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      selectEl.appendChild(opt);
    });

    selectEl.dataset.populated = "1";
    return;
  }

  // Otherwise load from Firestore but dedupe and avoid duplicates
  try {
    const snap = await getDocs(collection(db, "users"));

    // track seen uids and seen display names
    const seenUids = new Set();
    const seenNames = new Set();

    snap.forEach((docSnap) => {
      const uid = docSnap.id;
      const user = docSnap.data();
      if (!user) return;

      // Skip duplicates by uid
      if (seenUids.has(uid)) return;
      seenUids.add(uid);

      // If you want to dedupe by name too (to avoid show same name twice), use:
      const displayName = (user.name || "").trim();
      if (!displayName) return;

      // If you prefer to show duplicates when names are same but UIDs different,
      // comment out the next two lines.
      if (seenNames.has(displayName)) return;
      seenNames.add(displayName);

      // cache user if needed elsewhere
      userCache[uid] = user;

      const opt = document.createElement("option");
      opt.value = uid; // keep UID so later code can use it
      opt.textContent = `${displayName}${
        user.role ? " (" + user.role + ")" : ""
      }`;
      selectEl.appendChild(opt);
    });
  } catch (err) {
    console.error("Error populating user dropdown:", err);
  }

  // mark populated
  selectEl.dataset.populated = "1";
}
const monthlyRefreshBtn = document.getElementById("btn-monthly-task-refresh");
if (monthlyRefreshBtn) {
  monthlyRefreshBtn.addEventListener("click", function () {
    loadMonthlyTaskTable();
  });
}

// Main loader for monthly-task-table
// REPLACE your existing loadMonthlyTaskTable() with this
// ---- Replace existing loadMonthlyTaskTable() with this ----
async function loadMonthlyTaskTable() {
  const monthInput = document.getElementById("monthly-month-filter");
  const userFilter =
    document.getElementById("monthly-user-filter")?.value || "";
  const clientFilter =
    document.getElementById("monthly-client-filter")?.value || "";
  const tbody = document.querySelector("#monthly-task-table tbody");
  document.getElementById("monthly-task-table").style.display = "block";
  if (!monthInput || !tbody) {
    console.warn("monthly-month-filter or monthly-task-table not found in DOM");
    return;
  }

  // Show loading row
  tbody.innerHTML = `<tr><td colspan="9">Loading...</td></tr>`;

  // Parse selected month: YYYY-MM
  const [year, month] = monthInput.value.split("-");
  if (!year || !month) {
    tbody.innerHTML = `<tr><td colspan="9">Please select a month.</td></tr>`;
    return;
  }

  const start = `${year}-${month}-01`;

  let ny = Number(year);
  let nm = Number(month) + 1;
  if (nm === 13) {
    nm = 1;
    ny++;
  }
  const next = `${ny}-${String(nm).padStart(2, "0")}-01`;

  const tasksRef = collection(db, "tasks");

  // 🎯 Fetch tasks completed in the selected month (using dateDone)
  const qRef = query(
    tasksRef,
    where("dateDone", ">=", start),
    where("dateDone", "<", next)
  );

  const snap = await getDocs(qRef);
  const rows = [];

  snap.forEach((docSnap) => {
    const task = docSnap.data();
    console.log("Monthly Task:", task);
    // Filter by user (UID)
    if (
      userFilter &&
      task.userId !== userFilter &&
      task.assignedToUID !== userFilter
    ) {
      return;
    }

    // Filter by client
    if (clientFilter) {
      const cf = clientFilter.toLowerCase();
      const candidates = [
        task.client,
        task.clientName,
        task.clientId,
        task.client_name,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());

      if (!candidates.some((c) => c === cf || c.includes(cf))) return;
    }

    rows.push({ id: docSnap.id, ...task });
  });

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No tasks found.</td></tr>`;
    return;
  }

  // 🧱 Render rows
  tbody.innerHTML = "";

  rows.forEach((task) => {
    const tr = document.createElement("tr");
    if (task.status === "backlog") {
      tr.classList.add("status-backlog");
    } else if (task.status === "to-do") {
      tr.classList.add("status-todo");
    } else if (task.status === "done") {
      tr.classList.add("status-done");
    }

    const userName = task.assignedName || task.assignedTo || "-";
    const clientName =
      task.client ||
      task.clientName ||
      task.clientId ||
      task.client_name ||
      "-";
    const assignedBy =
      task.assignedByName || task.assignedBy || task.createdByName || "-";

    // 👇 Try multiple possible field names for task type
    const taskType =
      task.taskType ||
      task.taskTypeId ||
      task.allocTaskType ||
      task.selectedTaskType ||
      task.task_type ||
      task.type ||
      "-";

    const deadline = task.deadline || "-";
    const status = task.status || "-";
    const rating = task.rating ?? "";
    const canEditRating = ratingAllowedUIDs.includes(
      task.assignedToUID || task.userId
    );

    tr.innerHTML = `
    <td>${userName}</td>
    <td>${clientName}</td>
    <td>${assignedBy}</td>
    <td>${taskType}</td>
    <td>${deadline}</td>
    <td>${status}</td>

    <td>
      <select class="edit-status-dropdown" data-task-id="${task.id}">
        <option value="done" ${
          status === "done" ? "selected" : ""
        }>done</option>
        <option value="to-do" ${
          status === "to-do" ? "selected" : ""
        }>to-do</option>
        <option value="backlog" ${
          status === "backlog" ? "selected" : ""
        }>backlog</option>
      </select>
    </td>

    <td
      class="rating-cell"
      data-task-id="${task.id}"
      contenteditable="${canEditRating ? "true" : "false"}"
      style="${canEditRating ? "background:#fffbea;" : ""}"
    >
      ${rating}
    </td>

    <td>
      <button class="btn-delete-task" data-task-id="${task.id}">
        Delete
      </button>
    </td>
  `;

    tbody.appendChild(tr);
  });
}

// 🔁 Set up listeners: status change, rating edit, delete
function setupMonthlyTaskTableListeners() {
  const table = document.querySelector("#monthly-task-table");
  if (!table) {
    console.warn("#monthly-task-table not found for listeners");
    return;
  }

  // 🔄 Status dropdown change → update Firestore
  table.addEventListener("change", async (e) => {
    if (!e.target.classList.contains("edit-status-dropdown")) return;

    const selectEl = e.target;
    const taskId = selectEl.dataset.taskId;
    const newStatus = selectEl.value;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await safeUpdateDoc(taskRef, { status: newStatus });

      // Update status cell shown in column 6
      const row = selectEl.closest("tr");
      const statusCell = row?.querySelector("td:nth-child(6)");
      if (statusCell) statusCell.textContent = newStatus;

      console.log("Status updated for:", taskId, "→", newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  });

  // ⭐ Rating blur (contenteditable cell) → update Firestore
  table.addEventListener(
    "blur",
    async (e) => {
      if (!e.target.classList.contains("rating-cell")) return;

      const cell = e.target;
      const taskId = cell.dataset.taskId;
      const newRating = cell.innerText.trim();

      try {
        const taskRef = doc(db, "tasks", taskId);
        await safeUpdateDoc(taskRef, { rating: newRating });
        console.log("Rating updated for:", taskId, "→", newRating);
      } catch (err) {
        console.error("Error updating rating:", err);
        alert("Failed to update rating.");
      }
    },
    true // useCapture so blur is caught
  );

  // 🗑️ Delete task button
  table.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-task");
    if (!btn) return;

    const taskId = btn.dataset.taskId;
    const row = btn.closest("tr");

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteDoc(doc(db, "tasks", taskId));
      if (row) row.remove();
      console.log("Task deleted:", taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  });
}

// 🚀 Init on page load
document.addEventListener("DOMContentLoaded", () => {
  setupMonthlyTaskTableListeners();

  // Optional: bind a button to load the table
  const loadBtn = document.getElementById("btn-load-monthly-tasks");
  if (loadBtn) {
    loadBtn.addEventListener("click", loadMonthlyTaskTable);
  }

  // Optional: auto-load if month already selected
  const monthInput = document.getElementById("monthly-month-filter");
  if (monthInput && monthInput.value) {
    loadMonthlyTaskTable();
  }
});

// ---- end replacement ----

function attachMonthlyTaskRowHandlers() {
  // 🔹 Change Status
  document.querySelectorAll(".task-status-select").forEach((selectEl) => {
    selectEl.addEventListener("change", async function () {
      const taskId = this.dataset.id;
      const newStatus = this.value; // "to-do" | "backlog" | "done"

      if (!taskId) {
        console.error("No taskId on monthly row select");
        alert("Cannot update status: task id missing.");
        return;
      }
      try {
        console.log("MONTHLY → status change", { taskId, newStatus });

        // ✅ Use unified user helper: sets status, dateDone, updatedAt

        console.log(`Status updated → ${newStatus} for task ${taskId}`);

        // 🔹 Update row color in UI
        const row = this.closest("tr");
        if (row) {
          row.classList.remove("status-backlog", "status-todo", "status-done");

          const clean = newStatus.toLowerCase();
          if (clean === "backlog") row.classList.add("status-backlog");
          else if (clean === "to-do" || clean === "todo")
            row.classList.add("status-todo");
          else if (clean === "done") row.classList.add("status-done");
        }

        // 🔹 Optional: re-render DAILY table so both match
        const picker = document.getElementById("daily-date-picker");
        if (picker && typeof renderDailyTasks === "function" && picker.value) {
          await renderDailyTasks(picker.value);
        }
      } catch (err) {
        console.error("Failed to update status:", err);
        alert("Failed to update status.");
      }
    });
  });

  // 🔹 Rating - contenteditable cell
  document.querySelectorAll(".task-rating-cell").forEach((cell) => {
    cell.addEventListener("blur", async function () {
      const taskId = this.dataset.id;
      const editable = this.getAttribute("contenteditable") === "true";
      if (!editable) return;

      const value = this.textContent.trim();
      let rating = value ? Number(value) : null;

      if (rating !== null) {
        if (isNaN(rating) || rating < 1 || rating > 5) {
          alert("Rating must be 1–5.");
          this.textContent = "";
          return;
        }
      }

      try {
        await safeUpdateDoc(doc(db, "tasks", taskId), { rating });
        console.log("Rating updated:", taskId, rating);
      } catch (err) {
        console.error("Failed to update rating:", err);
        alert("Failed to update rating.");
      }
    });
  });

  // 🔹 Delete Task
  document.querySelectorAll(".btn-delete-task").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const taskId = this.dataset.id;
      const ok = confirm("Are you sure you want to delete this task?");
      if (!ok) return;

      try {
        await deleteDoc(doc(db, "tasks", taskId));
        console.log("Task deleted:", taskId);

        const row = this.closest("tr");
        if (row) row.remove();
      } catch (err) {
        console.error("Failed to delete task:", err);
        alert("Failed to delete task.");
      }
    });
  });
}

async function renderUserTasks(user) {
  const tbody = document.querySelector("#user-tasks-table tbody");
  if (!tbody) return;

  // Stats counters
  let total = 0;
  let todo = 0;
  let done = 0;
  let backlog = 0;

  tbody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center;">Loading tasks...</td>
    </tr>
  `;

  try {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", user.email)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">No tasks available.</td>
        </tr>
      `;

      document.getElementById("user-total-tasks").textContent = 0;
      document.getElementById("user-pending-tasks").textContent = 0;
      document.getElementById("user-completed-tasks").textContent = 0;
      return;
    }

    tbody.innerHTML = "";

    snap.forEach((docSnap) => {
      const t = docSnap.data();
      total++;

      /* =========================
         STATUS + BACKLOG LOGIC
      ========================== */
      let status = (t.status || "todo").toLowerCase();

      if (t.deadline && status !== "done") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadlineDate = new Date(t.deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        if (deadlineDate < today) {
          status = "backlog";
        }
      }

      // Stats counting
      if (status === "done") {
        done++;
      } else {
        todo++;
        if (status === "backlog") backlog++;
      }

      /* =========================
         CSS CLASS MAPPING
      ========================== */
      const statusClass =
        status === "backlog"
          ? "status-backlog"
          : status === "done"
          ? "status-done"
          : "status-todo";

      const rowClass =
        status === "backlog"
          ? "row-backlog"
          : status === "done"
          ? "row-done"
          : "row-todo";

      /* =========================
         TABLE ROW
      ========================== */
      const tr = document.createElement("tr");
      tr.classList.add(rowClass);

      tr.innerHTML = `
        <td class="${statusClass}">${status}</td>
        <td>${t.clientId || "-"}</td>
        <td>${t.deadline || "-"}</td>
        <td>${t.taskTypeId || "-"}</td>
        <td>${t.assignedBy || "-"}</td>
        <td>
          ${
            status !== "done"
              ? `<button onclick="markTaskDone('${docSnap.id}')">Done</button>`
              : "✔"
          }
        </td>
      `;

      tbody.appendChild(tr);
    });

    /* =========================
       UPDATE STATS CARDS
    ========================== */
    document.getElementById("user-total-tasks").textContent = total;
    document.getElementById("user-pending-tasks").textContent = todo;
    document.getElementById("user-completed-tasks").textContent = done;
  } catch (err) {
    console.error("❌ Error loading user tasks:", err);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">Error loading tasks.</td>
      </tr>
    `;
  }
}

function resolveClientName(task) {
  const c1 = (task.client || "").trim();
  if (c1 && c1 !== "-") return c1;

  return (task.clientId || task["client-name"] || "").trim() || "-";
}
function attachUserTaskMarkDoneHandlers() {
  // Remove existing handlers to avoid duplicates
  document.querySelectorAll(".mark-done-btn").forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  // Attach fresh handlers
  document.querySelectorAll(".mark-done-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const taskId = this.dataset.id;
      if (!taskId) {
        console.error("mark-done: no task id found on button", this);
        alert("Cannot mark done: task id missing.");
        return;
      }

      try {
        // Use the central helper so dateDone and doneAt are set
        // updateTaskStatus(taskId, newStatus, selectedDateStr)
        // For user panel we set dateDone = today
        const todayStr = new Date().toISOString().slice(0, 10);

        // If you prefer updateTaskStatusUser (it uses setDoc + sync to allocations),
        // use that instead. Both should set dateDone.
        if (typeof updateTaskStatus === "function") {
          await updateTaskStatus(taskId, "done", todayStr);
        } else if (typeof updateTaskStatusUser === "function") {
        } else {
          // fallback: write status + dateDone directly (not preferred)
          await safeUpdateDoc(doc(db, "tasks", taskId), {
            status: "done",
            dateDone: todayStr,
            doneAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        console.log("Marked task done:", taskId);

        // Update UI: disable button and change row class / pill
        this.disabled = true;
        this.textContent = "Done";

        const row = this.closest("tr");
        if (row) {
          row.classList.remove("status-todo", "status-backlog");
          row.classList.add("status-done");
          const pill = row.querySelector(".status-pill");
          if (pill) {
            pill.textContent = "done";
            pill.classList.remove("status-todo", "status-backlog");
            pill.classList.add("status-done");
          }
        }

        // Optional: refresh matrices or dashboards
        if (typeof loadClientTaskChart === "function")
          await loadClientTaskChart();
        if (typeof loadAndRenderTaskMatrixForDate === "function") {
          const picker = document.getElementById("matrix-date");
          if (picker && picker.value)
            await loadAndRenderTaskMatrixForDate(picker.value);
        }
      } catch (err) {
        console.error("Failed to mark task done (user panel):", err);
        alert("Failed to mark task done. Check console.");
      }
    });
  });
}

function buildTaskCountMap(tasks) {
  const map = {};

  tasks.forEach((t) => {
    const user = t.userName;
    const client = t.clientName;
    const type = t.taskType;

    if (!user || !client || !type) return;

    if (!map[user]) map[user] = {};
    if (!map[user][client]) map[user][client] = {};
    map[user][client][type] = (map[user][client][type] || 0) + 1;
  });

  return map;
}
function renderUserTaskMatrices(users, clients, taskTypes, tasks) {
  const container = document.getElementById("user-task-matrix-container");
  if (!container) return;

  container.innerHTML = "";

  const countMap = buildTaskCountMap(tasks || []);

  users.forEach((userName) => {
    const wrapper = document.createElement("div");
    wrapper.className = "user-matrix-wrapper";

    const title = document.createElement("div");
    title.className = "user-matrix-title";
    title.textContent = userName;
    wrapper.appendChild(title);

    const table = document.createElement("table");
    table.className = "user-matrix-table";

    // Header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const emptyTh = document.createElement("th");
    emptyTh.textContent = "";
    headerRow.appendChild(emptyTh);

    taskTypes.forEach((tt) => {
      const th = document.createElement("th");
      th.textContent = tt; // or map to nicer label if you want
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement("tbody");

    clients.forEach((clientName) => {
      const row = document.createElement("tr");

      const clientCell = document.createElement("td");
      clientCell.textContent = clientName;
      row.appendChild(clientCell);

      taskTypes.forEach((tt) => {
        const cell = document.createElement("td");

        const count = ((countMap[userName] || {})[clientName] || {})[tt] || 0;

        // show blank for 0, number for >0
        cell.textContent = count > 0 ? String(count) : "";

        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    container.appendChild(wrapper);
  });
}

// monthStr format: "YYYY-MM"  (e.g. "2025-12")
async function loadAndRenderTaskMatrixForMonth(monthStr) {
  if (!monthStr) return;

  const tasksRef = collection(db, "tasks");

  // Get all DONE tasks, then filter by month in JS
  const qDone = query(tasksRef, where("status", "==", "done"));
  const snapDone = await getDocs(qDone);

  const tasks = [];

  snapDone.forEach((docSnap) => {
    const t = docSnap.data() || {};

    // -----------------------------
    // 1) Normalise dateDone
    // -----------------------------
    let doneDateStr = "";

    if (typeof t.dateDone === "string") {
      // already "YYYY-MM-DD"
      doneDateStr = t.dateDone.slice(0, 10);
    } else if (t.dateDone && t.dateDone.toDate) {
      // Firestore Timestamp → string
      const d = t.dateDone.toDate();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      doneDateStr = `${yyyy}-${mm}-${dd}`;
    } else {
      // no usable dateDone
      return;
    }

    // keep only tasks whose dateDone is in the selected month
    // e.g. "2025-12"
    if (!doneDateStr.startsWith(monthStr)) return;

    // -----------------------------
    // 2) Normalise user / client / type
    // -----------------------------
    const userNameRaw = t.assignedName || t.assignedTo || "";
    const userName = userNameRaw.toString().trim();
    if (!userName) return;

    const clientName = normalizeClientForMatrix(t); // uses your helper
    if (!clientName) return;

    const taskTypeLabel = normalizeTaskTypeForMatrix(t);

    tasks.push({
      userName,
      clientName,
      taskType: taskTypeLabel,
    });
  });

  console.log("MONTH MATRIX tasks for", monthStr, tasks);

  renderUserTaskMatrices(
    MATRIX_USERS,
    MATRIX_CLIENTS,
    MATRIX_TASK_TYPES,
    tasks
  );
}

// ---- end replacement ----

document.getElementById("btn-load-matrix").addEventListener("click", () => {
  const date = document.getElementById("matrix-date").value;
  if (!date) {
    alert("Please select a date first");
    return;
  }
  loadAndRenderTaskMatrixForDate(date);
});
// ================================================
// DAILY TASK TABLE (tasks created on selected day)
// ================================================

// When page loads, set date to today and load daily table
document.addEventListener("DOMContentLoaded", () => {
  const dailyDatePicker = document.getElementById("daily-date-picker");
  if (!dailyDatePicker) return;

  const today = new Date();
  dailyDatePicker.value = today.toISOString().slice(0, 10); // "YYYY-MM-DD"

  renderDailyTasks(dailyDatePicker.value);

  dailyDatePicker.addEventListener("change", (e) => {
    const selectedDate = e.target.value; // "YYYY-MM-DD"
    renderDailyTasks(selectedDate);
  });
});

function formatDeadline(deadline) {
  if (!deadline) return "-";

  // Firestore Timestamp
  if (deadline.toDate) {
    return deadline.toDate().toISOString().slice(0, 10);
  }

  // Already a string
  return deadline;
}

// DAILY TABLE NOW READS DIRECTLY FROM "tasks"
// DAILY TABLE NOW READS DIRECTLY FROM "tasks"
async function renderDailyTasks(selectedDateStr) {
  if (!selectedDateStr) return;

  const tbody = document.querySelector("#daily-task-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  try {
    const tasksRef = collection(db, "tasks");

    // 🔹 simple query — no index required
    const qRef = query(tasksRef, where("dateAssigned", "==", selectedDateStr));
    const snap = await getDocs(qRef);

    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="9">No tasks for this day.</td></tr>`;
      return;
    }

    // 🔸 Build array
    const tasks = [];
    snap.forEach((taskDoc) => {
      tasks.push({
        id: taskDoc.id,
        ...taskDoc.data(),
      });
    });

    // 🔥 Sort descending by createdAt Firestore timestamp
    tasks.sort((a, b) => {
      const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return t2 - t1;
    });

    // 🔹 Now render sorted rows
    tasks.forEach((t) => {
      const tr = document.createElement("tr");

      const status = (t.status || "to-do").toLowerCase();
      tr.classList.add(
        status === "done"
          ? "status-done"
          : status === "backlog"
          ? "status-backlog"
          : "status-todo"
      );

      tr.dataset.taskId = t.id;
      if (t.allocationId) tr.dataset.allocId = t.allocationId;

      const assignedBy = t.assignedBy || t.assignedByEmail || "-";
      const userName = t.assignedName || t.assignedTo || "-";
      const clientName = (t.client || t.clientId || "-").trim();
      const taskTypeLabel =
        TASK_TYPE_LABELS[t.taskTypeId] ||
        TASK_TYPE_LABELS[t.taskType] ||
        t.taskType ||
        "-";
      const deadline = t.deadline || "-";

      tr.innerHTML = `
        <td>${userName}</td>
        <td>${clientName}</td>
        <td>${assignedBy}</td>
        <td>${taskTypeLabel}</td>
        <td>${deadline}</td>
        <td><span class="status-pill">${status}</span></td>
        <td>
          <select class="change-status-select"
                  data-task-id="${t.id}"
                  data-alloc-id="${t.allocationId || ""}">
            <option value="to-do" ${
              status === "to-do" ? "selected" : ""
            }>To-Do</option>
            <option value="backlog" ${
              status === "backlog" ? "selected" : ""
            }>Backlog</option>
            <option value="done" ${
              status === "done" ? "selected" : ""
            }>Done</option>
          </select>
        </td>
        <td class="daily-rating-cell" contenteditable="true" data-task-id="${
          t.id
        }">
          ${t.rating != null ? t.rating : ""}
        </td>
        <td>
          <button class="delete-task-btn" data-task-id="${t.id}">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    attachDailyRowEvents();
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="9">Error loading tasks.</td></tr>`;
  }
}

function attachDailyRowEvents() {
  const tbody = document.querySelector("#daily-task-table tbody");
  if (!tbody) return;

  // 🔹 Change STATUS from DAILY table → sync to task + allocation + monthly
  tbody.addEventListener("change", async (e) => {
    if (!e.target.classList.contains("change-status-select")) return;

    const select = e.target;

    const taskId = select.dataset.taskId; // per-task id
    const allocId = select.dataset.allocId; // allocation id (optional)
    const newStatus = select.value; // "to-do" | "backlog" | "done"

    if (!taskId) {
      console.error("❌ No taskId on daily row select");
      alert("Cannot update status: task id missing.");
      return;
    }

    try {
      console.log(
        "🔄 DAILY → Updating task from daily view:",
        taskId,
        "alloc:",
        allocId,
        "status:",
        newStatus
      );

      // 1️⃣ Update task (and dateDone) using helper
      const datePicker = document.getElementById("daily-date-picker");
      const selectedDateStr =
        datePicker && datePicker.value
          ? datePicker.value
          : new Date().toISOString().slice(0, 10);

      await updateTaskStatus(taskId, newStatus, selectedDateStr);

      // 2️⃣ Optional: also store dailyStatus on allocation for reporting
      if (allocId) {
        await safeUpdateDoc(doc(db, "taskAllocations", allocId), {
          status: newStatus,
          dailyStatus: newStatus,
          lastUpdatedAt: serverTimestamp(),
        });
      }

      // 3️⃣ Update UI row color + pill
      const row = select.closest("tr");
      if (row) {
        row.classList.remove("status-todo", "status-backlog", "status-done");
        row.classList.add(`status-${newStatus}`);
      }

      const pill = row?.querySelector(".status-pill");
      if (pill) {
        pill.textContent = newStatus;
        pill.classList.remove("status-todo", "status-backlog", "status-done");

        const s = newStatus.toLowerCase();
        if (s === "backlog") pill.classList.add("status-backlog");
        else if (s === "done") pill.classList.add("status-done");
        else pill.classList.add("status-todo");
      }

      // 4️⃣ Refresh MONTHLY table if visible
      if (typeof loadMonthlyTaskTable === "function") {
        await loadMonthlyTaskTable();
      }
    } catch (err) {
      console.error("❌ Error updating daily task status:", err);
      alert("Failed updating task.");
    }
  });

  // 🔹 Rating – keep your existing rating code here
  tbody.addEventListener("focusout", async (e) => {
    const cell = e.target;
    if (!cell.classList.contains("daily-rating-cell")) return;
    // ... your existing rating code ...
  });
}

// One-time backfill for existing taskAllocations
// ----------------------------------------------
// One-time backfill for existing allocations
// ----------------------------------------------
window.backfillCreatedAtDateOnAllocations = async function () {
  console.log("⏳ Running backfill...");

  const allocRef = collection(db, "taskAllocations");
  const snap = await getDocs(allocRef);

  let updated = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    // Skip if already exists
    if (data.createdAtDate) continue;

    // Skip if invalid timestamp
    if (!data.createdAt || !data.createdAt.toDate) continue;

    const d = data.createdAt.toDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    const dateStr = `${yyyy}-${mm}-${dd}`;

    await safeUpdateDoc(doc(db, "taskAllocations", docSnap.id), {
      createdAtDate: dateStr,
    });

    updated++;
  }

  console.log(`✅ Backfill complete — updated ${updated} allocations.`);
};
function showLoginTimesInList(html) {
  const listDiv = document.getElementById("login-times-list");
  if (listDiv) {
    listDiv.innerHTML = `<p style="font-size:14px; font-weight:500">${html}</p>`;
  }
}

function getCurrentMonthStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // e.g. "2025-12"
}

async function loadClientTaskChart(monthStr) {
  try {
    const targetMonth = monthStr || getCurrentMonthStr();

    const tasksSnap = await getDocs(collection(db, "tasks"));

    const clientCounts = {};

    tasksSnap.forEach((docSnap) => {
      const t = docSnap.data() || {};

      // Only count completed tasks
      if ((t.status || "").toLowerCase() !== "done") return;

      // Prefer dateDone; fallback to dateAssigned
      const rawDate = t.dateDone || t.dateAssigned;
      if (!rawDate || rawDate.length < 7) return; // skip bad dates

      // rawDate expected as "YYYY-MM-DD"
      if (!rawDate.startsWith(targetMonth)) return;

      const client = (t.client || t.clientId || "Other").trim();

      clientCounts[client] = (clientCounts[client] || 0) + 1;
    });

    renderClientTasksPieChart(clientCounts);
  } catch (err) {
    console.error("chart load failed:", err);
  }
}
function updateUserDashboardStats(total, pending, completed) {
  document.getElementById("user-total-tasks").textContent = total;
  document.getElementById("user-pending-tasks").textContent = pending;
  document.getElementById("user-completed-tasks").textContent = completed;
}
const monthBtn = document.getElementById("btn-load-matrix-month");
if (monthBtn) {
  monthBtn.addEventListener("click", () => {
    const monthVal = document.getElementById("matrix-month").value; // "YYYY-MM"
    if (!monthVal) {
      alert("Please select a month first");
      return;
    }
    loadAndRenderTaskMatrixForMonth(monthVal);
  });
}
// monthStr format: "YYYY-MM"  (example: "2025-12")

// 🔁 Single unified helper: updates status + dateDone + doneAt
/**
 * Updates task status and tracks completion date when status = "done".
 *
 * @param {string} taskId          Firestore document ID
 * @param {string} newStatus       "to-do" | "backlog" | "done"
 * @param {string} selectedDateStr YYYY-MM-DD (date picker day)
 */
async function updateTaskStatus(taskId, newStatus) {
  if (!appIsActive) return;
  if (taskUpdateInProgress) return; // 🔒 BLOCK DUPLICATES

  taskUpdateInProgress = true;

  try {
    await safeUpdateDoc(doc(db, "tasks", taskId), {
      status: newStatus,
      dateDone: newStatus === "Done" ? serverTimestamp() : null,
    });
  } catch (err) {
    console.error("Failed to update task status:", err);
  } finally {
    taskUpdateInProgress = false;
  }
}

try {
  if (typeof db !== "undefined") window.db = db;
  if (typeof collection !== "undefined") window.collection = collection;
  if (typeof query !== "undefined") window.query = query;
  if (typeof where !== "undefined") window.where = where;
  if (typeof getDocs !== "undefined") window.getDocs = getDocs;
  if (typeof Timestamp !== "undefined") window.Timestamp = Timestamp;
  console.log("Firestore helpers exported to window (for debug).");
} catch (e) {
  console.warn(
    "Could not export Firestore helpers. You might be in a module scope where these names are not accessible:",
    e
  );
}

document.getElementById("btn-load-matrix").addEventListener("click", () => {
  const date = document.getElementById("matrix-date").value;
  if (!date) {
    alert("Please select a date first");
    return;
  }
  loadAndRenderTaskMatrixForDate(date);
});

// DAILY MATRIX – show tasks completed on one specific date
// dateStr format: "YYYY-MM-DD"
async function loadAndRenderTaskMatrixForDate(dateStr) {
  if (!dateStr) return;

  const tasksRef = collection(db, "tasks");

  // Get all done tasks (any dateDone type)
  const qDone = query(tasksRef, where("status", "==", "done"));
  const snapDone = await getDocs(qDone);

  const tasks = [];

  snapDone.forEach((docSnap) => {
    const t = docSnap.data() || {};

    // --- 1) Normalise dateDone to "YYYY-MM-DD" string ---
    let doneStr = "";

    if (typeof t.dateDone === "string") {
      // already string, just cut to 10 chars
      doneStr = t.dateDone.slice(0, 10);
    } else if (t.dateDone && t.dateDone.toDate) {
      // Firestore Timestamp → string
      const d = t.dateDone.toDate();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      doneStr = `${yyyy}-${mm}-${dd}`;
    }

    // keep only tasks finished on the selected date
    if (doneStr !== dateStr) return;

    // --- 2) Normalise user / client / task type ---
    const userNameRaw = t.assignedName || t.assignedTo || "";
    const userName = userNameRaw.toString().trim();
    if (!userName) return;

    // use your helper so "Others" → "Other", etc.
    const clientName = normalizeClientForMatrix(t);
    if (!clientName) return;

    const taskTypeLabel = normalizeTaskTypeForMatrix(t);

    tasks.push({
      userName,
      clientName,
      taskType: taskTypeLabel,
    });
  });

  console.log("Matrix tasks for", dateStr, tasks);

  renderUserTaskMatrices(
    MATRIX_USERS,
    MATRIX_CLIENTS,
    MATRIX_TASK_TYPES,
    tasks
  );
}
/* ===== Single-sheet export: all users on one worksheet ===== */

/* sanitize text for safety */
function sanitizeText(t) {
  if (!t) return "";
  return String(t)
    .replace(/[\u0000-\u001F\u007F]+/g, "")
    .trim();
}

/* compute simple column widths */
function calcColWidths(dataRows) {
  const widths = [];
  dataRows.forEach((row) => {
    row.forEach((cell, i) => {
      const text = cell == null ? "" : String(cell);
      const len = Math.min(60, Math.max(1, text.length + 2));
      widths[i] = Math.max(widths[i] || 0, len);
    });
  });
  return widths.map((w) => ({ wch: w }));
}

/* Convert HTML table to 2D array (header + body), normalize numeric blanks to 0 */
function tableToMatrixArray(table) {
  if (!table) return [];

  // header
  let header = [];
  const thead = table.querySelector("thead");
  if (thead)
    header = Array.from(thead.querySelectorAll("th,td")).map((n) =>
      sanitizeText(n.textContent)
    );
  else {
    const firstRow = table.querySelector("tr");
    if (firstRow)
      header = Array.from(firstRow.querySelectorAll("th,td")).map((n) =>
        sanitizeText(n.textContent)
      );
  }
  if (header.length && !header[0]) header[0] = "Client";

  // body rows
  const rows = [];
  if (header.length) rows.push(header);

  const tbody = table.querySelector("tbody");
  const trList = tbody
    ? Array.from(tbody.querySelectorAll("tr"))
    : Array.from(table.querySelectorAll("tr")).slice(1);

  trList.forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll("td,th")).map((td) =>
      sanitizeText(td.textContent)
    );
    const isEmpty = cells.every((c) => c === "" || c == null);
    if (!isEmpty) rows.push(cells);
  });

  // normalize lengths
  const maxCols = Math.max(...rows.map((r) => r.length), 0);
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < maxCols; c++) {
      if (typeof rows[r][c] === "undefined") rows[r][c] = "";
    }
  }

  // convert blank body numeric cells to 0 (not header)
  for (let r = 1; r < rows.length; r++) {
    for (let c = 1; c < rows[r].length; c++) {
      if (rows[r][c] === "" || rows[r][c] == null) rows[r][c] = 0;
      if (typeof rows[r][c] === "string" && /^[0-9]+$/.test(rows[r][c]))
        rows[r][c] = Number(rows[r][c]);
    }
  }

  return rows;
}

/* heuristic: find a nearby title for a table */
function findTitleForTable(table) {
  if (!table) return null;
  if (table.dataset && table.dataset.user)
    return sanitizeText(table.dataset.user);

  // check previous siblings (a few nodes)
  let prev = table.previousElementSibling;
  for (let i = 0; i < 6 && prev; i++) {
    const tag = prev.tagName && prev.tagName.toUpperCase();
    if (
      tag === "H1" ||
      tag === "H2" ||
      tag === "H3" ||
      prev.classList.contains("user-matrix-title") ||
      prev.classList.contains("user-title")
    ) {
      return sanitizeText(prev.textContent);
    }
    prev = prev.previousElementSibling;
  }

  // check parent wrappers
  let p = table.parentElement;
  for (let i = 0; i < 4 && p; i++) {
    if (p.dataset && p.dataset.user) return sanitizeText(p.dataset.user);
    const childTitle = p.querySelector(
      ".user-matrix-title, .user-title, h3, h2"
    );
    if (childTitle) return sanitizeText(childTitle.textContent);
    p = p.parentElement;
  }

  // fallback: "User N"
  return null;
}

/* Build a single sheet combining all users' matrices */
function downloadDailyReportSingleSheet(dateStr) {
  if (typeof XLSX === "undefined") {
    alert("XLSX library not loaded.");
    return;
  }

  const container = document.getElementById("user-task-matrix-container");
  if (!container) {
    alert("No matrix container found. Load the daily report first.");
    return;
  }

  // find blocks or fall back to tables
  let userBlocks = Array.from(
    container.querySelectorAll(".user-matrix, .user-block, .user-report")
  );
  let tableEntries = [];
  if (userBlocks.length > 0) {
    userBlocks.forEach((block) => {
      const t = block.querySelector("table");
      if (t) tableEntries.push({ table: t, block });
    });
  } else {
    const allTables = Array.from(container.querySelectorAll("table"));
    tableEntries = allTables.map((t) => ({ table: t, block: null }));
  }

  if (!tableEntries.length) {
    alert("No user tables found.");
    return;
  }

  // Build combined 2D array
  const combined = [];
  tableEntries.forEach((entry, idx) => {
    const table = entry.table;
    const title = findTitleForTable(table) || `User_${idx + 1}`;
    // Title row (make it stand out by placing in first column)
    combined.push([title]);
    // table matrix
    const matrix = tableToMatrixArray(table);
    if (matrix && matrix.length > 0) {
      // If header exists, push header row; and then all rows
      matrix.forEach((row) => combined.push(row));
    } else {
      combined.push(["No data available"]);
    }
    // blank spacer row
    combined.push([]);
  });

  // Create workbook / single sheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(combined);

  // Auto column widths (basic)
  ws["!cols"] = calcColWidths(combined);

  XLSX.utils.book_append_sheet(wb, ws, "Daily Report");

  const safeDate = (dateStr || new Date().toISOString().slice(0, 10)).replace(
    /[:\\\/\s]+/g,
    "-"
  );
  const filename = `daily-report-${safeDate}.xlsx`;
  try {
    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.error(err);
    alert("Failed to save Excel file. See console.");
  }
}

/* Create/ensure Download button and hook */
function ensureDownloadDailyButtonSingle(dateStr) {
  const container = document.getElementById("user-task-matrix-container");
  if (!container) return;

  const existing = document.getElementById("btn-download-daily-report");
  if (existing) existing.remove();

  const btn = document.createElement("button");
  btn.id = "btn-download-daily-report";
  btn.type = "button";
  btn.textContent = `Download Report (${
    dateStr || new Date().toISOString().slice(0, 10)
  })`;
  btn.className = "download-daily-report";

  container.parentNode.insertBefore(btn, container.nextSibling);

  btn.addEventListener("click", () => downloadDailyReportSingleSheet(dateStr));
  return btn;
}

/* Hook into Load Report button: poll for tables then show download button */
(function attachSingleSheetHook() {
  const loadBtn = document.getElementById("btn-load-matrix");
  if (!loadBtn) return;

  loadBtn.addEventListener("click", () => {
    const dateInput = document.getElementById("matrix-date");
    const dateStr = dateInput
      ? dateInput.value
      : new Date().toISOString().slice(0, 10);
    const container = document.getElementById("user-task-matrix-container");
    if (!container) return;

    // remove old btn if any
    const old = document.getElementById("btn-download-daily-report");
    if (old) old.remove();

    const start = Date.now();
    const timeout = 6000;
    const pollInterval = 150;
    const poll = setInterval(() => {
      const tables = container.querySelectorAll("table");
      if (tables.length > 0) {
        clearInterval(poll);
        ensureDownloadDailyButtonSingle(dateStr);
        return;
      }
      if (Date.now() - start > timeout) {
        clearInterval(poll);
        ensureDownloadDailyButtonSingle(dateStr);
      }
    }, pollInterval);
  });
})();
(function attachMonthlyHook() {
  const loadBtn = document.getElementById("btn-load-matrix-month");
  if (!loadBtn) return;
  loadBtn.addEventListener("click", () => {
    const monthInput =
      document.getElementById("matrix-month") ||
      document.getElementById("monthly-month-filter");
    const monthStr = monthInput
      ? monthInput.value
      : new Date().toISOString().slice(0, 7);
    const container = document.getElementById("user-task-matrix-container");
    if (!container) return;
    const old = document.getElementById("btn-download-monthly-report");
    if (old) old.remove();
    const start = Date.now();
    const timeout = 6000;
    const pollInterval = 150;
    const poll = setInterval(() => {
      const tables = container.querySelectorAll("table");
      if (tables.length > 0) {
        clearInterval(poll);
        ensureDownloadDailyButtonSingle
          ? ensureDownloadDailyButtonSingle(monthStr)
          : ensureDownloadMonthlyButtonSingle(monthStr);
        // prefer a dedicated monthly button id
        ensureDownloadMonthlyButtonSingle(monthStr);
        return;
      }
      if (Date.now() - start > timeout) {
        clearInterval(poll);
        ensureDownloadMonthlyButtonSingle(monthStr);
      }
    }, pollInterval);
  });
})();
const clientsFixed = [
  "Appa",
  "Jitendra Nanaware",
  "Shivsena Maval",
  "Vishwajit Sir",
  "Trimortal",
  "Royal Court",
  "Plutuss Digital",
  "Nilesh Nikam",
  "Pramod",
  "Nilesh Taras",
  "Yogesh Babar",
  "Mayur Lande",
  "Other",
];
const taskTypesFixed = [
  "Posting",
  "Graphic design",
  "reel",
  "Boosting",
  "Outdoor Shooting",
  "Content Writing",
  "Motion Graphics",
  "Website Work",
  "Other",
];
/* ------------------------
   Matrix: load & render tasks whose dateDone is BETWEEN start & end
   ------------------------ */
async function loadAndRenderTaskMatrixForRange(startIso, endIso) {
  // startIso / endIso = 'YYYY-MM-DD' or null
  if (!startIso && !endIso) {
    // nothing selected — you can choose to show everything or return
    console.warn("No date range provided to loadAndRenderTaskMatrixForRange");
  }

  try {
    const tasksRef = collection(db, "tasks");

    // Build server-side query. We always filter status == 'done' to reduce results.
    const constraints = [where("status", "==", "done")];
    if (startIso) constraints.push(where("dateDone", ">=", startIso));
    if (endIso) constraints.push(where("dateDone", "<=", endIso));

    const q = constraints.length
      ? query(tasksRef, ...constraints)
      : query(tasksRef);
    const snap = await getDocs(q);

    // Prepare aggregation map using your MATRIX_CLIENTS and MATRIX_TASK_TYPES
    // Initialize agg[client][taskType] = 0
    const agg = {};
    for (const client of MATRIX_CLIENTS) {
      agg[client] = {};
      for (const t of MATRIX_TASK_TYPES) agg[client][t] = 0;
    }

    // Iterate and count
    snap.forEach((docSnap) => {
      const data = docSnap.data() || {};

      // ensure dateDone exists and is inside range (defensive)
      let raw = data.dateDone || data.doneAt || data.completedAt || null;
      if (!raw) return;

      // Normalize date to YYYY-MM-DD string
      let dateIso = "";
      if (typeof raw === "string") {
        // assume already 'YYYY-MM-DD' or ISO -> convert
        dateIso = raw.slice(0, 10);
      } else if (raw && raw.toDate) {
        dateIso = raw.toDate().toISOString().slice(0, 10);
      } else {
        dateIso = new Date(raw).toISOString().slice(0, 10);
      }

      // Final defensive check: is date within provided range?
      if (startIso && dateIso < startIso) return;
      if (endIso && dateIso > endIso) return;

      // Normalize labels (use your helpers present in task.js)
      const clientLabel =
        typeof normalizeClientForMatrix === "function"
          ? normalizeClientForMatrix(data) || "Other"
          : data.client || "Other";

      const taskTypeLabel =
        typeof normalizeTaskTypeForMatrix === "function"
          ? normalizeTaskTypeForMatrix(data) || "Other"
          : data.taskType || "Other";

      // Make sure labels match the matrix keys; if client not in MATRIX_CLIENTS, skip
      if (!agg[clientLabel]) {
        // If you prefer to auto-add unknown clients, uncomment the lines below:
        // agg[clientLabel] = {}; for (const t of MATRIX_TASK_TYPES) agg[clientLabel][t]=0;
        return;
      }

      // Increment counter (if task type unknown, map to 'Other')
      const finalTaskType = MATRIX_TASK_TYPES.includes(taskTypeLabel)
        ? taskTypeLabel
        : "Other";
      agg[clientLabel][finalTaskType] =
        (agg[clientLabel][finalTaskType] || 0) + 1;
    });

    // Render the compact table into #tableWrapper (same container used by report.html)
    const wrapper = document.getElementById("tableWrapper");
    if (!wrapper) {
      console.warn(
        "No #tableWrapper element found. Create one or change target."
      );
      return;
    }
    wrapper.innerHTML = "";

    const table = document.createElement("table");
    table.className = "pivot";
    // header
    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    hr.appendChild(
      Object.assign(document.createElement("th"), { textContent: "" })
    );
    for (const t of MATRIX_TASK_TYPES) {
      hr.appendChild(
        Object.assign(document.createElement("th"), { textContent: t })
      );
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    // body rows
    const tbody = document.createElement("tbody");
    for (const client of MATRIX_CLIENTS) {
      const tr = document.createElement("tr");
      tr.appendChild(
        Object.assign(document.createElement("td"), {
          textContent: client,
          className: "client",
        })
      );
      for (const t of MATRIX_TASK_TYPES) {
        const v = agg[client][t] || "";
        const td = document.createElement("td");
        td.className = "center";
        td.textContent = v || "";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrapper.appendChild(table);

    // OPTIONAL: show a summary toast/log
    console.log(
      "Matrix rendered for range",
      startIso,
      "→",
      endIso,
      "rows:",
      snap.size
    );
  } catch (err) {
    console.error("Error loading matrix for range:", err);
    alert("Failed to load matrix. See console.");
  }
}

// Expose function to global so your report HTML can call it if needed
window.loadAndRenderTaskMatrixForRange = loadAndRenderTaskMatrixForRange;

/* ------------------------
   Wire to UI (apply button)
   ------------------------ */
(function wireRangeApply() {
  // prefer existing '#apply' button (from the small report HTML), otherwise try '#applyRangeBtn'
  const btn =
    document.getElementById("apply") ||
    document.getElementById("applyRangeBtn") ||
    null;
  if (!btn) return; // no button to wire; caller can call loadAndRenderTaskMatrixForRange manually

  btn.addEventListener("click", async () => {
    const start = document.getElementById("startDate")?.value || null; // YYYY-MM-DD
    const end = document.getElementById("endDate")?.value || null;

    if (start && end && start > end) {
      alert("Start date must be before or equal to End date");
      return;
    }
    // call the loader
    await loadAndRenderTaskMatrixForRange(start, end);
    // update visible range display if you use one
    const rangeEl = document.getElementById("rangeDisplay");
    if (rangeEl)
      rangeEl.textContent = (start || "...") + " to " + (end || "...");
  });
})();
/* ---------- Pivot download: show a button when .pivot appears and download as .xlsx ---------- */

function downloadPivotExcel(filename = "pivot.xlsx") {
  const table = document.querySelector(".pivot");
  if (!table) {
    alert("Pivot table (.pivot) not found.");
    return;
  }

  // If SheetJS is available, use it (preferred)
  if (window.XLSX && typeof XLSX.utils.table_to_sheet === "function") {
    try {
      const ws = XLSX.utils.table_to_sheet(table, { raw: false });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pivot");
      // Optional: auto widths (basic)
      // ws['!cols'] = [{ wch: 20 }]; // example — SheetJS auto widths are approximate
      // Build a safe filename with timestamp
      const safeName = filename.replace(/[:\\\/\s]+/g, "-");
      XLSX.writeFile(wb, safeName);
      return;
    } catch (err) {
      console.error("SheetJS pivot export failed:", err);
      // fallthrough to CSV fallback
    }
  }

  // Fallback: CSV export (opens in Excel)
  try {
    const rows = Array.from(table.rows).map((row) =>
      Array.from(row.cells)
        .map((cell) => {
          const txt = (cell.innerText || "").replace(/\r?\n/g, " ").trim();
          return '"' + txt.replace(/"/g, '""') + '"';
        })
        .join(",")
    );
    const csv = rows.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\.xlsx$/i, ".csv");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("CSV fallback failed:", err);
    alert("Failed to export pivot table. See console.");
  }
}

/* Create the button and insert into the DOM (next to the table wrapper) */
function ensurePivotDownloadButton(dateLabel) {
  const wrapper = document.getElementById("tableWrapper");
  if (!wrapper) return;

  // remove old button if any
  const old = document.getElementById("btn-download-pivot");
  if (old) old.remove();

  const btn = document.createElement("button");
  btn.id = "btn-download-pivot";
  btn.type = "button";
  btn.textContent = dateLabel
    ? `Download Pivot (${dateLabel})`
    : "Download Pivot";
  // reuse your project's styles or add a class
  btn.className = "download-daily-report"; // uses existing CSS style in task.css
  wrapper.parentNode.insertBefore(btn, wrapper.nextSibling);

  btn.addEventListener("click", () => {
    const safeDate = dateLabel || new Date().toISOString().slice(0, 10);
    const filename = `pivot-${safeDate}.xlsx`;
    downloadPivotExcel(filename);
  });

  return btn;
}

/* Hook into the existing Apply button behaviour:
   When user clicks #apply this code polls for .pivot to appear then inserts the download button.
   This mirrors patterns you already use for matrix/daily hooks in task.js.
*/
(function attachPivotHook() {
  const applyBtn = document.getElementById("apply");
  if (!applyBtn) return;

  applyBtn.addEventListener("click", () => {
    // Remove any existing pivot button while new pivot is being generated
    const old = document.getElementById("btn-download-pivot");
    if (old) old.remove();

    // Derived label: try to use selected start/end or today
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const dateLabel =
      start && end ? `${start}_to_${end}` : start || end || null;

    const container = document.getElementById("tableWrapper");
    if (!container) return;

    const startMs = Date.now();
    const timeout = 6000; // 6s poll cap (tune as needed)
    const pollInterval = 150;
    const poll = setInterval(() => {
      const pivot = container.querySelector(".pivot");
      if (pivot) {
        clearInterval(poll);
        ensurePivotDownloadButton(dateLabel);
        return;
      }
      if (Date.now() - startMs > timeout) {
        clearInterval(poll);
        // still create a button (it will warn if no pivot)
        ensurePivotDownloadButton(dateLabel);
      }
    }, pollInterval);
  });
})();
function showLoggedOutUI() {
  sessionStarted = false; // reset for next login

  document.getElementById("auth-section").style.display = "flex";
  document.querySelector(".admin-wrapper").style.display = "none";
  document.getElementById("admin-panel")?.classList.add("hidden");
  document.getElementById("user-panel")?.classList.add("hidden");
  document.getElementById("dashboard-section").style.display = "none";
}

async function handleLogout() {
  const user = auth.currentUser;
  if (!user) return;

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  // 🔴 IMPORTANT: search by EMAIL (because logs use email)
  const q = query(
    collection(db, "loginLogs"),
    where("email", "==", user.email),
    where("date", "==", today)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    console.error("❌ No login log found for logout");
  } else {
    await updateDoc(snap.docs[0].ref, {
      logoutTime: serverTimestamp(),
    });
    console.log("✅ Logout time saved");
  }

  await signOut(auth);
  resetUIAfterLogout();
}

document
  .getElementById("btn-logout-admin")
  ?.addEventListener("click", handleLogout);
document.getElementById("login-btn").addEventListener("click", async () => {
  appIsActive = true; // ✅ RE-ACTIVATE APP

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  await signInWithEmailAndPassword(auth, email, password);
});
async function safeUpdateDoc(docRef, data) {
  // ❌ stop if app is inactive (logout, auth switch)
  if (!appIsActive) return;

  // ❌ stop duplicate / parallel writes
  if (taskUpdateInProgress) return;

  taskUpdateInProgress = true;

  try {
    await safeUpdateDoc(docRef, data);
  } catch (err) {
    console.error("Firestore update failed:", err);
  } finally {
    taskUpdateInProgress = false;
  }
}
function formatTimeAMPM(ts) {
  if (!ts || !ts.toDate) return "—";

  const d = ts.toDate();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h ? h : 12;

  return `${h}:${m} ${ampm}`;
}
async function loadUserLoginInfo(user, userData) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const logRef = doc(db, "loginLogs", `${todayStr}_${user.uid}`);
  const snap = await getDoc(logRef);

  // user name
  document.getElementById("login-user-name").textContent =
    userData.name || "User";

  if (!snap.exists()) return;

  const log = snap.data();

  document.getElementById("login-time-text").textContent = formatTimeAMPM(
    log.loginTime
  );

  document.getElementById("logout-time-text").textContent = log.logoutTime
    ? formatTimeAMPM(log.logoutTime)
    : "—";
}
window.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initial UI state setup");

  // AUTH visible
  document.getElementById("auth-section")?.style.setProperty("display", "flex");

  // HIDE everything else
  document.getElementById("admin-panel")?.classList.add("hidden");
  document.getElementById("user-panel")?.classList.add("hidden");
  document.getElementById("user-task-section")?.classList.add("hidden");
  document
    .getElementById("dashboard-section")
    ?.style.setProperty("display", "none");

  // Optional safety
  document
    .getElementById("monthly-task-table")
    ?.style.setProperty("display", "none");
  document
    .querySelector(".daily-tasks-wrapper")
    ?.style.setProperty("display", "block");
});
function hideAllPanels() {
  document.getElementById("admin-panel")?.classList.add("hidden");
  document.getElementById("user-panel")?.classList.add("hidden");
}
async function ensureTodayLoginLog(user, role, name) {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  const q = query(
    collection(db, "loginLogs"),
    where("email", "==", user.email),
    where("date", "==", today)
  );

  const snap = await getDocs(q);

  // ✅ If already exists, do nothing
  if (!snap.empty) return;

  // ✅ Create today's login log
  await addDoc(collection(db, "loginLogs"), {
    email: user.email,
    name,
    role,
    date: today,
    loginTime: serverTimestamp(),
    logoutTime: null,
    createdAt: serverTimestamp(),
  });
}
document
  .getElementById("btn-logout-user")
  ?.addEventListener("click", handleLogout);

document
  .getElementById("btn-logout-admin")
  ?.addEventListener("click", handleLogout);
async function displayAdminLoginInfo(email, name) {
  const adminInfoDiv = document.getElementById("login-info-admin");
  if (!adminInfoDiv) return;

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  let loginTime = "-";
  let logoutTime = "-";

  try {
    const q = query(
      collection(db, "loginLogs"),
      where("email", "==", email),
      where("date", "==", today)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      const data = snap.docs[0].data();

      if (data.loginTime?.toDate) {
        loginTime = data.loginTime.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      if (data.logoutTime?.toDate) {
        logoutTime = data.logoutTime.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
  } catch (err) {
    console.error("Admin login info error:", err);
  }

  adminInfoDiv.textContent = `Hi ${name} | Login time: ${loginTime} | Logout time: ${logoutTime}`;

  adminInfoDiv.style.display = "block";
}
