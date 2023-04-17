function Gameboard() {
  const fieldSize = 9;
  const board = Array.from({ length: fieldSize }, () => Cell());
  const getBoard = () => board;
  return { getBoard };
}

function Cell() {
  let value = 0;
  const getValue = () => value;
  const setValue = (player) => {
    value = player;
  };
  return {
    getValue,
    setValue,
  };
}

function artificialInt() {
  let aiMode = false;
  const setMode = () => {
    aiMode = aiMode === false ? true : false;
    console.log(aiMode);
  };
  const getMode = () => aiMode;
  const aiRound = (valueBoard) => {
    console.log(valueBoard);
    const emptyIndexes = valueBoard.reduce((acc, curr, index) => {
      if (curr === 0) {
        acc.push(index);
      }
      return acc;
    }, []);

    console.log(emptyIndexes);

    const getRandom = (max) => {
      return Math.floor(Math.random() * max);
    };
    let random = getRandom(emptyIndexes.length);
    let turn = emptyIndexes[random];
    return turn;
  };
  return {
    setMode,
    getMode,
    aiRound,
  };
}

function GameController(playerOne = "Player One", playerTwo = "player Two") {
  const ai = artificialInt();
  const board = Gameboard();
  const players = [
    { name: playerOne, mark: 1 },
    { name: playerTwo, mark: 2 },
  ];
  let currentTurn = players[0];
  const changeTurn = () => {
    currentTurn = currentTurn === players[0] ? players[1] : players[0];
  };
  const getCurrentTurn = () => currentTurn;

  const playRoundHandler = (cell) => {
    if (board.getBoard()[cell].getValue() !== 0) return;
    if (ai.getMode() && currentTurn.mark === 1) {
      playRound(cell);
      const aiCell = ai.aiRound(stat().getValueBoard());
      console.log("AIround");
      const lastCell = stat()
        .getValueBoard()
        .filter((e) => e === 0);
      console.log(lastCell.length);
      console.log(stat().getValueBoard());
      if (lastCell.length > 1) {
        playRound(aiCell);
      }
    } else {
      playRound(cell);
    }
  };
  const playRound = (cell) => {
    board.getBoard()[cell].setValue(currentTurn.mark);
    //check for win condition
    winCondition();
    changeTurn();
    console.log(stat().getValueBoard());
  };
  const stat = () => {
    let statHolder = board.getBoard().map((e) => e.getValue());
    const getValueBoard = () => statHolder;
    return {
      getValueBoard,
    };
  };
  const winCondition = () => {
    const valueBoard = stat().getValueBoard();
    for (let i = 0; i < valueBoard.length; i += 3) {
      if (
        valueBoard[i] !== 0 &&
        valueBoard[i] === valueBoard[i + 1] &&
        valueBoard[i] === valueBoard[i + 2]
      ) {
        console.log("GGG");
        return i;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        valueBoard[i] !== 0 &&
        valueBoard[i] === valueBoard[i + 3] &&
        valueBoard[i] === valueBoard[i + 6]
      ) {
        console.log("GGGGGG");
        return i;
      }
    }
    if (
      valueBoard[0] !== 0 &&
      valueBoard[0] === valueBoard[4] &&
      valueBoard[0] === valueBoard[8]
    ) {
      console.log("gege");
      return valueBoard[0];
    }
    if (
      valueBoard[2] !== 0 &&
      valueBoard[2] === valueBoard[4] &&
      valueBoard[2] === valueBoard[6]
    ) {
      console.log(valueBoard[2]);
      return valueBoard[2];
    }
    let tie = valueBoard.every((e) => e !== 0);
    if (tie) {
      console.log("tie");
      return 3;
    }
  };
  return {
    playRoundHandler,
    getBoard: board.getBoard,
    getCurrentTurn,
    stat: stat().getValueBoard,
    ai: ai.setMode,
  };
}
function UIController() {
  const game = GameController();
  const boardDiv = document.querySelector(".board");
  boardDiv.classList.add("x");

  const updateBoard = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const createTable = () => {
      board.forEach((e, index) => {
        const instance = document.createElement("button");
        instance.classList.add("cell");
        instance.dataset.index = index;
        // console.log(instance);
        if (e.getValue() === 1) {
          // console.log(e.getValue());
          instance.classList.add("x");
        } else if (e.getValue() === 2) {
          console.log(e.getValue());
          instance.classList.add("circle");
        }
        boardDiv.appendChild(instance);
      });
    };
    createTable();
  };
  const changeBoardMarker = () => {
    if (game.getCurrentTurn().mark === 1) {
      boardDiv.classList.replace("circle", "x");
    } else {
      boardDiv.classList.replace("x", "circle");
    }
  };
  const eventHandler = (e) => {
    if (!e.target.classList.contains("cell")) return;
    const fieldClicked = e.target.dataset.index;
    game.playRoundHandler(fieldClicked);
    console.log(fieldClicked);
    updateBoard();
    changeBoardMarker();
  };
  boardDiv.addEventListener("click", eventHandler);

  const switcher = () => {
    const container = document.querySelector(".container");
    const button = document.createElement("button");
    button.classList.add("switch");
    button.textContent = "switch";
    container.insertBefore(button, boardDiv);
    button.addEventListener("click", game.ai);
  };

  return {
    updateBoard,
    getStat: game.stat,
    switcher,
  };
}
const game = UIController();
game.updateBoard();
console.log(game.getStat());
game.switcher();
