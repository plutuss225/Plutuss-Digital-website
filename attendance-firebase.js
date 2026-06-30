// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDnrv9733sMcFLbDCMjY0-V4w5jSQ8oiEI",
  authDomain: "task-manager-new-3743c.firebaseapp.com",
  projectId: "task-manager-new-3743c",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
async function deleteEmployeeGlobal(name, selectedMonth) {
  // 1. Get employees list
  const empRef = db.collection("employees").doc("list");
  const empDoc = await empRef.get();

  if (!empDoc.exists) return;

  let employees = empDoc.data().names || [];

  // 2. Remove from list
  employees = employees.filter((emp) => emp !== name);

  await empRef.set({ names: employees });

  // 3. Remove from attendance (current month)
  const attRef = db.collection("attendance").doc(selectedMonth);
  const attDoc = await attRef.get();

  if (attDoc.exists) {
    let data = attDoc.data();

    // remove from time attendance
    if (data.attendance) {
      Object.keys(data.attendance).forEach((date) => {
        delete data.attendance[date][name];
      });
    }

    // remove from dashboard records
    if (data.records) {
      Object.keys(data.records).forEach((date) => {
        delete data.records[date][name];
      });
    }

    await attRef.set(data);
  }
}
