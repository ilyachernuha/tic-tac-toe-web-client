interface InvitationCard {
  inviter: string;
  gridSize: number;
  winningLine: number;
  token: "x" | "o";
  status: "pending" | "accepted" | "declined";
  onPlay: () => void;
  onCancel: () => void;
}

export const InvitationCard = ({
  inviter,
  gridSize,
  winningLine,
  token,
  status,
  onPlay,
  onCancel,
}: InvitationCard) => {
  return (
    <li className="card margin-block-5">
      <h2 className="card__heading">{inviter}</h2>
      <div>
        <p>Grid size: {gridSize}</p>
        <p>Winning line: {winningLine}</p>
        <p>Your token: {token}</p>
        <p>Status: {status}</p>
      </div>
      <div>
        {status === "pending" && (
          <button
            className="button"
            data-type="accent"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
        )}
        {status === "accepted" && (
          <button
            className="button"
            data-type="primary"
            onClick={() => onPlay()}
          >
            Play
          </button>
        )}
      </div>
    </li>
  );
};
