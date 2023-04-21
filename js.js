function Gameboard() {
  const fieldSize = 9;
  const board = Array.from({ length: fieldSize }, () => Cell());
  const getBoard = () => board;
  const getValueBoard = () => getBoard().map((e) => e.getValue());
  const getEmptyIndexes = () => {
    const arrOfIndexes = getValueBoard().reduce((acc, curr, index) => {
      if (curr === 0) {
        acc.push(index);
      }
      return acc;
    }, []);
    return arrOfIndexes;
  };
  return { getBoard, getValueBoard, getEmptyIndexes };
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

function RandomAi(board) {
  const aiRound = () => {
    const emptyIndexes = board.getEmptyIndexes();
    console.log(emptyIndexes);
    const getRandom = (max) => {
      return Math.floor(Math.random() * max);
    };
    let random = getRandom(emptyIndexes.length);
    let turn = emptyIndexes[random];
    return turn;
  };

  return {
    aiRound,
  };
}

function MinimaxAi(gameboard) {
  //make new instance of board and copy over values from main instance
  const newInstanceOfGameBoard = Gameboard();
  const { getWinCondition } = winCondition;
  const minimaxRound = () => {
    newInstanceOfGameBoard.getBoard().forEach((e, index) => {
      e.setValue(gameboard.getBoard()[index].getValue());
    });
    return bestMove();
  };

  const minimax = (board, depth, maximizingPlayer) => {
    let result = getWinCondition(board.getValueBoard());
    if (result === "tie") {
      return 0;
    }
    if (result === 2) {
      return 10 - depth;
    }
    if (result === 1) {
      return depth - 10;
    }
    if (maximizingPlayer) {
      let bestScore = -Infinity;
      const moves = board.getEmptyIndexes();
      for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        board.getBoard()[move].setValue(2);
        let score = minimax(board, depth + 1, false);
        board.getBoard()[move].setValue(0);
        bestScore = Math.max(bestScore, score);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      const moves = board.getEmptyIndexes();
      for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        board.getBoard()[move].setValue(1);
        let score = minimax(board, depth + 1, true);
        board.getBoard()[move].setValue(0);
        bestScore = Math.min(bestScore, score);
      }
      return bestScore;
    }
  };
  const bestMove = () => {
    let bestScore = -Infinity;
    let bestMoveIndex = null;
    const moves = newInstanceOfGameBoard.getEmptyIndexes();
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      newInstanceOfGameBoard.getBoard()[move].setValue(2);
      const score = minimax(newInstanceOfGameBoard, 0, false);
      newInstanceOfGameBoard.getBoard()[move].setValue(0);
      if (score > bestScore) {
        bestScore = score;
        bestMoveIndex = move;
        console.log(bestMoveIndex);
      }
    }
    return bestMoveIndex;
  };
  return {
    minimaxRound,
  };
}

const winCondition = (() => {
  const getWinCondition = (valueBoard) => {
    for (let i = 0; i < valueBoard.length; i += 3) {
      if (
        valueBoard[i] !== 0 &&
        valueBoard[i] === valueBoard[i + 1] &&
        valueBoard[i] === valueBoard[i + 2]
      ) {
        return valueBoard[i];
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        valueBoard[i] !== 0 &&
        valueBoard[i] === valueBoard[i + 3] &&
        valueBoard[i] === valueBoard[i + 6]
      ) {
        return valueBoard[i];
      }
    }
    if (
      valueBoard[0] !== 0 &&
      valueBoard[0] === valueBoard[4] &&
      valueBoard[0] === valueBoard[8]
    ) {
      return valueBoard[0];
    }
    if (
      valueBoard[2] !== 0 &&
      valueBoard[2] === valueBoard[4] &&
      valueBoard[2] === valueBoard[6]
    ) {
      return valueBoard[2];
    }
    let tie = valueBoard.every((e) => e !== 0);
    if (tie) {
      return "tie";
    }
    return null;
  };
  return {
    getWinCondition,
  };
})();

function GameController(playerOne = "Player One", playerTwo = "player Two") {
  const { getWinCondition } = winCondition;
  const board = Gameboard();
  const ai = RandomAi(board);
  const minimax = MinimaxAi(board);
  const players = [
    { name: playerOne, mark: 1 },
    { name: playerTwo, mark: 2 },
  ];
  let currentTurn = players[0];
  const changeTurn = () => {
    currentTurn = currentTurn === players[0] ? players[1] : players[0];
  };
  const getCurrentTurn = () => currentTurn;

  const modeHandler = (() => {
    let currMode = "";
    const updateMode = (mode = currMode) => {
      console.log("hi");
      currMode = mode;
      board.getBoard().forEach((e) => e.setValue(0));
    };
    const getMode = () => currMode;
    return { updateMode, getMode };
  })();
  const playRoundHandler = (cell) => {
    if (board.getValueBoard()[cell] !== 0) return;
    if (currentTurn.mark === 1 && modeHandler.getMode() === "RandomAi") {
      playRound(cell);
      const aiCell = ai.aiRound();
      const lastCell = board.getValueBoard().filter((e) => e === 0);
      if (
        lastCell.length > 1 &&
        getWinCondition(board.getValueBoard()) === null
      ) {
        // playRound(minimax.minimaxRound());
        playRound(aiCell);
        console.log(aiCell);
      }
    } else {
      playRound(cell);
    }
  };
  const playRound = (cell) => {
    board.getBoard()[cell].setValue(currentTurn.mark);
    //check for win condition
    const winner = getWinCondition(board.getValueBoard());
    if (winner === 1) {
      console.log("x wins");
    } else if (winner === 2) {
      console.log("o wins");
    } else if (winner === "tie") {
      console.log("tie");
    } else {
      changeTurn();
    }
  };

  return {
    playRoundHandler,
    board,
    getCurrentTurn,
    modeHandler: modeHandler.updateMode,
  };
}

function UIController() {
  const { getWinCondition } = winCondition;
  const game = GameController();
  const boardDiv = document.querySelector(".board");
  const container = document.querySelector(".container");
  const curtainContainer = document.querySelector(".curtain");
  const nameForm = document.querySelector("form");
  const startGame = document.querySelector(".startGame");
  const alarm = document.querySelector("h2");
  boardDiv.classList.add("x");

  const updateBoard = () => {
    boardDiv.textContent = "";
    const board = game.board.getBoard();
    const createTable = () => {
      board.forEach((e, index) => {
        const instance = document.createElement("button");
        instance.classList.add("cell");
        instance.dataset.index = index;
        if (e.getValue() === 1) {
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
    console.log(getWinCondition(game.board.getValueBoard()));
    if (getWinCondition(game.board.getValueBoard()) === 1) {
      console.log();
      game.modeHandler();
      updateBoard();
    }
    changeBoardMarker();
  };

  boardDiv.addEventListener("click", eventHandler);

  const synchronizeButtonSets = (target) => {
    console.log(target);
    const buttons = document.querySelectorAll(".switch");
    [...buttons].forEach((e) => {
      if (e.classList.contains(target) && !e.classList.contains("Reset")) {
        e.classList.add("chosen");
      } else if (target !== "Reset") {
        e.classList.remove("chosen");
      }
    });
    formControl.setState(target);
  };
  const switchers = () => {
    const createDivWithButtons = () => {
      const buttonDiv = document.createElement("div");
      buttonDiv.classList.add("buttonContainer");
      const buttons = ["PvP", "RandomAi", "MinimaxAi", "Reset"];
      buttons.forEach((e) => {
        const button = document.createElement("button");
        button.classList.add("switch", e);
        button.textContent = e;
        buttonDiv.appendChild(button);
      });
      buttonDiv.addEventListener("click", (e) => {
        if (e.target.nodeName === "BUTTON") {
          synchronizeButtonSets(e.target.classList[1]);
        }
      });
      return buttonDiv;
    };
    //button sets on main screen and game field
    const modifiedBtnDiv = createDivWithButtons();
    modifiedBtnDiv.removeChild(modifiedBtnDiv.lastChild);
    curtainContainer.insertBefore(modifiedBtnDiv, nameForm);

    container.insertBefore(createDivWithButtons(), boardDiv);
  };
  const formControl = (() => {
    let mode = false;
    let name = "";
    const setState = (newState) => {
      mode = newState;
      alarm.style.color = "black";
      console.log(newState);
      game.modeHandler(mode);
      // lose state to early, need to pass from here to curtain and stuff
      updateBoard();
    };
    const validation = (playerName) => {
      if (!mode) {
        alarm.style.color = "red";
        console.log("CHOOOOOSE");
      } else {
        name = playerName;
        curtainContainer.classList.add("off");
        game.modeHandler(mode);
        updateBoard();
        console.log(name);
      }
    };
    return { setState, validation };
  })();
  startGame.addEventListener("click", () => {
    const inputField = document.querySelector("input");
    const inputValue = inputField.value;
    formControl.validation(inputValue);
  });
  switchers();
  updateBoard();
}

UIController();
