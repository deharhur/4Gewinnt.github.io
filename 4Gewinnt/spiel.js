function checkWin(player) {
  const cells = document.querySelectorAll('.cell');
  const width = 7;
  const height = 6;

  function checkDirection(direction) {
    let count = 0;
    for (let i = 0; i < direction.length; i++) {
      const cell = cells[direction[i]];
      if (cell.classList.contains(player)) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  }

  for (let row = 0; row < height; row++) {
    let horizontal = [];
    for (let col = 0; col < width; col++) {
      horizontal.push(row * width + col);
    }
    if (checkDirection(horizontal)) return true;
  }

  for (let col = 0; col < width; col++) {
    let vertical = [];
    for (let row = 0; row < height; row++) {
      vertical.push(row * width + col);
    }
    if (checkDirection(vertical)) return true;
  }

  for (let row = 0; row < height - 3; row++) {
    for (let col = 0; col < width - 3; col++) {
      let diagonalRight = [];
      for (let i = 0; i < 4; i++) {
        diagonalRight.push((row + i) * width + (col + i));
      }
      if (checkDirection(diagonalRight)) return true;

      let diagonalLeft = [];
      for (let i = 0; i < 4; i++) {
        diagonalLeft.push((row + i) * width + (col + 3 - i));
      }
      if (checkDirection(diagonalLeft)) return true;
    }
  }

  return false;
}

function showBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  let currentPlayer = 'red';

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = elt('div', { class: 'cell', 'data-col': col, 'data-row': row });
      cell.addEventListener('click', () => placePiece(col, currentPlayer), { once: true });
      board.appendChild(cell);
    }
  }

  function placePiece(col, player) {
    for (let row = 5; row >= 0; row--) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      if (!cell.hasChildNodes()) {
        const piece = elt('div', { class: `piece ${player}` });
        cell.appendChild(piece);
        if (checkWin(player)) {
          alert(`Spieler ${player} hat gewonnen!`);
          showResetButton();
        }
        currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
        break;
      }
    }
  }
}

function showResetButton() {
  const resetButton = elt('button', {}, 'Spiel zurücksetzen');
  resetButton.addEventListener('click', () => {
    showBoard();
    document.body.removeChild(resetButton);
  });
  document.body.appendChild(resetButton);
}

document.addEventListener('DOMContentLoaded', showBoard);
