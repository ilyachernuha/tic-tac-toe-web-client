import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createUser, loginUser } from "./api";
import { Login } from "./routes/login";
import { Register } from "./routes/register";
import { Root } from "./routes/root";

async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
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
}

async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
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

  console.log(response);
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root handleLogin={handleLogin} />,
    },
    {
      path: "/login",
      element: <Login handleLogin={handleLogin} />,
    },
    {
      path: "/register",
      element: <Register handleRegister={handleRegister} />,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
