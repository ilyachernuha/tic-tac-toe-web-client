interface InvitationCard {
  invitation: Invitation;
  token: "x" | "o";
}

interface SentInvitationCard extends InvitationCard {
  onPlay: () => void;
  onCancel: () => void;
}

export const SentInvitationCard = ({
  invitation: { gridSize, winningLine, status, invited, mode },
  token,
  onPlay,
  onCancel,
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
          Mode: <span>{mode}</span>
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
  onAccept: () => void;
  onDecline: () => void;
}

export const ReceivedInvitationCard = ({
  invitation: { gridSize, winningLine, inviter, mode },
  token,
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
        <p>
          Mode: <span>{mode}</span>
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
