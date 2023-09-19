import { useParams } from "react-router-dom";
import { useGame } from "../hooks";
import { ModalWindow } from "../components";

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

export function Game() {
  const { id } = useParams();

  const {
    game,
    handleClick,
    gameState,
    playAgainStatus,
    handlePlayAgain,
    handleMainMenu,
    turn,
  } = useGame(id as string);

  if (!game) return <h1>Loading...</h1>;

  return (
    <>
      <div className="game-info">
        <p>
          Playing against: <span>{game.opponent}</span>
        </p>
        <p>
          Your token: <span className="uppercase">{game.token}</span>
        </p>
        <p>
          Winning line: <span>{game.winningLine}</span>
        </p>
        <p>
          Mode: <span className="uppercase">{game.mode}</span>
        </p>
        <p>
          Game state: <span className="uppercase">{game.state}</span>
        </p>
        <p>
          <span>{turn}</span>
        </p>
      </div>
      <div className="game container">
        <Board grid={game.grid} onClick={handleClick} />
      </div>
      <ModalWindow isOpen={game?.state !== "ongoing"}>
        <h2>{gameState}</h2>
        <p>
          {playAgainStatus ? playAgainStatus : "Do you want to play again?"}
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
