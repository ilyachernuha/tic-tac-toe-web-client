import React, { useEffect, useState } from "react";
import {
  startWaiting,
  getWaitingUsers,
  stopWaiting,
  sendInvitation,
  getReceivedInvitations,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
  pollInvitationStatus,
} from "./api";
import { Game } from "./routes/";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./routes/login";

export const Home = () => {
  const [game, setGame] = useState<Game | null>(null);

  if (game)
    return (
      <Game
        gameId={game.id}
        gridSize={game.gridSize}
        winningLine={game.winningLine}
        sign={game.playingX ? "x" : "o"}
      />
    );

  const { token } = useAuth();
  const [waitingUsers, setWaitingUsers] = useState<string[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    []
  );

  const fetchWaitingUsers = async () => {
    const [error, waitingUsers] = await getWaitingUsers(token);
    if (error) {
      console.error(error);
    }
    setWaitingUsers(waitingUsers);
  };

  const fetchInvitations = async () => {
    const [error, invitations] = await getReceivedInvitations(token);
    if (error) {
      console.error(error);
    }
    setReceivedInvitations(invitations);
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
      inviter: username,
      inviterPlayingX: playingToken.value === "x",
      gridSize: Number(gridSize.value),
      winningLine: Number(winningLine.value),
      status: "pending",
    };
    const [error, invitationId] = await sendInvitation(
      invitation as Invitation,
      token
    );
    if (error) {
      return console.error("Error sending invitation");
    }
    setSentInvitations([
      ...sentInvitations,
      { ...(invitation as Invitation), id: invitationId },
    ]);
  };

  const onAccept = async ({
    id,
    inviterPlayingX,
    gridSize,
    winningLine,
  }: Invitation) => {
    const [error, gameId] = await acceptInvitation(id as string, token);
    if (error) {
      return console.error("Error accepting invitation");
    }
    setGame({
      id: gameId,
      playingX: !inviterPlayingX,
      gridSize: gridSize,
      winningLine: winningLine,
    });
  };

  const onDecline = async (invitationId: string) => {
    const [error] = await declineInvitation(invitationId, token);
    if (error) {
      return console.error("Error declining invitation");
    }
    setReceivedInvitations([
      ...receivedInvitations.filter(({ id }) => id !== invitationId),
    ]);
  };

  const handleCancel = async (invitationId: string) => {
    const [error] = await cancelInvitation(invitationId, token);
    if (error) {
      return console.error("Error canceling invitation");
    }
    setSentInvitations([
      ...sentInvitations.filter(({ id }) => id !== invitationId),
    ]);
  };

  const refreshSentInvitations = async () => {
    const nextSentInvitations = sentInvitations.slice();
    nextSentInvitations.map(async (invitation) => {
      const [error, data] = await pollInvitationStatus(
        invitation.id as string,
        token
      );
      if (error) {
        return invitation;
      }
      const { status, gameId } = data as any;
      invitation.status = status;
      invitation.gameId = gameId;
      return invitation;
    });
    setSentInvitations(nextSentInvitations);
  };

  const handlePlay = (invitation: Invitation) => {
    setGame({
      id: invitation.gameId as any,
      playingX: invitation.inviterPlayingX,
      gridSize: invitation.gridSize,
      winningLine: invitation.winningLine,
    });
  };

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      fetchWaitingUsers();
      fetchInvitations();
    }, 1000);
    startWaiting(token).then();
    fetchWaitingUsers();
    fetchInvitations();
    return () => {
      stopWaiting(token).then();
      clearInterval(pollingInterval);
    };
  }, []);

  if (token) return <Menu setGame={setGame} />;
  return <LoginForm />;
};
