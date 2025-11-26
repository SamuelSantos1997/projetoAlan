const BFF_BASE_URL = "http://localhost:8000/api";

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

// ==================== VALIDADORES ====================

// Validação de CPF brasileiro (algoritmo oficial)
function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPFs inválidos conhecidos)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de senha forte
function getPasswordStrength(password) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
}

function isStrongPassword(password) {
  const strength = getPasswordStrength(password);
  return Object.values(strength).every(v => v === true);
}

// Mostrar erro inline em um campo
function showFieldError(input, message) {
  const errorSpan = input.parentElement.querySelector('.field-error');
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
  input.classList.add('input-error');
}

// Limpar erro inline de um campo
function clearFieldError(input) {
  const errorSpan = input.parentElement.querySelector('.field-error');
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  }
  input.classList.remove('input-error');
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

  // Validação de CPF ao sair do campo
  cpfInput.addEventListener("blur", (e) => {
    const cpf = e.target.value.trim();
    if (cpf && !isValidCPF(cpf)) {
      showFieldError(cpfInput, "CPF inválido");
    } else {
      clearFieldError(cpfInput);
    }
  });
}

// Validação de email ao sair do campo
if (emailInput) {
  emailInput.addEventListener("blur", (e) => {
    const email = e.target.value.trim();
    if (email && !isValidEmail(email)) {
      showFieldError(emailInput, "Email inválido");
    } else {
      clearFieldError(emailInput);
    }
  });
}

// Validação de senha forte ao digitar
if (senhaInput) {
  senhaInput.addEventListener("input", (e) => {
    const senha = e.target.value;
    if (senha) {
      const strength = getPasswordStrength(senha);
      updatePasswordRequirements(strength);
    }
  });

  senhaInput.addEventListener("blur", (e) => {
    const senha = e.target.value;
    if (senha && !isStrongPassword(senha)) {
      showFieldError(senhaInput, "Senha não atende aos requisitos");
    } else {
      clearFieldError(senhaInput);
    }
  });
}

// Validação de confirmação de senha
if (senhaConfirmInput) {
  senhaConfirmInput.addEventListener("blur", (e) => {
    const senhaConfirm = e.target.value;
    const senha = senhaInput.value;
    if (senhaConfirm && senha !== senhaConfirm) {
      showFieldError(senhaConfirmInput, "As senhas não coincidem");
    } else {
      clearFieldError(senhaConfirmInput);
    }
  });
}

// Função para atualizar indicadores de requisitos de senha
function updatePasswordRequirements(strength) {
  const requirements = document.getElementById('passwordRequirements');
  if (!requirements) return;

  const items = requirements.querySelectorAll('li');
  items.forEach(item => {
    const req = item.dataset.req;
    if (strength[req]) {
      item.classList.add('valid');
      item.classList.remove('invalid');
    } else {
      item.classList.add('invalid');
      item.classList.remove('valid');
    }
  });
}

// Função de cadastro
async function cadastrar(dadosCliente) {
  const resp = await fetch(`${BFF_BASE_URL}/bff/auth/cadastro`, {
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
  const cpf = cpfInput.value.trim();

  // Validações obrigatórias
  if (!nome || !email || !senha || !senhaConfirm) {
    showError("Preencha todos os campos obrigatórios (*)");
    return;
  }

  // Validar email
  if (!isValidEmail(email)) {
    showError("Email inválido");
    showFieldError(emailInput, "Email inválido");
    return;
  }

  // Validar CPF se preenchido
  if (cpf && !isValidCPF(cpf)) {
    showError("CPF inválido");
    showFieldError(cpfInput, "CPF inválido");
    return;
  }

  // Validar senha forte
  if (!isStrongPassword(senha)) {
    showError("A senha deve ter: 8+ caracteres, maiúscula, minúscula, número e caractere especial");
    showFieldError(senhaInput, "Senha fraca");
    return;
  }

  if (senha !== senhaConfirm) {
    showError("As senhas não coincidem");
    showFieldError(senhaConfirmInput, "As senhas não coincidem");
    return;
  }

  // Montar objeto com todos os dados
  const dadosCliente = {
    username: email,
    nome: nome,
    email: email,
    senha: senha  // BFF espera 'senha', não 'password'
  };

  // Adicionar campos opcionais se preenchidos
  const telefone = telefoneInput.value.trim();
  if (telefone) {
    dadosCliente.telefone = telefone;
  }

  // cpf já foi declarado acima para validação
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
