// ========================
// CONFIG
// ========================
const PASSWORD = "jamesisgoingtosurvivethisflight"; // change as you like
// let interval = 60 * 60 * 1000; // 1h in ms
let interval = 4 * 1000; // for testing

const questions = [
  {
    text: "What’s the Danish word for hedgehog (one word)?",
    answer: "Pindsvin",
    image: "assets/hedgehog1.jpg"
  },
  {
    text: "How often did we visit the gym together (integer)?",
    answer: "5",
    image: "assets/hedgehog2.jpg"
  },
  {
    text: "Who ruled as king of Denmark from c. 958 – c. 986 (first name space surname)?",
    answer: "Harald Bluetooth",
    image: "assets/hedgehog3.jpg"
  },
  {
    text: "If I ate one cinnamon bun every day how many years would it take me to eat 10000 (rounded integer)?",
    answer: "27",
    image: "assets/hedgehog4.jpg"
  },
  {
    text: "What is the name of the bike rental app we used to feel like flying (one word)?",
    answer: "Lime",
    image: "assets/hedgehog5.jpg"
  },
  {
    text: "How many beer drinks did I see you have on the Friday night we went from Student House to Lecoq to Paradis (integer)?",
    answer: "6",
    image: "assets/hedgehog6.jpg"
  },
  {
    text: "What is the first name of our questionable Malaysian Aarhus royalty (one word)?",
    answer: "Harits",
    image: "assets/hedgehog7.jpg"
  },
  {
    text: "How many delicious cakes did James get from the Føtex store? (integer)",
    answer: "2",
    image: "assets/hedgehog8.jpg"
  },
  {
    text: "In which country is Akshat pursuing his studies (one word)?",
    answer: "Australia",
    image: "assets/hedgehog9.jpg"
  },
  {
    text: "What is the first name of the person in Aarhus who you deemed to be too intelligent for his own good, noticing things before others did (one word)?",
    answer: "Kieron",
    image: "assets/hedgehog10.jpg"
  },
  {
    text: "How many kilometres did Sofia run when we met her after she finished her run (integer)?",
    answer: "18",
    image: "assets/hedgehog11.jpg"
  },
  {
    text: "What is the name of your true hair colour (one word)?",
    answer: "Blonde",
    image: "assets/hedgehog12.jpg"
  },
  {
    text: "Has James sent a picture of his new haircut yet (yes / no)?",
    answer: "No",
    image: "assets/hedgehog13.jpg"
  },
  {
    text: "How many hedgehogs did we see together during one of our night walks (integer)?",
    answer: "5",
    image: "assets/hedgehog14.jpg"
  },
  {
    text: "If you jumped into Aarhus Harbour every day in 2026, how many days would you freeze your toes off (integer)?",
    answer: "365",
    image: "assets/hedgehog15.jpg"
  },
  {
    text: "How many nights did Melodi sleep over at my place (integer)?",
    answer: "2",
    image: "assets/hedgehog16.jpg"
  },
  {
    text: "What was the best sweet at the street food market that we both got to try (two words)?",
    answer: "Ice Cream",
    image: "assets/hedgehog17.jpg"
  },
  {
    text: "How many questions did you answer, including this one (integer)?",
    answer: "18",
    image: "assets/hedgehog18.jpg"
  }
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
    <h1>Heya there James!</h1>
    <p>This site will ask you questions every hour. 
    Answer correctly to unlock ... you will see hehe 
    Let's begin!</p>
    <button onclick="startFirstQuestion()">Start</button>
  `;
}

function startFirstQuestion() {
  state.unlocked = -1;
  state.nextUnlock = null;
  saveState();
  showQuestion(0); // go directly to first question
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
    let countdown = 7;
    document.getElementById("feedback").innerText = `Wrong! Smh, wait ${countdown}s...`;
    lockout = true;
    document.getElementById("answerBtn").disabled = true;

    const timer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        document.getElementById("feedback").innerText = `Wrong! Smh, wait ${countdown}s...`;
      } else {
        clearInterval(timer);
        lockout = false;
        document.getElementById("feedback").innerText = "";
        document.getElementById("answerBtn").disabled = false;
      }
    }, 1000);
  }
}

function showImage(index) {
  const q = questions[index];
  app.innerHTML = `
    <h2>Awesome, reward image unlocked!</h2>
    <img src="${q.image}" alt="Reward image"/>
    <p>Confirm once you’ve seen the picture to continue!</p>
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
    app.innerHTML = "<h2>You are amazing James, all done! 🎉</h2><p>You’ve unlocked every single picture, good job! Hopefully you successfully survived the flight by now!</p>";
  }
}

function saveState() {
  localStorage.setItem("flightBuddyState", JSON.stringify(state));
}

// ========================
// INIT
// ========================
render();
