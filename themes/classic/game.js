const grid = document.getElementById("grid");

function createTile(value = "") {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.textContent = value;
  return tile;
}

function generateBoard() {
  grid.innerHTML = "";
  for (let i = 0; i < 16; i++) {
    const tile = createTile();
    grid.appendChild(tile);
  }
}

function startGame() {
  generateBoard();
  placeRandomTile();
  placeRandomTile();
}

function placeRandomTile() {
  const tiles = [...grid.children];
  const emptyTiles = tiles.filter(tile => tile.textContent === "");
  if (emptyTiles.length === 0) return;

  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  randomTile.textContent = Math.random() < 0.9 ? "2" : "4";
}

// Start game on load
window.onload = startGame;
