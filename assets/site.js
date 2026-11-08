/* Medição (GA4 + Google Ads) com modo de consentimento, aviso de cookies e vídeos leves. */
(function () {
  var GA4 = "G-3L1E9K3MMR";
  var ADS = "AW-11130199341";
  // Rótulo da conversão "Clique no WhatsApp" criada no Google Ads (preencher após criar a conversão).
  var ADS_ROTULO_WHATSAPP = "";

  var producao = /(^|\.)arnslauro\.com\.br$|\.github\.io$/.test(location.hostname);
  var CHAVE = "consentimento-cookies";

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function lerEscolha() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function salvarEscolha(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  var escolha = lerEscolha();
  var negado = { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  var aceito = { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" };

  // Começa sempre negado; quem não aceita ainda é contado de forma anônima (sem cookies).
  gtag("consent", "default", escolha === "aceito" ? aceito : negado);
  gtag("js", new Date());
  gtag("config", GA4);
  gtag("config", ADS);

  if (producao) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4;
    document.head.appendChild(s);
  }

  // Clique em qualquer botão de WhatsApp vira evento no GA4 e conversão no Google Ads.
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[data-wa]");
    if (!link) return;
    var pagina = document.body.getAttribute("data-pagina") || "inicio";
    gtag("event", "clique_whatsapp", { pagina: pagina, posicao: link.getAttribute("data-wa") });
    if (ADS_ROTULO_WHATSAPP) gtag("event", "conversion", { send_to: ADS + "/" + ADS_ROTULO_WHATSAPP });
  });

  // Aviso de cookies
  var aviso = document.getElementById("cookies");
  function fecharAviso() { if (aviso) aviso.hidden = true; }
  function decidir(v) {
    salvarEscolha(v);
    gtag("consent", "update", v === "aceito" ? aceito : negado);
    fecharAviso();
  }
  if (aviso) {
    if (!escolha) aviso.hidden = false;
    aviso.querySelector(".aceitar").addEventListener("click", function () { decidir("aceito"); });
    aviso.querySelector(".recusar").addEventListener("click", function () { decidir("recusado"); });
  }
  var rever = document.getElementById("rever-cookies");
  if (rever && aviso) rever.addEventListener("click", function () { aviso.hidden = false; });

  // Página de sentido: título muda conforme o anúncio (?tema=esgotamento ou ?tema=crise)
  var tema = new URLSearchParams(location.search).get("tema");
  var variantes = document.querySelectorAll("[data-tema]");
  if (tema && document.querySelector('[data-tema="' + tema + '"]')) {
    variantes.forEach(function (el) { el.hidden = el.getAttribute("data-tema") !== tema; });
  }

  // Carrossel: setas e um vídeo por vez
  document.querySelectorAll(".midia-sec").forEach(function (sec) {
    var trilho = sec.querySelector(".carrossel");
    sec.querySelectorAll(".seta").forEach(function (b) {
      b.addEventListener("click", function () {
        var slide = trilho.querySelector(".slide");
        var passo = slide ? slide.getBoundingClientRect().width + 18 : 300;
        trilho.scrollBy({ left: passo * Number(b.getAttribute("data-dir")), behavior: "smooth" });
      });
    });
  });
  document.addEventListener("play", function (e) {
    document.querySelectorAll("video").forEach(function (v) { if (v !== e.target) v.pause(); });
  }, true);

  // Vídeos: só carregam o YouTube quando a pessoa clica (página mais leve).
  document.querySelectorAll(".video[data-yt]").forEach(function (box) {
    var id = box.getAttribute("data-yt");
    var capa = box.querySelector("img[data-hq]");
    if (producao && capa) {
      var hq = new Image();
      hq.onload = function () { capa.src = hq.src; };
      hq.src = capa.getAttribute("data-hq");
    }
    var btn = box.querySelector("a");
    if (!btn || !producao) return; // fora do site oficial, o link abre o vídeo no YouTube
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
      f.title = btn.getAttribute("aria-label") || "Vídeo";
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      box.classList.add("tocando");
      box.replaceChildren(f);
    });
  });
})();
