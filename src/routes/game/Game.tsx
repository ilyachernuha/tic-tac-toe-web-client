import { useEffect, useRef, useState } from "react";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { ModalWindow } from "../../components";

interface Square {
  value: "x" | "o" | "";
  onClick: () => void;
}

function Square({ value, onClick }: Square) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

interface Board {
  grid: Game["grid"];
  onClick: (row: number, col: number) => void;
}

function Board({ grid, onClick }: Board) {
  return (
    <div className="game-board">
      {grid.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((square, colIndex) => (
            <Square
              key={String(rowIndex) + String(colIndex)}
              value={square}
              onClick={() => {
                onClick(rowIndex, colIndex);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface GameProps {
  game: Game;
  setGame: any;
}

export function Game({ game, setGame }: GameProps) {
  const { token, grid, id, isYourTurn, opponent, winningLine, mode, state } =
    game;
  const { authToken } = useAuth();

  const [playAgain, setPlayAgain] = useState<any>(null);

  const gamePollingTimer = useRef<number | undefined>(undefined);
  const playAgainPollingTimer = useRef<number | undefined>(undefined);

  const handleClick = async (row: number, col: number) => {
    if (grid[row][col]) {
      return;
    }
    if (isYourTurn && state === "ongoing") {
      try {
        const cell = String.fromCharCode(97 + row) + String(col + 1);
        const state = await api.makeMove(id, cell, authToken);
        const nextGrid = grid.slice();
        nextGrid[row][col] = token;
        setGame({
          ...game,
          state: state,
          grid: nextGrid,
          isYourTurn: false,
        });
      } catch (error) {}
    }
  };

  const pollGame = async () => {
    try {
      const { newMove, state, cell } = await api.pollGame(id, authToken);
      if (newMove && cell) {
        const nextGrid = grid.slice();
        const row = cell[0].charCodeAt(0) - 97;
        const col = Number(cell.slice(1)) - 1;
        nextGrid[row][col] = token === "x" ? "o" : "x";
        setGame({
          ...game,
          state: state,
          grid: nextGrid,
          isYourTurn: true,
        });
      }
    } catch (error) {}
  };

  const handlePlayAgain = async () => {
    const { status, gameId } = await api.playAgain(id, true, authToken);
    setPlayAgain({ status: status, gameId: gameId });
    if (gameId) {
      const game = await api.getGame(gameId, authToken);
      setGame(game);
      setPlayAgain(null);
    }
  };

  const handleMainMenu = async () => {
    await api.playAgain(id, false, authToken);
    setGame(null);
  };

  const pollPlayAgain = async () => {
    try {
      const { status, gameId } = await api.pollPlayAgain(id, authToken);
      setPlayAgain({ status: status, gameId: gameId });
      if (gameId) {
        const game = await api.getGame(gameId, authToken);
        setGame(game);
        setPlayAgain(null);
      }
    } catch (error) {}
  };

  const startGamePolling = () => {
    gamePollingTimer.current = setInterval(pollGame, 2000);
  };

  const stopGamePolling = () => {
    clearInterval(gamePollingTimer.current);
  };

  const startPlayAgainPolling = () => {
    playAgainPollingTimer.current = setInterval(pollPlayAgain, 2000);
  };

  const stopPlayAgainPolling = () => {
    clearInterval(playAgainPollingTimer.current);
  };

  const turn =
    state === "ongoing" &&
    (isYourTurn ? "Choose your next move" : "Waiting for opponent to move");

  useEffect(() => {
    if (state === "ongoing") {
      isYourTurn ? stopGamePolling() : startGamePolling();
      stopPlayAgainPolling();
    } else {
      startPlayAgainPolling();
    }
    return () => {
      stopGamePolling();
      stopPlayAgainPolling();
    };
  }, [state, isYourTurn]);

  const getPlayAgainStatus = (status: string) => {
    if (status === "declined") return `${opponent} doesn't want to play again`;
    if (status === "requested_by_x") {
      if (token === "x") return `you invited ${opponent} to play again`;
      if (token === "o") return `${opponent} invited you to play again`;
    }
    if (status === "requested_by_o") {
      if (token === "o") return `you invited ${opponent} to play again`;
      if (token === "x") return `${opponent} invited you to play again`;
    }
  };

  const getGameState = (state: string) => {
    if (state === "draw") return `Draw`;
    if (state === "won_by_x") {
      if (token === "x") return `You win!`;
      if (token === "o") return `You lose!`;
    }
    if (state === "won_by_o") {
      if (token === "o") return `You win!`;
      if (token === "x") return `You lose!`;
    }
  };

  const gameState = getGameState(state);

  const playAgaingStatus = getPlayAgainStatus(playAgain?.status);

  return (
    <>
      <div className="game-info">
        <p>
          Playing against: <span>{opponent}</span>
        </p>
        <p>
          Your token: <span className="uppercase">{token}</span>
        </p>
        <p>
          Winning line: <span>{winningLine}</span>
        </p>
        <p>
          Mode: <span className="uppercase">{mode}</span>
        </p>
        <p>
          Game state: <span className="uppercase">{state}</span>
        </p>
        <p>
          <span>{turn}</span>
        </p>
      </div>
      <div className="game container">
        <Board grid={grid} onClick={handleClick} />
      </div>
      <ModalWindow isOpen={state !== "ongoing"}>
        <h2>{gameState}</h2>
        <p>
          {playAgaingStatus ? playAgaingStatus : "Do you want to play again?"}
        </p>
        <div className="modal__buttons">
          <button
            className="button"
            data-type="primary"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
          <button
            className="button"
            data-type="accent"
            onClick={handleMainMenu}
          >
            Main Menu
          </button>
        </div>
      </ModalWindow>
    </>
  );
}
