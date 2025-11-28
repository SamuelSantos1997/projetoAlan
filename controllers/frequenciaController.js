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

    if (normalized.includes(" ") && !normalized.includes("T")) {
      normalized = normalized.replace(" ", "T");
    }

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

// Parsear data de forma segura
function parseDate(value) {
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    let normalized = value.trim();
    if (normalized.includes(" ") && !normalized.includes("T")) {
      normalized = normalized.replace(" ", "T");
    }
    if (normalized.length > 19) {
      normalized = normalized.substring(0, 19);
    }
    return new Date(normalized);
  }

  return new Date(NaN);
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
  const titulo = treino.titulo || "";

  const idMatch = titulo.match(/Treino #(\d+)/i);
  if (idMatch) {
    const treinoId = parseInt(idMatch[1]);
    return mapTreinoIdToGrupo(treinoId);
  }

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
  return treinos.map(treino => {
    const descricao = treino.descricao || "";
    const duracaoMatch = descricao.match(/duração de (\d+) minuto/i);
    const duracao = duracaoMatch ? parseInt(duracaoMatch[1]) : 45;
    const calorias = Math.round(duracao * 8);
    const data = treino.createdAt;

    return {
      d: data,
      dur: duracao,
      kcal: calorias,
      tipo: treino.nivel || "INICIANTE"
    };
  });
}

// Calcular sequência atual (streak) de dias consecutivos
function calcularStreak(treinos) {
  if (treinos.length === 0) return { atual: 0, recorde: 0 };

  // Ordenar treinos por data decrescente
  const datasUnicas = [...new Set(treinos.map(t => {
    const d = parseDate(t.createdAt);
    return d.toISOString().split('T')[0];
  }))].sort().reverse();

  if (datasUnicas.length === 0) return { atual: 0, recorde: 0 };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let streakAtual = 0;
  let streakRecorde = 0;
  let streakTemp = 1;

  // Verificar se treinou hoje ou ontem para começar o streak
  const ultimaData = new Date(datasUnicas[0]);
  const diffUltima = Math.floor((hoje - ultimaData) / (1000 * 60 * 60 * 24));

  if (diffUltima <= 1) {
    streakAtual = 1;

    for (let i = 1; i < datasUnicas.length; i++) {
      const dataAtual = new Date(datasUnicas[i - 1]);
      const dataAnterior = new Date(datasUnicas[i]);
      const diff = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        streakAtual++;
      } else {
        break;
      }
    }
  }

  // Calcular recorde
  for (let i = 1; i < datasUnicas.length; i++) {
    const dataAtual = new Date(datasUnicas[i - 1]);
    const dataAnterior = new Date(datasUnicas[i]);
    const diff = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streakTemp++;
    } else {
      streakRecorde = Math.max(streakRecorde, streakTemp);
      streakTemp = 1;
    }
  }
  streakRecorde = Math.max(streakRecorde, streakTemp, streakAtual);

  return { atual: streakAtual, recorde: streakRecorde };
}

// Calcular meta semanal
function calcularMetaSemanal(treinos, meta = 4) {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo
  inicioSemana.setHours(0, 0, 0, 0);

  const treinosSemana = treinos.filter(t => {
    const d = parseDate(t.createdAt);
    return d >= inicioSemana && d <= hoje;
  });

  // Dias da semana com treino
  const diasComTreino = new Set(treinosSemana.map(t => {
    const d = parseDate(t.createdAt);
    return d.getDay();
  }));

  return {
    realizados: diasComTreino.size,
    meta: meta,
    diasComTreino: diasComTreino
  };
}

// Gerar dados para o calendário heatmap (últimos 3 meses)
function gerarDadosCalendario(treinos) {
  const hoje = new Date();
  const tresMesesAtras = new Date(hoje);
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

  // Contar treinos por dia
  const treinosPorDia = {};
  treinos.forEach(t => {
    const d = parseDate(t.createdAt);
    const key = d.toISOString().split('T')[0];
    treinosPorDia[key] = (treinosPorDia[key] || 0) + 1;
  });

  const dias = [];
  const dataIterador = new Date(tresMesesAtras);

  while (dataIterador <= hoje) {
    const key = dataIterador.toISOString().split('T')[0];
    const count = treinosPorDia[key] || 0;

    // Determinar nível (0-4)
    let nivel = 0;
    if (count === 1) nivel = 1;
    else if (count === 2) nivel = 2;
    else if (count === 3) nivel = 3;
    else if (count >= 4) nivel = 4;

    dias.push({
      data: key,
      count: count,
      nivel: nivel
    });

    dataIterador.setDate(dataIterador.getDate() + 1);
  }

  return dias;
}

// Definições de conquistas
const CONQUISTAS = [
  { id: 'primeiro-treino', nome: 'Primeiro Passo', desc: 'Complete seu primeiro treino', icone: '🎯', verificar: (stats) => stats.totalTreinos >= 1 },
  { id: 'semana-completa', nome: 'Semana Perfeita', desc: '4 treinos em uma semana', icone: '📅', verificar: (stats) => stats.metaSemanal.realizados >= 4 },
  { id: 'streak-3', nome: 'Esquentando', desc: '3 dias seguidos', icone: '🔥', verificar: (stats) => stats.streak.atual >= 3 || stats.streak.recorde >= 3 },
  { id: 'streak-7', nome: 'Em Chamas', desc: '7 dias seguidos', icone: '💥', verificar: (stats) => stats.streak.atual >= 7 || stats.streak.recorde >= 7 },
  { id: 'streak-30', nome: 'Imparável', desc: '30 dias seguidos', icone: '🏆', verificar: (stats) => stats.streak.atual >= 30 || stats.streak.recorde >= 30 },
  { id: 'dez-treinos', nome: 'Consistente', desc: 'Complete 10 treinos', icone: '💪', verificar: (stats) => stats.totalTreinos >= 10 },
  { id: 'vinte-cinco-treinos', nome: 'Dedicado', desc: 'Complete 25 treinos', icone: '🥈', verificar: (stats) => stats.totalTreinos >= 25 },
  { id: 'cinquenta-treinos', nome: 'Atleta', desc: 'Complete 50 treinos', icone: '🥇', verificar: (stats) => stats.totalTreinos >= 50 },
  { id: 'cem-treinos', nome: 'Lendário', desc: 'Complete 100 treinos', icone: '👑', verificar: (stats) => stats.totalTreinos >= 100 },
  { id: 'madrugador', nome: 'Madrugador', desc: 'Treino antes das 7h', icone: '🌅', verificar: (stats) => stats.treinoMatinal },
  { id: 'noturno', nome: 'Coruja', desc: 'Treino após as 21h', icone: '🌙', verificar: (stats) => stats.treinoNoturno },
  { id: 'mil-kcal', nome: 'Queimador', desc: 'Gaste 1000 kcal em um dia', icone: '🔥', verificar: (stats) => stats.maxKcalDia >= 1000 }
];

// Verificar conquistas do usuário
function verificarConquistas(treinos, treinoHistorico) {
  const stats = {
    totalTreinos: treinos.length,
    streak: calcularStreak(treinos),
    metaSemanal: calcularMetaSemanal(treinos),
    treinoMatinal: false,
    treinoNoturno: false,
    maxKcalDia: 0
  };

  // Verificar horários dos treinos
  treinos.forEach(t => {
    const d = parseDate(t.createdAt);
    const hora = d.getHours();
    if (hora < 7) stats.treinoMatinal = true;
    if (hora >= 21) stats.treinoNoturno = true;
  });

  // Calcular máximo de kcal em um dia
  const kcalPorDia = {};
  treinoHistorico.forEach(t => {
    const d = parseDate(t.d);
    const key = d.toISOString().split('T')[0];
    kcalPorDia[key] = (kcalPorDia[key] || 0) + t.kcal;
  });
  stats.maxKcalDia = Math.max(0, ...Object.values(kcalPorDia));

  return CONQUISTAS.map(c => ({
    ...c,
    desbloqueada: c.verificar(stats)
  }));
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

// Renderizar calendário heatmap
function renderizarCalendario(dadosCalendario) {
  const container = document.getElementById('freq-calendar');
  if (!container) return;

  container.innerHTML = '';

  dadosCalendario.forEach(dia => {
    const div = document.createElement('div');
    div.className = `calendar-day level-${dia.nivel}`;
    div.title = `${dia.data}: ${dia.count} treino(s)`;
    container.appendChild(div);
  });
}

// Renderizar dias da semana
function renderizarDiasSemana(metaSemanal) {
  const container = document.getElementById('weekly-days');
  if (!container) return;

  const diasNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hoje = new Date().getDay();

  container.innerHTML = '';

  diasNomes.forEach((nome, index) => {
    const div = document.createElement('div');
    div.className = 'weekly-day';

    const completado = metaSemanal.diasComTreino.has(index);
    const ehHoje = index === hoje;

    div.innerHTML = `
      <span class="weekly-day-name">${nome}</span>
      <div class="weekly-day-indicator ${completado ? 'completed' : ''} ${ehHoje ? 'today' : ''}">
        ${completado ? '✓' : ''}
      </div>
    `;

    container.appendChild(div);
  });
}

// Renderizar conquistas
function renderizarConquistas(conquistas) {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  container.innerHTML = '';

  conquistas.forEach(c => {
    const div = document.createElement('div');
    div.className = `achievement-card ${c.desbloqueada ? 'unlocked' : 'locked'}`;
    div.innerHTML = `
      <span class="achievement-icon">${c.icone}</span>
      <span class="achievement-name">${c.nome}</span>
      <span class="achievement-desc">${c.desc}</span>
    `;
    container.appendChild(div);
  });
}

// Renderizar histórico recente
function renderizarHistorico(treinos, treinoHistorico) {
  const container = document.getElementById('history-list');
  if (!container) return;

  // Pegar os 5 mais recentes
  const recentes = treinos.slice(0, 5);

  if (recentes.length === 0) {
    container.innerHTML = '<p style="color: var(--muted); text-align: center;">Nenhum treino registrado ainda.</p>';
    return;
  }

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  container.innerHTML = '';

  recentes.forEach((treino, index) => {
    const d = parseDate(treino.createdAt);
    const hist = treinoHistorico[index] || { dur: 45, kcal: 360 };

    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-date">
        <span class="history-day">${d.getDate()}</span>
        <span class="history-month">${meses[d.getMonth()]}</span>
      </div>
      <div class="history-info">
        <div class="history-title">${treino.titulo || 'Treino'}</div>
        <div class="history-details">${treino.nivel || 'Personalizado'}</div>
      </div>
      <div class="history-stats">
        <div class="history-stat">
          <div class="history-stat-value">${hist.dur}min</div>
          <div class="history-stat-label">Duração</div>
        </div>
        <div class="history-stat">
          <div class="history-stat-value">${hist.kcal}</div>
          <div class="history-stat-label">kcal</div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Renderizar gráficos com dados reais
export async function renderCharts() {
  const treinosBackend = await buscarTreinosDoUsuario();
  const treinoHistorico = transformarTreinosParaGrafico(treinosBackend);

  console.log("Histórico transformado:", treinoHistorico);

  // Calcular estatísticas
  const streak = calcularStreak(treinosBackend);
  const metaSemanal = calcularMetaSemanal(treinosBackend);
  const dadosCalendario = gerarDadosCalendario(treinosBackend);
  const conquistas = verificarConquistas(treinosBackend, treinoHistorico);
  const { totalTreinos, mediaDur, mediaKcal } = calcKPIs(treinoHistorico);

  console.log("=== DEBUG CONQUISTAS ===");
  console.log("Total treinos backend:", treinosBackend.length);
  console.log("Streak:", streak);
  console.log("Meta semanal:", metaSemanal);
  console.log("Conquistas:", conquistas.map(c => ({ nome: c.nome, desbloqueada: c.desbloqueada })));

  // Atualizar KPIs
  document.getElementById("kpi-treinos").innerText = totalTreinos;
  document.getElementById("kpi-duracao").innerHTML = `${mediaDur}<small>min</small>`;
  document.getElementById("kpi-kcal").innerHTML = `${mediaKcal}<small>kcal</small>`;
  document.getElementById("kpi-recorde").innerText = streak.recorde;

  // Atualizar streak
  document.getElementById("streak-value").innerText = streak.atual;

  // Atualizar meta semanal
  const progressoPct = Math.min(100, (metaSemanal.realizados / metaSemanal.meta) * 100);
  document.getElementById("weekly-goal-text").innerText = `${metaSemanal.realizados} de ${metaSemanal.meta} treinos`;
  document.getElementById("weekly-goal-bar").style.width = `${progressoPct}%`;

  // Renderizar componentes
  renderizarDiasSemana(metaSemanal);
  renderizarCalendario(dadosCalendario);
  renderizarConquistas(conquistas);
  renderizarHistorico(treinosBackend, treinoHistorico);

  if (treinoHistorico.length === 0) {
    console.warn("Nenhum treino encontrado.");
    return;
  }

  const ctx1 = document.getElementById("chart-frequencia");
  const ctx2 = document.getElementById("chart-duracao");
  const ctx3 = document.getElementById("chart-kcal");
  const ctx4 = document.getElementById("chart-grupos");

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
      datasets: [{
        label: "Minutos por treino",
        data: duracoes,
        tension: 0.3,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true
      }]
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
      datasets: [{
        label: "Gasto calórico (kcal)",
        data: calorias,
        tension: 0.3,
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true
      }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

  // Gráfico 4: Grupos Musculares (pizza)
  const gruposMuscularesData = agregarPorGrupoMuscular(treinosBackend);
  const gruposLabels = Object.keys(gruposMuscularesData);
  const gruposValues = Object.values(gruposMuscularesData);

  const backgroundColors = [
    "rgba(34, 197, 94, 0.8)",
    "rgba(59, 130, 246, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(249, 115, 22, 0.8)",
    "rgba(168, 85, 247, 0.8)",
    "rgba(236, 72, 153, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(234, 179, 8, 0.8)",
    "rgba(161, 161, 170, 0.8)",
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
            font: { size: 12 },
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
}

export function mountKPIs() {
  // KPIs serão montados dentro de renderCharts após buscar dados
}

// Função principal de inicialização
export function initFrequenciaDashboard() {
  renderCharts();
}
