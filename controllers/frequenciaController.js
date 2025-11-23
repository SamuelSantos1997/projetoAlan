const BFF_BASE_URL = "http://localhost:8000/api";

// Obter ID do usuário logado
function getLoggedUserId() {
  const userId = localStorage.getItem("userId");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn || !userId) {
    window.location.href = "/views/login/index.html";
    return null;
  }

  return parseInt(userId);
}

// Função helper para montar label dd/MM de forma segura
function createLabelFromDateValue(value) {
  let d;

  if (value instanceof Date) {
    d = value;
  } else if (typeof value === "string") {
    let normalized = value.trim();

    // Se vier com espaço entre data e hora, troca por "T"
    if (normalized.includes(" ") && !normalized.includes("T")) {
      normalized = normalized.replace(" ", "T");
    }

    // Se vier com milissegundos ou timezone, corta no 19º caractere
    if (normalized.length > 19) {
      normalized = normalized.substring(0, 19);
    }

    d = new Date(normalized);
  } else {
    d = new Date(NaN);
  }

  if (Number.isNaN(d.getTime())) {
    return "--/--";
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

// Mapear ID do treino para grupo muscular
function mapTreinoIdToGrupo(treinoId) {
  const mapping = {
    1: "Pernas & Core",
    2: "Membros Superiores",
    3: "Cardio & Core",
    4: "Peito & Costas",
    5: "Bíceps & Tríceps",
    6: "Pernas",
    7: "Ombros",
    8: "Core & Abdômen",
    9: "Glúteo",
    10: "Peito & Costas",
    11: "Bíceps & Tríceps",
    12: "Pernas",
    13: "Ombros",
    14: "Core & Abdômen",
    15: "Glúteo"
  };

  return mapping[treinoId] || "Outros";
}

// Extrair grupo muscular do título do treino
function extrairGrupoMuscular(treino) {
  // Tentar extrair do ID do treino na descrição
  const descricao = treino.descricao || "";
  const titulo = treino.titulo || "";

  // Extrair ID do treino do título (ex: "Treino #5" -> 5)
  const idMatch = titulo.match(/Treino #(\d+)/i);
  if (idMatch) {
    const treinoId = parseInt(idMatch[1]);
    return mapTreinoIdToGrupo(treinoId);
  }

  // Fallback: tentar detectar pelo nível
  if (treino.nivel === "INICIANTE") return "Treino Iniciante";
  if (treino.nivel === "INTERMEDIARIO") return "Treino Intermediário";
  if (treino.nivel === "AVANCADO") return "Treino Avançado";

  return "Outros";
}

// Agregar treinos por grupo muscular
function agregarPorGrupoMuscular(treinos) {
  const grupos = {};

  treinos.forEach(treino => {
    const grupo = extrairGrupoMuscular(treino);
    grupos[grupo] = (grupos[grupo] || 0) + 1;
  });

  return grupos;
}

// Buscar treinos do usuário no backend
async function buscarTreinosDoUsuario() {
  const userId = getLoggedUserId();
  if (!userId) return [];

  const token = localStorage.getItem('userToken');
  if (!token) {
    console.error("Token não encontrado");
    window.location.href = "/views/login/index.html";
    return [];
  }

  try {
    const response = await fetch(`${BFF_BASE_URL}/bff/treinos/cliente/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Erro ao buscar treinos:", response.status);
      return [];
    }

    const json = await response.json();
    console.log("Treinos do backend:", json);

    // O backend retorna { success: true, data: [...] }
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);
    return [];
  }
}

// Transformar treinos do backend para o formato do gráfico
function transformarTreinosParaGrafico(treinos) {
  // Treinos vêm do backend como: { id, clienteId, titulo, descricao, nivel, createdAt }
  // Precisamos extrair data e estimar duração/calorias

  return treinos.map(treino => {
    // Extrair duração da descrição (ex: "Treino realizado em 2025-01-23 com duração de 45 minutos")
    const descricao = treino.descricao || "";
    const duracaoMatch = descricao.match(/duração de (\d+) minuto/i);
    const duracao = duracaoMatch ? parseInt(duracaoMatch[1]) : 45; // default 45min

    // Estimar calorias: ~8 kcal por minuto (média)
    const calorias = Math.round(duracao * 8);

    // Data: usar createdAt
    const data = treino.createdAt;

    return {
      d: data,
      dur: duracao,
      kcal: calorias,
      tipo: treino.nivel || "INICIANTE"
    };
  });
}

// KPIs
export function calcKPIs(hist) {
  const totalTreinos = hist.length;
  const mediaDur = totalTreinos > 0
    ? Math.round(hist.reduce((a, b) => a + b.dur, 0) / totalTreinos)
    : 0;
  const mediaKcal = totalTreinos > 0
    ? Math.round(hist.reduce((a, b) => a + b.kcal, 0) / totalTreinos)
    : 0;
  return { totalTreinos, mediaDur, mediaKcal };
}

// Renderizar gráficos com dados reais
export async function renderCharts() {
  // Buscar dados reais do backend
  const treinosBackend = await buscarTreinosDoUsuario();
  const treinoHistorico = transformarTreinosParaGrafico(treinosBackend);

  console.log("Histórico transformado:", treinoHistorico);

  if (treinoHistorico.length === 0) {
    console.warn("Nenhum treino encontrado. Mostrando mensagem vazia.");
    document.getElementById("kpi-treinos").innerText = "0";
    document.getElementById("kpi-duracao").innerText = "0 min";
    document.getElementById("kpi-kcal").innerText = "0 kcal";
    return;
  }

  const ctx1 = document.getElementById("chart-frequencia");
  const ctx2 = document.getElementById("chart-duracao");
  const ctx3 = document.getElementById("chart-kcal");
  const ctx4 = document.getElementById("chart-grupos");

  // Labels dd/MM
  const labels = treinoHistorico.map(x => createLabelFromDateValue(x.d));

  const frequenciaPorDia = treinoHistorico.map(() => 1);
  const duracoes = treinoHistorico.map(x => x.dur);
  const calorias = treinoHistorico.map(x => x.kcal);

  // Gráfico 1: Frequência (barras)
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Presenças",
        data: frequenciaPorDia,
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });

  // Gráfico 2: Duração (linha)
  new Chart(ctx2, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Minutos por treino",
          data: duracoes,
          tension: 0.3,
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.1)"
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

  // Gráfico 3: Calorias (linha)
  new Chart(ctx3, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Gasto calórico (kcal)",
          data: calorias,
          tension: 0.3,
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.1)"
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

  // Gráfico 4: Grupos Musculares (pizza)
  const gruposMuscularesData = agregarPorGrupoMuscular(treinosBackend);
  const gruposLabels = Object.keys(gruposMuscularesData);
  const gruposValues = Object.values(gruposMuscularesData);

  // Cores vibrantes para cada grupo
  const backgroundColors = [
    "rgba(34, 197, 94, 0.8)",   // Verde
    "rgba(59, 130, 246, 0.8)",  // Azul
    "rgba(239, 68, 68, 0.8)",   // Vermelho
    "rgba(249, 115, 22, 0.8)",  // Laranja
    "rgba(168, 85, 247, 0.8)",  // Roxo
    "rgba(236, 72, 153, 0.8)",  // Rosa
    "rgba(14, 165, 233, 0.8)",  // Ciano
    "rgba(234, 179, 8, 0.8)",   // Amarelo
    "rgba(161, 161, 170, 0.8)", // Cinza
  ];

  const borderColors = backgroundColors.map(color => color.replace("0.8", "1"));

  new Chart(ctx4, {
    type: "pie",
    data: {
      labels: gruposLabels,
      datasets: [{
        label: "Treinos por Grupo",
        data: gruposValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#e5e7eb",
            font: {
              size: 12
            },
            padding: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} treinos (${percentage}%)`;
            }
          }
        }
      }
    }
  });

  // Atualizar KPIs
  const { totalTreinos, mediaDur, mediaKcal } = calcKPIs(treinoHistorico);
  document.getElementById("kpi-treinos").innerText = totalTreinos;
  document.getElementById("kpi-duracao").innerText = mediaDur + " min";
  document.getElementById("kpi-kcal").innerText = mediaKcal + " kcal";
}

export function mountKPIs() {
  // KPIs serão montados dentro de renderCharts após buscar dados
  // Deixar essa função vazia por compatibilidade
}
