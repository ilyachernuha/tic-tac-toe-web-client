import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  getServerStatus,
  createUser,
  loginUser,
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

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [token, setToken] = useState(null);

  const handleFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    interface FormDataElements extends HTMLFormControlsCollection {
      username: HTMLInputElement;
      password: HTMLInputElement;
    }

    const elements = event.currentTarget.elements as FormDataElements;

    setUsername(elements.username.value);
    setPassword(elements.password.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username) {
      return console.error("Username is required!");
    }

    if (!password) {
      return console.error("Password is required!");
    }

    const [error, token] = await loginUser(username, password);

    if (error) {
      return console.error("Error Login");
    }

    setToken(token);
  };

  const handleLogout = async () => {
    setToken(null);
  };

  const handleRegister = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!username) {
      return console.error("Username is required!");
    }

    if (!password) {
      return console.error("Password is required!");
    }

    const [error, token] = await createUser(username, password);

    if (error) {
      return console.error("Error Register");
    }

    setToken(token);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
    onFormChange: handleFormChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

function App() {
  const [serverStatus, setServerStatus] = useState(false);

  const fetchServerStatus = async () => {
    const status = await getServerStatus();
    setServerStatus(status);
  };

  useEffect(() => {
    fetchServerStatus();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                serverStatus={serverStatus}
                onClickServerStatus={fetchServerStatus}
              />
            }
          >
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

  const onInvite = async (event: React.FormEvent<HTMLFormElement>) => {
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
    const [error, invitationId] = await sendInvitation(invitation, token);
    if (error) {
      return console.error("Error sending invitation");
    }
    setSentInvitations([
      ...sentInvitations,
      { ...invitation, id: invitationId },
    ]);
  };

  const onAccept = async ({ id, inviterPlayingX, gridSize }: Invitation) => {
    const [error, gameId] = await acceptInvitation(id as string, token);
    if (error) {
      return console.error("Error accepting invitation");
    }
    setGame({
      id: gameId,
      playingX: !inviterPlayingX,
      gridSize: gridSize,
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

  const onCancel = async (invitationId: string) => {
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
      const [error, data] = await pollInvitationStatus(invitation.id, token);
      if (error) {
        return invitation;
      }
      const { status, gameId } = data;
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
        sign={game.playingX ? "x" : "o"}
        token={token}
      />
    );

  return (
    <>
      <div className="section container">
        <h1 className="heading-3">Players Online</h1>
        {waitingUsers.length === 0 && <p>No waiting users</p>}
        <ul>
          {waitingUsers.map((username) => (
            <li className="card margin-block-5" key={username}>
              <h2 className="heading-3 margin-block-end-5">{username}</h2>
              <form data-username={username} onSubmit={onInvite}>
                <div className="card-inputs">
                  <label htmlFor="gridSize">
                    Grid size:
                    <input
                      name="gridSize"
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
                      type="number"
                      min="3"
                      max="15"
                      defaultValue="3"
                      required
                    />
                  </label>
                  <label htmlFor="playingToken">
                    Token:
                    <select name="playingToken" defaultValue="x" required>
                      <option value="x">X</option>
                      <option value="o">O</option>
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
            <li className="card margin-block-5" key={invitation.id}>
              <h2 className="card__heading">{invitation.inviter}</h2>
              <div>
                <p>Grid size: {invitation.gridSize}</p>
                <p>Winning line: {invitation.winningLine}</p>
                <p>Your symbol: {invitation.inviterPlayingX ? "X" : "O"}</p>
                <p>Status: {invitation.status}</p>
              </div>
              <div>
                {invitation.status === "pending" && (
                  <button
                    className="button"
                    data-type="accent"
                    onClick={() => onCancel(invitation.id as string)}
                  >
                    Cancel
                  </button>
                )}
                {invitation.status === "accepted" && (
                  <button
                    className="button"
                    data-type="primary"
                    onClick={() => handlePlay(invitation)}
                  >
                    Play
                  </button>
                )}
              </div>
            </li>
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
  const { onLogin, onRegister, onFormChange } = useAuth();
  return (
    <div className="section container login-form">
      <h1 className="heading-3 margin-block-end-5">Login into account</h1>
      <form className="form-group" onSubmit={onLogin} onChange={onFormChange}>
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
        <a className="button" onClick={onRegister}>
          Create an account
        </a>
      </form>
    </div>
  );
};

export default App;
