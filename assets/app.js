/* PDF++ 水印工坊 — small, dependency-free page script.
   Replace the four values below before publishing. */
const SITE = {
  downloadUrl: "https://github.com/xutiantian258/xutiantian258.github.io/releases/latest",
  contactEmail: "ykxu_1@163.com",
  githubUrl: "https://github.com/xutiantian258/xutiantian258.github.io",
  siteUrl: "https://xutiantian258.github.io"
};

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  /* ---------- contact dialog ---------- */

  const dialog = document.querySelector("[data-contact-dialog]");
  const dialogTitle = document.querySelector("[data-dialog-title]");
  const dialogDesc = document.querySelector("[data-dialog-desc]");
  const planBox = document.querySelector("[data-dialog-plan]");
  const planName = document.querySelector("[data-dialog-plan-name]");
  const planPrice = document.querySelector("[data-dialog-plan-price]");
  const emailButton = document.querySelector("[data-copy-email]");
  const emailLabel = emailButton ? emailButton.querySelector("[data-copy-label]") : null;
  const orderButton = document.querySelector("[data-copy-order]");
  const status = document.querySelector("[data-copy-status]");
  const closeButton = document.querySelector("[data-dialog-close]");
  const emailTexts = document.querySelectorAll("[data-contact-email]");
  const emailLabelDefault = emailLabel ? emailLabel.textContent : "";
  const orderLabelDefault = orderButton ? orderButton.textContent : "";

  let lastTrigger = null;
  let currentPlan = "";
  let currentPrice = "";
  let closeTimer = 0;
  let statusTimer = 0;
  let emailResetTimer = 0;
  let orderResetTimer = 0;

  emailTexts.forEach((element) => {
    element.textContent = SITE.contactEmail;
  });
  if (emailButton) {
    emailButton.setAttribute("aria-label", `复制邮箱 ${SITE.contactEmail}`);
  }

  function announce(message, state = "success") {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      status.textContent = "";
      delete status.dataset.state;
    }, 3600);
  }

  function resetCopyUi() {
    window.clearTimeout(statusTimer);
    window.clearTimeout(emailResetTimer);
    window.clearTimeout(orderResetTimer);
    if (status) {
      status.textContent = "";
      delete status.dataset.state;
    }
    if (emailButton) emailButton.classList.remove("is-copied");
    if (emailLabel) emailLabel.textContent = emailLabelDefault;
    if (orderButton) orderButton.textContent = orderLabelDefault;
  }

  function setDialogContent(plan, price) {
    currentPlan = plan || "";
    currentPrice = price || "";
    const hasPlan = Boolean(currentPlan);

    if (dialogTitle) {
      dialogTitle.textContent = hasPlan
        ? currentPlan === "机构版"
          ? "机构采购咨询"
          : `购买${currentPlan}`
        : "联系 PDF++";
    }

    if (dialogDesc) {
      dialogDesc.textContent = hasPlan
        ? currentPlan === "机构版"
          ? "复制邮箱，注明设备数量与开票需求，我会回复采购方案。"
          : `复制邮箱，把「${currentPlan}」和机器码发给我，确认后我会回复付款与激活方式。`
        : "复制邮箱，说明你的问题或需要的版本，通常一个工作日内回复。";
    }

    if (planBox) {
      planBox.hidden = !hasPlan;
      if (hasPlan && planName && planPrice) {
        planName.textContent = currentPlan;
        planPrice.textContent = currentPrice;
      }
    }
  }

  function openDialog(trigger, plan, price) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    const wasOpen = dialog.open;
    lastTrigger = trigger || document.activeElement;
    window.clearTimeout(closeTimer);
    resetCopyUi();
    setDialogContent(plan, price);
    dialog.classList.remove("is-closing");

    if (!wasOpen) {
      dialog.showModal();
      document.body.classList.add("dialog-open");
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        dialog.classList.add("is-open");
        if (!wasOpen && emailButton) {
          emailButton.focus({ preventScroll: true });
        }
      });
    });
  }

  function closeDialog() {
    if (!dialog || !dialog.open || dialog.classList.contains("is-closing")) return;
    window.clearTimeout(closeTimer);
    dialog.classList.remove("is-open");
    dialog.classList.add("is-closing");
    const delay = reduceMotion.matches ? 0 : 160;
    closeTimer = window.setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
      document.body.classList.remove("dialog-open");
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus({ preventScroll: true });
      }
    }, delay);
  }

  if (dialog) {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener("close", () => {
      window.clearTimeout(closeTimer);
      dialog.classList.remove("is-open", "is-closing");
      document.body.classList.remove("dialog-open");
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeDialog);
  }

  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      openDialog(button, button.getAttribute("data-plan"), button.getAttribute("data-price"));
    });
  });

  document.querySelectorAll("[data-contact]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openDialog(button, "", "");
    });
  });

  /* Clipboard with a fallback for browsers without the async API. */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        /* Fall through to execCommand. */
      }
    }

    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "-9999px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, area.value.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    area.remove();
    return copied;
  }

  if (emailButton) {
    emailButton.addEventListener("click", async () => {
      const copied = await copyText(SITE.contactEmail);
      if (!copied) {
        announce("复制失败，请长按邮箱地址手动复制", "error");
        return;
      }

      emailButton.classList.add("is-copied");
      if (emailLabel) emailLabel.textContent = "已复制 ✓";
      announce(`邮箱已复制：${SITE.contactEmail}`);
      window.clearTimeout(emailResetTimer);
      emailResetTimer = window.setTimeout(() => {
        emailButton.classList.remove("is-copied");
        if (emailLabel) emailLabel.textContent = emailLabelDefault;
      }, 2600);
    });
  }

  if (orderButton) {
    orderButton.addEventListener("click", async () => {
      const subject = currentPlan
        ? `购买 PDF++ 水印工坊 · ${currentPlan}`
        : "咨询 PDF++ 水印工坊";
      const body = currentPlan
        ? `你好，我想购买「${currentPlan}」${currentPrice ? `（${currentPrice}）` : ""}。\n\n我的机器码：\n\n备注：`
        : "你好，我想咨询 PDF++ 水印工坊。\n\n我的问题：";
      const message = `收件人：${SITE.contactEmail}\n主题：${subject}\n\n${body}`;
      const copied = await copyText(message);

      if (!copied) {
        announce("复制失败，请手动选择邮箱地址", "error");
        return;
      }

      orderButton.textContent = "已复制 ✓";
      announce("邮件内容已复制，粘贴到邮件正文即可");
      window.clearTimeout(orderResetTimer);
      orderResetTimer = window.setTimeout(() => {
        orderButton.textContent = orderLabelDefault;
      }, 2400);
    });
  }

  /* ---------- homepage interactions ---------- */

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