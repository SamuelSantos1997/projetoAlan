
import { treinoHistorico } from "../models/data.js";

// KPIs
export function calcKPIs(hist){
  const totalTreinos = hist.length;
  const mediaDur = Math.round(hist.reduce((a,b)=>a+b.dur,0)/Math.max(1,totalTreinos));
  const mediaKcal = Math.round(hist.reduce((a,b)=>a+b.kcal,0)/Math.max(1,totalTreinos));
  return { totalTreinos, mediaDur, mediaKcal };
}

// Charts
export function renderCharts(){
  const ctx1 = document.getElementById("chart-frequencia");
  const ctx2 = document.getElementById("chart-duracao");
  const ctx3 = document.getElementById("chart-kcal");

  const labels = treinoHistorico.map(x=> new Date(x.d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}));
  const frequenciaPorDia = treinoHistorico.map(()=>1);
  const duracoes = treinoHistorico.map(x=>x.dur);
  const calorias = treinoHistorico.map(x=>x.kcal);

  // Using Chart.js (CDN on the page)
  new Chart(ctx1, {
    type: "bar",
    data: { labels, datasets: [{ label: "Presenças", data: frequenciaPorDia }] },
    options: { plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
  });
  new Chart(ctx2, {
    type: "line",
    data: { labels, datasets: [{ label: "Minutos por treino", data: duracoes, tension:.3 }] },
    options: { plugins:{ legend:{ display:false } } }
  });
  new Chart(ctx3, {
    type: "line",
    data: { labels, datasets: [{ label: "Gasto calórico (kcal)", data: calorias, tension:.3 }] },
    options: { plugins:{ legend:{ display:false } } }
  });
}

export function mountKPIs(){
  const { totalTreinos, mediaDur, mediaKcal } = calcKPIs(treinoHistorico);
  document.getElementById("kpi-treinos").innerText = totalTreinos;
  document.getElementById("kpi-duracao").innerText = mediaDur + " min";
  document.getElementById("kpi-kcal").innerText = mediaKcal + " kcal";
}
