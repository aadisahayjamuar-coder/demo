// app.js
document.getElementById("greetForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const mood = document.getElementById("moodInput").value;

  // Time-based greeting
  const hour = new Date().getHours();
  let timeGreet;
  if (hour < 12) {
    timeGreet = "Good morning";
  } else if (hour < 18) {
    timeGreet = "Good afternoon";
  } else {
    timeGreet = "Good evening";
  }

  // Mood additions
  let moodMsg;
  switch (mood) {
    case "happy": moodMsg = "It's great to see you cheerful!"; break;
    case "sad": moodMsg = "Hope your day gets brighter."; break;
    case "excited": moodMsg = "Let's channel that excitement!"; break;
    case "tired": moodMsg = "Take some rest – you deserve it."; break;
    default: moodMsg = "";
  }

  // Build final message
  const message = `${timeGreet}, ${name}! ${moodMsg}`;

  // Show message with animation
  const msgEl = document.getElementById("message");
  msgEl.textContent = message;
  msgEl.classList.remove("show"); // Remove previous animation
  setTimeout(() => msgEl.classList.add("show"), 50); // Trigger animation after DOM update
});
// app.js