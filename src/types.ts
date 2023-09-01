interface Invitation {
  id?: string;
  status?: string;
  gameId?: string;
  inviter: string;
  gridSize: number;
  winningLine: number;
  inviterPlayingX: boolean;
}

interface Game {
  id: string;
  gridSize: number;
  playingX: boolean;
}
