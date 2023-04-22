import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";

export default function HomePage() {
  const [user, setUser] = useContext(UserContext);

  const [name, setName] = useState("");
  const [transactions, setTransactions] = useState([]);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      navigate("/");
    } else {
      setUser(JSON.parse(userToken));
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(userToken)}`,
        },
      };
      const promise = api.get("/transactions", config);
      promise.then(transactionsSuccess);
      promise.catch(transactionsFailed);
    }
  }, []);

  function transactionsSuccess(res) {
    const { nome, transactions } = res.data;
    setName(nome);
    setTransactions(transactions.reverse());
  }

  function transactionsFailed(err) {
    alert("Erro inesperado. Tente novamente.");
  }

  function logout() {
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };
    const promise = api.delete("/logout", config);
    promise.then(lougoutSuccess);
    promise.catch(logoutFailed);
  }

  function lougoutSuccess(res) {
    localStorage.clear();
    navigate("/");
  }

  function logoutFailed(err) {
    alert("Erro inesperado. Tente novamente.");
  }

  function sumValores(objetos, filtro) {
    return objetos.reduce(
      (total, objeto) => (filtro(objeto) ? total + objeto.valor : total),
      0
    );
  }
  const saldo =
    sumValores(transactions, (t) => t.tipo === "entrada") -
    sumValores(transactions, (t) => t.tipo === "saida");

  function editarRegistro(id, tipo) {
    navigate(`/editar-registro/${tipo}?id=${id}`);
  }

  function apagarRegistro(id) {
    if (window.confirm("Confirme a deleção da transação")) {
      const config = {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      };
      const promise = api.delete(`/delete-transaction/${id}`, config);
      promise.then(window.location.reload());
      promise.catch((err) => alert(err.response.data));
    }
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {name}</h1>
        <BiExit onClick={logout} />
      </Header>

      <TransactionsContainer show={transactions.length !== 0}>
        <ul>
          {transactions.map((t) => (
            <ListItemContainer key={t._id}>
              <div>
                <span>{t.data}</span>
                <strong onClick={() => editarRegistro(t._id, t.tipo)}>
                  {t.titulo}
                </strong>
              </div>
              <Value color={t.tipo}>
                {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Value>
              <DeleteIcon onClick={() => apagarRegistro(t._id)}>x</DeleteIcon>
            </ListItemContainer>
          ))}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value color={saldo >= 0 ? "positivo" : "negativo"}>
            {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Value>
        </article>
      </TransactionsContainer>
      <EmptyTransactionsContainer show={transactions.length === 0}>
        <p>Não há registros de entrada ou saída</p>
      </EmptyTransactionsContainer>

      <ButtonsContainer>
        <button>
          <Link to="/nova-transacao/entrada">
            <AiOutlinePlusCircle />
            <p>
              Nova <br /> entrada
            </p>
          </Link>
        </button>
        <button>
          <Link to="/nova-transacao/saida">
            <AiOutlineMinusCircle />
            <p>
              Nova <br />
              saída
            </p>
          </Link>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
  h1 {
    font-weight: 700;
    font-size: 26px;
  }
  svg {
    cursor: pointer;
  }
`;
const TransactionsContainer = styled.article`
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px 16px 0px 16px;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  max-height: 446px;
  overflow-y: scroll;
  article {
    display: flex;
    margin-top: 16px;
    justify-content: space-between;
    align-items: flex-end;
    position: sticky;
    bottom: 0px;
    background-color: white;
    min-height: 32px;
    padding-bottom: 16px;
    box-shadow: 0 -10px 1px -10px rgba(0, 0, 0, 0.5);
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
    ul {
      position: relative;
    }
  }
`;
const EmptyTransactionsContainer = styled.article`
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-grow: 1;
  background-color: #fff;
  color: #868686;
  border-radius: 5px;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 20px;
    font-weight: 400;
    line-height: 23px;
    max-width: 180px;
    text-align: center;
  }
`;
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) =>
    props.color === "entrada" || props.color === "positivo" ? "green" : "red"};
`;

const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 13px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
  strong {
    cursor: pointer;
  }
`;

const DeleteIcon = styled.p`
  position: absolute;
  right: 10px;
  color: #c6c6c6;
  font-weight: 400;
  line-height: 18.78px;
  cursor: pointer;
`;
