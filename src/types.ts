type Invitation = {
  id: string;
  gameId: string;
  inviter: string;
  invited: string;
  gridSize: number;
  winningLine: number;
  inviterPlayingX: boolean;
  status: "pending" | "accepted" | "declined" | "cancelled";
  mode: Game["mode"];
};

type Game = {
  id: string;
  winningLine: number;
  opponent: string;
  grid: ("x" | "o" | "")[][];
  state: "ongoing" | "won_by_x" | "won_by_o" | "draw";
  token: "x" | "o";
  isYourTurn: boolean;
  gridSize: number;
  mode: "same" | "alternating" | "winner_plays_x" | "winner_plays_o";
};

type PollGameResponse = {
  newMove: boolean;
  state: Game["state"];
  cell?: string;
};
