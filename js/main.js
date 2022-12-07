const startingBombs = {
  easy: 10,
  medium: 40,
  hard: 80,
}

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
]

const defaultDifficulty = "easy"

let grid = []
let bombs = []
let win

let difficulty = defaultDifficulty
let remainingBombs = startingBombs[difficulty]

let gridSize = {
  easy: 10,
  medium: 16,
  hard: 21,
}

const gridEl = document.getElementById("grid")
const buttonEl = document.querySelector("button")
const remainingBombsEl = document.getElementById("remainingBombs")
const winEl = document.getElementById("win")
const lossEl = document.getElementById("lose")
const allButtonsEl = document.querySelectorAll("button")
const difficultyButtonEl = document.querySelectorAll(".button-cont button")
const buttonEasyEl = document.getElementById("easy")
const buttonMediumEl = document.getElementById("medium")
const buttonHardEl = document.getElementById("hard")

//functions

function createGrid() {
  for (let i = 0; i < gridSize[difficulty]; i++) {
    let row = []
    for (let j = 0; j < gridSize[difficulty]; j++) {
      let sqEl = document.createElement("div")
      sqEl.position = [i, j]
      sqEl.isBomb = false
      sqEl.flagStatus = false
      sqEl.bombCount = ""
      sqEl.revealed = false
      sqEl.addEventListener("click", squareClicked)
      sqEl.addEventListener("contextmenu", flag)
      adjustSquareSize(sqEl)
      gridEl.append(sqEl)
      row.push(sqEl)
    }
    grid.push(row)
  }
  renderBombs()
  renderButtons()
  winEl.classList.add("hide")
  lossEl.classList.add("hide")
  remainingBombsEl.classList.remove("hide")
  remainingBombsEl.innerHTML = `Remaining Bombs: ${startingBombs[difficulty]}`
}
createGrid()

function renderBombs() {
  for (let i = 0; i < startingBombs[difficulty]; i++) {
    let value = [...Array(2)].map(() =>
      Math.floor(Math.random() * gridSize[difficulty])
    )
    //accounts for duplicates
    if (JSON.stringify(bombs).includes(JSON.stringify(value))) {
      i--
      continue
    }
    bombs.push(value)
  }
  bombs.forEach((bomb) => {
    square = grid[bomb[0]][bomb[1]]
    square.isBomb = true
  })
}

function renderButtons() {
  buttonEl.addEventListener("click", restart)
  buttonEl.classList.add("hidden")
  allButtonsEl.forEach((button) => button.classList.add("hidden"))
  difficultyButtonEl.forEach((button) =>
    button.addEventListener("click", changeDifficulty)
  )
  buttonEl.addEventListener("click", restart)
}

function changeDifficulty() {
  difficulty = this.id.toString()
  restart()
}

function adjustSquareSize(element) {
  if (difficulty == "easy") {
    element.classList.remove("medium")
    element.classList.remove("hard")
    element.classList.add("easy")
  } else if (difficulty == "medium") {
    element.classList.remove("easy")
    element.classList.remove("hard")
    element.classList.add("medium")
  } else if (difficulty == "hard") {
    element.classList.remove("easy")
    element.classList.remove("medium")
    element.classList.add("hard")
  }
}

function revealAllBombs() {
  bombs.forEach(function (bomb, index) {
    let timeOutCoeff = difficulty == "hard" ? 14 : 35
    setTimeout(function () {
      let bombSquare = grid[bomb[0]][bomb[1]]
      bombSquare.innerHTML = "💣"
      if (win == true) {
        bombSquare.classList.replace("flag", "win")
        bombSquare.classList.add("win")
      } else {
        bombSquare.classList.replace("flag", "bomb")
        bombSquare.classList.add("bomb")
      }
    }, timeOutCoeff * (index + 0))
  })
  setTimeout(function () {
    allButtonsEl.forEach((button) => button.classList.remove("hidden"))
  }, 2800)
}

function restart() {
  win = undefined
  bombs = []
  grid = []
  bombPosition = []
  remainingBombs = startingBombs[difficulty]
  gridEl.classList.remove("disable")
  while (gridEl.firstChild) {
    gridEl.removeChild(gridEl.firstChild)
  }
  createGrid()
}
function squareClicked() {
  let square = this
  // x,y coordinate of square clicked
  let x = square.position[0]
  let y = square.position[1]

  if (square.isBomb) {
    revealAllBombs()
    lossEl.classList.remove("hide")
    remainingBombsEl.classList.add("hide")
    disableClick()
  } else if (square.revealed == false || square.bombCount == "") {
    adjacentBombsCount(square)

    if (square.bombCount == 0) {
      bfs(grid, x, y)
    }
  }
  if (checkWin() == true) {
    win = true
    winEl.classList.remove("hide")
    remainingBombsEl.classList.add("hide")
    revealAllBombs()
    disableClick()
  }
}

function disableClick() {
  gridEl.classList.add("disable")
}

function checkWin() {
  return grid.every((row) =>
    row.every(
      (square) =>
        square.revealed === true ||
        (square.isBomb === true && square.revealed === false)
    )
  )
}

function flag(e) {
  e.preventDefault()
  let square = this
  let x = square.position[0]
  let y = square.position[1]
  if (square.revealed == true) {
    return
  }

  if (square.flagStatus == true) {
    grid[x][y].flagStatus = false
    grid[x][y].classList.remove("flag")
    remainingBombs += 1
    remainingBombsEl.innerHTML = `Remaining Bombs: ${remainingBombs}`
  } else if (square.flagStatus == false) {
    grid[x][y].flagStatus = true
    grid[x][y].classList.add("flag")
    remainingBombs -= 1
    remainingBombsEl.innerHTML = `Remaining Bombs: ${remainingBombs}`
  }
}

function adjacentBombsCount(sq) {
  let x = sq.position[0]
  let y = sq.position[1]
  let bombCount = 0
  for (let dir of directions) {
    let r = x + dir[0]
    let c = y + dir[1]
    if (
      r < 0 ||
      r >= gridSize[difficulty] ||
      c < 0 ||
      c >= gridSize[difficulty]
    ) {
      continue
    }
    if (grid[r][c].isBomb) bombCount = bombCount + 1
  }

  sq.bombCount = bombCount
  sq.revealed = true
  if (bombCount > 0) {
    sq.innerHTML = bombCount
    sq.classList.add(`_${bombCount}`)
  } else {
    sq.classList.add(`_${bombCount}`)
  }
  return bombCount
}

function bfs(grid, x, y) {
  // create an array for square's position to be checked
  const queue = []
  queue.push([x, y])
  while (queue.length > 0) {
    for (let dir of directions) {
      let r = queue[0][0] + dir[0]
      let c = queue[0][1] + dir[1]
      if (
        // check if position of square is out of bounds
        r < 0 ||
        r >= gridSize[difficulty] ||
        c < 0 ||
        c >= gridSize[difficulty] ||
        // check if bomb or previously revealed
        grid[r][c].isBomb ||
        grid[r][c].revealed ||
        // run func on the square and check if the squares bombCount property is > 0
        // reveal square
        adjacentBombsCount(grid[r][c]) > 0
      ) {
        continue
      }
      // if a square fails previous conditions then the resulting square's position will be added into the END of the queue
      queue.push(grid[r][c].position)
    }
    // remove position in the beginning of the queue
    queue.shift()
  }
}
