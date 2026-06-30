const accordions = document.querySelectorAll(".case-accordion");

accordions.forEach((acc) => {
  acc.addEventListener("click", () => {
    accordions.forEach((a) => a.classList.remove("active"));
    acc.classList.add("active");
  });
});

// =========================
// REVEAL ON SCROLL
// =========================

const reveals = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom-out, .reveal-rotate, .reveal-blur, .reveal-flip",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15,
  },
);

// observe all elements
reveals.forEach((el) => observer.observe(el));
document.querySelectorAll(".cp-card").forEach((card) => {
  card.addEventListener("click", () => {
    const link = card.getAttribute("data-link");
    if (link) {
      window.location.href = link;
    }
  });
});
