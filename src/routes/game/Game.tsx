import { useEffect, useState } from "react";
import { makeMove, pollGame } from "../../api";

interface Square {
  value: "x" | "o" | null;
  onClick: () => void;
}

function Square({ value, onClick }: Square) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

interface GameProps {
  gameId: string;
  gridSize: number;
  sign: "x" | "o";
  token: string;
}

export function Game({ gameId, gridSize, sign, token }: GameProps) {
  type Squares = null | "x" | "o";
  const [squares, setSquares] = useState<Squares[][]>(
    new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(null))
  );
  const [yourTurn, setYourTurn] = useState<boolean>(sign == "x" ? true : false);
  const [gameState, setGameState] = useState("ongoing");

  const handleClick = async (row: number, col: number) => {
    if (squares[row][col]) {
      return;
    }
    if (yourTurn && gameState === "ongoing") {
      setYourTurn(false);
      const nextSquares = squares.slice();
      squares[row][col] = sign;
      setSquares(nextSquares);
      const cell = String.fromCharCode(97 + col) + String(row + 1);
      const state = await makeMove(gameId, cell, token);
      setGameState(state);
    }
  };

  const fetchGame = async () => {
    const [error, data] = await pollGame(gameId, token);
    if (error) {
      return console.error(error);
    }
    const { newMove, state, cell } = data as any;
    setGameState(state);
    if (!newMove) {
      return;
    }
    setYourTurn(true);
    const nextSquares = squares.slice();
    const col = cell[0].charCodeAt(0) - 97;
    const row = Number(cell.slice(1)) - 1;
    squares[row][col] = sign === "x" ? "o" : "x";
    setSquares(nextSquares);
  };

  useEffect(() => {
    const pollingInterval = setInterval(fetchGame, 1000);
    fetchGame();

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  return (
    <div className="game">
      <div className="game-info">
        <p>
          Your token: <span>{sign}</span>
        </p>
        <p>
          Game state: <span>{gameState}</span>
        </p>
      </div>
      <div className="game-board">
        {squares.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((square, colIndex) => (
              <Square
                key={String(rowIndex) + String(colIndex)}
                value={square}
                onClick={() => {
                  handleClick(rowIndex, colIndex);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}