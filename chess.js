var copy = toCopy => JSON.parse(JSON.stringify(toCopy));

var figure = {
  king: {
    img: 'K'
  },
  queen: {
    img: 'Q'
  },
  rook: {
    img: 'R'
  },
  bishop: {
    img: 'B'
  },
  knight: {
    img: 'Kn'
  },
  pawn: {
    img: 'P'
  }
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
  
  state[0][0].piece = copy(figure.rook);
  state[0][1].piece = copy(figure.knight);
  state[0][2].piece = copy(figure.bishop);
  state[0][3].piece = copy(figure.queen);
  state[0][4].piece = copy(figure.king);
  state[0][5].piece = copy(figure.bishop);
  state[0][6].piece = copy(figure.knight);
  state[0][7].piece = copy(figure.rook);
  
  for (var i = 0; i < 8; i++) {
    state[1][i].piece = copy(figure.pawn);
  }
  
  for (var i = 0; i < 2; i++) {
  	for (var j = 0; j < 8; j++) {
    	state[i][j].piece.player = 1;
    }
  }
  
  state[7][0].piece = copy(figure.rook);
  state[7][1].piece = copy(figure.knight);
  state[7][2].piece = copy(figure.bishop);
  state[7][3].piece = copy(figure.queen);
  state[7][4].piece = copy(figure.king);
  state[7][5].piece = copy(figure.bishop);
  state[7][6].piece = copy(figure.knight);
  state[7][7].piece = copy(figure.rook);
  
  for (var i = 0; i < 8; i++) {
    state[6][i].piece = copy(figure.pawn);
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
  context.fillStyle = 'red';
      
  for (var i = 0; i < amountOfTiles; i++) {
    for (var j = 0; j < amountOfTiles; j++) {
      var piece =  state[i][j].piece;
      
      if (piece) {
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
    
    		getSquare({ x: location.x, y: location.y + 1 }, boardState)
    		
        
        
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
  // switch (selectedSquare.piece) {
  //   case 'pawn': {
      
  //     break;
  //   }
  // }
  // console.log(selectedSquare)
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

var canvas  = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 480;

canvas.addEventListener('click', e => {
  var x = Math.floor(e.clientX * 8 / canvas.height);
  var y = Math.floor(e.clientY * 8 / canvas.height);
  console.log(getSquare({ y, x }, boardState));
  
  if (selectedSquare === null) {
    selectedSquare = getSquare({ y, x }, boardState);
  } else {
    movePiece({ y, x }, boardState);
  }

  drawBoard(context, canvas.height)
  updateBoard(context, boardState, canvas.height);
});

drawBoard(context, canvas.height)
updateBoard(context, boardState, canvas.height);