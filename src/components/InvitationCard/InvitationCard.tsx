interface InvitationCard {
  gridSize: number;
  winningLine: number;
  token: "x" | "o";
  status: "pending" | "accepted" | "declined" | "cancelled";
}

interface SentInvitationCard extends InvitationCard {
  invited: string;
  onPlay: () => void;
  onCancel: () => void;
}

export const SentInvitationCard = ({
  gridSize,
  winningLine,
  token,
  status,
  invited,
  onCancel,
  onPlay,
}: SentInvitationCard) => {
  return (
    <li className="card margin-block-5">
      <h2 className="card__heading">{invited}</h2>
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
        <p>
          Status: <span>{status}</span>
        </p>
      </div>
      <div className="card__buttons">
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

interface ReceivedInvitationCard extends InvitationCard {
  inviter: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const ReceivedInvitationCard = ({
  gridSize,
  winningLine,
  token,
  inviter,
  onAccept,
  onDecline,
}: ReceivedInvitationCard) => {
  return (
    <li className="card margin-block-5">
      <h2 className="card__heading">{inviter}</h2>
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
        <button
          className="button"
          data-type="primary"
          onClick={() => onAccept()}
        >
          Accept
        </button>

        <button
          className="button"
          data-type="accent"
          onClick={() => onDecline()}
        >
          Decline
        </button>
      </div>
    </li>
  );
};
