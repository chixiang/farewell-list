/* ============================================================
   告别清单 / Farewell List - 主页交互
   - 主题切换（localStorage 记忆）
   - 今日金句（按一年中的第几天取模，跟 app 同步）
   - 滚动 fade-in
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

function renderTodayQuote() {
  const q = getTodayQuote();
  const quoteEl = document.getElementById("today-quote");
  const attrEl = document.getElementById("today-attr");
  if (quoteEl) quoteEl.textContent = q.text;
  if (attrEl) attrEl.textContent = "— " + q.attr;
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
      // 滚动到主题区块顶部
      document.getElementById("design").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---------- 滚动 fade-in ----------
function bindScrollFadeIn() {
  if (!("IntersectionObserver" in window)) return;

  const targets = document.querySelectorAll(
    ".section, .method-card, .theme-card, .ceremony, .splash-showcase, .privacy-item"
  );
  targets.forEach(t => {
    t.style.opacity = "0";
    t.style.transform = "translateY(20px)";
    t.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  targets.forEach(t => observer.observe(t));
}

// ---------- 启动 ----------
document.addEventListener("DOMContentLoaded", () => {
  // 1. 主题（不闪屏：先设置再渲染）
  const theme = getInitialTheme();
  document.documentElement.setAttribute("data-theme", theme);

  // 2. 今日金句
  renderTodayQuote();

  // 3. 绑定事件
  bindThemeButtons();
  bindScrollFadeIn();
});
