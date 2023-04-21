import {
  BrowserRouter,
  Routes,
  Route,
  RedirectFunction,
} from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionsPage from "./pages/TransactionPage";
import UserContext from "./contexts/UserContext";
import TransactionEditPage from "./pages/TransactionEditPage";

export default function App() {
  window.scrollTo(0, 0);
  const [user, setUser] = useState({});

  return (
    <PagesContainer>
      <BrowserRouter>
        <UserContext.Provider value={[user, setUser]}>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/cadastro" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/nova-transacao/:tipo"
              element={<TransactionsPage />}
            />
            <Route
              path="/editar-registro/:tipo"
              element={<TransactionEditPage />}
            />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </PagesContainer>
  );
}

const PagesContainer = styled.main`
  background-color: #8c11be;
  width: calc(100vw - 50px);
  max-height: 100vh;
  padding: 25px;
`;
