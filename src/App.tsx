import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getServerStatus } from "./api";
import { Layout } from "./layouts";
import { AuthProvider } from "./hooks";
import { Game, ProtectedRoute, Menu, Login, PageNotFound } from "./routes";

function App() {
  const fetchServerStatus = async () => {
    await getServerStatus();
  };

  useEffect(() => {
    fetchServerStatus();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              }
            />
            <Route
              path="game/:id"
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
