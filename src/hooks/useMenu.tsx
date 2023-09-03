import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import api from "../api";

interface useMenu {
  setGame: ({}: Game) => void;
}

export const useMenu = ({ setGame }: useMenu) => {
  const { token, onLogout } = useAuth();

  const [waitingUsers, setWaitingUsers] = useState<string[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    []
  );

  const startWaiting = async () => {
    const error = await api.startWaiting(token);
    if (error) onLogout();
  };

  const fetchWaitingUsers = async () => {
    const [error, waitingUsers] = await api.getWaitingUsers(token);
    if (error) return;
    setWaitingUsers(waitingUsers);
  };

  const fetchReceivedInvitations = async () => {
    const [error, invitations] = await api.getReceivedInvitations(token);
    if (error) return;
    setReceivedInvitations(invitations);
  };

  const fetchSentIvitations = async () => {
    const [error, invitations] = await api.getSentInvitations(token);
    if (error) return;
    // const responses = await Promise.all(
    //   invitations.map((invitation: Invitation) => {
    //     if (invitation.gameId) {
    //       return api.pollGame(invitation.gameId, token);
    //     }
    //   })
    // );
    // const cringeInvitations = invitations.map(
    //   (invitation: Invitation, index: number) => {
    //     if (responses[index]) {
    //       invitation.status = responses[index][1].state;
    //     }
    //     return invitation;
    //   }
    // );
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
    await api.sendInvitation(invitation as Invitation, token);
    fetchSentIvitations();
  };

  const handleAccept = async ({
    id,
    inviterPlayingX,
    gridSize,
    winningLine,
  }: Invitation) => {
    const [error, gameId] = await api.acceptInvitation(id, token);
    if (error) return;
    setGame({
      id: gameId,
      playingX: !inviterPlayingX,
      gridSize: gridSize,
      winningLine: winningLine,
    });
  };

  const handleDecline = async (invitationId: string) => {
    const [error] = await api.declineInvitation(invitationId, token);
    if (error) return;
    fetchReceivedInvitations();
  };

  const handleCancel = async (invitationId: string) => {
    const [error] = await api.cancelInvitation(invitationId, token);
    if (error) return;
    fetchSentIvitations();
  };

  const handlePlay = (invitation: Invitation) => {
    setGame({
      id: invitation.gameId,
      playingX: invitation.inviterPlayingX,
      gridSize: invitation.gridSize,
      winningLine: invitation.winningLine,
    });
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
      api.stopWaiting(token);
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
