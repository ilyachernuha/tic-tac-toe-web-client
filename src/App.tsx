import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createUser, loginUser } from "./api";
import { Login } from "./routes/login";
import { Register } from "./routes/register";
import { Root } from "./routes/root";

async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const [error, response] = await createUser(
    event.target.username.value,
    event.target.password.value
  );
  if (error) {
    return console.log("Error");
  }
  const [error2, response2] = await loginUser(
    event.target.username.value,
    event.target.password.value
  );
  console.log(response2);
}

async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const [error, response] = await loginUser(
    event.target.username.value,
    event.target.password.value
  );
  if (error) {
    return console.log("Error");
  }

  console.log(response);
}

const router = createBrowserRouter([
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
