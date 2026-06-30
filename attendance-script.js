// =======================
// 🔐 LOGIN
// =======================
const empDepartmentMap = {
  Karthik: "Video Editor",
  Yash: "Video Editor",
  Mohit: "Video Editor",
  Manish: "Graphic Designer",
  Vaibhav: "Graphic Designer",
  Siddharth: "Graphic Designer",
  Shruti: "Graphic Designer",
  Grishma: "Back Office",
  Akshad: "Digital Marketing",
  Sapna: "Digital Marketing",
  Gauri: "Digital Marketing",
  Shweta: "Digital Marketing",
  Mitali: "Web Developer",
  Amol: "Content Writer",
};

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userEmail = userCredential.user.email;

      const allowedAdmins = [
        "grishmashivaji@gmail.com",
        "secondadmin@gmail.com",
      ];

      if (allowedAdmins.includes(userEmail)) {
        localStorage.setItem("userEmail", userEmail);
        window.location.href = "dashboard.html";
      } else {
        alert("Access denied");
        auth.signOut();
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

// =======================
// 🌍 GLOBALS
// =======================
const currentUser = localStorage.getItem("userEmail");
const isEditor = currentUser === "grishmashivaji@gmail.com";

let selectedMonth = "";
let employees = [];

// =======================
// 🚀 INIT
// =======================
document.addEventListener("DOMContentLoaded", function () {
  if (!currentUser && window.location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }

  const monthInput = document.getElementById("monthPicker");
  const today = new Date();

  monthInput.value = today.toISOString().slice(0, 7);
  selectedMonth = monthInput.value;

  loadData();

  monthInput.addEventListener("change", () => {
    selectedMonth = monthInput.value;
    loadData();
  });

  if (!isEditor) {
    const empInput = document.getElementById("empName");
    const addBtn = document.getElementById("addBtn");

    if (empInput) empInput.style.display = "none";
    if (addBtn) addBtn.style.display = "none";
  }
});

// =======================
// 📥 LOAD DATA
// =======================
function loadData() {
  db.collection("attendance")
    .doc(selectedMonth)
    .get()
    .then((doc) => {
      attendanceData = doc.exists ? doc.data().attendance || {} : {};

      db.collection("employees")
        .doc("list")
        .get()
        .then((empDoc) => {
          employees = empDoc.exists ? empDoc.data().names || [] : [];

          renderTable();
        });
    });
}

// =======================
// 📊 RENDER TABLE
// =======================
function renderTable() {
  const table = document.getElementById("attendanceTable");
  table.innerHTML = "";

  let header = "<thead><tr><th>Date</th>";

  employees.forEach((emp) => {
    header += `
      <th onclick="goToDepartment('${emp}')">
        ${emp}
        ${
          isEditor
            ? `<button onclick="event.stopPropagation(); removeEmployee('${emp}')">Close</button>`
            : ""
        }
      </th>`;
  });

  header += "</tr></thead><tbody>";
  table.innerHTML += header;

  const [year, month] = selectedMonth.split("-");
  const totalDays = new Date(year, month, 0).getDate();

  for (let i = 1; i <= totalDays; i++) {
    const date = `${selectedMonth}-${String(i).padStart(2, "0")}`;

    let row = `<tr><td>${date}</td>`;

    employees.forEach((emp) => {
      row += `
        <td>
          <select onchange="markAttendanceDropdown('${date}', '${emp}', this)">
            <option value="">--</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Week-Off">Week Off</option>
            <option value="Half Day">Half Day</option>
            <option value="Late">Late</option> <!-- ✅ ADDED -->
          </select>
        </td>
      `;
    });

    row += "</tr>";
    table.innerHTML += row;
  }

  loadAttendanceData();
  table.innerHTML += "</tbody>";
}

// =======================
// ✏️ MARK ATTENDANCE
// =======================
function markAttendanceDropdown(date, emp, select) {
  if (!isEditor) return alert("No permission");

  const value = select.value;
  const cell = select.parentElement;

  cell.className = "";

  if (value === "Present") cell.classList.add("present");
  else if (value === "Absent") cell.classList.add("absent");
  else if (value === "Week-Off") cell.classList.add("weekoff");
  else if (value === "Half Day") cell.classList.add("halfday");
  else if (value === "Late") cell.classList.add("late"); // ✅ NEW

  const docRef = db.collection("attendance").doc(selectedMonth);

  docRef.get().then((doc) => {
    let records = doc.data()?.records || {};

    if (!records[date]) records[date] = {};

    records[date][emp] = value;

    docRef.set({ records }, { merge: true });
  });
}

// =======================
// 📥 LOAD ATTENDANCE DATA
// =======================
function loadAttendanceData() {
  db.collection("attendance")
    .doc(selectedMonth)
    .get()
    .then((doc) => {
      if (!doc.exists) return;

      const records = doc.data().records || {};

      Object.keys(records).forEach((date) => {
        const rows = document.querySelectorAll("#attendanceTable tr");

        rows.forEach((row) => {
          const firstCell = row.children[0];
          if (!firstCell || firstCell.innerText !== date) return;

          employees.forEach((emp, index) => {
            const cell = row.children[index + 1];
            const select = cell?.querySelector("select");

            if (!select) return;

            const value = records[date]?.[emp] || "";
            select.value = value;

            cell.className = "";

            if (value === "Present") cell.classList.add("present");
            else if (value === "Absent") cell.classList.add("absent");
            else if (value === "Week-Off") cell.classList.add("weekoff");
            else if (value === "Half Day") cell.classList.add("halfday");
            else if (value === "Late") cell.classList.add("late"); // ✅ NEW
          });
        });
      });
    });
}

// =======================
// 📤 EXPORT TO EXCEL
// =======================
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [];

  document.querySelectorAll("#attendanceTable tr").forEach((row) => {
    let rowData = [];

    row.querySelectorAll("th, td").forEach((cell) => {
      const select = cell.querySelector("select");

      if (select) {
        rowData.push(select.value || "");
      } else {
        rowData.push(cell.innerText.trim());
      }
    });

    ws_data.push(rowData);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");

  XLSX.writeFile(wb, "attendance.xlsx");
}
function addEmployee() {
  const input = document.getElementById("empName");
  const name = input.value.trim();

  if (!name) {
    alert("Enter employee name");
    return;
  }

  // Prevent duplicate
  if (employees.includes(name)) {
    alert("Employee already exists");
    return;
  }

  employees.push(name);

  // Save to Firestore
  db.collection("employees")
    .doc("list")
    .set({ names: employees })
    .then(() => {
      input.value = "";
      renderTable();
    })
    .catch((error) => {
      console.error("Error adding employee:", error);
    });
}
function removeEmployee(name) {
  if (!isEditor) return alert("No permission");

  if (!confirm(`Remove ${name}?`)) return;

  // Remove from local array
  employees = employees.filter((emp) => emp !== name);

  // 🔥 Update Firestore (employees list)
  db.collection("employees")
    .doc("list")
    .set({ names: employees })
    .then(() => {
      // 🔥 ALSO remove from attendance records
      return db.collection("attendance").doc(selectedMonth).get();
    })
    .then((doc) => {
      if (!doc.exists) return;

      let records = doc.data().records || {};

      // Remove employee from all dates
      Object.keys(records).forEach((date) => {
        if (records[date][name]) {
          delete records[date][name];
        }
      });

      return db
        .collection("attendance")
        .doc(selectedMonth)
        .set({ records }, { merge: true });
    })
    .then(() => {
      renderTable(); // 🔥 Refresh UI
    })
    .catch((err) => {
      console.error("Error removing employee:", err);
    });
}
