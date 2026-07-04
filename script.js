/* ============================================================
   告别清单 / Farewell List - 主页交互
   呼吸感 + 仪式感（与 App 微交互对齐）
   - 主题切换（localStorage 记忆）
   - 今日金句（按 dayOfYear % 30 取模，与 app 同步）
   - 逐字打字机揭示金句（SplashQuoteView 对齐）
   - 错峰滚动入场（DiaryListView 0.06s * index 对齐）
   - 朱砂圆圈双击反馈（Ceremony 对齐）
   - Nav-scroll 透明过渡
   ============================================================ */

// ---------- 30 句金句（来自 daily_quotes.json，跟 app 同步） ----------
const QUOTES = [
  { text: "拥有得愈少，自由便愈多。", attr: "断舍离·前言" },
  { text: "我们占有的东西，最终也在占有我们。", attr: "亨利·戴维·梭罗" },
  { text: "把房间里多余的东西都送走，剩下的就是真正需要照料的自己。", attr: "近藤麻理惠" },
  { text: "少买一件不必之物，便少一次日后的告别。", attr: "未知" },
  { text: "极简不是清空生活，而是为重要的事腾出空间。", attr: "约书亚·贝克尔" },
  { text: "衣橱里悬挂的，应当是真正会被穿上的那一件。", attr: "断舍离·衣物" },
  { text: "空间清爽了，心也就清爽了。", attr: "未知" },
  { text: "若一件物品不能让你心动、不为你所用，便不必再为它停留。", attr: "近藤麻理惠" },
  { text: "先断，再舍，后离——顺序不能颠倒。", attr: "断舍离三步骤" },
  { text: "减物的过程，也是减念的过程。", attr: "未知" },
  { text: "桌上的杂物越少，专注的时间就越长。", attr: "极简主义者访谈" },
  { text: "少，则得；多，则惑。", attr: "老子·《道德经》" },
  { text: "不为物累，是内在的自由。", attr: "未知" },
  { text: "拥有的少，反而让你更专注真正在用的东西。", attr: "未知" },
  { text: "扔下一件物品，是为新的可能腾出空间。", attr: "未知" },
  { text: "真正的极简，是留下让你心动的东西。", attr: "近藤麻理惠" },
  { text: "把不重要的东西放下，重要的东西才会浮现。", attr: "未知" },
  { text: "当你不再为物品所累时，你才能听见自己真正想要什么。", attr: "未知" },
  { text: "家不是仓库，是让人放松的地方。", attr: "未知" },
  { text: "生活不必拥有全部，懂得取舍才更重要。", attr: "未知" },
  { text: "一件物品不必永远跟着你，它的使命可以结束。", attr: "未知" },
  { text: "把不再使用的东西送走，也是一种让爱流动的方式。", attr: "未知" },
  { text: "心无旁骛，是减少干扰的开始。", attr: "未知" },
  { text: "极简生活，是从过载中主动撤退。", attr: "未知" },
  { text: "生活不必满，留白也是充实的一部分。", attr: "未知" },
  { text: "扔掉它不是否定它，是承认它使命已尽。", attr: "未知" },
  { text: "数字时代的极简，是为通知、邮件、订阅也设一道门。", attr: "极简·数字" },
  { text: "一物一用，是秩序；一物多用，是将就。", attr: "未知" },
  { text: "在能力之内简朴，在简朴之内自由。", attr: "未知" },
  { text: "每一次告别，都是为下一次相遇腾出空间。", attr: "未知" }
];

// ---------- 今日金句（与 app 同步：dayOfYear % 30） ----------
function getTodayQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}

// ---------- 仪式感 · 逐字打字机（对应 app SplashQuoteView 逐字揭示 0.15s/字） ----------
function typeQuote(el, text, interval, callback) {
  el.innerHTML = "";
  el.style.visibility = "visible";
  const chars = text.split("");
  let i = 0;

  function typeChar() {
    if (i >= chars.length) {
      if (callback) callback();
      return;
    }
    const span = document.createElement("span");
    span.textContent = chars[i];
    span.className = "char-reveal";
    span.style.setProperty("animation-delay", "0s");
    el.appendChild(span);
    i++;
    setTimeout(typeChar, interval);
  }

  typeChar();
}

function renderQuoteWithTypewriter() {
  const q = getTodayQuote();
  const quoteEl = document.getElementById("today-quote");
  const attrEl = document.getElementById("today-attr");

  if (!quoteEl) return;

  // 先设 text content 让 spacing 算对，同时保持 visibility hidden
  quoteEl.textContent = q.text;
  quoteEl.style.visibility = "hidden";

  // 0.3s 后开始打字
  setTimeout(() => {
    typeQuote(quoteEl, q.text, 50, () => {
      // 最后带一小延迟，然后出处淡入
      setTimeout(() => {
        if (attrEl) {
          attrEl.textContent = "— " + q.attr;
          attrEl.style.opacity = "0";
          attrEl.style.transition = "opacity 0.4s ease-out";
          // 触发 reflow
          attrEl.getBoundingClientRect();
          attrEl.style.opacity = "1";
        }
      }, 300);
    });
  }, 300);
}

// ---------- 主题切换 ----------
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("farewell-theme", theme);
  } catch (e) {}
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("farewell-theme");
    if (saved && ["light", "dark", "ink"].includes(saved)) return saved;
  } catch (e) {}
  return "light";
}

function bindThemeButtons() {
  const buttons = document.querySelectorAll(".theme-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      setTheme(theme);
    });
  });

  // 主题卡片点击也可切换
  const themeCards = document.querySelectorAll(".theme-card");
  themeCards.forEach(card => {
    card.addEventListener("click", () => {
      const theme = card.getAttribute("data-theme");
      setTheme(theme);
      document.getElementById("design").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---------- 呼吸感 · 错峰滚动入场（对应 app DiaryListView 0.06s * index） ----------
function bindScrollSpringIn() {
  if (!("IntersectionObserver" in window)) return;

  // 逐组优雅入场
  const groups = [
    { sel: ".method-card", delayBase: 0, delayStep: 0.06 },
    { sel: ".theme-card", delayBase: 0, delayStep: 0.08 },
    { sel: ".privacy-item", delayBase: 0, delayStep: 0.06 },
    { sel: ".ceremony", delayBase: 0, delayStep: 0 },
    { sel: ".splash-showcase", delayBase: 0, delayStep: 0 },
    { sel: ".faq-item", delayBase: 0, delayStep: 0.04 },
  ];

  groups.forEach(group => {
    const targets = document.querySelectorAll(group.sel);
    if (targets.length === 0) return;

    targets.forEach(t => {
      t.style.opacity = "0";
      t.style.transform = "translateY(16px) scale(0.96)";
      t.style.transition = "none";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(targets).indexOf(entry.target);
          const delay = group.delayBase + index * group.delayStep;
          const el = entry.target;
          el.style.transition = `opacity 0.5s cubic-bezier(0.28, 0.6, 0.32, 1) ${delay}s, transform 0.5s cubic-bezier(0.28, 0.6, 0.32, 1) ${delay}s`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(t => observer.observe(t));
  });
}

// ---------- 拍立得显影（对应 app FarewellCardView 拍立得白边卡片） ----------
// 每次点击：升起空白卡 → 渐显影 → 最终定稿
function bindPolaroidDevelop() {
  const frame = document.getElementById("polaroid-demo");
  const trigger = document.querySelector(".polaroid-trigger");
  if (!frame) return;

  function develop() {
    const imgArea = frame.querySelector(".polaroid-image-area");
    const result = frame.querySelector(".polaroid-result");
    if (!imgArea || !result) return;

    // 重置：移除 result 可见性，显示 image-area
    result.classList.remove("visible");
    imgArea.style.opacity = "1";
    imgArea.style.display = "flex";
    // 强制 reflow
    void result.offsetWidth;

    // 0.5s 后 image-area 渐隐
    setTimeout(() => {
      imgArea.style.opacity = "0";
    }, 500);

    // 0.5s + 0.6s 渐隐时间 = 1.1s 后 result 渐显
    setTimeout(() => {
      imgArea.style.display = "none";
      result.classList.add("visible");
    }, 1200);
  }

  // 点击拍立得帧触发
  frame.addEventListener("click", develop);
  // 点击"再试一次"按钮触发
  if (trigger) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      develop();
    });
  }

  // 页面加载后 2s 自动演示一次
  setTimeout(develop, 2000);
}

// ---------- Nav 滚动透明过渡 ----------
function bindNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      nav.style.backdropFilter = "saturate(180%) blur(20px)";
      nav.style.webkitBackdropFilter = "saturate(180%) blur(20px)";
      nav.style.borderBottomColor = "var(--divider)";
    } else {
      nav.style.backdropFilter = "none";
      nav.style.webkitBackdropFilter = "none";
      nav.style.borderBottomColor = "transparent";
    }
  }, { rootMargin: "-80px 0px 0px 0px" });
  observer.observe(document.querySelector(".hero"));
}

// ---------- CTA 按钮缓动呼吸 ----------
function bindCTABreathing() {
  const ctaBtn = document.querySelector(".section-cta .btn");
  if (ctaBtn) {
    ctaBtn.classList.add("btn-breathing");
  }
}

// ---------- 启动 ----------
document.addEventListener("DOMContentLoaded", () => {
  // 1. 主题（先设置再渲染，避免闪屏）
  const theme = getInitialTheme();
  document.documentElement.setAttribute("data-theme", theme);

  // 2. 今日金句逐字打字
  renderQuoteWithTypewriter();

  // 3. 绑定交互
  bindThemeButtons();
  bindSpring = bindScrollSpringIn();
  bindPolaroidDevelop();
  bindNavScroll();
  bindCTABreathing();
});

// ---------- 导出金句数组供调试用 ----------
window.FAREWELL_QUOTES = QUOTES;
