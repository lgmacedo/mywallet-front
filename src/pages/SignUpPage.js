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
    const promise = api.post("/sign-up", signup);
    promise.then(signUpSuccess);
    promise.catch(signUpFailed);
  }

  function signUpSuccess() {
    navigate("/");
  }

  function signUpFailed(err) {
    if(err.response.status === 409){
      alert("Email já cadastrado.");
    }else if(err.response.status === 422){
      alert(err.response.data);
    }else{
      alert("Erro inesperado. Tente novamente.");
    }
  }

  return (
    <SignUpContainer>
      <MyWalletLogo />
      <form onSubmit={signup}>
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
    </SignUpContainer>
  );
}

const SignUpContainer = styled.section`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  form{
    margin-top: 30px;
  }
  a{
    margin-top: 30px;
    font-weight: 700;
  }
`;
