//gridsize == # of mines
const gridSize = 10;
const grid = [];
let startingBombs = 10;
const bombPosition = [];
const bombs = [];

const bombs2 = [
  [0, 1],
  [0, 2],
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
  for (let i = 0; i < 10; i++) {
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
  });
}

function squareClicked() {
  //or event.targetSelector
  let square = this;
  console.log(square.position);
}
