function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m])
  );
}

function statusClass(status) {
  if (!status) return "";
  if (status === "Backlog") return "status-backlog";
  if (status === "To-Do") return "status-todo";
  if (status === "In Progress") return "status-inprogress";
  if (status === "In Review") return "status-inreview";
  if (status === "Done") return "status-done";
  return "";
}

// Compare only year, month, day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export { statusClass, escapeHtml, isSameDay };
