import { useState } from "react";
import { createUser, loginUser } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useCookies } from "react-cookie";

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loginPushed, setLoginPushed] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token"]);

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
      return setError("Username is required");
    }

    if (!password) {
      return setError("Password is required");
    }

    setLoginPushed(true);

    const [error, token] = await loginUser(username, password);

    setLoginPushed(false);

    if (error) {
      return setError(error);
    }

    setCookie("jwt_token", token);
  };

  const handleLogout = async () => {
    removeCookie("jwt_token");
  };

  const handleRegister = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!username) {
      return setError("Username is required");
    }

    if (!password) {
      return setError("Password is required");
    }

    const [error, token] = await createUser(username, password);

    if (error) {
      setError(error);
    }

    setCookie("jwt_token", token);
  };

  const value = {
    token: cookies.jwt_token,
    error: error,
    loginPushed: loginPushed,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
    onFormChange: handleFormChange,
    username: username,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
