const CLIENTE_ID = 1;
const BFF_CLIENTES_BASE = "http://localhost:8090";

const $ = (sel) => document.querySelector(sel);

const form = $("#perfilForm");
const avatarInput = $("#avatarInput");
const avatarPreview = $("#avatarPreview");
const removerFoto = $("#removerFoto");
const isPremium = $("#isPremium");
const premiumAteWrapper = $("#premiumAteWrapper");
const premiumAte = $("#premiumAte");
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
});

// premium toggle
function togglePremiumDate(){
  premiumAteWrapper.hidden = !isPremium.checked;
}
isPremium.addEventListener("change", togglePremiumDate);

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

// chamada à API
async function fetchCliente(id){
  const resp = await fetch(`${BFF_CLIENTES_BASE}/bff/clientes/${id}`);
  const json = await resp.json();
  if (!json.success){
    throw new Error(json.message || "Erro ao carregar cliente");
  }
  return json.data;
}

async function updateCliente(id, payload){
  const resp = await fetch(`${BFF_CLIENTES_BASE}/bff/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await resp.json();

  if (!json.success){
    throw new Error(json.message || "Erro ao salvar cliente");
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
  $("#isPremium").checked     = !!cliente.premium;
  $("#premiumAte").value      = cliente.premiumAte || "";

  if (cliente.avatarDataUrl){
    avatarPreview.src = cliente.avatarDataUrl;
  } else {
    avatarPreview.src = "./img/avatar-placeholder.svg";
  }

  togglePremiumDate();
}

// carregar inicial
async function loadPerfil(){
  try {
    statusCarregando.textContent = "Carregando perfil...";
    const cli = await fetchCliente(CLIENTE_ID);
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

  // monta payload do cliente com TODOS os campos que o Core agora entende
  const payload = {
    nome: $("#nomeCompleto").value,
    email: $("#email").value,
    telefone: $("#telefone").value,
    cpf: $("#cpf").value,
    endereco: $("#endereco").value,
    dataNascimento: $("#dataNascimento").value || null,
    premium: $("#isPremium").checked,
    premiumAte: $("#premiumAte").value || null,
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

// init
document.addEventListener("DOMContentLoaded", () => {
  loadPerfil();
});
