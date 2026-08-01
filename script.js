/* ============================================
   DROOLING CAT — $DROOL
   All editable project data lives in CONFIG
   ============================================ */

const CONFIG = {
  contractAddress: "SolTBA",
  xUrl: "https://x.com/WiWiWiMeme",
  chartUrl: "#", // ← insert Dexscreener URL here
  buyUrl: "#"    // ← insert pump.fun URL here
};

/* ---------- Boot ---------- */
document.documentElement.classList.remove("no-js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

if (isTouch) {
  document.body.classList.add("is-touch");
}

/* ---------- Wire CONFIG into the DOM ---------- */
function applyConfig() {
  document.querySelectorAll(".js-contract").forEach((el) => {
    el.textContent = CONFIG.contractAddress;
  });

  document.querySelectorAll(".js-x-link").forEach((el) => {
    el.href = CONFIG.xUrl;
  });

  document.querySelectorAll(".js-chart-link").forEach((el) => {
    el.href = CONFIG.chartUrl;
    if (CONFIG.chartUrl === "#") {
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });

  document.querySelectorAll(".js-buy-link").forEach((el) => {
    el.href = CONFIG.buyUrl;
    if (CONFIG.buyUrl === "#") {
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });
}

/* ---------- Sticky nav compact on scroll ---------- */
function initNavScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------- Copy contract address ---------- */
function initCopyButtons() {
  const buttons = document.querySelectorAll(".js-copy-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const label = btn.querySelector(".js-copy-label");
      try {
        await navigator.clipboard.writeText(CONFIG.contractAddress);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = CONFIG.contractAddress;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      btn.classList.add("is-copied");
      if (label) label.textContent = "COPIED!";

      window.setTimeout(() => {
        btn.classList.remove("is-copied");
        if (label) label.textContent = "COPY";
      }, 1600);
    });
  });
}

/* ---------- Smooth anchor scrolling (keyboard-safe) ---------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- Custom cursor + pointer glow ---------- */
function initCursor() {
  if (isTouch || reducedMotion) return;

  const cursor = document.querySelector(".custom-cursor");
  const glow = document.querySelector(".cursor-glow");
  if (!cursor || !glow) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;
  let gx = mx;
  let gy = my;
  let raf = 0;

  const interactive = "a, button, .btn, .meter__track, .reaction-card, .nav__toggle";

  document.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseover",
    (e) => {
      if (e.target.closest(interactive)) {
        cursor.classList.add("is-hover");
      }
    },
    true
  );

  document.addEventListener(
    "mouseout",
    (e) => {
      if (e.target.closest(interactive)) {
        cursor.classList.remove("is-hover");
      }
    },
    true
  );

  const tick = () => {
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    glow.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    glow.style.opacity = "0.35";
  });
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (isTouch || reducedMotion) return;

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ---------- Card tilt ---------- */
function initCardTilt() {
  if (isTouch || reducedMotion) return;

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -12;
      const ry = (px - 0.5) * 14;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- Hero parallax ---------- */
function initHeroParallax() {
  if (isTouch || reducedMotion) return;

  const banner = document.querySelector(".hero__banner");
  const mascotWrap = document.querySelector(".hero__mascot-wrap");
  if (!banner) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          banner.style.transform = `scale(1.05) translateY(${y * 0.18}px)`;
          if (mascotWrap) {
            mascotWrap.style.transform = `translateY(${y * 0.08}px)`;
          }
        }
        ticking = false;
      });
    },
    { passive: true }
  );
}

/* ---------- Crowd banner pointer perspective ---------- */
function initCrowdParallax() {
  if (isTouch || reducedMotion) return;

  const wrap = document.getElementById("crowd-parallax");
  const img = wrap && wrap.querySelector(".community__banner");
  if (!wrap || !img) return;

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `scale(1.06) translate(${px * -14}px, ${py * -10}px) rotateY(${px * 4}deg) rotateX(${py * -3}deg)`;
  });

  wrap.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1.04)";
  });
}

/* ---------- Random floating phrase reposition ---------- */
function initFloatingPhrases() {
  if (reducedMotion) return;

  const phrases = document.querySelectorAll("[data-phrase]");
  if (!phrases.length) return;

  const reposition = () => {
    phrases.forEach((el) => {
      const top = 12 + Math.random() * 70;
      const side = Math.random() > 0.5 ? "left" : "right";
      const offset = 4 + Math.random() * 18;
      el.style.top = `${top}%`;
      el.style.bottom = "auto";
      el.style.left = side === "left" ? `${offset}%` : "auto";
      el.style.right = side === "right" ? `${offset}%` : "auto";
      el.style.animationDuration = `${6 + Math.random() * 5}s`;
    });
  };

  reposition();
  window.setInterval(reposition, 9000);
}

/* ---------- Drool Meter ---------- */
function initDroolMeter() {
  const track = document.getElementById("meter-track");
  const fill = document.getElementById("meter-fill");
  const thumb = document.getElementById("meter-thumb");
  const percentEl = document.getElementById("meter-percent");
  const messageEl = document.getElementById("meter-message");
  const particlesEl = document.getElementById("meter-particles");

  if (!track || !fill || !thumb || !percentEl || !messageEl) return;

  let level = 0;
  let dragging = false;
  let maxTriggered = false;

  const messages = [
    { max: 25, text: "Suspiciously conscious" },
    { max: 50, text: "Thoughts are fading" },
    { max: 75, text: "Brain officially melting" },
    { max: 99, text: "Maximum screen stare" },
    { max: 100, text: "FULL DROOL MODE" }
  ];

  function messageFor(v) {
    for (const m of messages) {
      if (v <= m.max) return m.text;
    }
    return messages[messages.length - 1].text;
  }

  function setLevel(value) {
    level = Math.max(0, Math.min(100, Math.round(value)));
    fill.style.width = `${level}%`;
    thumb.style.left = `${level}%`;
    percentEl.textContent = `${level}%`;
    const msg = messageFor(level);
    messageEl.textContent = msg;
    track.setAttribute("aria-valuenow", String(level));
    track.setAttribute("aria-valuetext", msg);

    if (level >= 100) {
      messageEl.classList.add("is-max");
      if (!maxTriggered) {
        maxTriggered = true;
        burstParticles();
      }
    } else {
      messageEl.classList.remove("is-max");
      maxTriggered = false;
    }
  }

  function valueFromEvent(e) {
    const rect = track.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function burstParticles() {
    if (!particlesEl || reducedMotion) return;

    // Reuse a small pool — no heavy continuous DOM creation
    particlesEl.innerHTML = "";
    const count = 18;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = 60 + Math.random() * 120;
      p.style.left = "50%";
      p.style.top = "55%";
      p.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      p.style.setProperty("--ty", `${Math.sin(angle) * dist - 40}px`);
      p.style.animationDelay = `${Math.random() * 0.12}s`;
      frag.appendChild(p);
    }

    particlesEl.appendChild(frag);

    window.setTimeout(() => {
      particlesEl.innerHTML = "";
    }, 1100);
  }

  const onMove = (e) => {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    setLevel(valueFromEvent(e));
  };

  const onUp = () => {
    dragging = false;
  };

  track.addEventListener("mousedown", (e) => {
    dragging = true;
    setLevel(valueFromEvent(e));
  });

  track.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      setLevel(valueFromEvent(e));
    },
    { passive: true }
  );

  window.addEventListener("mousemove", onMove, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  track.addEventListener("keydown", (e) => {
    let next = level;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next += 5;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= 5;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    else return;
    e.preventDefault();
    setLevel(next);
  });

  setLevel(0);
}

/* ---------- Init all ---------- */
function init() {
  applyConfig();
  initNavScroll();
  initMobileMenu();
  initCopyButtons();
  initSmoothAnchors();
  initReveal();
  initCursor();
  initMagnetic();
  initCardTilt();
  initHeroParallax();
  initCrowdParallax();
  initFloatingPhrases();
  initDroolMeter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
