import { useState } from "react";
import { createUser, loginUser } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useCookies } from "react-cookie";

const validateCredentials = (username: string, password: string) => {
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    throw new Error("Username can have only English letters and numbers");
  }

  if (!/^[!-~]+$/.test(password)) {
    throw new Error(
      "Password can have only ASCII symbols excluding whitespace"
    );
  }
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loginPushed, setLoginPushed] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "jwt_token",
    "username",
  ]);

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

    try {
      if (!username) throw new Error("Username is required");

      if (!password) throw new Error("Password is required");

      validateCredentials(username, password);

      setLoginPushed(true);

      const token = await loginUser(username, password);
      setCookie("jwt_token", token);
      setCookie("username", username);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoginPushed(false);
    }
  };

  const handleLogout = async () => {
    removeCookie("jwt_token");
    removeCookie("username");
  };

  const handleRegister = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      if (!username) throw new Error("Username is required");

      if (!password) throw new Error("Password is required");

      validateCredentials(username, password);

      const token = await createUser(username, password);
      setCookie("jwt_token", token);
      setCookie("username", username);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const value = {
    authToken: cookies.jwt_token,
    username: cookies.username,
    error: error,
    loginPushed: loginPushed,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
    onFormChange: handleFormChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
