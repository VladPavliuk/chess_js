var copy = toCopy => JSON.parse(JSON.stringify(toCopy));

var baseFigure = () => ({
    type: 'base',
    allowedMoves: [],
    sameAttackMoves: true,
    jumpOver: false,
    alreadyMoved: false,
    movesOnlyForward: false,
    img: ''
});

var kingFigure = () => ({
    ...baseFigure(),
    type: 'king',
    allowedMoves: [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}],
    img: 'K'
});

var queenFigure = () => ({
    ...baseFigure(),
    type: 'queen',
    allowedMoves: [{x: true, y: true}, {x: true, y: 0}, {x: 0, y: true}],
    img: 'Q'
});

var rookFigure = () => ({
    ...baseFigure(),
    type: 'rook',
    allowedMoves: [{x: true, y: 0}, {x: 0, y: true}],
    img: 'R'
});

var bishopFigure = () => ({
    ...baseFigure(),
    type: 'bishop',
    allowedMoves: [{x: true, y: true}],
    img: 'B'
});

var knightFigure = () => ({
    ...baseFigure(),
    type: 'knight',
    allowedMoves: [{x: 1, y: 2}, {x: 2, y: 1}],
    img: 'Kn',
    jumpOver: true
});

var pawnFigure = () => ({
    ...baseFigure(),
    type: 'pawn',
    allowedMoves: [{x: 0, y: 1}],
    img: 'P',
    movesOnlyForward: true,
    sameAttackMoves: [{x: 1, y: 1}, {x: -1, y: 1}],
});

var figure = {
    king: kingFigure(),
    queen: queenFigure(),
    rook: rookFigure(),
    bishop: bishopFigure(),
    knight: knightFigure(),
    pawn: pawnFigure(),
};

var getFigure = type => {
    return copy(figure[type]);
};

var drawBoard = (context, size) => {
    var amountOfTiles = 8;

    if (size % amountOfTiles !== 0) {
        throw 'incorrect board size!';
    }

    var unit = size / amountOfTiles;

    for (var i = 0; i < amountOfTiles; i++) {
        for (var j = 0; j < amountOfTiles; j++) {
            context.fillStyle = (i + j) % 2 === 0 ? 'white' : 'black';
            context.fillRect(i * unit, j * unit, unit, unit);
        }
    }
};

var getEmptySquare = location => ({
    location: {
        y: location.y,
        x: location.x
    },
    piece: null
});

var getEmptyBoardState = () => {
    var state = [];

    for (var i = 0; i < 8; i++) {
        state.push([]);

        for (var j = 0; j < 8; j++) {
            state[i].push(getEmptySquare({
                y: i,
                x: j
            }));
        }
    }

    return state;
};

var getInitialBoardState = () => {
    var state = getEmptyBoardState();

    state[0][0].piece = getFigure(figure.rook.type);
    state[0][1].piece = getFigure(figure.knight.type);
    state[0][2].piece = getFigure(figure.bishop.type);
    state[0][3].piece = getFigure(figure.queen.type);
    state[0][4].piece = getFigure(figure.king.type);
    state[0][5].piece = getFigure(figure.bishop.type);
    state[0][6].piece = getFigure(figure.knight.type);
    state[0][7].piece = getFigure(figure.rook.type);

    for (var i = 0; i < 8; i++) {
        state[1][i].piece = getFigure(figure.pawn.type);
    }

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 8; j++) {
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

    for (var i = 0; i < 8; i++) {
        state[6][i].piece = getFigure(figure.pawn.type);
    }

    for (var i = 6; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            state[i][j].piece.player = 0;
        }
    }

    return state;
};

var updateBoard = (context, state, size) => {
    var amountOfTiles = 8;

    if (size % amountOfTiles !== 0) {
        throw 'incorrect board size!';
    }

    var unit = canvas.height / amountOfTiles;

    context.font = '40px Arial';

    for (var i = 0; i < amountOfTiles; i++) {
        for (var j = 0; j < amountOfTiles; j++) {
            var piece = state[i][j].piece;

            if (piece) {
                context.fillStyle = piece.player === 0 ? 'red' : 'blue';
                context.fillText(piece.img, j * unit + 10, i * unit + 45);
            }
        }
    }
};

var getSquare = (location, boardState) => boardState[location.y][location.x];

var getAvailableSquaresToMove = (player, location, boardState) => {
    var selectedSquare = boardState[location.y][location.x];

    if (selectedSquare.piece === null || selectedSquare.piece.player !== player)
        return [];

    var availableSquares = [];

    switch (selectedSquare.piece) {
        case figure.pawn: {

            getSquare({x: location.x, y: location.y + 1}, boardState)


        }
    }

    for (var i = 0; i < boardState.length; i++) {
        for (var j = 0; j < boardState[i].length; j++) {

        }
    }
};

var movePiece = (targetLocation, boardState) => {
    var targetSquare = boardState[targetLocation.y][targetLocation.x];

    if (!targetSquare) throw 'Incorrect location!';

    clearSourceSquare = () => {
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

var boardState = getInitialBoardState();
var selectedSquare = null;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 480;

canvas.addEventListener('click', e => {
    let x = Math.floor(e.clientX * 8 / canvas.height);
    let y = Math.floor(e.clientY * 8 / canvas.height);

    if (selectedSquare === null) {
        var squareToCheck = getSquare({y, x}, boardState);

        if (squareToCheck.piece) {
            selectedSquare = squareToCheck;

            let allowed = [];
            // multiply moves by 4

            //> add locations
            let addToAllowed = (x, y) => allowed.push({x: x + selectedSquare.location.x, y: y + selectedSquare.location.y});

            for (var allowedMove of selectedSquare.piece.allowedMoves) {
                if (typeof allowedMove.x == 'number' && typeof allowedMove.y == 'number') {
                    addToAllowed(allowedMove.x, allowedMove.y);
                } else if (typeof allowedMove.x == 'boolean' && typeof allowedMove.y == 'boolean') {
                    for (var i = 0; i < 8; i++) {
                        addToAllowed(i, i);
                    }
                } else if (typeof allowedMove.x == 'boolean' && typeof allowedMove.y == 'number') {
                    for (var i = 0; i < 8; i++) {
                        addToAllowed(i, allowedMove.y);
                    }
                } else if (typeof allowedMove.x == 'number' && typeof allowedMove.y == 'boolean') {
                    for (var i = 0; i < 8; i++) {
                        addToAllowed(allowedMove.y, allowedMove.y);
                    }
                } else throw 'Wrong moves types!';
            }
            //<

            console.log(JSON.stringify(allowed));
        }
    } else {
        movePiece({y, x}, boardState);
    }

    drawBoard(context, canvas.height)
    updateBoard(context, boardState, canvas.height);
});

drawBoard(context, canvas.height)
updateBoard(context, boardState, canvas.height);
