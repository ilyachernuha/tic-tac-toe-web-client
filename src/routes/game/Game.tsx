import { useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

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

export function Game({
  game: { token, grid, id, isYourTurn, opponent, winningLine, state },
  setGame,
}: GameProps) {
  const { authToken } = useAuth();

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
        setGame((prevGame: Game) => {
          return {
            ...prevGame,
            isYourTurn: false,
            grid: nextGrid,
            state: state,
          };
        });
      } catch (error) {}
    }
  };

  const pollGame = async () => {
    try {
      const { newMove, state, cell } = await api.pollGame(id, authToken);
      const nextGrid = grid.slice();
      let nextIsYourTurn = isYourTurn;

      if (newMove) {
        const row = cell[0].charCodeAt(0) - 97;
        const col = Number(cell.slice(1)) - 1;
        nextGrid[row][col] = token === "x" ? "o" : "x";
        nextIsYourTurn = true;
      }

      setGame((prevGame: Game) => {
        return {
          ...prevGame,
          state: state,
          grid: nextGrid,
          isYourTurn: nextIsYourTurn,
        };
      });
    } catch (error) {}
  };

  useEffect(() => {
    const pollingInterval = setInterval(pollGame, 2000);
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const turn =
    state === "ongoing" &&
    (isYourTurn ? "Choose your next move" : "Waiting for opponent to move");

  return (
    <div className="game container">
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
          Game state: <span className="uppercase">{state}</span>
        </p>
        <p>
          <span>{turn}</span>
        </p>
      </div>
      <Board grid={grid} onClick={handleClick} />
    </div>
  );
}
