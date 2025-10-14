
(function(){
  const status = localStorage.getItem("fitpanel_plan_status") || "Grátis";
  const venc = localStorage.getItem("fitpanel_plan_exp") || "—";
  document.getElementById("current-plan").innerText = status;
  document.getElementById("plan-exp").innerText = venc;
  document.getElementById("btn-simular").addEventListener("click", ()=>{
    localStorage.setItem("fitpanel_plan_status","Premium");
    const d = new Date(); d.setMonth(d.getMonth()+1);
    localStorage.setItem("fitpanel_plan_exp", d.toLocaleDateString("pt-BR"));
    location.reload();
  });
})();
