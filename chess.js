const copy = toCopy => JSON.parse(JSON.stringify(toCopy));

const baseFigure = () => ({
    type: 'base',
    allowedMoves: [],
    sameAttackMoves: true,
    jumpOver: false,
    alreadyMoved: false,
    movesOnlyForward: false,
    img: ''
});

const kingFigure = () => ({
    ...baseFigure(),
    type: 'king',
    allowedMoves: [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
    img: 'K'
});

const queenFigure = () => ({
    ...baseFigure(),
    type: 'queen',
    allowedMoves: [{x: true, y: true}, {x: true, y: 0}, {x: 0, y: true}],
    img: 'Q'
});

const rookFigure = () => ({
    ...baseFigure(),
    type: 'rook',
    allowedMoves: [{x: true, y: 0}, {x: 0, y: true}],
    img: 'R'
});

const bishopFigure = () => ({
    ...baseFigure(),
    type: 'bishop',
    allowedMoves: [{x: true, y: true}],
    img: 'B'
});

const knightFigure = () => ({
    ...baseFigure(),
    type: 'knight',
    allowedMoves: [{x: 1, y: 2}, {x: 2, y: 1}],
    img: 'Kn',
    jumpOver: true
});

const pawnFigure = () => ({
    ...baseFigure(),
    type: 'pawn',
    allowedMoves: [{x: 0, y: 1}],
    img: 'P',
    movesOnlyForward: true,
    sameAttackMoves: [{x: 1, y: 1}, {x: -1, y: 1}],
});

const figure = {
    king: kingFigure(),
    queen: queenFigure(),
    rook: rookFigure(),
    bishop: bishopFigure(),
    knight: knightFigure(),
    pawn: pawnFigure(),
};

const getFigure = type => copy(figure[type]);

const drawBoard = (context, size) => {
    const amountOfTiles = 8;

    if (size % amountOfTiles !== 0) {
        throw 'incorrect board size!';
    }

    const unit = size / amountOfTiles;

    for (let i = 0; i < amountOfTiles; i++) {
        for (let j = 0; j < amountOfTiles; j++) {
            context.fillStyle = (i + j) % 2 === 0 ? 'white' : 'black';
            context.fillRect(i * unit, j * unit, unit, unit);
        }
    }
};

const getEmptySquare = location => ({
    location: {
        y: location.y,
        x: location.x
    },
    piece: null
});

const getEmptyBoardState = () => {
    const state = [];

    for (let i = 0; i < 8; i++) {
        state.push([]);

        for (let j = 0; j < 8; j++) {
            state[i].push(getEmptySquare({
                y: i,
                x: j
            }));
        }
    }

    return state;
};

const getInitialBoardState = () => {
    const state = getEmptyBoardState();

    state[0][0].piece = getFigure(figure.rook.type);
    state[0][1].piece = getFigure(figure.knight.type);
    state[0][2].piece = getFigure(figure.bishop.type);
    state[0][3].piece = getFigure(figure.queen.type);
    state[0][4].piece = getFigure(figure.king.type);
    state[0][5].piece = getFigure(figure.bishop.type);
    state[0][6].piece = getFigure(figure.knight.type);
    state[0][7].piece = getFigure(figure.rook.type);

    for (let i = 0; i < 8; i++) {
        state[1][i].piece = getFigure(figure.pawn.type);
    }

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            state[i][j].piece.player = 1;
        }
    }

    state[7][0].piece = getFigure(figure.rook.type);
    state[7][1].piece = getFigure(figure.knight.type);
    state[7][2].piece = getFigure(figure.bishop.type);
    state[7][3].piece = getFigure(figure.queen.type);
    state[7][4].piece = getFigure(figure.king.type);
    state[7][5].piece = getFigure(figure.bishop.type);
    state[7][6].piece = getFigure(figure.knight.type);
    state[7][7].piece = getFigure(figure.rook.type);

    for (let i = 0; i < 8; i++) {
        state[6][i].piece = getFigure(figure.pawn.type);
    }

    for (let i = 6; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            state[i][j].piece.player = 0;
        }
    }

    return state;
};

const updateBoard = (context, state, size) => {
    const amountOfTiles = 8;

    if (size % amountOfTiles !== 0) {
        throw 'incorrect board size!';
    }

    const unit = canvas.height / amountOfTiles;

    context.font = '40px Arial';

    for (let i = 0; i < amountOfTiles; i++) {
        for (let j = 0; j < amountOfTiles; j++) {
            const piece = state[i][j].piece;

            if (piece) {
                context.fillStyle = piece.player === 0 ? 'red' : 'blue';
                context.fillText(piece.img, j * unit + 10, i * unit + 45);
            }
        }
    }
};

const getSquare = (location, boardState) => boardState[location.y][location.x];

const getAvailableSquaresToMove = boardState => {
    let allowed = [];

    const rotateSquares = (x, y) => [
        {x, y},
        {x: -x, y},
        {x, y: -y},
        {x: -x, y: -y}
    ];

    const filterTheSameSquares = squares => {
        const result = [];

        squares.forEach(square => {
            if (square.x === 0 && square.y === 0)
                return;

            if (!result.find(_ => _.x === square.x && _.y === square.y)) {
                result.push({x: square.x, y: square.y});
            }
        });

        return result;
    };

    const filterOutOfBoard = squares => {
        const result = [];

        squares.forEach(square => {
            if (square.x < 0 || square.x > 7 || square.y < 0 || square.y > 7)
                return;

            result.push({x: square.x, y: square.y});
        });

        return result;
    };

    const filterSamePlayerFigures = squares => {
        const result = [];

        squares.forEach(square => {
            if (boardState[square.y][square.x].piece && selectedSquare.piece.player === boardState[square.y][square.x].piece.player)
                return;

            result.push({x: square.x, y: square.y});
        });

        return result;
    };

    for (const allowedMove of selectedSquare.piece.allowedMoves) {
        if (typeof allowedMove.x == 'number' && typeof allowedMove.y == 'number') {
            if (selectedSquare.piece.movesOnlyForward) {
                // the pawn case.
                let direction = selectedSquare.piece.player === 0 ? -1 : 1;

                allowed = allowed.concat({x: allowedMove.x, y: direction * allowedMove.y});
            } else {
                allowed = allowed.concat(rotateSquares(allowedMove.x, allowedMove.y));
            }
        } else if (typeof allowedMove.x == 'boolean' && typeof allowedMove.y == 'boolean') {
            for (let i = 0; i < 8; i++) {
                allowed = allowed.concat(rotateSquares(i, i));
            }
        } else if (typeof allowedMove.x == 'boolean' && typeof allowedMove.y == 'number') {
            for (let i = 0; i < 8; i++) {
		if (boardState[allowedMove.y][i].piece === null) {
			break;
		}
                allowed = allowed.concat(rotateSquares(i, allowedMove.y));
            }
        } else if (typeof allowedMove.x == 'number' && typeof allowedMove.y == 'boolean') {
            for (let i = 0; i < 8; i++) {
		if (boardState[i][allowedMove.x].piece === null) {
			break;
		}
                allowed = allowed.concat(rotateSquares(allowedMove.x, i));
            }
        } else throw 'Wrong moves types!';
    }

    allowed = allowed.map(square => ({
        x: square.x + selectedSquare.location.x,
        y: square.y + selectedSquare.location.y
    }));

    allowed = filterTheSameSquares(allowed);
    allowed = filterOutOfBoard(allowed);
    allowed = filterSamePlayerFigures(allowed);

    return allowed;
};

const movePiece = (allowedSquares, targetLocation, boardState) => {
    const targetSquare = boardState[targetLocation.y][targetLocation.x];

    if (!targetSquare) throw 'Incorrect location!';

    if (!allowedSquares.find(square => square.x === targetSquare.location.x && square.y === targetSquare.location.y)) {
        console.log('Incorrect square!');
        selectedSquare = null;
        return;
    }

    const clearSourceSquare = () => {
        boardState[selectedSquare.location.y][selectedSquare.location.x] = getEmptySquare({
            y: selectedSquare.location.y,
            x: selectedSquare.location.x
        });

        selectedSquare = null;
    };

    if (targetSquare.piece === null) {
        targetSquare.piece = selectedSquare.piece;

        clearSourceSquare();
    } else {
        if (targetSquare.piece.player === selectedSquare.piece.player) {
            selectedSquare = targetSquare;
        } else {
            targetSquare.piece = selectedSquare.piece;

            clearSourceSquare();
        }
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////

const boardState = getInitialBoardState();
let selectedSquare = null;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 480;

canvas.addEventListener('click', e => {
    const x = Math.floor(e.clientX * 8 / canvas.height);
    const y = Math.floor(e.clientY * 8 / canvas.height);

    if (selectedSquare === null) {
        const squareToCheck = getSquare({y, x}, boardState);

        if (squareToCheck.piece) {
            selectedSquare = squareToCheck;

            console.log('allowed: ', JSON.stringify(getAvailableSquaresToMove(boardState)));
        }
    } else {
        const allowedSquares = getAvailableSquaresToMove(boardState);

        movePiece(allowedSquares, {y, x}, boardState);
    }

    drawBoard(context, canvas.height);
    updateBoard(context, boardState, canvas.height);
});

drawBoard(context, canvas.height);
updateBoard(context, boardState, canvas.height);
