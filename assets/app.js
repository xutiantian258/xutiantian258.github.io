/* PDF++ 水印工坊 — small, dependency-free page script.
   Replace the four values below before publishing. */
const SITE = {
  downloadUrl: "https://github.com/xudadiao102/xudadiao102.github.io/releases/latest",
  contactEmail: "xudadiao102@gmail.com",
  githubUrl: "https://github.com/xudadiao102/xudadiao102.github.io",
  siteUrl: "https://xudadiao102.github.io"
};

(() => {
  "use strict";

  /* Header: hairline appears only after the page moves. */
  const header = document.querySelector("[data-header]");
  if (header) {
    const setHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* Download links all point at one configurable URL. */
  document.querySelectorAll("[data-download]").forEach((link) => {
    link.href = SITE.downloadUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });

  /* Contact links. */
  const contactHref = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent("PDF++ 水印工坊 · 购买咨询")}`;
  document.querySelectorAll("[data-contact]").forEach((link) => {
    link.href = contactHref;
  });

  /* Paid plans prefill a short purchase email with the plan name. */
  document.querySelectorAll("[data-plan]").forEach((link) => {
    const plan = link.getAttribute("data-plan");
    const subject = `购买 PDF++ 水印工坊 · ${plan}`;
    const body = [
      `你好，我想购买「${plan}」。`,
      "",
      "机器码（软件激活窗口里显示）：",
      "",
      "备注：",
      ""
    ].join("\n");
    link.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* GitHub / site links. */
  document.querySelectorAll("[data-github]").forEach((link) => {
    link.href = SITE.githubUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll("[data-site-url]").forEach((link) => {
    link.href = SITE.siteUrl;
    link.textContent = SITE.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  });

  /* Watermark switch in the product preview. */
  const toggle = document.querySelector("[data-watermark-toggle]");
  const watermark = document.querySelector("[data-watermark]");
  if (toggle && watermark) {
    toggle.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-checked") !== "true";
      toggle.setAttribute("aria-checked", String(next));
      watermark.classList.toggle("is-hidden", !next);
    });
  }

  /* Exclusive accordion fallback for browsers without <details name>. */
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();