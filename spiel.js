function showBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = ''; // Reset das Board
  let currentPlayer = 'red';

  // Zeichne das Board
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = elt('div', {class: 'cell', 'data-col': col, 'data-row': row});
      cell.addEventListener('click', () => placePiece(col, cell));
      boardElement.appendChild(cell);
    }
  }

  function placePiece(col, clickedCell) {
    for (let row = 5; row >= 0; row--) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      if (!cell.querySelector('.piece')) {
        const piece = elt('div', {class: `piece ${currentPlayer}`});
        cell.appendChild(piece);
        board[row][col] = currentPlayer;
        
        if (checkForWinner(row, col)) {
          setTimeout(() => {
            alert(`Spieler ${currentPlayer} hat gewonnen!`);
            createResetButton();
          }, 10); // Verzögerung, damit die letzte Münze gezeichnet wird, bevor das Alert erscheint
          return;
        }
        
        currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
        break;
      }
    }
  }

  function checkForWinner(row, col) {
    // Überprüfen senkrecht, waagerecht und diagonal
    return checkLine(row, col, 1, 0) >= 4 ||
           checkLine(row, col, 0, 1) >= 4 ||
           checkLine(row, col, 1, 1) >= 4 ||
           checkLine(row, col, 1, -1) >= 4;
  }

  function checkLine(row, col, deltaRow, deltaCol) {
    let count = 1;
    let color = board[row][col];
    let r, c;

    // Nach links/up prüfen
    r = row - deltaRow;
    c = col - deltaCol;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
      count++;
      r -= deltaRow;
      c -= deltaCol;
    }

    // Nach rechts/down prüfen
    r = row + deltaRow;
    c = col + deltaCol;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
      count++;
      r += deltaRow;
      c += deltaCol;
    }

    return count;
  }

  function createResetButton() {
    const resetButton = elt('button', {id: 'resetButton'}, 'Neues Spiel');
    resetButton.addEventListener('click', () => {
      boardElement.removeEventListener('click', placePiece);
      showBoard(); // Zeige das Board erneut an, um das Spiel zurückzusetzen
      resetButton.remove(); // Entferne den Reset-Button
    });
    document.body.appendChild(resetButton);
  }
}

// Element-Erstellungs-Hilfsfunktion
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

// Initialisiere das Spielbrett als 2D-Array
function initializeBoard() {
  for (let i = 0; i < 6; i++) {
    board[i] = new Array(7).fill(null);
  }
}

// Spielinitialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
  initializeBoard();
  showBoard();
});
