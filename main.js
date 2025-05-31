import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqMkvEI81gzpqgcQ1i-8yyO-vm7j4pjaY",
  authDomain: "tic-tac-toe-5a808.firebaseapp.com",
  projectId: "tic-tac-toe-5a808",
  storageBucket: "tic-tac-toe-5a808.appspot.com",
  messagingSenderId: "502400629639",
  appId: "1:502400629639:web:580bdd301f26f2f215b122",
  measurementId: "G-DD2PD881RM",
  databaseURL: "https://tic-tac-toe-5a808-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const gameBoard = document.getElementById("game-board");
let gameId = null;
let isPlayerX = true;

function renderBoard() {
  gameBoard.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = `cell-${i}`;
    cell.addEventListener("click", () => handleMove(i));
    gameBoard.appendChild(cell);
  }
}

function handleMove(index) {
  const cell = document.getElementById(`cell-${index}`);
  if (cell.textContent) return;
  const symbol = isPlayerX ? "X" : "O";
  cell.textContent = symbol;
  set(ref(db, `games/${gameId}/board/${index}`), symbol);
  isPlayerX = !isPlayerX;
}

function startGame(id) {
  gameId = id;
  onValue(ref(db, `games/${gameId}/board`), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(i => {
        document.getElementById(`cell-${i}`).textContent = data[i];
      });
    }
  });
}

function generateGameId() {
  return Math.random().toString(36).substring(2, 10);
}

window.inviteFriend = function () {
  const newGameId = generateGameId();
  window.location.href = `?game=${newGameId}`;
};

window.shareGame = function () {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copied! Share with your friend to play together.");
};

renderBoard();

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("game")) {
  startGame(urlParams.get("game"));
}
