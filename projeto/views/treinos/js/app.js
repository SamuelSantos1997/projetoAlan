document.addEventListener('DOMContentLoaded', () => {
    // --- Dados da Aplicação ---
    const workoutData = {
        niveles: [
            {
                id: "iniciante",
                nome: "Iniciante",
                icon: "🌱",
                grupos: ["Treino A", "Treino B", "Treino C"],
                resumo: "Treino fundamental com foco em aprender a forma correta dos exercícios e construir uma base sólida.",
                treinos: {
                    "Treino A": {
                        nome: "Treino A - Pernas e Core",
                        exercicios: [
                            {
                                nome: "Agachamento",
                                series: "5 séries",
                                detalhes: "1x20 com peso do corpo, 1x15 com barra vazia ou pouca carga, 3x12 com peso da série",
                                imagem: "images/mLKFGsUN80w7.jpg"
                            },
                            {
                                nome: "Extensora",
                                series: "3x10 cada perna",
                                detalhes: "Exercício na máquina extensora",
                                imagem: "images/VyiVDDkpyXaR.jpg"
                            },
                            {
                                nome: "Abdutora",
                                series: "3x20",
                                detalhes: "Exercício na máquina abdutora",
                                imagem: "images/ES0yQgVK5qY9.jpg"
                            },
                            {
                                nome: "Afundo",
                                series: "3x15 cada perna",
                                detalhes: "Afundo alternado com ou sem peso",
                                imagem: "images/IdZwGHMVOE5s.jpg"
                            },
                            {
                                nome: "Panturrilha em pé",
                                series: "3x20",
                                detalhes: "Elevação de panturrilha em pé",
                                imagem: "images/7x0Xjcsp7aEG.jpg"
                            },
                            {
                                nome: "Prancha",
                                series: "3 minutos total",
                                detalhes: "Prancha isométrica para fortalecimento do core",
                                imagem: "images/IsJ36ICvUgBt.jpg"
                            }
                        ]
                    },
                    "Treino B": {
                        nome: "Treino B - Membros Superiores",
                        exercicios: [
                            {
                                nome: "Rosca alternada com halter",
                                series: "3x12",
                                detalhes: "Rosca alternada para bíceps",
                                imagem: "images/i29y1D9bb9Sf.gif"
                            },
                            {
                                nome: "Tríceps no cross over",
                                series: "3x12",
                                detalhes: "Tríceps na polia alta",
                                imagem: "images/fS49bI0VxnHb.jpg"
                            },
                            {
                                nome: "Rosca direta no cross over",
                                series: "3x12",
                                detalhes: "Rosca direta na polia baixa",
                                imagem: "images/WH50ImvDG5R5.jpg"
                            },
                            {
                                nome: "Puxador frente",
                                series: "3x15",
                                detalhes: "Puxada frontal para dorsais",
                                imagem: "images/tdStTplsTdkn.jpg"
                            },
                            {
                                nome: "Remada baixa",
                                series: "3x15",
                                detalhes: "Remada sentada na polia",
                                imagem: "images/AOMaNvDTxhnS.jpg"
                            },
                            {
                                nome: "Voador (peck deck)",
                                series: "3x15",
                                detalhes: "Voador para peitoral",
                                imagem: "images/7mKDYRjslaOQ.jpg"
                            },
                            {
                                nome: "Abdominal Supra",
                                series: "3x20",
                                detalhes: "Abdominal tradicional",
                                imagem: "images/BeHDzsTwroem.jpg"
                            }
                        ]
                    },
                    "Treino C": {
                        nome: "Treino C - Pernas e Glúteos",
                        exercicios: [
                            {
                                nome: "Agachamento (Aquecimento)",
                                series: "2x20",
                                detalhes: "Agachamento para aquecimento",
                                imagem: "images/7z4kL1ZFL83n.jpg"
                            },
                            {
                                nome: "Abdutora",
                                series: "3x15-20",
                                detalhes: "Exercício na máquina abdutora",
                                imagem: "images/c7yLQmY6Gawp.jpg"
                            },
                            {
                                nome: "Agachamento sumo com halter",
                                series: "3x15",
                                detalhes: "Agachamento sumo segurando halter",
                                imagem: "images/ZJX2PkJepVK9.jpg"
                            },
                            {
                                nome: "Mesa flexora",
                                series: "3x15",
                                detalhes: "Flexão de pernas na mesa flexora",
                                imagem: "images/LnnbM4jSj9q3.jpg"
                            },
                            {
                                nome: "Elevação pélvica",
                                series: "3x12-15 (Pesado)",
                                detalhes: "Elevação pélvica com halteres ou barra",
                                imagem: "images/DvjlLafsC2Og.jpg"
                            },
                            {
                                nome: "Stiff com Halteres",
                                series: "3x12",
                                detalhes: "Stiff com halteres (cuidar na postura)",
                                imagem: "images/EBy95aGDOIbN.jpg"
                            },
                            {
                                nome: "Abdominal infra",
                                series: "3x15",
                                detalhes: "Abdominal inferior",
                                imagem: "images/lq5SPi1A25Yy.jpg"
                            }
                        ]
                    }
                }
            },
            {
                id: "medio",
                nome: "Médio",
                icon: "🔥",
                grupos: ["Peito & Costas", "Bíceps & Tríceps", "Pernas", "Ombros", "Core & Abdômen", "Glúteo"],
                resumo: "Aumente a intensidade e o volume para estimular o crescimento muscular e a força de forma consistente.",
                treinos: {
                    "Peito & Costas": {
                        nome: "Peito & Costas - Intermediário",
                        exercicios: [
                            {
                                nome: "Supino Reto com Barra",
                                series: "4x10-12",
                                detalhes: "Movimento principal para peito, controle na descida",
                                imagem: "images/supino-reto.jpg"
                            },
                            {
                                nome: "Supino Inclinado com Halteres",
                                series: "3x10-12",
                                detalhes: "Foco na parte superior do peitoral",
                                imagem: "images/supino-inclinado.jpg"
                            },
                            {
                                nome: "Crucifixo Inclinado",
                                series: "3x12-15",
                                detalhes: "Alongamento e contração completa do peito",
                                imagem: "images/crucifixo.jpg"
                            },
                            {
                                nome: "Barra Fixa ou Puxada Frontal",
                                series: "4x8-10",
                                detalhes: "Exercício composto para costas",
                                imagem: "images/tdStTplsTdkn.jpg"
                            },
                            {
                                nome: "Remada Curvada com Barra",
                                series: "4x10-12",
                                detalhes: "Desenvolvimento da espessura das costas",
                                imagem: "images/remada-curvada.jpg"
                            },
                            {
                                nome: "Remada Unilateral com Halter",
                                series: "3x12 cada lado",
                                detalhes: "Foco em cada lado individualmente",
                                imagem: "images/remada-unilateral.jpg"
                            },
                            {
                                nome: "Pullover com Halter",
                                series: "3x12-15",
                                detalhes: "Expansão da caixa torácica e ativação do dorsal",
                                imagem: "images/pullover.jpg"
                            }
                        ]
                    },
                    "Bíceps & Tríceps": {
                        nome: "Bíceps & Tríceps - Intermediário",
                        exercicios: [
                            {
                                nome: "Rosca Direta com Barra",
                                series: "4x10-12",
                                detalhes: "Exercício base para bíceps",
                                imagem: "images/rosca-direta-barra.jpg"
                            },
                            {
                                nome: "Rosca Alternada com Halteres",
                                series: "3x12 cada braço",
                                detalhes: "Foco na contração máxima",
                                imagem: "images/i29y1D9bb9Sf.gif"
                            },
                            {
                                nome: "Rosca Martelo",
                                series: "3x12",
                                detalhes: "Desenvolvimento do braquial e antebraço",
                                imagem: "images/rosca-martelo.jpg"
                            },
                            {
                                nome: "Rosca Concentrada",
                                series: "3x12-15",
                                detalhes: "Isolamento total do bíceps",
                                imagem: "images/rosca-concentrada.jpg"
                            },
                            {
                                nome: "Tríceps Testa com Barra",
                                series: "4x10-12",
                                detalhes: "Exercício principal para tríceps",
                                imagem: "images/triceps-testa.jpg"
                            },
                            {
                                nome: "Tríceps na Polia Alta",
                                series: "3x12-15",
                                detalhes: "Controle e contração constante",
                                imagem: "images/fS49bI0VxnHb.jpg"
                            },
                            {
                                nome: "Mergulho em Paralelas",
                                series: "3x10-12",
                                detalhes: "Exercício composto para tríceps",
                                imagem: "images/mergulho.jpg"
                            },
                            {
                                nome: "Tríceps Coice com Halteres",
                                series: "3x15 cada braço",
                                detalhes: "Finalização e queima muscular",
                                imagem: "images/triceps-coice.jpg"
                            }
                        ]
                    },
                    "Pernas": {
                        nome: "Pernas - Intermediário",
                        exercicios: [
                            {
                                nome: "Agachamento Livre com Barra",
                                series: "4x10-12",
                                detalhes: "Exercício principal para pernas completo",
                                imagem: "images/mLKFGsUN80w7.jpg"
                            },
                            {
                                nome: "Agachamento no Hack",
                                series: "3x12-15",
                                detalhes: "Foco nos quadríceps com segurança",
                                imagem: "images/hack-squat.jpg"
                            },
                            {
                                nome: "Leg Press 45°",
                                series: "4x12-15",
                                detalhes: "Volume para pernas completas",
                                imagem: "images/leg-press.jpg"
                            },
                            {
                                nome: "Cadeira Extensora",
                                series: "3x12-15",
                                detalhes: "Isolamento dos quadríceps",
                                imagem: "images/VyiVDDkpyXaR.jpg"
                            },
                            {
                                nome: "Mesa Flexora",
                                series: "4x12-15",
                                detalhes: "Desenvolvimento dos posteriores",
                                imagem: "images/LnnbM4jSj9q3.jpg"
                            },
                            {
                                nome: "Stiff com Barra",
                                series: "3x12",
                                detalhes: "Posteriores e glúteos, manter postura",
                                imagem: "images/EBy95aGDOIbN.jpg"
                            },
                            {
                                nome: "Afundo com Halteres",
                                series: "3x12 cada perna",
                                detalhes: "Equilíbrio e força unilateral",
                                imagem: "images/IdZwGHMVOE5s.jpg"
                            },
                            {
                                nome: "Panturrilha no Leg Press",
                                series: "4x15-20",
                                detalhes: "Volume para desenvolvimento das panturrilhas",
                                imagem: "images/panturrilha-leg.jpg"
                            }
                        ]
                    },
                    "Ombros": {
                        nome: "Ombros - Intermediário",
                        exercicios: [
                            {
                                nome: "Desenvolvimento com Barra",
                                series: "4x10-12",
                                detalhes: "Exercício base para ombros",
                                imagem: "images/desenvolvimento-barra.jpg"
                            },
                            {
                                nome: "Desenvolvimento com Halteres",
                                series: "3x10-12",
                                detalhes: "Amplitude maior de movimento",
                                imagem: "images/desenvolvimento-halter.jpg"
                            },
                            {
                                nome: "Elevação Lateral com Halteres",
                                series: "4x12-15",
                                detalhes: "Foco no deltoide medial",
                                imagem: "images/elevacao-lateral.jpg"
                            },
                            {
                                nome: "Elevação Frontal com Halteres",
                                series: "3x12-15",
                                detalhes: "Trabalho do deltoide anterior",
                                imagem: "images/elevacao-frontal.jpg"
                            },
                            {
                                nome: "Crucifixo Inverso",
                                series: "3x12-15",
                                detalhes: "Desenvolvimento do deltoide posterior",
                                imagem: "images/crucifixo-inverso.jpg"
                            },
                            {
                                nome: "Remada Alta com Barra",
                                series: "3x12",
                                detalhes: "Trapézio e deltoides",
                                imagem: "images/remada-alta.jpg"
                            },
                            {
                                nome: "Encolhimento com Halteres",
                                series: "3x15",
                                detalhes: "Hipertrofia do trapézio",
                                imagem: "images/encolhimento.jpg"
                            }
                        ]
                    },
                    "Core & Abdômen": {
                        nome: "Core & Abdômen - Intermediário",
                        exercicios: [
                            {
                                nome: "Prancha Isométrica",
                                series: "4x45-60 segundos",
                                detalhes: "Fortalecimento completo do core",
                                imagem: "images/IsJ36ICvUgBt.jpg"
                            },
                            {
                                nome: "Prancha Lateral",
                                series: "3x30-45s cada lado",
                                detalhes: "Trabalho dos oblíquos",
                                imagem: "images/prancha-lateral.jpg"
                            },
                            {
                                nome: "Abdominal Supra",
                                series: "4x20",
                                detalhes: "Parte superior do abdômen",
                                imagem: "images/BeHDzsTwroem.jpg"
                            },
                            {
                                nome: "Elevação de Pernas",
                                series: "4x15-20",
                                detalhes: "Parte inferior do abdômen",
                                imagem: "images/lq5SPi1A25Yy.jpg"
                            },
                            {
                                nome: "Abdominal Bicicleta",
                                series: "3x20 cada lado",
                                detalhes: "Trabalho dos oblíquos em movimento",
                                imagem: "images/abdominal-bicicleta.jpg"
                            },
                            {
                                nome: "Mountain Climbers",
                                series: "3x30 segundos",
                                detalhes: "Dinâmico, queima calórica e core",
                                imagem: "images/mountain-climbers.jpg"
                            },
                            {
                                nome: "Russian Twist",
                                series: "3x20 (10 cada lado)",
                                detalhes: "Rotação e oblíquos, pode adicionar peso",
                                imagem: "images/russian-twist.jpg"
                            }
                        ]
                    },
                    "Glúteo": {
                        nome: "Glúteo - Intermediário",
                        exercicios: [
                            {
                                nome: "Hip Thrust com Barra",
                                series: "4x12-15",
                                detalhes: "Exercício principal para glúteos",
                                imagem: "images/hip-thrust.jpg"
                            },
                            {
                                nome: "Agachamento Sumô com Halter",
                                series: "4x12-15",
                                detalhes: "Foco em glúteos e adutores",
                                imagem: "images/ZJX2PkJepVK9.jpg"
                            },
                            {
                                nome: "Stiff com Barra",
                                series: "3x12",
                                detalhes: "Ativação de glúteos e posteriores",
                                imagem: "images/EBy95aGDOIbN.jpg"
                            },
                            {
                                nome: "Cadeira Abdutora",
                                series: "4x15-20",
                                detalhes: "Isolamento do glúteo médio",
                                imagem: "images/ES0yQgVK5qY9.jpg"
                            },
                            {
                                nome: "Afundo Búlgaro",
                                series: "3x12 cada perna",
                                detalhes: "Trabalho unilateral intenso",
                                imagem: "images/afundo-bulgaro.jpg"
                            },
                            {
                                nome: "Coice na Polia",
                                series: "3x15 cada perna",
                                detalhes: "Isolamento e contração máxima",
                                imagem: "images/coice-polia.jpg"
                            },
                            {
                                nome: "Cadeira Adutora",
                                series: "3x15-20",
                                detalhes: "Parte interna das coxas",
                                imagem: "images/adutora.jpg"
                            }
                        ]
                    }
                }
            },
            {
                id: "avancado",
                nome: "Avançado",
                icon: "🏆",
                grupos: ["Peito & Costas", "Bíceps & Tríceps", "Pernas", "Ombros", "Core & Abdômen", "Glúteo"],
                resumo: "Desafie seus limites com técnicas avançadas, maior volume e intensidade para máxima performance.",
                treinos: {
                    "Peito & Costas": {
                        nome: "Peito & Costas - Avançado",
                        exercicios: [
                            {
                                nome: "Supino Reto com Barra",
                                series: "5x6-8 (pesado)",
                                detalhes: "Força máxima, descanso 2-3 min",
                                imagem: "images/supino-reto.jpg"
                            },
                            {
                                nome: "Supino Inclinado com Halteres",
                                series: "4x8-10",
                                detalhes: "Controle total, pausa no peito",
                                imagem: "images/supino-inclinado.jpg"
                            },
                            {
                                nome: "Supino Declinado",
                                series: "3x10-12",
                                detalhes: "Parte inferior do peitoral",
                                imagem: "images/supino-declinado.jpg"
                            },
                            {
                                nome: "Crucifixo Reto + Drop Set",
                                series: "3x10 + drop",
                                detalhes: "Último drop set até a falha",
                                imagem: "images/crucifixo.jpg"
                            },
                            {
                                nome: "Barra Fixa com Peso",
                                series: "4x6-8",
                                detalhes: "Adicionar peso extra, força pura",
                                imagem: "images/barra-fixa-peso.jpg"
                            },
                            {
                                nome: "Remada Curvada com Barra",
                                series: "4x8-10",
                                detalhes: "Pegada pronada, peso controlado",
                                imagem: "images/remada-curvada.jpg"
                            },
                            {
                                nome: "Remada na Polia (Triangulo)",
                                series: "4x10-12",
                                detalhes: "Contração máxima, controle na fase excêntrica",
                                imagem: "images/AOMaNvDTxhnS.jpg"
                            },
                            {
                                nome: "Pullover Cross + Pulldown",
                                series: "3x12 (bi-set)",
                                detalhes: "Sem descanso entre exercícios",
                                imagem: "images/pullover.jpg"
                            },
                            {
                                nome: "Remada Unilateral com Halter Pesado",
                                series: "3x8 cada lado",
                                detalhes: "Máxima carga, suporte no joelho",
                                imagem: "images/remada-unilateral.jpg"
                            }
                        ]
                    },
                    "Bíceps & Tríceps": {
                        nome: "Bíceps & Tríceps - Avançado",
                        exercicios: [
                            {
                                nome: "Rosca Direta com Barra (21s)",
                                series: "4 séries de 21 reps",
                                detalhes: "7 embaixo + 7 em cima + 7 completas",
                                imagem: "images/rosca-direta-barra.jpg"
                            },
                            {
                                nome: "Rosca Alternada com Halteres Pesados",
                                series: "4x8-10",
                                detalhes: "Movimento controlado, sem balanço",
                                imagem: "images/i29y1D9bb9Sf.gif"
                            },
                            {
                                nome: "Rosca Scott (Banco)",
                                series: "3x10-12",
                                detalhes: "Isolamento completo do bíceps",
                                imagem: "images/rosca-scott.jpg"
                            },
                            {
                                nome: "Rosca Martelo + Concentrada (Super Set)",
                                series: "3x10 cada",
                                detalhes: "Sem pausa entre exercícios",
                                imagem: "images/rosca-martelo.jpg"
                            },
                            {
                                nome: "Rosca Inversa",
                                series: "3x12-15",
                                detalhes: "Antebraços e braquial",
                                imagem: "images/rosca-inversa.jpg"
                            },
                            {
                                nome: "Tríceps Testa com Barra",
                                series: "4x8-10",
                                detalhes: "Peso controlado, cotovelos fixos",
                                imagem: "images/triceps-testa.jpg"
                            },
                            {
                                nome: "Supino Fechado",
                                series: "4x8-10",
                                detalhes: "Força e massa para tríceps",
                                imagem: "images/supino-fechado.jpg"
                            },
                            {
                                nome: "Mergulho com Peso",
                                series: "3x8-10",
                                detalhes: "Adicionar carga extra na cintura",
                                imagem: "images/mergulho.jpg"
                            },
                            {
                                nome: "Tríceps na Polia (Corda) + Polia Invertida",
                                series: "3x12 cada (bi-set)",
                                detalhes: "Execução perfeita, sem descanso",
                                imagem: "images/fS49bI0VxnHb.jpg"
                            },
                            {
                                nome: "Tríceps Francês com Halter",
                                series: "3x10-12",
                                detalhes: "Alongamento total, cuidado nos cotovelos",
                                imagem: "images/triceps-frances.jpg"
                            }
                        ]
                    },
                    "Pernas": {
                        nome: "Pernas - Avançado",
                        exercicios: [
                            {
                                nome: "Agachamento Livre Profundo",
                                series: "5x6-8 (pesado)",
                                detalhes: "ATG (ass to grass), descanso 3 min",
                                imagem: "images/mLKFGsUN80w7.jpg"
                            },
                            {
                                nome: "Agachamento Frontal",
                                series: "4x8-10",
                                detalhes: "Maior ativação de quadríceps",
                                imagem: "images/agachamento-frontal.jpg"
                            },
                            {
                                nome: "Leg Press com Pausa",
                                series: "4x12 (3s pausa)",
                                detalhes: "Pausa de 3 segundos embaixo",
                                imagem: "images/leg-press.jpg"
                            },
                            {
                                nome: "Hack Squat + Cadeira Extensora (Bi-set)",
                                series: "3x10-12 cada",
                                detalhes: "Sem descanso entre exercícios",
                                imagem: "images/hack-squat.jpg"
                            },
                            {
                                nome: "Afundo Caminhando com Barra",
                                series: "4x12 cada perna",
                                detalhes: "Passadas longas, controle total",
                                imagem: "images/IdZwGHMVOE5s.jpg"
                            },
                            {
                                nome: "Mesa Flexora + Stiff (Super Set)",
                                series: "4x10-12 cada",
                                detalhes: "Foco nos posteriores",
                                imagem: "images/LnnbM4jSj9q3.jpg"
                            },
                            {
                                nome: "Levantamento Terra Romeno",
                                series: "4x8-10",
                                detalhes: "Cadeia posterior completa, peso alto",
                                imagem: "images/terra-romeno.jpg"
                            },
                            {
                                nome: "Agachamento Sissy",
                                series: "3x15",
                                detalhes: "Isolamento extremo de quadríceps",
                                imagem: "images/sissy-squat.jpg"
                            },
                            {
                                nome: "Panturrilha em Pé + Sentado (Bi-set)",
                                series: "4x15-20 cada",
                                detalhes: "Gastrocnêmio + sóleo",
                                imagem: "images/7x0Xjcsp7aEG.jpg"
                            }
                        ]
                    },
                    "Ombros": {
                        nome: "Ombros - Avançado",
                        exercicios: [
                            {
                                nome: "Desenvolvimento Militar com Barra",
                                series: "5x6-8",
                                detalhes: "Em pé, força máxima",
                                imagem: "images/desenvolvimento-barra.jpg"
                            },
                            {
                                nome: "Desenvolvimento Arnold",
                                series: "4x10-12",
                                detalhes: "Rotação completa dos halteres",
                                imagem: "images/arnold-press.jpg"
                            },
                            {
                                nome: "Elevação Lateral (Série Descendente)",
                                series: "1x12+12+12",
                                detalhes: "Drop set triplo até a falha",
                                imagem: "images/elevacao-lateral.jpg"
                            },
                            {
                                nome: "Elevação Lateral na Polia Baixa",
                                series: "3x12-15",
                                detalhes: "Tensão constante no deltoide",
                                imagem: "images/elevacao-polia.jpg"
                            },
                            {
                                nome: "Elevação Frontal com Disco",
                                series: "3x12",
                                detalhes: "Segurar disco pelas laterais",
                                imagem: "images/elevacao-frontal.jpg"
                            },
                            {
                                nome: "Crucifixo Inverso na Polia",
                                series: "4x12-15",
                                detalhes: "Deltoides posteriores, controle total",
                                imagem: "images/crucifixo-inverso.jpg"
                            },
                            {
                                nome: "Remada Alta com Halteres",
                                series: "3x12",
                                detalhes: "Cotovelos acima dos punhos",
                                imagem: "images/remada-alta.jpg"
                            },
                            {
                                nome: "Face Pull",
                                series: "3x15-20",
                                detalhes: "Saúde dos ombros e deltoides posteriores",
                                imagem: "images/face-pull.jpg"
                            },
                            {
                                nome: "Encolhimento com Barra por Trás",
                                series: "3x12-15",
                                detalhes: "Trapézio médio e inferior",
                                imagem: "images/encolhimento.jpg"
                            }
                        ]
                    },
                    "Core & Abdômen": {
                        nome: "Core & Abdômen - Avançado",
                        exercicios: [
                            {
                                nome: "Prancha com Peso",
                                series: "4x60 segundos",
                                detalhes: "Adicionar anilha nas costas",
                                imagem: "images/IsJ36ICvUgBt.jpg"
                            },
                            {
                                nome: "Prancha Lateral com Elevação de Quadril",
                                series: "3x15 cada lado",
                                detalhes: "Movimento dinâmico dos oblíquos",
                                imagem: "images/prancha-lateral.jpg"
                            },
                            {
                                nome: "Abdominal na Polia Alta",
                                series: "4x15-20",
                                detalhes: "Resistência progressiva, controle",
                                imagem: "images/abdominal-polia.jpg"
                            },
                            {
                                nome: "Elevação de Pernas Suspensa",
                                series: "4x12-15",
                                detalhes: "Na barra fixa, sem balanço",
                                imagem: "images/elevacao-suspensa.jpg"
                            },
                            {
                                nome: "Dragon Flag",
                                series: "3x6-8",
                                detalhes: "Exercício avançado, core completo",
                                imagem: "images/dragon-flag.jpg"
                            },
                            {
                                nome: "Ab Wheel (Roda Abdominal)",
                                series: "3x10-12",
                                detalhes: "Controle na extensão completa",
                                imagem: "images/ab-wheel.jpg"
                            },
                            {
                                nome: "Russian Twist com Peso",
                                series: "3x30 (15 cada lado)",
                                detalhes: "Halter ou anilha, rotação completa",
                                imagem: "images/russian-twist.jpg"
                            },
                            {
                                nome: "Hollow Body Hold",
                                series: "3x30-45 segundos",
                                detalhes: "Posição de ginástica, tensão total",
                                imagem: "images/hollow-body.jpg"
                            },
                            {
                                nome: "Landmine Rotation",
                                series: "3x12 cada lado",
                                detalhes: "Rotação explosiva com barra",
                                imagem: "images/landmine.jpg"
                            }
                        ]
                    },
                    "Glúteo": {
                        nome: "Glúteo - Avançado",
                        exercicios: [
                            {
                                nome: "Hip Thrust com Barra Pesado",
                                series: "5x8-10",
                                detalhes: "Carga máxima, contração de 2s no topo",
                                imagem: "images/hip-thrust.jpg"
                            },
                            {
                                nome: "Hip Thrust Unilateral",
                                series: "3x10 cada perna",
                                detalhes: "Correção de assimetrias",
                                imagem: "images/hip-thrust-unilateral.jpg"
                            },
                            {
                                nome: "Agachamento Sumô com Barra",
                                series: "4x10-12",
                                detalhes: "Pés bem afastados, profundidade máxima",
                                imagem: "images/ZJX2PkJepVK9.jpg"
                            },
                            {
                                nome: "Levantamento Terra Sumô",
                                series: "4x8-10",
                                detalhes: "Foco em glúteos e adutores",
                                imagem: "images/terra-sumo.jpg"
                            },
                            {
                                nome: "Afundo Búlgaro com Barra",
                                series: "4x10 cada perna",
                                detalhes: "Barra nas costas, equilíbrio e força",
                                imagem: "images/afundo-bulgaro.jpg"
                            },
                            {
                                nome: "Stiff Unilateral",
                                series: "3x12 cada perna",
                                detalhes: "Equilíbrio e ativação isolada",
                                imagem: "images/EBy95aGDOIbN.jpg"
                            },
                            {
                                nome: "Abdutora + Adutora (Super Set)",
                                series: "4x15-20 cada",
                                detalhes: "Sem descanso entre máquinas",
                                imagem: "images/ES0yQgVK5qY9.jpg"
                            },
                            {
                                nome: "Coice na Polia com Caneleira",
                                series: "3x15 cada perna",
                                detalhes: "Extensão total, pico de contração",
                                imagem: "images/coice-polia.jpg"
                            },
                            {
                                nome: "Step Up com Halteres",
                                series: "3x12 cada perna",
                                detalhes: "Banco alto, explosão na subida",
                                imagem: "images/step-up.jpg"
                            }
                        ]
                    }
                }
            }
        ]
    };

    // --- Elementos do DOM ---
    const workoutGrid = document.getElementById('workout-levels');
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSummary = document.getElementById('modal-summary');
    const modalMuscleGroups = document.getElementById('modal-muscle-groups');
    const selectButton = document.getElementById('modal-select-button');
    const closeButton = document.getElementById('modal-close-button');
    const cancelButton = document.getElementById('modal-cancel-button');
    const badgeContainer = document.getElementById('selection-badge-container');

    let currentLevelId = null;
    let currentWorkoutType = null;
    let focusableElements = [];
    let firstFocusableElement, lastFocusableElement;

    // --- Funções ---

    /**
     * Renderiza os cards de nível na tela.
     */
    function renderLevelCards() {
        workoutGrid.innerHTML = '';
        workoutData.niveles.forEach(level => {
            const card = document.createElement('div');
            card.className = 'level-card';
            card.dataset.levelId = level.id;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Selecionar treino de nível ${level.nome}`);
            
            card.innerHTML = `
                <div class="icon" aria-hidden="true">${level.icon}</div>
                <h2>${level.nome}</h2>
                <p>${level.resumo.split('.')[0]}.</p>
            `;

            card.addEventListener('click', () => openModal(level.id));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(level.id);
                }
            });

            workoutGrid.appendChild(card);
        });
    }

    /**
     * Abre o modal com as informações do nível selecionado.
     * @param {string} levelId - O ID do nível a ser exibido.
     */
    function openModal(levelId) {
        currentLevelId = levelId;
        const level = workoutData.niveles.find(l => l.id === levelId);
        if (!level) return;

        modalTitle.textContent = level.nome;
        modalSummary.textContent = level.resumo;
        
        modalMuscleGroups.innerHTML = '';
        
        // Se o nível tem treinos específicos, mostra como botões clicáveis
        if (level.treinos) {
            level.grupos.forEach(grupo => {
                const tag = document.createElement('button');
                tag.className = 'muscle-group-tag clickable-tag';
                tag.textContent = grupo;
                tag.setAttribute('data-workout', grupo);
                tag.addEventListener('click', () => openWorkoutDetails(grupo));
                modalMuscleGroups.appendChild(tag);
            });
        } else {
            // Para outros níveis sem treinos, mostra os grupos musculares normais
            level.grupos.forEach(group => {
                const tag = document.createElement('span');
                tag.className = 'muscle-group-tag';
                tag.textContent = group;
                modalMuscleGroups.appendChild(tag);
            });
        }

        modal.hidden = false;
        document.body.style.overflow = 'hidden'; // Impede scroll do fundo

        // Gerenciamento de foco para acessibilidade
        focusableElements = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        firstFocusableElement.focus();

        document.addEventListener('keydown', trapFocus);
    }

    /**
     * Abre os detalhes de um treino específico
     * @param {string} workoutType - O tipo de treino (A, B ou C)
     */
    function openWorkoutDetails(workoutType) {
        currentWorkoutType = workoutType;
        const level = workoutData.niveles.find(l => l.id === currentLevelId);
        const treino = level.treinos[workoutType];
        
        if (!treino) return;

        // Atualiza o modal para mostrar os exercícios
        modalTitle.textContent = treino.nome;
        modalSummary.textContent = `Exercícios do ${workoutType}:`;
        
        modalMuscleGroups.innerHTML = '';
        
        // Cria uma lista de exercícios
        const exerciseList = document.createElement('div');
        exerciseList.className = 'exercise-list';
        
        treino.exercicios.forEach(exercicio => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            exerciseItem.innerHTML = `
                <div class="exercise-image">
                    <img src="${exercicio.imagem}" alt="${exercicio.nome}" loading="lazy" onerror="this.style.display='none'">
                </div>
                <div class="exercise-info">
                    <h4>${exercicio.nome}</h4>
                    <p class="exercise-series">${exercicio.series}</p>
                    <p class="exercise-details">${exercicio.detalhes}</p>
                </div>
            `;
            exerciseList.appendChild(exerciseItem);
        });
        
        modalMuscleGroups.appendChild(exerciseList);
        
        // Adiciona botão para voltar
        const backButton = document.createElement('button');
        backButton.className = 'button-secondary back-button';
        backButton.textContent = 'Voltar aos treinos';
        backButton.addEventListener('click', () => openModal(currentLevelId));
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(backButton);
        modalMuscleGroups.appendChild(buttonContainer);
    }

    /**
     * Fecha o modal.
     */
    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', trapFocus);
        // Devolve o foco para o card que abriu o modal
        const cardToFocus = workoutGrid.querySelector(`[data-level-id="${currentLevelId}"]`);
        if (cardToFocus) {
            cardToFocus.focus();
        }
    }

    /**
     * Mantém o foco dentro do modal (trap focus).
     * @param {KeyboardEvent} e - O evento de teclado.
     */
    function trapFocus(e) {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key !== 'Tab') return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }

    /**
     * Salva a seleção no localStorage e atualiza a UI.
     */
    function selectWorkout() {
        const selection = {
            levelId: currentLevelId,
            workoutType: currentWorkoutType,
            dateISO: new Date().toISOString()
        };
        localStorage.setItem('workoutSelection', JSON.stringify(selection));
        displaySelectionBadge();
        closeModal();
    }

    /**
     * Exibe o badge do treino selecionado com base no localStorage.
     */
    function displaySelectionBadge() {
        const savedSelection = localStorage.getItem('workoutSelection');
        badgeContainer.innerHTML = '';

        if (savedSelection) {
            const { levelId, workoutType } = JSON.parse(savedSelection);
            const level = workoutData.niveles.find(l => l.id === levelId);
            if (level) {
                const badge = document.createElement('div');
                badge.className = 'selection-badge';
                const displayText = workoutType ? 
                    `Treino selecionado: ${level.nome} - ${workoutType}` : 
                    `Treino selecionado: ${level.nome}`;
                badge.innerHTML = `
                    <span>${displayText}</span>
                    <button class="clear-selection-btn" aria-label="Limpar seleção">&times;</button>
                `;
                badgeContainer.appendChild(badge);

                badge.querySelector('.clear-selection-btn').addEventListener('click', clearSelection);
            }
        }
    }

    /**
     * Limpa a seleção do localStorage e remove o badge.
     */
    function clearSelection() {
        localStorage.removeItem('workoutSelection');
        displaySelectionBadge();
    }

    // --- Inicialização e Event Listeners ---

    renderLevelCards();
    displaySelectionBadge();

    selectButton.addEventListener('click', selectWorkout);
    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

