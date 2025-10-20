export default ({ router }) => {
  // Carrega o script do GA dinamicamente
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-CCWENBRM2X";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", "G-CCWENBRM2X");

  // Rastrear mudanças de rota
  router.afterEach((to) => {
    gtag("config", "G-CCWENBRM2X", { page_path: to.fullPath });
  });
};
