const shots = {
  signin: {
    src: "assets/screenshots/signin.png",
    alt: "JobBridge sign-in screen with email, password, and a check that the visitor is not a robot",
    caption: "Sign-in for a JobBridge account. Jobseekers and employers register themselves. PESO staff accounts are created by an administrator, and the administrator account is seeded rather than registered on this page."
  },
  search: {
    src: "assets/screenshots/job-search.png",
    alt: "Jobseeker job search listing vacancies with percentage match scores",
    caption: "Jobseeker job search on the deployed system. Each vacancy shows a match score from the TF-IDF and cosine similarity engine. The vacancy names and percentages are from the live system at the time of the screenshot, not from the evaluation sample."
  },
  admin: {
    src: "assets/screenshots/admin-dashboard.png",
    alt: "Administrator dashboard with office metrics, quick actions, and monthly charts",
    caption: "Administrator dashboard. It shows office-wide counts, quick actions for staff accounts, job fairs, announcements, reports, and the audit trail, plus monthly registration and application charts. The counts belong to the live deployment, not to the 238-person evaluation."
  },
  lmi: {
    src: "assets/screenshots/lmi-reports.png",
    alt: "Labor market information reports with filters and municipal employment statistics",
    caption: "Labor Market Information reports for PESO Pila. Filters cover period, barangay, municipality, gender, age, employment status, education, industry, occupation, job category, employer, and vacancy status. The figures shown are interface data from the deployed system."
  }
};

const frameImg = document.querySelector("#shot");
const frameCap = document.querySelector("#shot-caption");
const tabs = document.querySelectorAll(".shot-tabs button");

function showShot(key) {
  const shot = shots[key];
  if (!shot) return;
  frameImg.src = shot.src;
  frameImg.alt = shot.alt;
  frameCap.textContent = shot.caption;
  tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.shot === key)));
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showShot(tab.dataset.shot));
});

const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
function openLightbox() {
  lightboxImg.src = frameImg.src;
  lightboxImg.alt = frameImg.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.querySelector("#close-lightbox").focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
document.querySelector("#enlarge").addEventListener("click", openLightbox);
frameImg.addEventListener("click", openLightbox);
document.querySelector("#close-lightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const menu = document.querySelector("#menu");
const links = document.querySelector("#nav-links");
const menuLabel = menu.querySelector(".menu-label");
function setMenu(open) {
  links.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (menuLabel) menuLabel.textContent = open ? "Close" : "Menu";
}
menu.addEventListener("click", () => setMenu(!links.classList.contains("open")));
links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 1180) setMenu(false);
});

const progress = document.querySelector(".progress");
const nav = document.querySelector(".nav");
const heroPanel = document.querySelector(".hero-panel");
function onScroll() {
  const scrolled = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${height > 0 ? scrolled / height : 0})`;
  nav.classList.toggle("scrolled", scrolled > 8);
  const rect = heroPanel.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) heroPanel.classList.add("is-in");
}
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = "1";
    const target = Number(entry.target.dataset.count);
    const decimals = Number(entry.target.dataset.decimals || 0);
    const start = performance.now();
    const duration = 900;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const value = target * (1 - Math.pow(1 - p, 3));
      entry.target.textContent = value.toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      entry.target.textContent = target.toFixed(decimals);
      return;
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
counters.forEach((node) => counterObserver.observe(node));

document.querySelectorAll(".layer").forEach((layer) => {
  layer.addEventListener("click", () => {
    document.querySelectorAll(".layer").forEach((item) => item.classList.remove("active"));
    layer.classList.add("active");
    document.querySelector("#layer-note").textContent = layer.dataset.note;
  });
});
