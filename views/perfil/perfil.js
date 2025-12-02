// URL vem do config.js (importado no HTML)

// Obter token e ID do usuário logado
function getLoggedUserData() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn || !userId || !token) {
    // Redirecionar para login se não estiver logado
    window.location.href = "/views/login/index.html";
    return null;
  }

  return {
    userId: parseInt(userId),
    token: token
  };
}

const userData = getLoggedUserData();
const CLIENTE_ID = userData ? userData.userId : null;
const AUTH_TOKEN = userData ? userData.token : null;

const $ = (sel) => document.querySelector(sel);

const form = $("#perfilForm");
const avatarInput = $("#avatarInput");
const avatarPreview = $("#avatarPreview");
const removerFoto = $("#removerFoto");
const premiumBadge = $("#premiumBadge");
const premiumAteText = $("#premiumAteText");
const premiumLink = $("#premiumLink");
const telefoneEl = $("#telefone");
const cpfEl = $("#cpf");
const statusCarregando = $("#statusCarregando");
const btnSalvar = $("#btnSalvar");

// format helpers
function formatPhone(value){
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10){
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}
function formatCPF(value){
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}
telefoneEl.addEventListener("input", (e) => {
  e.target.value = formatPhone(e.target.value);
});
cpfEl.addEventListener("input", (e) => {
  e.target.value = formatCPF(e.target.value);
  validateCPFField();
});

// ============ VALIDAÇÕES ============

// Validação de CPF brasileiro (algoritmo oficial)
function isValidCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // CPF deve ter 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
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
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Validação de senha forte
function getPasswordStrength(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
}

function isStrongPassword(password) {
  const strength = getPasswordStrength(password);
  return Object.values(strength).every(v => v === true);
}

// Atualizar indicadores visuais dos requisitos de senha
function updatePasswordRequirements(password) {
  const strength = getPasswordStrength(password);

  const reqLength = document.getElementById("req-length");
  const reqUpper = document.getElementById("req-upper");
  const reqLower = document.getElementById("req-lower");
  const reqNumber = document.getElementById("req-number");
  const reqSpecial = document.getElementById("req-special");

  if (reqLength) {
    reqLength.className = password.length > 0 ? (strength.length ? "requirement valid" : "requirement invalid") : "requirement";
  }
  if (reqUpper) {
    reqUpper.className = password.length > 0 ? (strength.upper ? "requirement valid" : "requirement invalid") : "requirement";
  }
  if (reqLower) {
    reqLower.className = password.length > 0 ? (strength.lower ? "requirement valid" : "requirement invalid") : "requirement";
  }
  if (reqNumber) {
    reqNumber.className = password.length > 0 ? (strength.number ? "requirement valid" : "requirement invalid") : "requirement";
  }
  if (reqSpecial) {
    reqSpecial.className = password.length > 0 ? (strength.special ? "requirement valid" : "requirement invalid") : "requirement";
  }
}

// Validar campo CPF
function validateCPFField() {
  const cpfError = document.getElementById("cpfError");
  const cpfValue = cpfEl.value;

  if (!cpfValue || cpfValue.replace(/\D/g, '').length === 0) {
    cpfEl.classList.remove("input-error", "input-valid");
    if (cpfError) cpfError.textContent = "";
    return true; // CPF é opcional
  }

  if (cpfValue.replace(/\D/g, '').length < 11) {
    cpfEl.classList.remove("input-valid");
    cpfEl.classList.add("input-error");
    if (cpfError) cpfError.textContent = "CPF incompleto";
    return false;
  }

  if (!isValidCPF(cpfValue)) {
    cpfEl.classList.remove("input-valid");
    cpfEl.classList.add("input-error");
    if (cpfError) cpfError.textContent = "CPF inválido";
    return false;
  }

  cpfEl.classList.remove("input-error");
  cpfEl.classList.add("input-valid");
  if (cpfError) cpfError.textContent = "";
  return true;
}

// Validar campo Email
function validateEmailField() {
  const emailEl = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const emailValue = emailEl.value;

  if (!emailValue) {
    emailEl.classList.remove("input-error", "input-valid");
    if (emailError) emailError.textContent = "Email é obrigatório";
    return false;
  }

  if (!isValidEmail(emailValue)) {
    emailEl.classList.remove("input-valid");
    emailEl.classList.add("input-error");
    if (emailError) emailError.textContent = "Email inválido";
    return false;
  }

  emailEl.classList.remove("input-error");
  emailEl.classList.add("input-valid");
  if (emailError) emailError.textContent = "";
  return true;
}

// Adicionar validação no blur do email
const emailEl = document.getElementById("email");
if (emailEl) {
  emailEl.addEventListener("blur", validateEmailField);
  emailEl.addEventListener("input", () => {
    // Limpar erro enquanto digita
    const emailError = document.getElementById("emailError");
    if (emailError) emailError.textContent = "";
    emailEl.classList.remove("input-error");
  });
}

// Validar perfil antes de salvar
function validatePerfilForm() {
  let isValid = true;

  if (!validateEmailField()) {
    isValid = false;
  }

  if (!validateCPFField()) {
    isValid = false;
  }

  return isValid;
}

// Atualizar visualização do status premium
function updatePremiumDisplay(isPremium, premiumAte) {
  if (isPremium) {
    premiumBadge.textContent = "Premium";
    premiumBadge.className = "premium-badge-active";
    premiumLink.textContent = "Ver meu plano";

    if (premiumAte) {
      const dataExp = new Date(premiumAte);
      premiumAteText.textContent = `até ${dataExp.toLocaleDateString("pt-BR")}`;
    } else {
      premiumAteText.textContent = "";
    }
  } else {
    premiumBadge.textContent = "Grátis";
    premiumBadge.className = "premium-badge-inactive";
    premiumAteText.textContent = "";
    premiumLink.textContent = "Assinar Premium";
  }
}

// avatar preview
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if(!file) return;
  if(file.size > 5 * 1024 * 1024){
    alert("Arquivo muito grande. Máximo 5MB.");
    avatarInput.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreview.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});
removerFoto.addEventListener("click", () => {
  avatarPreview.src = "./img/avatar-placeholder.svg";
  avatarInput.value = "";
});

// Buscar dados do usuário autenticado via /api/bff/auth/me
async function fetchCliente(){
  const resp = await fetch(`${BFF_BASE_URL}/bff/auth/me`, {
    headers: {
      "Authorization": `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  const json = await resp.json();
  if (!json.success){
    throw new Error(json.message || "Erro ao carregar perfil");
  }
  return json.data;
}

async function updateCliente(id, payload){
  const resp = await fetch(`${BFF_BASE_URL}/bff/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const json = await resp.json();

  if (!json.success){
    throw new Error(json.message || "Erro ao salvar perfil");
  }
  return json.data;
}

// preencher form
function fillForm(cliente){
  $("#nomeCompleto").value    = cliente.nome || "";
  $("#email").value           = cliente.email || "";
  $("#telefone").value        = cliente.telefone || "";
  $("#cpf").value             = cliente.cpf || "";
  $("#endereco").value        = cliente.endereco || "";
  $("#dataNascimento").value  = cliente.dataNascimento || "";

  if (cliente.avatarDataUrl){
    avatarPreview.src = cliente.avatarDataUrl;
  } else {
    avatarPreview.src = "./img/avatar-placeholder.svg";
  }

  // Atualizar visualização do status premium (somente leitura)
  updatePremiumDisplay(!!cliente.premium, cliente.premiumAte);
}

// carregar inicial
async function loadPerfil(){
  try {
    statusCarregando.textContent = "Carregando perfil...";
    const cli = await fetchCliente();
    fillForm(cli);
    statusCarregando.textContent = "Perfil carregado ✔";
  } catch (err){
    console.error(err);
    statusCarregando.textContent = "Erro ao carregar perfil";
    statusCarregando.style.color = "red";
  }
}

// submit -> PUT no BFF (que PUT no Core)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar campos antes de enviar
  if (!validatePerfilForm()) {
    alert("Por favor, corrija os erros antes de salvar");
    return;
  }

  // Monta payload do perfil (apenas campos que o usuário pode editar)
  // NOTA: premium e premiumAte são gerenciados pelo sistema/admin, não pelo usuário
  const payload = {
    nome: $("#nomeCompleto").value,
    telefone: $("#telefone").value,
    cpf: $("#cpf").value,
    endereco: $("#endereco").value,
    dataNascimento: $("#dataNascimento").value || null,
    avatarDataUrl: (
      avatarPreview.src && !avatarPreview.src.endsWith("avatar-placeholder.svg")
        ? avatarPreview.src
        : null
    )
  };

  try {
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    const atualizado = await updateCliente(CLIENTE_ID, payload);

    // opcional: reflete na tela o que veio do back pós-salvar
    fillForm(atualizado);

    btnSalvar.textContent = "Salvo!";
    setTimeout(() => {
      btnSalvar.textContent = "Salvar alterações";
      btnSalvar.disabled = false;
    }, 1200);

  } catch (err){
    console.error("Erro ao salvar:", err);
    alert("Falha ao salvar perfil: " + err.message);
    btnSalvar.textContent = "Salvar alterações";
    btnSalvar.disabled = false;
  }
});

// cancelar -> recarrega dados do servidor
$("#btnReset").addEventListener("click", () => {
  loadPerfil();
});

// logout
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userToken");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/views/login/index.html";
}

// Se houver botão de logout, adicionar evento
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", logout);
}

// ============ ALTERAR SENHA ============

const senhaForm = document.getElementById("senhaForm");
const novaSenhaEl = document.getElementById("novaSenha");
const confirmarSenhaEl = document.getElementById("confirmarSenha");
const btnAlterarSenha = document.getElementById("btnAlterarSenha");

// Toggle de visibilidade das senhas
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const eyeOpen = btn.querySelector(".eye-open");
    const eyeClosed = btn.querySelector(".eye-closed");

    if (input.type === "password") {
      input.type = "text";
      eyeOpen.style.display = "none";
      eyeClosed.style.display = "block";
    } else {
      input.type = "password";
      eyeOpen.style.display = "block";
      eyeClosed.style.display = "none";
    }
  });
});

// Atualizar requisitos enquanto digita a nova senha
if (novaSenhaEl) {
  novaSenhaEl.addEventListener("input", (e) => {
    updatePasswordRequirements(e.target.value);

    // Validar confirmação se já tiver valor
    if (confirmarSenhaEl && confirmarSenhaEl.value) {
      validateConfirmPassword();
    }
  });
}

// Validar confirmação de senha
function validateConfirmPassword() {
  const novaSenhaError = document.getElementById("novaSenhaError");
  const confirmarSenhaError = document.getElementById("confirmarSenhaError");

  let isValid = true;

  // Validar senha forte
  if (novaSenhaEl && novaSenhaEl.value) {
    if (!isStrongPassword(novaSenhaEl.value)) {
      novaSenhaEl.classList.add("input-error");
      novaSenhaEl.classList.remove("input-valid");
      if (novaSenhaError) novaSenhaError.textContent = "A senha não atende aos requisitos";
      isValid = false;
    } else {
      novaSenhaEl.classList.remove("input-error");
      novaSenhaEl.classList.add("input-valid");
      if (novaSenhaError) novaSenhaError.textContent = "";
    }
  }

  // Validar se as senhas conferem
  if (confirmarSenhaEl && confirmarSenhaEl.value) {
    if (confirmarSenhaEl.value !== novaSenhaEl.value) {
      confirmarSenhaEl.classList.add("input-error");
      confirmarSenhaEl.classList.remove("input-valid");
      if (confirmarSenhaError) confirmarSenhaError.textContent = "As senhas não conferem";
      isValid = false;
    } else {
      confirmarSenhaEl.classList.remove("input-error");
      confirmarSenhaEl.classList.add("input-valid");
      if (confirmarSenhaError) confirmarSenhaError.textContent = "";
    }
  }

  return isValid;
}

if (confirmarSenhaEl) {
  confirmarSenhaEl.addEventListener("input", validateConfirmPassword);
  confirmarSenhaEl.addEventListener("blur", validateConfirmPassword);
}

// Função para alterar senha via API
async function alterarSenha(senhaAtual, novaSenha) {
  const resp = await fetch(`${BFF_BASE_URL}/bff/clientes/${CLIENTE_ID}/senha`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      senhaAtual: senhaAtual,
      novaSenha: novaSenha
    })
  });

  const json = await resp.json();

  if (!resp.ok || !json.success) {
    throw new Error(json.message || "Erro ao alterar senha");
  }

  return json;
}

// Submit do formulário de senha
if (senhaForm) {
  senhaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senhaAtualEl = document.getElementById("senhaAtual");
    const senhaAtual = senhaAtualEl.value;
    const novaSenha = novaSenhaEl.value;
    const confirmarSenha = confirmarSenhaEl.value;

    // Validar campos
    if (!senhaAtual) {
      alert("Digite sua senha atual");
      senhaAtualEl.focus();
      return;
    }

    if (!novaSenha) {
      alert("Digite a nova senha");
      novaSenhaEl.focus();
      return;
    }

    if (!isStrongPassword(novaSenha)) {
      alert("A nova senha não atende aos requisitos de segurança");
      novaSenhaEl.focus();
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não conferem");
      confirmarSenhaEl.focus();
      return;
    }

    try {
      btnAlterarSenha.disabled = true;
      btnAlterarSenha.textContent = "Alterando...";

      await alterarSenha(senhaAtual, novaSenha);

      // Limpar campos
      senhaAtualEl.value = "";
      novaSenhaEl.value = "";
      confirmarSenhaEl.value = "";

      // Resetar indicadores
      updatePasswordRequirements("");
      novaSenhaEl.classList.remove("input-valid", "input-error");
      confirmarSenhaEl.classList.remove("input-valid", "input-error");

      btnAlterarSenha.textContent = "Senha alterada!";
      setTimeout(() => {
        btnAlterarSenha.textContent = "Alterar senha";
        btnAlterarSenha.disabled = false;
      }, 2000);

    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      alert("Falha ao alterar senha: " + err.message);
      btnAlterarSenha.textContent = "Alterar senha";
      btnAlterarSenha.disabled = false;
    }
  });
}

// init
document.addEventListener("DOMContentLoaded", () => {
  loadPerfil();
});
