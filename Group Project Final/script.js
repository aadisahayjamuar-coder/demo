let courses = [
  { name: "Web Technology", day: "Monday", time: "10-11" },
  { name: "Database Systems", day: "Tuesday", time: "11-12" },
  { name: "Operating Systems", day: "Wednesday", time: "9-10" },
  { name: "Computer Networks", day: "Thursday", time: "10-11" },
  { name: "Software Engineering", day: "Friday", time: "12-1" }
];

let myCourses = [];

/* LOGIN */
function login() {
  if (role.value === "admin" && username.value === "admin" && password.value === "admin@123") {
    loginBox.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    drawChart();
    renderAdminCourses();
  }
  else if (role.value === "student" && username.value === "student" && password.value === "student@123") {
    loginBox.classList.add("hidden");
    studentPanel.classList.remove("hidden");
    renderStudentCourses();
  }
  else error.innerText = "Invalid credentials";
}

function logout() {
  location.reload();
}

/* ADMIN */
function addCourse() {
  courses.push({
    name: courseName.value,
    day: courseDay.value,
    time: courseTime.value
  });
  renderAdminCourses();
  drawChart();
}

function renderAdminCourses() {
  courseList.innerHTML = "";
  courses.forEach((c, i) => {
    courseList.innerHTML += `<li>${c.name} (${c.day} ${c.time})
      <button onclick="removeCourse(${i})">❌</button></li>`;
  });
}

function removeCourse(i) {
  courses.splice(i, 1);
  renderAdminCourses();
  drawChart();
}

/* ANALYTICS CHART */
function drawChart() {
  const ctx = chart.getContext("2d");
  ctx.clearRect(0,0,300,150);
  ctx.fillStyle = "#38bdf8";
  courses.forEach((c,i)=>{
    ctx.fillRect(20+i*50,150-(i+1)*20,30,(i+1)*20);
    ctx.fillText(c.name.split(" ")[0],10+i*50,145);
  });
}

/* STUDENT */
function renderStudentCourses() {
  studentCourseList.innerHTML = "";
  courses.forEach((c,i)=>{
    studentCourseList.innerHTML += `<li>${c.name} (${c.day} ${c.time})
      <button onclick="registerCourse(${i})">➕</button></li>`;
  });
}

function registerCourse(i) {
  if (myCourses.some(c=>c.day===courses[i].day && c.time===courses[i].time)) {
    alert("⛔ Time Conflict!");
    return;
  }
  myCourses.push(courses[i]);
  renderTimetable();
}

function renderTimetable() {
  timetable.innerHTML = "";
  ["Monday","Tuesday","Wednesday","Thursday","Friday"].forEach(d=>{
    const list = myCourses.filter(c=>c.day===d)
      .map(c=>`${c.name} (${c.time})`).join("<br>");
    timetable.innerHTML += `<tr><td>${d}</td><td>${list || "-"}</td></tr>`;
  });
}

/* FEEDBACK */
function submitFeedback() {
  alert("✅ Feedback submitted");
  feedback.value="";
}




/* 🌙 DARK MODE TOGGLE */
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.theme = document.body.classList.contains("light") ? "light" : "dark";
}

if (localStorage.theme === "light") {
  document.body.classList.add("light");
}

/* ⌨️ KEYBOARD SUPPORT */

// ENTER → LOGIN
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    if (!loginBox.classList.contains("hidden")) {
      login();
    }
  }
});

// ENTER → ADD COURSE (ADMIN)
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !adminPanel.classList.contains("hidden")) {
    addCourse();
  }
});

// CTRL + D → TOGGLE DARK MODE
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    toggleTheme();
  }
});

// ARROW KEY INPUT NAVIGATION
const inputs = document.querySelectorAll("input, select, textarea");
inputs.forEach((input, index) => {
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      inputs[index + 1]?.focus();
    }
    if (e.key === "ArrowUp") {
      inputs[index - 1]?.focus();
    }
  });
});