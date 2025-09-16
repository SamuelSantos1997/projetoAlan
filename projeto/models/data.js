
export const gyms = [
  { id: "g1", nome: "Academia Centro" },
  { id: "g2", nome: "Iron House" },
  { id: "g3", nome: "Athletic Club" }
];

export const usersByGym = {
  g1: [
    { id:"u1", nome:"Bruna" },
    { id:"u2", nome:"Diego" },
    { id:"u3", nome:"Letícia" }
  ],
  g2: [
    { id:"u4", nome:"Rafael" },
    { id:"u5", nome:"Camila" }
  ],
  g3: [
    { id:"u6", nome:"João" },
    { id:"u7", nome:"Mariana" },
    { id:"u8", nome:"Paulo" }
  ]
};

// Exemplo de histórico de treinos (mock)
export const treinoHistorico = [
  // dia, duração (min), calorias, tipo
  { d: "2025-09-01", dur: 45, kcal: 360, tipo:"A" },
  { d: "2025-09-03", dur: 52, kcal: 420, tipo:"B" },
  { d: "2025-09-05", dur: 38, kcal: 300, tipo:"C" },
  { d: "2025-09-08", dur: 60, kcal: 500, tipo:"A" },
  { d: "2025-09-10", dur: 48, kcal: 380, tipo:"B" },
  { d: "2025-09-12", dur: 55, kcal: 440, tipo:"C" },
  { d: "2025-09-14", dur: 42, kcal: 330, tipo:"A" }
];
