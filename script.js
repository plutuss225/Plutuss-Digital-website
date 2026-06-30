/* ===================================== */
/* COUNTER ANIMATION FUNCTION (GLOBAL) */
/* ===================================== */

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  const duration = 2000;
  const frameRate = 30;

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let current = 0;

    const steps = duration / frameRate;
    const increment = target / steps;

    const updateCount = () => {
      current += increment;

      if (current < target) {
        counter.innerText = Math.floor(current);
        setTimeout(updateCount, frameRate);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
}

/* ===================================== */
/* DOM READY */
/* ===================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ===================================== */
  /* NAVBAR SYSTEM */
  /* ===================================== */

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const navDropdown = document.querySelector(".nav-dropdown");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("open");
    });
  }

  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navDropdown.classList.toggle("open");
    });
  }

  document.addEventListener("click", function (e) {
    if (navDropdown && !navDropdown.contains(e.target)) {
      navDropdown.classList.remove("open");
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 992) {
      navDropdown?.classList.remove("open");
      navLinks?.classList.remove("active");
      hamburger?.classList.remove("open");
    }
  });

  /* ===================================== */
  /* ACTIVE NAV LINK */
  /* ===================================== */

  const currentPage = window.location.pathname.split("/").pop();
  const navLinksAll = document.querySelectorAll("#nav-links a");

  navLinksAll.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  /* ===================================== */
  /* HERO PARALLAX */
  /* ===================================== */

  const hero = document.querySelector(".hero");
  const layers = document.querySelectorAll(".parallax-layer");

  if (hero) {
    hero.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;

      layers.forEach((layer) => {
        const speed = layer.getAttribute("data-speed");

        const moveX = ((window.innerWidth / 2 - x) * speed) / 100;
        const moveY = ((window.innerHeight / 2 - y) * speed) / 100;

        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    hero.addEventListener("mouseleave", () => {
      layers.forEach((layer) => {
        layer.style.transform = "translate(0,0)";
      });
    });
  }

  /* ===================================== */
  /* TYPING ANIMATION */
  /* ===================================== */

  const text = "Turning Vision Into\nDigital Growth";
  const typingElement = document.getElementById("typing");

  if (typingElement) {
    let i = 0;

    function typeText() {
      if (i < text.length) {
        if (text.charAt(i) === "\n") {
          typingElement.innerHTML += "<br>";
        } else {
          typingElement.innerHTML += text.charAt(i);
        }

        i++;
        setTimeout(typeText, 100);
      } else {
        typingElement.style.borderRight = "none";
        typingElement.style.animation = "none";
      }
    }

    typeText();
  }

  /* ===================================== */
  /* COUNTER TRIGGER ON SCROLL */
  /* ===================================== */

  const statsSection = document.querySelector(".about-stats");
  let counterTriggered = false;

  if (statsSection) {
    window.addEventListener("scroll", () => {
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight;

      if (sectionPos < screenPos && !counterTriggered) {
        animateCounters();
        counterTriggered = true;
      }
    });
  }

  /* ===================================== */
  /* SCROLL REVEAL ANIMATION */
  /* ===================================== */

  const revealElements = document.querySelectorAll(".reveal, .reveal-zoom");

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = el.dataset.reveal || 150;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);

  /* ===================================== */
  /* FAQ ACCORDION (FIXED) */
  /* ===================================== */

  /* FAQ ACCORDION FIX */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    answer.style.height = "0px";

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      /* close all */
      faqItems.forEach((faq) => {
        faq.classList.remove("open");
        const ans = faq.querySelector(".faq-answer");
        ans.style.height = "0px";
      });

      /* open clicked */
      if (!isOpen) {
        item.classList.add("open");
        answer.style.height = answer.scrollHeight + "px";
      }
    });
  });
});

/* ===================================== */
/* FORM VALIDATION */
/* ===================================== */

function validateForm() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const subject = document.getElementById("subject")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const message = document.getElementById("message")?.value.trim();

  if (!name || name.length < 2) {
    alert("Please enter your full name.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!subject || subject.length < 3) {
    alert("Please enter a subject (at least 3 characters).");
    return false;
  }

  if (phone) {
    const phonePattern = /^[0-9]{10,15}$/;

    if (!phonePattern.test(phone)) {
      alert("Please enter a valid phone number (digits only).");
      return false;
    }
  }

  if (!message || message.length < 5) {
    alert("Please enter a message (at least 5 characters).");
    return false;
  }

  return true;
}
let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress");
  let progressValue = document.getElementById("progress-value");
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  /* Change the variable below to change the page Y position from where the button will be visisble */
  let myHeight = 100;
  /* Change the Primary Color here */
  let primaryColor = "#ff5e14";
  /* Change the Secondary Color here */
  let secondaryColor = "#d7d7d7";
  let scrollValue = Math.round((pos * 100) / calcHeight);
  if (pos > myHeight) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }
  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });

  scrollProgress.style.background = `conic-gradient( ${primaryColor} ${scrollValue}%,${secondaryColor} ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;
/* HERO REVEAL ON LOAD */

window.addEventListener("load", () => {
  const heroElements = document.querySelectorAll("#hero .reveal");

  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("active");
    }, index * 200); // stagger animation
  });
});

const element = document.querySelector(".scroll-text");
const text = element.innerText;

element.innerHTML = "";

// split text into letters
text.split("").forEach((letter) => {
  const span = document.createElement("span");
  span.textContent = letter;
  element.appendChild(span);
});

const letters = document.querySelectorAll(".scroll-text span");

window.addEventListener("scroll", () => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // start when element enters viewport
  const start = windowHeight * 0.9;

  // finish while still visible
  const end = windowHeight * 0.2;

  let progress = (start - rect.top) / (start - end);

  progress = Math.max(0, Math.min(1, progress));

  const revealCount = Math.floor(progress * letters.length);

  letters.forEach((letter, index) => {
    letter.classList.toggle("active", index < revealCount);
  });
});
const cards = document.querySelectorAll(".service-card");

const rotations = [1, 2, 2.5, 3, 3.5, 4];

window.addEventListener("scroll", () => {
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress = (windowHeight - rect.top) / windowHeight;

    progress = Math.max(0, Math.min(1, progress));

    const maxRotation = rotations[index] || 0;

    const rotation = progress * (index % 2 === 0 ? maxRotation : maxRotation);

    card.style.transform = `rotate(${rotation}deg) `;
  });
});
