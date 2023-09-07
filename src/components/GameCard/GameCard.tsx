interface GameCard {
  game: Game;
  onPlay: () => void;
}

export const GameCard = ({
  game: { gridSize, winningLine, opponent, token },
  onPlay,
}: GameCard) => {
  return (
    <li className="card margin-block-5">
      <h2 className="card__heading">{opponent}</h2>
      <div className="card__description">
        <p>
          Grid size: <span>{gridSize}</span>
        </p>
        <p>
          Winning line: <span>{winningLine}</span>
        </p>
        <p>
          Your token: <span>{token}</span>
        </p>
      </div>
      <div className="card__buttons">
        <button className="button" data-type="primary" onClick={() => onPlay()}>
          Play
        </button>
      </div>
    </li>
  );
};
