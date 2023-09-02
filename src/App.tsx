import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  getServerStatus,
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
import Layout from "./layouts/Layout";
import { Game } from "./routes/";
import { PlayerCard } from "./components/PlayerCard";
import { InvitationCard } from "./components/InvitationCard";
import { AuthProvider } from "./providers/AuthProvider";
import { useAuth } from "./hooks/useAuth";

function App() {
  const fetchServerStatus = async () => {
    await getServerStatus();
  };

  useEffect(() => {
    fetchServerStatus();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const Home = () => {
  const { token } = useAuth();
  return token ? <Menu /> : <LoginForm />;
};

const Menu = () => {
  const { token } = useAuth();
  const [waitingUsers, setWaitingUsers] = useState<string[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    []
  );
  const [game, setGame] = useState<Game | null>(null);

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

  if (game)
    return (
      <Game
        gameId={game.id}
        gridSize={game.gridSize}
        winningLine={game.winningLine}
        sign={game.playingX ? "x" : "o"}
      />
    );

  return (
    <>
      <div className="section container">
        <h1 className="heading-3">Players Online</h1>
        {waitingUsers.length === 0 && <p>No waiting users</p>}
        <ul>
          {waitingUsers.map((username) => (
            <PlayerCard
              key={username}
              name={username}
              onInvite={handleInvite}
            />
          ))}
        </ul>
      </div>
      <div className="section container">
        <div className="section-header">
          <h1 className="heading-3">Sent Invitations</h1>
          <button
            className="button"
            data-type="primary"
            onClick={refreshSentInvitations}
          >
            Refresh
          </button>
        </div>
        {sentInvitations.length === 0 && <p>No sent invitations</p>}
        <ul>
          {sentInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              inviter={invitation.inviter}
              gridSize={invitation.gridSize}
              winningLine={invitation.winningLine}
              token={invitation.inviterPlayingX ? "x" : "o"}
              status={invitation.status}
              onPlay={() => handlePlay(invitation)}
              onCancel={() => handleCancel(invitation.id as string)}
            />
          ))}
        </ul>
      </div>
      <div className="section container">
        <h1 className="heading-3">Received Invitations</h1>
        {receivedInvitations.length === 0 && <p>No recieved invitations</p>}
        <ul>
          {receivedInvitations.map((invitation: Invitation) => (
            <li className="card margin-block-5" key={invitation.id}>
              <h2 className="card__heading">{invitation.inviter}</h2>
              <div>
                <p>Grid size: {invitation.gridSize}</p>
                <p>Winning line: {invitation.winningLine}</p>
                <p>Your symbol: {invitation.inviterPlayingX ? "O" : "X"}</p>
              </div>
              <div className="card__buttons">
                <button
                  className="button"
                  data-type="primary"
                  onClick={() => onAccept(invitation)}
                >
                  Accept
                </button>
                <button
                  className="button"
                  data-type="accent"
                  onClick={() => onDecline(invitation.id as string)}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const LoginForm = () => {
  const { onLogin, onRegister, onFormChange, error } = useAuth();
  return (
    <div className="section container login-form">
      <h1 className="heading-3 margin-block-end-5 text-center">
        Log into account
      </h1>
      <form className="form-group" onSubmit={onLogin} onChange={onFormChange}>
        <p className="form-error text-center">{error}</p>
        <input
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          minLength={2}
          maxLength={16}
          pattern="^[a-zA-Z0-9]*$"
          required
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          minLength={8}
          maxLength={32}
          pattern="^[!-~]*$"
          required
        ></input>
        <button
          className="button"
          data-type="accent"
          type="submit"
          onClick={onLogin}
        >
          Login
        </button>
        <button className="button" data-type="secondary" onClick={onRegister}>
          Create an account
        </button>
      </form>
    </div>
  );
};

export default App;
