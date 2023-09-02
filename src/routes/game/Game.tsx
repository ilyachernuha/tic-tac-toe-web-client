import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

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

interface Game {
  gameId: string;
  gridSize: number;
  winningLine: number;
  sign: "x" | "o";
}

export function Game({ gameId, gridSize, sign, winningLine }: Game) {
  const { token } = useAuth();
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
      const cell = String.fromCharCode(97 + row) + String(col + 1);
      const [error, state] = await api.makeMove(gameId, cell, token);
      if (error) return;
      setYourTurn(false);
      const nextSquares = squares.slice();
      squares[row][col] = sign;
      setSquares(nextSquares);
      setGameState(state);
    }
  };

  const fetchGame = async () => {
    const [error, data] = await api.pollGame(gameId, token);
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
    const row = cell[0].charCodeAt(0) - 97;
    const col = Number(cell.slice(1)) - 1;
    squares[row][col] = sign === "x" ? "o" : "x";
    setSquares(nextSquares);
  };

  useEffect(() => {
    const pollingInterval = setInterval(fetchGame, 2000);
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
          Winning line: <span>{winningLine}</span>
        </p>
        <p>
          Game state: <span>{gameState}</span>
        </p>
        <p>
          {yourTurn ? "Choose your next move" : "Waiting for opponent to move"}
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
