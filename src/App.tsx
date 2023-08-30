import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  getServerStatus,
  createUser,
  loginUser,
  startWaiting,
  getWaitingUsers,
} from "./api";
import Layout from "./layouts/Layout";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    interface FormDataElements extends HTMLFormControlsCollection {
      username: HTMLInputElement;
      password: HTMLInputElement;
    }

    event.preventDefault();

    const elements = event.currentTarget.elements as FormDataElements;

    const [error, response] = await loginUser(
      elements.username.value,
      elements.password.value
    );

    if (error) {
      return console.log("Error Login");
    }

    const token = response.data.token;

    setToken(token);
  };

  const handleLogout = async () => {
    setToken(null);
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(event);

    // interface FormDataElements extends HTMLFormControlsCollection {
    //   username: HTMLInputElement;
    //   password: HTMLInputElement;
    // }

    // event.preventDefault();

    // const elements = event.currentTarget.elements as FormDataElements;
    // const [error] = await createUser(
    //   elements.username.value,
    //   elements.password.value
    // );

    // if (error) {
    //   return console.log("Error Register");
    // }

    // const [error2, response2] = await loginUser(
    //   elements.username.value,
    //   elements.password.value
    // );

    // if (error2) {
    //   return console.log("Error Login");
    // }

    // console.log(response2);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

function App() {
  const [serverStatus, setServerStatus] = useState(false);

  useEffect(() => {
    getServerStatus().then((resolve) => {
      const [error, response] = resolve;
      if (error) return console.error("Error chech server status");
      if (response) setServerStatus(true);
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout serverStatus={serverStatus} />}>
            <Route index element={<Home />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const Home = () => {
  const { token } = useAuth();
  return token ? <Game /> : <LoginForm />;
};

const Game = () => {
  const { token } = useAuth();
  const [waitingUsers, setWaitingUsers] = useState([]);
  useEffect(() => {
    startWaiting(token).then();
    getWaitingUsers(token).then((resolve) => {
      setWaitingUsers(resolve[1]);
    });
  }, []);

  return (
    <div>
      <h1 className="heading-3">Players online:</h1>
      <ul>
        {waitingUsers.map((user) => (
          <li className="card">
            {user}
            <button>Invite</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LoginForm = () => {
  const { onLogin, onRegister } = useAuth();
  return (
    <div className="section container contact-form">
      <h1 className="heading-3 margin-block-end-5">Login into account</h1>
      <form className="form-group" onSubmit={onLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          required
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          required
        ></input>
        <button className="button" data-type="accent" type="submit">
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
