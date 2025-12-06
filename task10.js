const taskTextInput = document.getElementById("taskText");
    const taskTimeInput = document.getElementById("taskTime");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    function formatTime(value) {
      // value is "HH:MM"
      if (!value) return "";
      const [h, m] = value.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = ((h + 11) % 12) + 1;
      return ${hour12}:${m.toString().padStart(2, "0")} ${period};
    }

    function addTask() {
      const text = taskTextInput.value.trim();
      const timeValue = taskTimeInput.value;

      if (!text || !timeValue) {
        alert("Please enter a task and choose a time.");
        return;
      }

      const li = document.createElement("li");
      li.className = "task-item";

      const main = document.createElement("div");
      main.className = "task-main";

      const textEl = document.createElement("div");
      textEl.className = "task-text";
      textEl.textContent = text;

      const timeEl = document.createElement("div");
      timeEl.className = "task-time";
      timeEl.textContent = At ${formatTime(timeValue)} you will: ${text};

      main.appendChild(textEl);
      main.appendChild(timeEl);

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => li.remove());

      li.appendChild(main);
      li.appendChild(delBtn);
      taskList.appendChild(li);

      taskTextInput.value = "";
      taskTimeInput.value = "";
      taskTextInput.focus();
    }

    addTaskBtn.addEventListener("click", addTask);

    taskTextInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addTask();
    });
    taskTimeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addTask();
    });  