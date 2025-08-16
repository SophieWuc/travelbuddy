// ========================
// CONFIG
// ========================
const PASSWORD = "hedgehog"; // change as you like
let interval = 60 * 60 * 1000; // 1h in ms
// interval = 30 * 1000; // for testing

const questions = [
  {
    text: "How tall is the Eiffel Tower (in metres)?",
    answer: "330",
    image: "assets/hedgehog.jpg"
  },
  {
    text: "What’s 5 x 7?",
    answer: "35",
    image: "assets/example2.jpg"
  },
  // add more here...
];

// ========================
// STATE
// ========================
let state = JSON.parse(localStorage.getItem("flightBuddyState")) || {
  unlocked: -1,    // last unlocked question index
  nextUnlock: null // timestamp when next question becomes available
};

const app = document.getElementById("app");

// ========================
// RENDER FUNCTIONS
// ========================
function showPasswordScreen() {
  app.innerHTML = `
    <h1>Flight Buddy</h1>
    <p>Please enter the secret password:</p>
    <input type="password" id="pwInput" />
    <button onclick="checkPassword()">Enter</button>
    <p id="pwError" style="color:red"></p>
  `;
}

function checkPassword() {
  const input = document.getElementById("pwInput").value;
  if (input === PASSWORD) {
    localStorage.setItem("flightBuddyUnlocked", "true");
    render();
  } else {
    document.getElementById("pwError").innerText = "Wrong password!";
  }
}

function showIntro() {
  app.innerHTML = `
    <h1>Welcome!</h1>
    <p>This app will ask you questions every hour. 
    Answer correctly to unlock fun pictures. 
    Let's begin!</p>
    <button onclick="startFirstQuestion()">Start</button>
  `;
}

function startFirstQuestion() {
  state.unlocked = -1;
  state.nextUnlock = null;
  saveState();
  render();
}

function showQuestion(index) {
  const q = questions[index];
  app.innerHTML = `
    <h2>Question ${index + 1}</h2>
    <p>${q.text}</p>
    <input type="text" id="answerInput" />
    <button id="answerBtn" onclick="checkAnswer(${index})">Submit</button>
    <p id="feedback" style="color:red"></p>
  `;
}

let lockout = false;
function checkAnswer(index) {
  if (lockout) return;

  const input = document.getElementById("answerInput").value.trim();
  if (input.toLowerCase() === questions[index].answer.toLowerCase()) {
    showImage(index);
  } else {
    document.getElementById("feedback").innerText = "Wrong! Wait 15s...";
    lockout = true;
    document.getElementById("answerBtn").disabled = true;
    setTimeout(() => {
      lockout = false;
      document.getElementById("feedback").innerText = "";
      document.getElementById("answerBtn").disabled = false;
    }, 15000);
  }
}

function showImage(index) {
  const q = questions[index];
  app.innerHTML = `
    <h2>Unlocked!</h2>
    <img src="${q.image}" alt="Reward image"/>
    <p>Confirm once you’ve seen it.</p>
    <button onclick="confirmImage(${index})">Confirm</button>
  `;
}

function confirmImage(index) {
  state.unlocked = index;
  state.nextUnlock = Date.now() + interval;
  saveState();
  render();
}

function showTimer() {
  const msLeft = state.nextUnlock - Date.now();
  if (msLeft <= 0) {
    render();
    return;
  }
  const mins = Math.floor(msLeft / 60000);
  const secs = Math.floor((msLeft % 60000) / 1000);
  app.innerHTML = `
    <h2>Next question in:</h2>
    <p>${mins}m ${secs}s</p>
  `;
  setTimeout(showTimer, 1000);
}

// ========================
// MAIN RENDER LOGIC
// ========================
function render() {
  if (!localStorage.getItem("flightBuddyUnlocked")) {
    showPasswordScreen();
    return;
  }

  if (state.unlocked === -1 && state.nextUnlock === null) {
    showIntro();
    return;
  }

  if (state.nextUnlock && Date.now() < state.nextUnlock) {
    showTimer();
    return;
  }

  // Otherwise, next question
  const nextIndex = state.unlocked + 1;
  if (nextIndex < questions.length) {
    showQuestion(nextIndex);
  } else {
    app.innerHTML = "<h2>All done! 🎉</h2><p>You’ve unlocked everything.</p>";
  }
}

function saveState() {
  localStorage.setItem("flightBuddyState", JSON.stringify(state));
}

// ========================
// INIT
// ========================
render();
