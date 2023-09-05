import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getServerStatus } from "./api";
import Layout from "./layouts/Layout";
import { Game } from "./routes/";
import { AuthProvider } from "./providers/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./routes/login";
import { Menu } from "./routes/menu";

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
  const [game, setGame] = useState<Game | null>(null);

  if (game) return <Game game={game} setGame={setGame} />;

  const { authToken } = useAuth();

  if (authToken) return <Menu setGame={setGame} />;

  return <LoginForm />;
};

export default App;
