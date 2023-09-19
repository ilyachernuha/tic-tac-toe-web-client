interface PlayerCard {
  name: string;
  onInvite: React.FormEventHandler<HTMLFormElement>;
}

export const PlayerCard = ({ name, onInvite }: PlayerCard) => {
  return (
    <li className="card margin-block-5">
      <h2 className="card__heading">{name}</h2>
      <form data-username={name} onSubmit={onInvite}>
        <div className="card-inputs">
          <label htmlFor="gridSize">
            Grid size:
            <input
              name="gridSize"
              id="gridSize"
              type="number"
              min="3"
              max="15"
              defaultValue="3"
              required
            />
          </label>
          <label htmlFor="winningLine">
            Winning line:
            <input
              name="winningLine"
              id="winningLine"
              type="number"
              min="3"
              max="15"
              defaultValue="3"
              required
            />
          </label>
          <label htmlFor="playingToken">
            Your token:
            <select
              name="playingToken"
              id="playingToken"
              defaultValue="x"
              required
            >
              <option value="x">X</option>
              <option value="o">O</option>
            </select>
          </label>
          <label htmlFor="gameMode">
            Mode:
            <select name="gameMode" id="gameMode" defaultValue="same" required>
              <option value="same">same</option>
              <option value="alternating">alternating</option>
              <option value="winner_plays_x">winner_plays_x</option>
              <option value="winner_plays_o">winner_plays_o</option>
            </select>
          </label>
        </div>
        <div>
          <button className="button" type="submit" data-type="primary">
            Invite
          </button>
        </div>
      </form>
    </li>
  );
};
