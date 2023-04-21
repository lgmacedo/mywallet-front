import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";

export default function TransactionsPage() {
  const [user, setUser] = useContext(UserContext);
  const { tipo } = useParams();

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      navigate("/");
    } else {
      setUser(JSON.parse(userToken));
    }
  }, []);

  const [form, setForm] = useState({
    valor: "",
    descricao: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function newTransaction(e) {
    e.preventDefault();
    const transaction = {
      valor: form.valor,
      descricao: form.descricao,
      tipo,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };
    const promise = api.post("/new-transaction", transaction, config);
    promise.then(newTransactionSuccess);
    promise.catch(newTransactionFailed);
  }

  function newTransactionSuccess(res) {
    navigate("/home");
  }

  function newTransactionFailed(err) {
    alert(err.response.data);
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo === "entrada" ? "entrada" : "saída"}</h1>
      <form onSubmit={newTransaction}>
        <input
          required
          placeholder="Valor"
          type="text"
          name="valor"
          value={form.valor}
          onChange={(e) => handleChange(e)}
        />
        <input
          required
          placeholder="Descrição"
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit">
          Salvar {tipo === "entrada" ? "entrada" : "saída"}
        </button>
      </form>
    </TransactionsContainer>
  );
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    font-weight: 700;
    font-size: 26px;
    align-self: flex-start;
    margin-bottom: 40px;
  }
`;
