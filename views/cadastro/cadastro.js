const BFF_CLIENTES_BASE = "http://localhost:8080";

const $ = (sel) => document.querySelector(sel);

const form = $("#cadastroForm");
const nomeInput = $("#nome");
const emailInput = $("#email");
const telefoneInput = $("#telefone");
const cpfInput = $("#cpf");
const dataNascimentoInput = $("#dataNascimento");
const enderecoInput = $("#endereco");
const senhaInput = $("#senha");
const senhaConfirmInput = $("#senhaConfirm");
const btnCadastro = $("#btnCadastro");
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

// Formatadores
function formatPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

// Aplicar máscaras
if (telefoneInput) {
  telefoneInput.addEventListener("input", (e) => {
    e.target.value = formatPhone(e.target.value);
  });
}

if (cpfInput) {
  cpfInput.addEventListener("input", (e) => {
    e.target.value = formatCPF(e.target.value);
  });
}

// Função de cadastro
async function cadastrar(dadosCliente) {
  const resp = await fetch(`${BFF_CLIENTES_BASE}/bff/auth/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosCliente)
  });

  const json = await resp.json();

  if (!json.success) {
    throw new Error(json.message || "Erro ao fazer cadastro");
  }

  return json.data;
}

// Submit do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value;
  const senhaConfirm = senhaConfirmInput.value;

  // Validações obrigatórias
  if (!nome || !email || !senha || !senhaConfirm) {
    showError("Preencha todos os campos obrigatórios (*)");
    return;
  }

  if (senha.length < 6) {
    showError("A senha deve ter no mínimo 6 caracteres");
    return;
  }

  if (senha !== senhaConfirm) {
    showError("As senhas não coincidem");
    return;
  }

  // Montar objeto com todos os dados
  const dadosCliente = {
    username: email,
    nome: nome,
    email: email,
    password: senha
  };

  // Adicionar campos opcionais se preenchidos
  const telefone = telefoneInput.value.trim();
  if (telefone) {
    dadosCliente.telefone = telefone;
  }

  const cpf = cpfInput.value.trim();
  if (cpf) {
    dadosCliente.cpf = cpf;
  }

  const endereco = enderecoInput.value.trim();
  if (endereco) {
    dadosCliente.endereco = endereco;
  }

  const dataNascimento = dataNascimentoInput.value;
  if (dataNascimento) {
    dadosCliente.dataNascimento = dataNascimento;
  }

  try {
    btnCadastro.disabled = true;
    btnCadastro.textContent = "Criando conta...";

    const userData = await cadastrar(dadosCliente);

    // Salvar dados do usuário no localStorage
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userName", userData.nome);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("isLoggedIn", "true");

    // Redirecionar para o perfil
    window.location.href = "/views/perfil/index.html";

  } catch (err) {
    console.error("Erro ao fazer cadastro:", err);
    showError(err.message);
    btnCadastro.textContent = "Criar conta";
    btnCadastro.disabled = false;
  }
});

// Verificar se já está logado
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "/views/perfil/index.html";
  }
});
