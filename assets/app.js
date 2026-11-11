/* PDF++ 水印工坊 — small, dependency-free page script. */

/* ---------------- 下载配置 ----------------
   换版本 / 换仓库只改这里，index.html 里的链接会被下面的脚本覆盖。

   Gitee 直链格式：/releases/download/<tag>/<文件名>
   点击后直接开始下载，不会先跳到发行版页面；国内速度正常。
   GitHub 只作为备用线路，放在 `fallbackUrl`。 */
const DOWNLOAD = {
  giteeRepo: "xutiantian_1/pdfplus-watermark",
  tag: "v1.6.0",
  asset: "WatermarkTrace-v1.6.0-win64.zip",
  size: "71 MB",
  sha256: "518e3ea3c42f36e020a17fd0cd5d9e64b01ef42f9a61e2db72077984385bfb85",
  fallbackUrl: "https://github.com/xutiantian258/xutiantian258.github.io/releases/latest"
};

function giteeDirectUrl() {
  if (!DOWNLOAD.giteeRepo || !DOWNLOAD.tag || !DOWNLOAD.asset) return "";
  return (
    "https://gitee.com/" +
    DOWNLOAD.giteeRepo +
    "/releases/download/" +
    encodeURIComponent(DOWNLOAD.tag) +
    "/" +
    encodeURIComponent(DOWNLOAD.asset)
  );
}

const SITE = {
  downloadUrl: giteeDirectUrl(),
  downloadFallbackUrl: DOWNLOAD.fallbackUrl,
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

  /* Download links all point at the Gitee direct URL (GitHub is the spare line). */
  const primaryDownload = SITE.downloadUrl || SITE.downloadFallbackUrl;
  document.querySelectorAll("[data-download]").forEach((link) => {
    link.href = primaryDownload;
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll("[data-download-fallback]").forEach((link) => {
    link.href = SITE.downloadFallbackUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll("[data-download-size]").forEach((node) => {
    if (DOWNLOAD.size) node.textContent = DOWNLOAD.size;
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
  const tabs = Array.from(document.querySelectorAll("[data-contact-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-contact-panel]"));
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

  function selectTab(name, focusTab = false) {
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      const active = tab.getAttribute("data-contact-tab") === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus({ preventScroll: true });
    });
    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-contact-panel") !== name;
    });
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
    selectTab("email");
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

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectTab(tab.getAttribute("data-contact-tab"));
    });

    tab.addEventListener("keydown", (event) => {
      const key = event.key;
      if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") {
        return;
      }
      event.preventDefault();
      let nextIndex;
      if (key === "Home") {
        nextIndex = 0;
      } else if (key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        const direction = key === "ArrowRight" ? 1 : -1;
        nextIndex = (index + direction + tabs.length) % tabs.length;
      }
      selectTab(tabs[nextIndex].getAttribute("data-contact-tab"), true);
    });
  });

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