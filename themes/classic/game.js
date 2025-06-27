const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");

let grid = [];
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let mergedPositions = []; // NEW: To track where merges happen

function createGrid() {
  grid = new Array(4).fill(null).map(() => new Array(4).fill(0));
  placeRandomTile();
  placeRandomTile();
  updateBoard();
}

function updateBoard() {
  gridContainer.innerHTML = "";

  grid.flat().forEach((value, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = value === 0 ? "" : value;
    tile.dataset.index = index;

    const row = Math.floor(index / 4);
    const col = index % 4;

    // Only animate if this tile is in mergedPositions
    const isMerged = mergedPositions.some(([r, c]) => r === row && c === col);
    if (value !== 0 && isMerged) {
      tile.classList.add("merged");
      setTimeout(() => tile.classList.remove("merged"), 250);
    }

    gridContainer.appendChild(tile);
  });

  scoreDisplay.textContent = "Score: " + score;
  bestScoreDisplay.textContent = "Best: " + bestScore;
}

function placeRandomTile() {
  const empty = [];
  grid.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 0) empty.push([i, j]);
    });
  });
  if (empty.length === 0) return;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  grid[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function move(direction) {
  let moved = false;
  mergedPositions = []; // RESET merge list for this move

  function moveRow(row, rowIndex) {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
        }
        newRow[i + 1] = 0;
        mergedPositions.push([rowIndex, i]); // Record merge position
      }
    }
    return newRow.filter(val => val !== 0).concat(new Array(4).fill(0)).slice(0, 4);
  }

  if (direction === "left") {
    for (let i = 0; i < 4; i++) {
      const newRow = moveRow(grid[i], i);
      if (!arraysEqual(newRow, grid[i])) {
        grid[i] = newRow;
        moved = true;
      }
    }
  }

  if (direction === "right") {
    for (let i = 0; i < 4; i++) {
      const reversed = [...grid[i]].reverse();
      const newRow = moveRow(reversed, i).reverse();
      if (!arraysEqual(newRow, grid[i])) {
        grid[i] = newRow;
        moved = true;
      }
    }
  }

  if (direction === "up") {
    for (let j = 0; j < 4; j++) {
      let col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
      let newCol = moveRow(col, j); // Using j temporarily
      for (let i = 0; i < 4; i++) {
        if (grid[i][j] !== newCol[i]) {
          grid[i][j] = newCol[i];
          moved = true;
        }
      }
    }
  }

  if (direction === "down") {
    for (let j = 0; j < 4; j++) {
      let col = [grid[3][j], grid[2][j], grid[1][j], grid[0][j]];
      let newCol = moveRow(col, j).reverse(); // Using j temporarily
      for (let i = 0; i < 4; i++) {
        if (grid[i][j] !== newCol[i]) {
          grid[i][j] = newCol[i];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    placeRandomTile();
    updateBoard();
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
  }
});

// Initialize
createGrid();
