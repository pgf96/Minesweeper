//gridsize == # of mines
const gridSize = 15;
const grid = [];
let startingBombs = 40;
const bombPosition = [];
const bombs = [];

//limiter
let loop = 200;

const testBombs = [
  [1, 3],
  [2, 0],
  [1, 6],
  [1, 10],
  [3, 1],
  [9, 10],
  [4, 10],
  [8, 10],
  [0, 2],
  [8, 1],
  [6, 1],
  [6, 12],
  [8, 5],
  [8, 6],
  [10, 7],
  [8, 9],
  [8, 13],
  [13, 5],
  [13, 12],
  [3, 5],
  [13, 6],
  [13, 7],
  [2, 9],
  [2, 13],
  [13, 13],
  [13, 1],
  [3, 4],
  [13, 4],
  [13, 2],
  [12, 1],
  [7, 5],
  [13, 7],
];

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

function createGrid() {
  for (let i = 0; i < gridSize; i++) {
    let row = [];
    for (let j = 0; j < gridSize; j++) {
      let sqEl = document.createElement("div");
      sqEl.position = [i, j];
      sqEl.isBomb = false;
      sqEl.bombCount = "";
      sqEl.revealed = false;
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
  // for (let i = 0; i < startingBombs; i++) {
  //   let value = [...Array(2)].map(() => Math.floor(Math.random() * 15));
  //   //accounts for duplicates
  //   if (JSON.stringify(bombs).includes(JSON.stringify(value))) {
  //     i--;
  //     continue;
  //   }
  //   console.log(value);
  //   bombs.push(value);
  // }
  // console.log(bombs);

  // bombs.forEach((bomb) => {
  //   square = grid[bomb[0]][bomb[1]];
  //   square.innerHTML = "bomb";
  //   square.isBomb = true;
  //   square.classList.add("bomb");
  // });

  testBombs.forEach((bomb) => {
    square = grid[bomb[0]][bomb[1]];
    square.innerHTML = "bomb";
    square.isBomb = true;
    square.classList.add("bomb");
  });
}

function squareClicked() {
  //or event.targetSelector
  // square is the element clicked
  let square = this;
  // console.log(square.position);
  // x,y coordinate of square clicked
  let x = square.position[0];
  let y = square.position[1];

  //check if bomb
  if (square.isBomb) {
    console.log("you lose");
  } else if (square.revealed == false || square.bombCount == "") {
    adjacentBombsCount(square);

    if (square.bombCount == 0) {
      bfs(grid, x, y);
    }
  }

  function adjacentBombsCount(sq) {
    // JSON.stringify(console.log(`square: ${sq}`));
    let x = sq.position[0];
    let y = sq.position[1];
    // JSON.stringify(console.log(`here is: ${[x, y]}`));
    let bombCount = 0;
    for (let dir of directions) {
      let r = x + dir[0];
      let c = y + dir[1];
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
        continue;
      }
      if (grid[r][c].isBomb) bombCount = bombCount + 1;
    }

    // JSON.stringify(console.log(`bombcount: ${bombCount}`));
    sq.innerHTML = bombCount;
    sq.bombCount = bombCount;
    sq.revealed = true;

    if (bombCount > 0) {
      sq.style.backgroundColor = "green";
    } else if (bombCount == 0) {
      sq.style.backgroundColor = "yellow";
    }
  }

  function areYaWinningSon(grid) {
    //all squares that arent bombs are revealed
  }

  function bfs(grid, x, y) {
    const queue = [];

    queue.push([x, y]);

    while (queue.length > 0 && loop > 0) {
      for (let dir of directions) {
        let r = queue[0][0] + dir[0];
        let c = queue[0][1] + dir[1];
        if (
          r < 0 ||
          r >= gridSize ||
          c < 0 ||
          c >= gridSize ||
          grid[r][c].isBomb ||
          grid[r][c].revealed
        ) {
          // console.log(JSON.parse(JSON.stringify([r, c])));
          // console.log("out of bonds, revealed already, or bomb");
          continue;
        }

        adjacentBombsCount(grid[r][c]);

        if (grid[r][c].bombCount > 0) {
          grid[r][c].innerHTML = grid[r][c].bombCount;
          grid[r][c].revealed = true;
          grid[r][c].style.backgroundColor = "green";
          // console.log("number - dont add to queue");
          continue;
        }

        queue.push(grid[r][c].position);
        // console.log("here is new queue");
        // console.log(JSON.parse(JSON.stringify(queue)));
      }
      queue.shift();
      // console.log("shift");
      // console.log(JSON.parse(JSON.stringify(queue)));
      loop = loop - 1;
    }
  }
}
