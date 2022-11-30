//gridsize == # of mines
const gridSize = 15;
const grid = [];
let startingBombs = 20;
const bombPosition = [];
const bombs = [];
const directions = [
  [1, -1],
  [1, 0],
  [1, 1],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

function createGrid() {
  for (let i = 0; i < gridSize; i++) {
    let row = [];
    for (let j = 0; j < gridSize; j++) {
      let sqEl = document.createElement("div");
      sqEl.position = [i, j];
      sqEl.bombStatus = false;
      sqEl.addEventListener("click", squareClicked);
      document.getElementById("grid").append(sqEl);
      row.push(sqEl);
    }
    grid.push(row);
  }
  addBombs();
}

createGrid();

function addBombs() {
  for (let i = 0; i < startingBombs; i++) {
    let value = [...Array(2)].map((e) => ~~(Math.random() * 10));
    console.log(value);
    //accounts for duplicates
    if (JSON.stringify(bombs).includes(JSON.stringify(value))) {
      console.log("duplicate");
      i--;
      continue;
    }
    bombs.push(value);
  }

  bombs.forEach((bomb) => {
    square = grid[bomb[0]][bomb[1]];
    square.innerHTML = "bomb";
    square.bombStatus = true;
    square.classList.add("bomb");
  });
}

function squareClicked() {
  //or event.targetSelector
  // square is the element clicked
  let square = this;

  // x,y coordinate of square clicke
  let x = square.position[0];
  let y = square.position[1];

  //check if bomb
  if (square.bombStatus) {
    console.log("you lose");
  } else adjacentBombsCount(square);
}

function adjacentBombsCount(clickedSquare) {
  let x = clickedSquare.position[0];
  let y = clickedSquare.position[1];
  let bombCount = 0;
  for (const dir of directions) {
    let r = x + dir[0];
    let c = y + dir[1];
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
      continue;
    }
    if (grid[r][c].bombStatus) bombCount = bombCount + 1;
  }
  JSON.stringify(console.log(`bombcount: ${bombCount}`));
  clickedSquare.innerHTML = bombCount;
}
