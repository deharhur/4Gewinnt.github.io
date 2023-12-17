// Global variables
let currentPlayer;
let board = new Array(6); // Assuming a 6x7 board
let movesStack = []; // Stack to keep track of moves

// Initialize the board and current player
function initializeBoard() {
  for (let i = 0; i < 6; i++) {
    board[i] = new Array(7).fill(null);
  }
  currentPlayer = 'red'; // Start with the red player
}

// Function to create a DOM element with attributes and children
function elt(type, attrs, ...children) {
  const node = document.createElement(type);
  for (const attr of Object.keys(attrs)) {
    node.setAttribute(attr, attrs[attr]);
  }
  for (const child of children) {
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child));
    } else {
      node.appendChild(child);
    }
  }
  return node;
}

// Function to display the board
function showBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = ''; // Clear the board

  // Draw the board
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = elt('div', { class: 'cell', 'data-col': col, 'data-row': row });
      cell.addEventListener('click', () => placePiece(col, cell));
      boardElement.appendChild(cell);
    }
  }
}

// Function to handle piece placement
function placePiece(col, clickedCell) {
  for (let row = 5; row >= 0; row--) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell.querySelector('.piece')) {
      const piece = elt('div', { class: `piece ${currentPlayer}` });
      cell.appendChild(piece);
      board[row][col] = currentPlayer;

      // Record the move
      movesStack.push({ row, col, player: currentPlayer });

      if (checkForWinner(row, col)) {
        setTimeout(() => {
          alert(`Spieler ${currentPlayer} hat gewonnen!`);
        }, 10); // Delay for the last piece to be drawn before the alert
        return;
      }

      currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
      break;
    }
  }
}

// Function to check for a winner
function checkForWinner(row, col) {
  // Check vertically, horizontally, and diagonally
  return checkLine(row, col, 1, 0) >= 4 ||
         checkLine(row, col, 0, 1) >= 4 ||
         checkLine(row, col, 1, 1) >= 4 ||
         checkLine(row, col, 1, -1) >= 4;
}

// Function to check a line for a winning condition
function checkLine(row, col, deltaRow, deltaCol) {
  let count = 1;
  let color = board[row][col];
  let r, c;

  // Check left/up
  r = row - deltaRow;
  c = col - deltaCol;
  while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
    count++;
    r -= deltaRow;
    c -= deltaCol;
  }

  // Check right/down
  r = row + deltaRow;
  c = col + deltaCol;
  while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
    count++;
    r += deltaRow;
    c += deltaCol;
  }

  return count;
}

// Reset Game function
function resetGame() {
  initializeBoard();
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  showBoard();
  console.log('The game has been reset.');
}

// Add event listener for the reset button after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', () => {
  resetGame();

  const resetButton = document.getElementById('reset-game');
  if (resetButton) {
    resetButton.addEventListener('click', resetGame);
  }
});



function saveGame() {
  // Save the current board and current player to localStorage
  localStorage.setItem('savedBoard', JSON.stringify(board));
  localStorage.setItem('currentPlayer', currentPlayer);

  // Inform the user that the game has been saved
  console.log('The game has been saved.');
}
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-game');
  if (saveButton) {
    saveButton.addEventListener('click', saveGame);
  }
});

// Load Game function
function loadGame() {
  // Retrieve the saved game state from localStorage
  const savedBoard = JSON.parse(localStorage.getItem('savedBoard'));
  const savedCurrentPlayer = localStorage.getItem('currentPlayer');

  // Check if there is a saved game
  if (savedBoard && savedCurrentPlayer) {
    // Set the current game state to the saved state
    board = savedBoard;
    currentPlayer = savedCurrentPlayer;

    // Update the board UI to reflect the loaded game state
    updateBoardUI();

    // Inform the user that the game has been loaded
    console.log('The game has been loaded.');
  } else {
    // Inform the user that there is no saved game to load
    console.log('No saved game to load.');
  }
}

// Function to update the board UI after loading a game
function updateBoardUI() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.innerHTML = ''; // Clear the cell
      const player = board[row][col];
      if (player) {
        const piece = elt('div', { class: `piece ${player}` });
        cell.appendChild(piece);
      }
    }
  }
}

// Event listener for the load game button after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const loadButton = document.getElementById('load-game');
  if (loadButton) {
    // Enable the button if there is a saved game
    const savedBoard = localStorage.getItem('savedBoard');
    loadButton.disabled = !savedBoard;

    loadButton.addEventListener('click', loadGame);
  }
});

// Undo Move function
function undoMove() {
  if (movesStack.length > 0) {
    const lastMove = movesStack.pop();
    board[lastMove.row][lastMove.col] = null;

    // Update the UI
    const cell = document.querySelector(`.cell[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
    if (cell) {
      cell.innerHTML = ''; // Clear the cell
    }

    // Switch the player back
    currentPlayer = lastMove.player === 'red' ? 'blue' : 'red';

    console.log('The last move has been undone.');
  } else {
    console.log('No moves to undo.');
  }
}

// Add event listener for the Undo Move button
document.addEventListener('DOMContentLoaded', () => {
  const undoButton = document.getElementById('undo-move');
  if (undoButton) {
    undoButton.addEventListener('click', undoMove);
  }
});