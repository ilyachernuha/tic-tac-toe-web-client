import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import api from "../api";

interface useMenu {
  setGame: ({}: Game) => void;
}

export const useMenu = ({ setGame }: useMenu) => {
  const { authToken } = useAuth();

  const [waitingUsers, setWaitingUsers] = useState<string[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    []
  );

  const startWaiting = async () => {
    await api.startWaiting(authToken);
  };

  const fetchWaitingUsers = async () => {
    const waitingUsers = await api.getWaitingUsers(authToken);
    setWaitingUsers(waitingUsers);
  };

  const fetchReceivedInvitations = async () => {
    const invitations = await api.getReceivedInvitations(authToken);
    setReceivedInvitations(invitations);
  };

  const fetchSentIvitations = async () => {
    const invitations = await api.getSentInvitations(authToken);
    setSentInvitations(invitations);
  };

  interface FormDataElements extends HTMLFormControlsCollection {
    gridSize: HTMLInputElement;
    winningLine: HTMLInputElement;
    playingToken: HTMLSelectElement;
  }

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form.dataset.username as string;
    const elements = form.elements as FormDataElements;
    const { gridSize, winningLine, playingToken } = elements;
    const invitation = {
      invited: username,
      inviterPlayingX: playingToken.value === "x",
      gridSize: Number(gridSize.value),
      winningLine: Number(winningLine.value),
    };
    await api.sendInvitation(invitation as Invitation, authToken);
    fetchSentIvitations();
  };

  const handleAccept = async ({ id }: Invitation) => {
    const gameId = await api.acceptInvitation(id, authToken);
    const game = await api.getGame(gameId, authToken);
    setGame(game);
  };

  const handleDecline = async (invitationId: string) => {
    await api.declineInvitation(invitationId, authToken);
    fetchReceivedInvitations();
  };

  const handleCancel = async (invitationId: string) => {
    await api.cancelInvitation(invitationId, authToken);
    fetchSentIvitations();
  };

  const handlePlay = async ({ gameId }: Invitation) => {
    const game = await api.getGame(gameId, authToken);
    setGame(game);
  };

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      fetchWaitingUsers();
      fetchReceivedInvitations();
      fetchSentIvitations();
    }, 2000);
    startWaiting();
    fetchWaitingUsers();
    fetchReceivedInvitations();
    fetchSentIvitations();
    return () => {
      api.stopWaiting(authToken);
      clearInterval(pollingInterval);
    };
  }, []);

  return {
    waitingUsers,
    sentInvitations,
    receivedInvitations,
    handleInvite,
    handlePlay,
    handleCancel,
    handleAccept,
    handleDecline,
  };
};
