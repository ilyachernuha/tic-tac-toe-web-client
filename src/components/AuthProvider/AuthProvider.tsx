import { createContext, useState } from "react";
import { createUser, loginUser } from "../../api";

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
    setToken(response.data.token);
  };

  const handleLogout = async () => {
    setToken(null);
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    interface FormDataElements extends HTMLFormControlsCollection {
      username: HTMLInputElement;
      password: HTMLInputElement;
    }

    event.preventDefault();

    const elements = event.currentTarget.elements as FormDataElements;
    const [error] = await createUser(
      elements.username.value,
      elements.password.value
    );

    if (error) {
      return console.log("Error Register");
    }

    const [error2, response2] = await loginUser(
      elements.username.value,
      elements.password.value
    );

    if (error2) {
      return console.log("Error Login");
    }

    console.log(response2);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
