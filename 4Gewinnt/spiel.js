function showBoard() {
  const board = document.getElementById('board');
  let currentPlayer = 'red';

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = elt('div', {class: 'cell', 'data-col': col, 'data-row': row});
      cell.addEventListener('click', () => placePiece(col));
      board.appendChild(cell);
    }
  }

  function placePiece(col) {
    for (let row = 5; row >= 0; row--) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      if (!cell.hasChildNodes()) {
        const piece = elt('div', {class: `piece ${currentPlayer}`});
        cell.appendChild(piece);
        currentPlayer = (currentPlayer === 'red') ? 'blue' : 'red';
        break;
      }
    }
  }
}

function elt(type, attrs, ...children) {
  const node = document.createElement(type);
  Object.keys(attrs).forEach(key => node.setAttribute(key, attrs[key]));
  children.forEach(child => {
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child));
    } else {
      node.appendChild(child);
    }
  });
  return node;
}

document.addEventListener('DOMContentLoaded', showBoard);
