import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import axios from "axios";
import { useState } from "react";

export default function SignUpPage() {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function signup(e) {
    e.preventDefault();
    if (form.senha !== form.confirmaSenha) {
      alert("Senhas inseridas não conferem");
      return;
    }
    const signup = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
    };
    const promise = api.post("/users", signup);
    promise.then(signUpSuccess);
    promise.catch(signUpFailed);
  }

  function signUpSuccess() {
    navigate("/");
  }

  function signUpFailed(err) {
    console.log(err);
    if(err.response.status === 409){
      alert("Email já cadastrado.");
    }else if(err.response.status === 422){
      alert("Confira seus dados. Todos os campos são obrigatórios, o email deve ter formato válido e a senha deve ter no mínimo 3 caracteres.");
    }else{
      alert("Erro inesperado. Tente novamente.");
    }
  }

  return (
    <SingUpContainer>
      <form onSubmit={signup}>
        <MyWalletLogo />
        <input
          required
          name="nome"
          value={form.nome}
          onChange={(e) => handleChange(e)}
          placeholder="Nome"
          type="text"
        />
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => handleChange(e)}
          placeholder="E-mail"
        />
        <input
          placeholder="Senha"
          type="password"
          required
          name="senha"
          value={form.senha}
          onChange={(e) => handleChange(e)}
        />
        <input
          placeholder="Confirme a senha"
          type="password"
          required
          name="confirmaSenha"
          value={form.confirmaSenha}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit">Cadastrar</button>
      </form>

      <Link to="/">Já tem uma conta? Entre agora!</Link>
    </SingUpContainer>
  );
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
