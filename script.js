// הגדרת הלוח (6x4)
const board = Array(4).fill().map(() => Array(6).fill(null));
const targetBoard = Array(4).fill().map(() => Array(6).fill(null));
let selectedPiece = null;

// הגדרת החלקים במצב התחלתי
const pieces = {
    green: { positions: [[0, 0], [0, 1], [1, 0], [2, 0]], color: 'green' }, // L
    red: { positions: [[0, 2], [0, 3], [0, 4], [1, 2]], color: 'red' }, // T
    yellow: { positions: [[1, 3], [1, 4], [1, 5], [2, 3]], color: 'yellow' }, // L הפוכה
    orange: { positions: [[2, 4], [2, 5], [3, 4], [3, 5]], color: 'orange' }, // ריבוע
    blue: { positions: [[3, 0], [3, 1], [3, 2], [3, 3]], color: 'blue' } // I
};

// סידור היעד
const targetPositions = {
    red: [[0, 0], [0, 1], [0, 2], [1, 0]],
    green: [[2, 0], [3, 0], [3, 1], [2, 1]],
    yellow: [[1, 3], [2, 3], [2, 4], [2, 2]],
    orange: [[0, 4], [0, 5], [1, 4], [1, 5]],
    blue: [[3, 2], [3, 3], [3, 4], [3, 5]]
};

// אתחול הלוח
function initializeBoard() {
    // מילוי הלוח במצב התחלתי
    for (let piece in pieces) {
        pieces[piece].positions.forEach(([row, col]) => {
            board[row][col] = piece;
        });
    }

    // מילוי לוח היעד
    for (let piece in targetPositions) {
        targetPositions[piece].forEach(([row, col]) => {
            targetBoard[row][col] = piece;
        });
    }

    renderBoard();
}

// הצגת הלוח
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (board[row][col]) {
                cell.classList.add(board[row][col]);
                if (selectedPiece === board[row][col]) {
                    cell.classList.add('selected');
                }
            }
            cell.addEventListener('click', () => selectPiece(row, col));
            gameBoard.appendChild(cell);
        }
    }

    checkWin();
}

// בחירת חלק
function selectPiece(row, col) {
    const piece = board[row][col];
    if (piece) {
        selectedPiece = piece;
        renderBoard();
    }
}

// הזזת חלק
function moveSelectedPiece(direction) {
    if (!selectedPiece) {
        alert('בחר חלק תחילה!');
        return;
    }

    const piece = pieces[selectedPiece];
    let newPositions = piece.positions.map(pos => [...pos]);

    // חישוב המיקום החדש לפי הכיוון
    if (direction === 'up') newPositions = newPositions.map(([row, col]) => [row - 1, col]);
    if (direction === 'down') newPositions = newPositions.map(([row, col]) => [row + 1, col]);
    if (direction === 'left') newPositions = newPositions.map(([row, col]) => [row, col - 1]);
    if (direction === 'right') newPositions = newPositions.map(([row, col]) => [row, col + 1]);

    // בדיקה אם המהלך חוקי
    if (isValidMove(newPositions)) {
        // ניקוי המיקום הישן
        piece.positions.forEach(([row, col]) => {
            board[row][col] = null;
        });

        // עדכון המיקום החדש
        piece.positions = newPositions;
        piece.positions.forEach(([row, col]) => {
            board[row][col] = selectedPiece;
        });

        selectedPiece = null;
        renderBoard();
    } else {
        alert('מהלך לא חוקי!');
    }
}

// בדיקת תקינות המהלך
function isValidMove(newPositions) {
    for (let [row, col] of newPositions) {
        // בדיקה אם המיקום מחוץ ללוח
        if (row < 0 || row >= 4 || col < 0 || col >= 6) return false;

        // בדיקה אם המיקום תפוס על ידי חלק אחר
        if (board[row][col] && !pieces[selectedPiece].positions.some(([r, c]) => r === row && c === col)) {
            return false;
        }
    }
    return true;
}

// בדיקת ניצחון
function checkWin() {
    let won = true;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] !== targetBoard[row][col]) {
                won = false;
                break;
            }
        }
    }

    const message = document.getElementById('message');
    if (won) {
        message.textContent = 'כל הכבוד! ניצחת!';
    } else {
        message.textContent = '';
    }
}

// אתחול המשחק
initializeBoard();