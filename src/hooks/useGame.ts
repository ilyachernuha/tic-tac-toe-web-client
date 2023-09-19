import { useEffect, useRef, useState } from "react";
import api from "../api";
import { useAuth } from ".";
import { useNavigate } from "react-router-dom";

export const useGame = (id: Game["id"]) => {
  const { authToken } = useAuth();

  const navigate = useNavigate();

  const [game, setGame] = useState<Game | undefined>(undefined);
  const [playAgain, setPlayAgain] = useState<any | undefined>(undefined);

  const gamePollingTimer = useRef<number | undefined>(undefined);
  const playAgainPollingTimer = useRef<number | undefined>(undefined);

  const getGame = async () => {
    const game = await api.getGame(id, authToken);
    setGame(game);
  };

  useEffect(() => {
    getGame();
  }, []);

  const handleClick = async (row: number, col: number) => {
    if (!game) return;
    if (game.grid[row][col]) {
      return;
    }
    if (game.isYourTurn && game.state === "ongoing") {
      try {
        const cell = String.fromCharCode(97 + row) + String(col + 1);
        const state = await api.makeMove(id, cell, authToken);
        const nextGrid = game.grid.slice();
        nextGrid[row][col] = game.token;
        setGame({
          ...game,
          state: state,
          grid: nextGrid,
          isYourTurn: false,
        });
      } catch (error) {}
    }
  };

  const pollGame = async () => {
    if (!game) return;
    try {
      const { newMove, state, cell } = await api.pollGame(id, authToken);
      if (newMove && cell) {
        const nextGrid = game.grid.slice();
        const row = cell[0].charCodeAt(0) - 97;
        const col = Number(cell.slice(1)) - 1;
        nextGrid[row][col] = game.token === "x" ? "o" : "x";
        setGame({
          ...game,
          state: state,
          grid: nextGrid,
          isYourTurn: true,
        });
      }
    } catch (error) {}
  };

  const startGamePolling = () => {
    gamePollingTimer.current = setInterval(pollGame, 2000);
  };

  const stopGamePolling = () => {
    clearInterval(gamePollingTimer.current);
  };

  const pollPlayAgain = async () => {
    try {
      const { status, gameId } = await api.pollPlayAgain(id, authToken);
      setPlayAgain({ status: status, gameId: gameId });
      if (gameId) {
        const game = await api.getGame(gameId, authToken);
        setGame(game);
        setPlayAgain(null);
      }
    } catch (error) {}
  };

  const startPlayAgainPolling = () => {
    playAgainPollingTimer.current = setInterval(pollPlayAgain, 2000);
  };

  const stopPlayAgainPolling = () => {
    clearInterval(playAgainPollingTimer.current);
  };

  useEffect(() => {
    if (!game) return;
    if (game.state === "ongoing") {
      game.isYourTurn ? stopGamePolling() : startGamePolling();
      stopPlayAgainPolling();
    } else {
      startPlayAgainPolling();
    }
    return () => {
      stopGamePolling();
      stopPlayAgainPolling();
    };
  });

  const handlePlayAgain = async () => {
    const { status, gameId } = await api.playAgain(id, true, authToken);
    setPlayAgain({ status: status, gameId: gameId });
    if (gameId) {
      const game = await api.getGame(gameId, authToken);
      setGame(game);
      setPlayAgain(null);
    }
  };

  const handleMainMenu = async () => {
    await api.playAgain(id, false, authToken);
    navigate("/menu", { replace: true });
  };

  const getPlayAgainStatus = () => {
    if (!game) return;
    const { token, opponent } = game;
    if (!playAgain) return;
    const { status } = playAgain;
    if (status === "declined") return `${opponent} doesn't want to play again`;
    if (status === "requested_by_x") {
      if (token === "x") return `you invited ${opponent} to play again`;
      if (token === "o") return `${opponent} invited you to play again`;
    }
    if (status === "requested_by_o") {
      if (token === "o") return `you invited ${opponent} to play again`;
      if (token === "x") return `${opponent} invited you to play again`;
    }
  };

  const getGameState = () => {
    if (!game) return;
    const { token, state } = game;
    if (state === "draw") return `Draw`;
    if (state === "won_by_x") {
      if (token === "x") return `You win!`;
      if (token === "o") return `You lose!`;
    }
    if (state === "won_by_o") {
      if (token === "o") return `You win!`;
      if (token === "x") return `You lose!`;
    }
  };

  const gameState = getGameState();

  const playAgainStatus = getPlayAgainStatus();

  const turn =
    game?.state === "ongoing" &&
    (game?.isYourTurn
      ? "Choose your next move"
      : "Waiting for opponent to move");

  return {
    game,
    setGame,
    handleClick,
    handlePlayAgain,
    handleMainMenu,
    playAgainStatus,
    gameState,
    turn,
  };
};
