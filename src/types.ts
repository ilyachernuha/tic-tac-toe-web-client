interface Invitation {
  id: string;
  gameId: string;
  inviter: string;
  invited: string;
  gridSize: number;
  winningLine: number;
  inviterPlayingX: boolean;
  status: "pending" | "accepted" | "declined" | "cancelled";
}

interface Game {
  id: string;
  gridSize: number;
  playingX: boolean;
  winningLine: number;
}
