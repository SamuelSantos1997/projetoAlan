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
                grupos: ["Peito & Costas", "Bíceps & Tríceps", "Pernas", "Ombros", "Core & Abdômen"],
                resumo: "Aumente a intensidade e o volume para estimular o crescimento muscular e a força de forma consistente."
            },
            {
                id: "avancado",
                nome: "Avançado",
                icon: "🏆",
                grupos: ["Peito & Costas", "Bíceps & Tríceps", "Pernas", "Ombros", "Core & Abdômen"],
                resumo: "Desafie seus limites com técnicas avançadas, maior volume e intensidade para máxima performance."
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
        
        // Se for o nível iniciante, mostra os treinos específicos
        if (levelId === 'iniciante' && level.treinos) {
            level.grupos.forEach(grupo => {
                const tag = document.createElement('button');
                tag.className = 'muscle-group-tag clickable-tag';
                tag.textContent = grupo;
                tag.setAttribute('data-workout', grupo);
                tag.addEventListener('click', () => openWorkoutDetails(grupo));
                modalMuscleGroups.appendChild(tag);
            });
        } else {
            // Para outros níveis, mostra os grupos musculares normais
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

