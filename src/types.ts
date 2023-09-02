interface Invitation {
  id?: string;
  gameId?: string;
  inviter: string;
  gridSize: number;
  winningLine: number;
  inviterPlayingX: boolean;
  status: "pending" | "accepted" | "declined";
}

interface Game {
  id: string;
  gridSize: number;
  playingX: boolean;
  winningLine: number;
}
