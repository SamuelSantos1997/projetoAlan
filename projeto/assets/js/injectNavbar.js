
/**
 * Injects the shared navbar into any page that includes this script.
 * Requires that /views/partials/navbar.html exists and the page has <div id="navbar"></div>
 */
(async () => {
  const hostRoot = location.pathname.startsWith("/views") ? "/" : "";
  const navbarUrl = hostRoot + "views/partials/navbar.html";
  try {
    const res = await fetch(navbarUrl);
    const html = await res.text();
    const mount = document.getElementById("navbar");
    if (mount) {
      mount.innerHTML = html;
      // Mark active link by pathname
      const path = location.pathname.replace(/index\.html$/,"");
      const links = mount.querySelectorAll("a[data-route]");
      links.forEach(a => {
        const r = a.getAttribute("data-route");
        if (path.includes(r)) a.classList.add("active");
      });
    }
  } catch (e) {
    console.error("Navbar injection failed:", e);
  }
})();
