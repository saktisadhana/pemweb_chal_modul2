/* Friend: wire this up. HTML/CSS is already hooked.

   #todo-form / #todo-input  — add or search
   [data-filter]             — All / Active / Completed
   #todo-list                — render tasks
   template#task-template    — clone for each new task
   .delete-btn               — remove a task
   .task.is-completed        — CSS already styles this
*/

// ---- State ----
const STORAGE_KEY = "todo-tasks";
let tasks = loadTasks();
let currentFilter = "all"; // "all" | "active" | "completed"
 
// ---- Elements ----
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const template = document.getElementById("task-template");
const filterButtons = document.querySelectorAll("[data-filter]");
 
// ---- LocalStorage helpers ----
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}
 
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
 
// ---- Rendering ----
function render() {
  list.innerHTML = "";
 
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true; // "all"
  });
 
  filteredTasks.forEach((task) => {
    const clone = template.content.cloneNode(true);
    const taskEl = clone.querySelector(".task");
    const nameEl = clone.querySelector(".task-name");
    const deleteBtn = clone.querySelector(".delete-btn");
 
    nameEl.textContent = task.text;
    taskEl.dataset.id = task.id;
 
    if (task.completed) {
      taskEl.classList.add("is-completed");
    }
 
    // Click task text to toggle "completed" (Challenge 1 bonus)
    nameEl.addEventListener("click", () => toggleTask(task.id));
 
    // Delete task
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
 
    list.appendChild(clone);
  });
}
 
// ---- Task actions ----
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return; // ignore empty input
 
  tasks.push({
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  });
 
  saveTasks();
  render();
}
 
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}
 
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
}
 
// ---- Event listeners ----
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});
 
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
 
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
 
    render();
  });
});
 
// ---- Init ----
render();