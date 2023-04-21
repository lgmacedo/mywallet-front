import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";

export default function TransactionEditPage() {
  const [user, setUser] = useContext(UserContext);
  const { tipo } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    valor: "",
    descricao: "",
  });

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const userToken = localStorage.getItem("user");
    if (userToken === null || !id) {
      navigate("/");
    } else {
      setUser(JSON.parse(userToken));
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(userToken)}`,
        },
      };
      const promise = api.get(`/transaction/${id}`, config);
      promise.then(transactionsSuccess);
      promise.catch(transactionsFailed);
    }
  }, []);

  function transactionsSuccess(res) {
    setForm({valor: res.data.valor, descricao: res.data.titulo})
  };

  function transactionsFailed(err) {
    alert(err.response.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function updateTransaction(e) {
    e.preventDefault();
    const updatedTransaction = {
      valor: form.valor,
      descricao: form.descricao,
      tipo
    };
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };
    const promise = api.put(`/update-transaction/${id}`, updatedTransaction, config);
    promise.then(updatedTransactionSuccess);
    promise.catch(updatedTransactionFailed);
  }

  function updatedTransactionSuccess(res) {
    navigate("/home");
  }

  function updatedTransactionFailed(err) {
    alert(err.response.data);
  }

  return (
    <TransactionEditContainer>
      <h1>Editar {tipo === "entrada" ? "entrada" : "saída"}</h1>
      <form onSubmit={updateTransaction}>
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
          Atualizar {tipo === "entrada" ? "entrada" : "saída"}
        </button>
      </form>
    </TransactionEditContainer>
  );
}

const TransactionEditContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
    font-size: 26px;
    font-weight: 700;
  }
`;
