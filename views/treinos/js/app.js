document.addEventListener('DOMContentLoaded', () => {

    // URL vem do config.js (importado no HTML)

    // Estado do usuário premium
    let isUserPremium = false;

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

    // Verificar status premium do usuário
    async function checkPremiumStatus() {
        const token = localStorage.getItem("userToken");
        if (!token) {
            isUserPremium = false;
            return;
        }

        try {
            const response = await fetch(`${BFF_BASE_URL}/bff/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const result = await response.json();
                const user = result.data || result;
                isUserPremium = !!user.premium;
            } else {
                isUserPremium = false;
            }
        } catch (error) {
            console.error("Erro ao verificar status premium:", error);
            isUserPremium = false;
        }
    }

    // Definir quais treinos são bloqueados para não-premium
    // Avançado: todos bloqueados
    // Médio: alguns bloqueados (Ombros, Core & Abdômen, Glúteo)
    function isWorkoutLocked(levelId, workoutType) {
        if (isUserPremium) return false;

        if (levelId === "avancado") {
            return true; // Todos os avançados são premium
        }

        if (levelId === "medio") {
            const lockedMedioWorkouts = ["Ombros", "Core & Abdômen", "Glúteo"];
            return lockedMedioWorkouts.includes(workoutType);
        }

        return false; // Iniciante é sempre liberado
    }

    // Verificar se o nível inteiro é bloqueado
    function isLevelLocked(levelId) {
        if (isUserPremium) return false;
        return levelId === "avancado";
    }

    // Verificar se o nível tem treinos bloqueados
    function levelHasLockedWorkouts(levelId) {
        if (isUserPremium) return false;
        return levelId === "medio" || levelId === "avancado";
    }

    // Mapeia o id do nível textual para o enum esperado pelo backend
    function mapLevelIdToEnum(levelId) {
        switch (levelId) {
            case "iniciante":
                return "INICIANTE";
            case "medio":
                return "INTERMEDIARIO";
            case "avancado":
                return "AVANCADO";
            default:
                return "INICIANTE";
        }
    }

    // IDs estáticos de treinos com base nos treinos definidos neste front
    function mapWorkoutToTreinoId(levelId, workoutType) {
        const key = `${levelId}::${workoutType}`;
        const mapping = {
            "iniciante::Treino A": 1,
            "iniciante::Treino B": 2,
            "iniciante::Treino C": 3,
            "medio::Peito & Costas": 4,
            "medio::Bíceps & Tríceps": 5,
            "medio::Pernas": 6,
            "medio::Ombros": 7,
            "medio::Core & Abdômen": 8,
            "medio::Glúteo": 9,
            "avancado::Peito & Costas": 10,
            "avancado::Bíceps & Tríceps": 11,
            "avancado::Pernas": 12,
            "avancado::Ombros": 13,
            "avancado::Core & Abdômen": 14,
            "avancado::Glúteo": 15
        };

        return mapping[key] || 0;
    }

    // Mapeamento de ícones por tipo de exercício
    const exerciseIcons = {
        'agachamento': '🦵', 'leg press': '🦵', 'extensora': '🦵', 'flexora': '🦵', 'hack': '🦵',
        'afundo': '🦿', 'stiff': '🦿', 'panturrilha': '🦶',
        'rosca': '💪', 'bíceps': '💪', 'tríceps': '💪', 'mergulho': '💪',
        'supino': '🏋️', 'crucifixo': '🏋️', 'voador': '🏋️', 'peck': '🏋️',
        'puxada': '🔙', 'puxador': '🔙', 'remada': '🔙', 'barra fixa': '🔙', 'pullover': '🔙',
        'desenvolvimento': '🎯', 'elevação': '🎯', 'arnold': '🎯', 'encolhimento': '🎯', 'face pull': '🎯',
        'prancha': '🧘', 'abdominal': '🧘', 'mountain': '🧘', 'russian': '🧘', 'dragon': '🧘', 'hollow': '🧘', 'ab wheel': '🧘', 'landmine': '🧘',
        'hip thrust': '🍑', 'abdutora': '🍑', 'adutora': '🍑', 'glúteo': '🍑', 'coice': '🍑', 'step up': '🍑', 'elevação pélvica': '🍑',
        'terra': '🏋️‍♂️', 'levantamento': '🏋️‍♂️'
    };

    function getExerciseIcon(exerciseName) {
        const name = exerciseName.toLowerCase();
        for (const [key, icon] of Object.entries(exerciseIcons)) {
            if (name.includes(key)) return icon;
        }
        return '💪';
    }

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

    // --- Estado do treino em andamento / timer ---
    let currentTimerInterval = null;
    let workoutStartTime = null;
    let currentWorkoutInProgress = null; // { userId, levelId, workoutType, startTimeISO }
    let isWorkoutInProgress = false;

    // --- Funções ---

    /**
     * Renderiza os cards de nível na tela.
     */
    function renderLevelCards() {
        workoutGrid.innerHTML = '';
        workoutData.niveles.forEach(level => {
            const card = document.createElement('div');
            const locked = isLevelLocked(level.id);
            const hasLocked = levelHasLockedWorkouts(level.id);

            card.className = 'level-card' + (locked ? ' locked' : '');
            card.dataset.levelId = level.id;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Selecionar treino de nível ${level.nome}${locked ? ' (Premium)' : ''}`);

            // Badge premium para níveis com conteúdo bloqueado
            const premiumBadge = (locked || hasLocked) ? '<span class="premium-badge">PREMIUM</span>' : '';
            const lockIcon = locked ? '<span class="lock-icon">🔒</span>' : '';

            card.innerHTML = `
                ${premiumBadge}
                <div class="icon" aria-hidden="true">${level.icon}${lockIcon}</div>
                <h2>${level.nome}</h2>
                <p>${level.resumo.split('.')[0]}.</p>
            `;

            card.addEventListener('click', () => {
                if (locked) {
                    showPremiumModal();
                } else {
                    openModal(level.id);
                }
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (locked) {
                        showPremiumModal();
                    } else {
                        openModal(level.id);
                    }
                }
            });

            workoutGrid.appendChild(card);
        });
    }

    /**
     * Mostra modal para assinar premium
     */
    function showPremiumModal() {
        modalTitle.textContent = "Conteúdo Premium 🔒";
        modalSummary.textContent = "Este treino está disponível apenas para assinantes Premium. Assine agora e tenha acesso a todos os treinos avançados e exclusivos!";

        modalMuscleGroups.innerHTML = `
            <div class="premium-promo">
                <h3>Benefícios Premium:</h3>
                <ul>
                    <li>✅ Acesso a todos os treinos avançados</li>
                    <li>✅ Treinos médios exclusivos (Ombros, Core, Glúteo)</li>
                    <li>✅ Acompanhamento personalizado</li>
                    <li>✅ Suporte prioritário</li>
                </ul>
                <p class="premium-price">Por apenas <strong>R$ 39,90/mês</strong></p>
            </div>
        `;

        // Esconder botão "Iniciar Treino" e mostrar botão de assinar
        selectButton.textContent = "Assinar Premium";
        selectButton.onclick = () => {
            window.location.href = "/views/premium/index.html";
        };

        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        focusableElements = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        firstFocusableElement.focus();

        document.addEventListener('keydown', trapFocus);
    }

    /**
     * Abre o modal com as informações do nível selecionado.
     * @param {string} levelId - O ID do nível a ser exibido.
     */
    function openModal(levelId) {
        currentLevelId = levelId;
        const level = workoutData.niveles.find(l => l.id === levelId);
        if (!level) return;

        // Restaurar comportamento padrão do botão
        selectButton.textContent = "Iniciar Treino";
        selectButton.onclick = null;

        modalTitle.textContent = level.nome;
        modalSummary.textContent = level.resumo;

        modalMuscleGroups.innerHTML = '';

        // Se o nível tem treinos específicos, mostra como botões clicáveis
        if (level.treinos) {
            level.grupos.forEach(grupo => {
                const tag = document.createElement('button');
                const locked = isWorkoutLocked(levelId, grupo);

                tag.className = 'muscle-group-tag clickable-tag' + (locked ? ' locked' : '');
                tag.textContent = locked ? `🔒 ${grupo}` : grupo;
                tag.setAttribute('data-workout', grupo);

                if (locked) {
                    tag.addEventListener('click', () => showPremiumModal());
                } else {
                    tag.addEventListener('click', () => openWorkoutDetails(grupo));
                }

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
            const icon = getExerciseIcon(exercicio.nome);
            exerciseItem.innerHTML = `
                <div class="exercise-icon-box">
                    <span class="exercise-emoji">${icon}</span>
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
     * Exibe o badge do treino em andamento (se houver).
     */
    function displaySelectionBadge() {
        badgeContainer.innerHTML = '';

        // Se houver treino em andamento, mostra badge especial
        if (isWorkoutInProgress && currentWorkoutInProgress) {
            const level = workoutData.niveles.find(l => l.id === currentWorkoutInProgress.levelId);
            if (level) {
                const badge = document.createElement('div');
                badge.className = 'selection-badge in-progress';
                badge.innerHTML = `
                    <span>⏱ <strong>Em andamento</strong></span>
                    <button class="button-primary" id="view-current-workout-btn">Ver treino</button>
                `;
                badgeContainer.appendChild(badge);

                const viewBtn = document.getElementById('view-current-workout-btn');
                viewBtn.addEventListener('click', () => {
                    renderCurrentWorkoutViewFromState();
                });
            }
        }
    }

    /**
     * Inicia o cronômetro do treino em andamento.
     */
    function startTimer() {
        if (!workoutStartTime) return;

        if (currentTimerInterval) {
            clearInterval(currentTimerInterval);
        }

        currentTimerInterval = setInterval(() => {
            const now = new Date();
            const diffMs = now - workoutStartTime;
            const totalSeconds = Math.floor(diffMs / 1000);

            const horas = Math.floor(totalSeconds / 3600);
            const minutos = Math.floor((totalSeconds % 3600) / 60);
            const segundos = totalSeconds % 60;

            const timerEl = document.getElementById('workout-timer');
            if (timerEl) {
                timerEl.textContent = [
                    String(horas).padStart(2, '0'),
                    String(minutos).padStart(2, '0'),
                    String(segundos).padStart(2, '0')
                ].join(':');
            }
        }, 1000);
    }

    /**
     * Renderiza na TELA PRINCIPAL o treino em andamento
     */
    function renderCurrentWorkoutViewFromState() {
        if (!currentWorkoutInProgress) {
            return;
        }

        const level = workoutData.niveles.find(l => l.id === currentWorkoutInProgress.levelId);
        const treino = level?.treinos?.[currentWorkoutInProgress.workoutType];
        if (!level || !treino) {
            return;
        }

        isWorkoutInProgress = true;

        workoutGrid.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'current-workout-view';

        // Ícone baseado no nível
        const levelIcons = {
            'iniciante': '🌱',
            'medio': '🔥',
            'avancado': '🏆'
        };
        const icon = levelIcons[level.id] || '💪';

        const totalSeries = treino.exercicios.reduce((acc, ex) => {
            const match = ex.series.match(/^(\d+)/);
            return acc + (match ? parseInt(match[1]) : 0);
        }, 0);

        container.innerHTML = `
            <div class="current-workout-header">
                <div class="current-workout-header-content">
                    <div class="workout-info">
                        <span class="workout-icon">${icon}</span>
                        <div class="workout-text">
                            <h2>${treino.nome}</h2>
                            <p class="workout-subtitle">${level.nome}</p>
                        </div>
                    </div>
                    <div class="current-workout-timer">
                        <span class="timer-label">Tempo</span>
                        <span id="workout-timer">00:00:00</span>
                    </div>
                    <div class="current-workout-stats">
                        <div class="stat-item">
                            <div class="stat-value">${treino.exercicios.length}</div>
                            <div class="stat-label">Exercícios</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${totalSeries}</div>
                            <div class="stat-label">Séries</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="exercise-list current-workout-exercise-list"></div>
            <div class="current-workout-footer">
                <button id="finish-workout-main-button" class="button-primary">
                    ✓ Finalizar treino
                </button>
            </div>
        `;

        workoutGrid.appendChild(container);

        const exerciseListEl = container.querySelector('.current-workout-exercise-list');

        treino.exercicios.forEach((exercicio) => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            const icon = getExerciseIcon(exercicio.nome);
            exerciseItem.innerHTML = `
                <div class="exercise-icon-box">
                    <span class="exercise-emoji">${icon}</span>
                </div>
                <div class="exercise-info">
                    <h4>${exercicio.nome}</h4>
                    <p class="exercise-series">${exercicio.series}</p>
                    <p class="exercise-details">${exercicio.detalhes}</p>
                </div>
            `;
            exerciseListEl.appendChild(exerciseItem);
        });

        const finishBtn = document.getElementById('finish-workout-main-button');
        finishBtn.addEventListener('click', finalizarTreino);
    }

    /**
     * Finaliza o treino atual e envia para o BFF
     */
    async function finalizarTreino() {
        if (!currentWorkoutInProgress || !workoutStartTime) {
            return;
        }

        const endTime = new Date();
        const diffMs = endTime - workoutStartTime;
        const totalSeconds = Math.floor(diffMs / 1000);

        const duracaoMinutos = Math.round(totalSeconds / 60);

        const userId = currentWorkoutInProgress.userId;
        const treinoId = mapWorkoutToTreinoId(
            currentWorkoutInProgress.levelId,
            currentWorkoutInProgress.workoutType
        );
        const nivelTreinoEnum = mapLevelIdToEnum(currentWorkoutInProgress.levelId);

        const year = endTime.getFullYear();
        const month = String(endTime.getMonth() + 1).padStart(2, '0');
        const day = String(endTime.getDate()).padStart(2, '0');
        const data = `${year}-${month}-${day}`;

        const payload = {
            usuarioId: userId,
            treino: String(treinoId),
            duracao: duracaoMinutos,
            data: data,
            nivel: nivelTreinoEnum
        };

        console.log("Payload enviado para o BFF:", payload);

        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = "/views/login/index.html";
            return;
        }

        try {
            const resp = await fetch(`${BFF_BASE_URL}/bff/frequencias`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const json = await resp.json();
            console.log("Resposta do BFF:", json);

            if (!resp.ok || !json.success) {
                console.error("Erro completo:", json);
                throw new Error(json.message || "Falha ao registrar frequência");
            }

        } catch (err) {
            console.error("Erro ao finalizar treino:", err);
        } finally {
            if (currentTimerInterval) {
                clearInterval(currentTimerInterval);
                currentTimerInterval = null;
            }
            workoutStartTime = null;
            currentWorkoutInProgress = null;
            localStorage.removeItem('currentWorkout');
            localStorage.removeItem('workoutSelection');
            isWorkoutInProgress = false;

            displaySelectionBadge();
            closeModal();
            renderLevelCards();
        }
    }

    /**
     * Inicia o treino a partir do modal
     */
    function startWorkout() {
        const userId = getLoggedUserId();
        if (!userId) return;

        if (!currentLevelId || !currentWorkoutType) {
            return;
        }

        const selection = {
            levelId: currentLevelId,
            workoutType: currentWorkoutType,
            dateISO: new Date().toISOString()
        };
        localStorage.setItem('workoutSelection', JSON.stringify(selection));

        workoutStartTime = new Date();
        currentWorkoutInProgress = {
            userId,
            levelId: currentLevelId,
            workoutType: currentWorkoutType,
            startTimeISO: workoutStartTime.toISOString()
        };
        localStorage.setItem('currentWorkout', JSON.stringify(currentWorkoutInProgress));

        isWorkoutInProgress = true;

        displaySelectionBadge();
        closeModal();
        renderCurrentWorkoutViewFromState();
        startTimer();
    }

    // --- Inicialização e Event Listeners ---

    // Inicialização assíncrona
    async function init() {
        // Verificar status premium antes de renderizar
        await checkPremiumStatus();

        // Primeiro, tenta restaurar o treino em andamento
        const savedCurrent = localStorage.getItem('currentWorkout');
        if (savedCurrent) {
            try {
                const current = JSON.parse(savedCurrent);
                currentWorkoutInProgress = current;
                workoutStartTime = new Date(current.startTimeISO);
                isWorkoutInProgress = true;
            } catch (e) {
                console.error("Erro ao restaurar treino em andamento:", e);
                localStorage.removeItem('currentWorkout');
            }
        }

        displaySelectionBadge();

        // Se houver treino em andamento, renderiza e inicia timer
        if (currentWorkoutInProgress && workoutStartTime) {
            renderCurrentWorkoutViewFromState();
            startTimer();
        } else {
            renderLevelCards();
        }
    }

    // Chamar inicialização
    init();

    selectButton.addEventListener('click', startWorkout);
    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

