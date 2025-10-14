// Persistência simples no localStorage
const $ = (sel) => document.querySelector(sel);

const form = $("#perfilForm");
const avatarInput = $("#avatarInput");
const avatarPreview = $("#avatarPreview");
const removerFoto = $("#removerFoto");
const isPremium = $("#isPremium");
const premiumAteWrapper = $("#premiumAteWrapper");
const premiumAte = $("#premiumAte");
const telefone = $("#telefone");
const cpf = $("#cpf");

const STORAGE_KEY = "perfilUsuario";

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

telefone.addEventListener("input", (e) => {
  const start = e.target.selectionStart;
  e.target.value = formatPhone(e.target.value);
});

cpf.addEventListener("input", (e) => {
  e.target.value = formatCPF(e.target.value);
});

// Mostrar/ocultar campo Premium até
function togglePremiumDate(){
  premiumAteWrapper.hidden = !isPremium.checked;
}
isPremium.addEventListener("change", togglePremiumDate);

// Avatar preview
avatarInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if(!file) return;
  if(file.size > 5 * 1024 * 1024){ // 5MB
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

// Carregar dados salvos
function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;
  try {
    const data = JSON.parse(raw);
    for (const [k,v] of Object.entries(data)){
      const el = document.getElementById(k);
      if(!el) continue;
      if (el.type === "checkbox"){
        el.checked = !!v;
      } else {
        el.value = v ?? "";
      }
    }
    if (data.avatarDataUrl){
      avatarPreview.src = data.avatarDataUrl;
    }
    togglePremiumDate();
  } catch(e){
    console.warn("Erro ao carregar dados do perfil:", e);
  }
}

// Salvar
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.isPremium = $("#isPremium").checked;

  // Salvar foto como DataURL se houver
  let avatarDataUrl = null;
  if (avatarPreview.src && !avatarPreview.src.endsWith("avatar-placeholder.svg")){
    avatarDataUrl = avatarPreview.src;
  }
  data.avatarDataUrl = avatarDataUrl;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Micro feedback
  const btn = e.submitter;
  const original = btn.textContent;
  btn.textContent = "Salvo!";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 1200);
});

// Cancelar (reset para dados do storage)
$("#btnReset").addEventListener("click", () => {
  form.reset();
  loadData();
});

// Inicialização
loadData();
