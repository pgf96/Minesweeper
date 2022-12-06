let gridSize = {
  easy: 10,
  medium: 16,
  hard: 21,
};
let grid = [];
let bombPosition = [];
let bombs = [];
let defaultDifficulty = "easy";
let difficulty = defaultDifficulty;
let startingBombs = {
  easy: 10,
  medium: 40,
  hard: 80,
};
let remainingBombs = startingBombs[difficulty];
let win;
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

// cached element references
const gridEl = document.getElementById("grid");
const buttonEl = document.querySelector("button");
const remainingBombsEl = document.getElementById("remainingBombs");
const allButtonsEl = document.querySelectorAll("button");
const difficultyButtonEl = document.querySelectorAll(
  ".button-container button"
);
const buttonEasyEl = document.getElementById("easy");
const buttonMediumEl = document.getElementById("medium");
const buttonHardEl = document.getElementById("hard");

//functions
createGrid();

function createGrid() {
  for (let i = 0; i < gridSize[difficulty]; i++) {
    let row = [];
    for (let j = 0; j < gridSize[difficulty]; j++) {
      let sqEl = document.createElement("div");
      sqEl.position = [i, j];
      sqEl.isBomb = false;
      sqEl.flagStatus = false;
      sqEl.bombCount = "";
      sqEl.revealed = false;
      sqEl.addEventListener("click", squareClicked);
      sqEl.addEventListener("contextmenu", flag);
      adjustSquareSize(sqEl);
      gridEl.append(sqEl);
      row.push(sqEl);
    }
    grid.push(row);
  }
  addBombs();
  addButtons();
  remainingBombsEl.innerHTML = `Remaining Bombs: ${startingBombs[difficulty]}`;
}

function addBombs() {
  for (let i = 0; i < startingBombs[difficulty]; i++) {
    let value = [...Array(2)].map(() =>
      Math.floor(Math.random() * gridSize[difficulty])
    );
    //accounts for duplicates
    if (JSON.stringify(bombs).includes(JSON.stringify(value))) {
      i--;
      continue;
    }
    bombs.push(value);
  }
  bombs.forEach((bomb) => {
    square = grid[bomb[0]][bomb[1]];
    square.isBomb = true;
  });
}

function addButtons() {
  buttonEl.addEventListener("click", restart);
  buttonEl.classList.add("hidden");
  allButtonsEl.forEach((button) => button.classList.add("hidden"));
  difficultyButtonEl.forEach((button) =>
    button.addEventListener("click", changeDifficulty)
  );
  buttonEl.addEventListener("click", restart);
}

function changeDifficulty() {
  difficulty = this.id.toString();
  restart();
}

function adjustSquareSize(element) {
  if (difficulty == "easy") {
    element.classList.remove("medium");
    element.classList.remove("hard");
    element.classList.add("easy");
  } else if (difficulty == "medium") {
    element.classList.remove("easy");
    element.classList.remove("hard");
    element.classList.add("medium");
  } else if (difficulty == "hard") {
    element.classList.remove("easy");
    element.classList.remove("medium");
    element.classList.add("hard");
  }
}

function revealAllBombs() {
  bombs.forEach(function (bomb, index) {
    let timeOutCoeff = difficulty == "hard" ? 14 : 35;
    setTimeout(function () {
      let bombSquare = grid[bomb[0]][bomb[1]];
      bombSquare.innerHTML = "💣";
      if (win == true) {
        bombSquare.classList.replace("flag", "win");
        bombSquare.classList.add("win");
      } else {
        bombSquare.classList.replace("flag", "bomb");
        bombSquare.classList.add("bomb");
      }
    }, timeOutCoeff * (index + 0));
  });
  setTimeout(function () {
    allButtonsEl.forEach((button) => button.classList.remove("hidden"));
  }, 2800);
}

function restart() {
  win = undefined;
  bombs = [];
  grid = [];
  bombPosition = [];
  remainingBombs = startingBombs[difficulty];
  gridEl.classList.remove("disable");
  while (gridEl.firstChild) {
    gridEl.removeChild(gridEl.firstChild);
  }
  createGrid();
}
function squareClicked() {
  // square is the element clicked
  let square = this;
  // console.log(square.position);
  // x,y coordinate of square clicked
  let x = square.position[0];
  let y = square.position[1];

  //check if bomb
  if (square.isBomb) {
    //loss condition
    revealAllBombs();
    console.log("you lose");
    disableClick();
  } else if (square.revealed == false || square.bombCount == "") {
    adjacentBombsCount(square);

    if (square.bombCount == 0) {
      bfs(grid, x, y);
    }
  }
  console.log(checkWin());
  if (checkWin() == true) {
    win = true;
    revealAllBombs();
    disableClick();
    console.log("you win");
  }
}

function disableClick() {
  gridEl.classList.add("disable");
}

function checkWin() {
  return grid.every((row) =>
    row.every(
      (square) =>
        square.revealed === true ||
        (square.isBomb === true && square.revealed === false)
    )
  );
}

function flag(e) {
  e.preventDefault();
  let square = this;
  let x = square.position[0];
  let y = square.position[1];
  if (square.revealed == true) {
    return;
  }

  if (square.flagStatus == true) {
    grid[x][y].flagStatus = false;
    grid[x][y].classList.remove("flag");
    remainingBombs += 1;
    remainingBombsEl.innerHTML = `Remaining Bombs: ${remainingBombs}`;
  } else if (square.flagStatus == false) {
    grid[x][y].flagStatus = true;
    grid[x][y].classList.add("flag");
    remainingBombs -= 1;
    remainingBombsEl.innerHTML = `Remaining Bombs: ${remainingBombs}`;
  }
}

function adjacentBombsCount(sq) {
  let x = sq.position[0];
  let y = sq.position[1];
  let bombCount = 0;
  for (let dir of directions) {
    let r = x + dir[0];
    let c = y + dir[1];
    if (
      r < 0 ||
      r >= gridSize[difficulty] ||
      c < 0 ||
      c >= gridSize[difficulty]
    ) {
      continue;
    }
    if (grid[r][c].isBomb) bombCount = bombCount + 1;
  }

  sq.bombCount = bombCount;
  sq.revealed = true;
  if (bombCount > 0) {
    sq.innerHTML = bombCount;
    sq.classList.add(`_${bombCount}`);
  } else {
    sq.classList.add(`_${bombCount}`);
  }
  return bombCount;
}

function bfs(grid, x, y) {
  const queue = [];
  queue.push([x, y]);

  // while (queue.length > 0 && loop > 0) {
  while (queue.length > 0) {
    for (let dir of directions) {
      let r = queue[0][0] + dir[0];
      let c = queue[0][1] + dir[1];
      if (
        r < 0 ||
        r >= gridSize[difficulty] ||
        c < 0 ||
        c >= gridSize[difficulty] ||
        grid[r][c].isBomb ||
        grid[r][c].revealed ||
        adjacentBombsCount(grid[r][c]) > 0
      ) {
        // console.log("out of bounds, revealed already, has adjacent bombs, or bomb");
        continue;
      }
      queue.push(grid[r][c].position);
      // console.log("here is new queue");
      // console.log(JSON.parse(JSON.stringify(queue)));
    }
    queue.shift();
  }
}
