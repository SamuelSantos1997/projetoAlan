// URL vem do config.js (importado no HTML)

(function() {
  const currentPlanEl = document.getElementById("current-plan");
  const planExpEl = document.getElementById("plan-exp");
  const cardAssinar = document.getElementById("card-assinar");
  const cardPremiumAtivo = document.getElementById("card-premium-ativo");
  const btnAssinar = document.getElementById("btn-assinar");
  const errorMessage = document.getElementById("error-message");

  // Carregar status do usuário ao iniciar
  carregarStatusPremium();

  // Evento de clique no botão assinar
  btnAssinar.addEventListener("click", iniciarCheckout);

  async function carregarStatusPremium() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      currentPlanEl.innerText = "Grátis";
      planExpEl.innerText = "—";
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

      if (!response.ok) {
        throw new Error("Falha ao carregar dados do usuário");
      }

      const result = await response.json();
      const user = result.data || result;

      if (user.premium) {
        currentPlanEl.innerText = "Premium";
        currentPlanEl.style.color = "#28a745";

        if (user.premiumAte) {
          const dataExp = new Date(user.premiumAte);
          planExpEl.innerText = dataExp.toLocaleDateString("pt-BR");
        } else {
          planExpEl.innerText = "Ativo";
        }

        // Esconder card de assinar e mostrar card de premium ativo
        cardAssinar.style.display = "none";
        cardPremiumAtivo.style.display = "block";
      } else {
        currentPlanEl.innerText = "Grátis";
        planExpEl.innerText = "—";
        cardAssinar.style.display = "block";
        cardPremiumAtivo.style.display = "none";
      }
    } catch (error) {
      console.error("Erro ao carregar status premium:", error);
      currentPlanEl.innerText = "Grátis";
      planExpEl.innerText = "—";
    }
  }

  async function iniciarCheckout() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      mostrarErro("Você precisa estar logado para assinar o plano Premium.");
      setTimeout(() => {
        window.location.href = "/views/login/index.html";
      }, 2000);
      return;
    }

    // Desabilitar botão e mostrar loading
    btnAssinar.disabled = true;
    btnAssinar.innerText = "Processando...";
    esconderErro();

    try {
      const response = await fetch(`${BFF_BASE_URL}/bff/premium/checkout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Falha ao criar checkout");
      }

      const checkoutData = result.data;

      if (checkoutData && checkoutData.checkoutUrl) {
        // Redirecionar para a página de pagamento do AbacatePay
        window.location.href = checkoutData.checkoutUrl;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
      mostrarErro(error.message || "Erro ao processar pagamento. Verifique se seu CPF e telefone estão cadastrados no perfil.");
      btnAssinar.disabled = false;
      btnAssinar.innerText = "Assinar Premium — R$ 39,90";
    }
  }

  function mostrarErro(mensagem) {
    errorMessage.innerText = mensagem;
    errorMessage.style.display = "block";
  }

  function esconderErro() {
    errorMessage.style.display = "none";
  }
})();
