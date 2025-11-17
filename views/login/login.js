const BFF_CLIENTES_BASE = "http://localhost:8080";

const $ = (sel) => document.querySelector(sel);

const form = $("#loginForm");
const emailInput = $("#email");
const senhaInput = $("#senha");
const btnLogin = $("#btnLogin");
const errorMessage = $("#errorMessage");

// Função para mostrar erro
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

// Função para esconder erro
function hideError() {
  errorMessage.hidden = true;
  errorMessage.textContent = "";
}

// Função de login
async function login(email, senha) {
  const resp = await fetch(`${BFF_CLIENTES_BASE}/bff/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,  // Usando email como username
      password: senha
    })
  });

  const json = await resp.json();

  if (!json.success) {
    throw new Error(json.message || "Erro ao fazer login");
  }

  return json.data;
}

// Submit do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    showError("Preencha todos os campos");
    return;
  }

  try {
    btnLogin.disabled = true;
    btnLogin.textContent = "Entrando...";

    const userData = await login(email, senha);

    // Salvar dados do usuário no localStorage
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userName", userData.nome);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("isLoggedIn", "true");

    // Redirecionar para a home/perfil
    window.location.href = "/views/perfil/index.html";

  } catch (err) {
    console.error("Erro ao fazer login:", err);
    showError(err.message);
    btnLogin.textContent = "Entrar";
    btnLogin.disabled = false;
  }
});

// Verificar se já está logado
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "/views/perfil/index.html";
  }
});
