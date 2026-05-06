import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* Home (Protected) */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;