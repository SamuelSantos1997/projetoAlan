import { treinoHistorico } from "../models/data.js";

// Função helper para montar label dd/MM de forma segura
function createLabelFromDateValue(value) {
  let d;

  if (value instanceof Date) {
    d = value;
  } else if (typeof value === "string") {
    let normalized = value.trim();

    // Se vier com espaço entre data e hora, troca por "T"
    // Ex: "2025-11-17 15:20:00" -> "2025-11-17T15:20:00"
    if (normalized.includes(" ") && !normalized.includes("T")) {
      normalized = normalized.replace(" ", "T");
    }

    // Se vier com milissegundos ou timezone, corta no 19º caractere (YYYY-MM-DDTHH:mm:ss)
    if (normalized.length > 19) {
      normalized = normalized.substring(0, 19);
    }

    d = new Date(normalized);
  } else {
    d = new Date(NaN); // força inválida
  }

  if (Number.isNaN(d.getTime())) {
    // Se a data for inválida, devolve um placeholder
    return "--/--";
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

// KPIs
export function calcKPIs(hist) {
  const totalTreinos = hist.length;
  const mediaDur = Math.round(
    hist.reduce((a, b) => a + b.dur, 0) / Math.max(1, totalTreinos)
  );
  const mediaKcal = Math.round(
    hist.reduce((a, b) => a + b.kcal, 0) / Math.max(1, totalTreinos)
  );
  return { totalTreinos, mediaDur, mediaKcal };
}

// Charts
export function renderCharts() {
  const ctx1 = document.getElementById("chart-frequencia");
  const ctx2 = document.getElementById("chart-duracao");
  const ctx3 = document.getElementById("chart-kcal");

  // Labels dd/MM gerados de forma segura
  const labels = treinoHistorico.map(x => createLabelFromDateValue(x.d));

  const frequenciaPorDia = treinoHistorico.map(() => 1);
  const duracoes = treinoHistorico.map(x => x.dur);
  const calorias = treinoHistorico.map(x => x.kcal);

  // Using Chart.js (CDN on the page)
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Presenças", data: frequenciaPorDia }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  new Chart(ctx2, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Minutos por treino", data: duracoes, tension: 0.3 }
      ]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

  new Chart(ctx3, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Gasto calórico (kcal)", data: calorias, tension: 0.3 }
      ]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });
}

export function mountKPIs() {
  const { totalTreinos, mediaDur, mediaKcal } = calcKPIs(treinoHistorico);
  document.getElementById("kpi-treinos").innerText = totalTreinos;
  document.getElementById("kpi-duracao").innerText = mediaDur + " min";
  document.getElementById("kpi-kcal").innerText = mediaKcal + " kcal";
}
