
import { gyms, usersByGym } from "/models/data.js";

const select = document.getElementById("sel-gym");
const userSel = document.getElementById("sel-user");
const list = document.getElementById("user-list");
const msgBox = document.getElementById("messages");
const input = document.getElementById("input-msg");
const btn = document.getElementById("btn-send");

function loadGyms(){
  gyms.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.id; opt.textContent = g.nome;
    select.appendChild(opt);
  });
  const saved = localStorage.getItem("fitpanel_gym") || "g1";
  select.value = saved;
  loadUsers();
}

function loadUsers(){
  list.innerHTML = "";
  userSel.innerHTML = "";
  const arr = usersByGym[select.value] || [];
  arr.forEach(u=>{
    const tag = document.createElement("span");
    tag.className = "user"; tag.textContent = u.nome; list.appendChild(tag);
    const opt = document.createElement("option"); opt.value=u.id; opt.textContent=u.nome;
    userSel.appendChild(opt);
  });
  localStorage.setItem("fitpanel_gym", select.value);
  renderMessages();
}

function roomKey(){
  return "chat_" + select.value;
}

function renderMessages(){
  msgBox.innerHTML="";
  const msgs = JSON.parse(localStorage.getItem(roomKey()) || "[]");
  msgs.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + (m.me ? "me":"other");
    div.textContent = m.text;
    const ts = document.createElement("span");
    ts.className = "timestamp"; ts.textContent = new Date(m.t).toLocaleString("pt-BR");
    div.appendChild(ts);
    msgBox.appendChild(div);
  });
  msgBox.scrollTop = msgBox.scrollHeight;
}

function send(){
  const text = input.value.trim();
  if (!text) return;
  const msgs = JSON.parse(localStorage.getItem(roomKey()) || "[]");
  msgs.push({ text, t: Date.now(), me: true });
  localStorage.setItem(roomKey(), JSON.stringify(msgs));
  input.value="";
  renderMessages();
}

select.addEventListener("change", loadUsers);
btn.addEventListener("click", send);
input.addEventListener("keydown", e=>{ if(e.key==="Enter") send(); });

loadGyms();
