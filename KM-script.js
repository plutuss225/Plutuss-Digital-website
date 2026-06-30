// ==============================
// SAFE OBSERVER HELPER
// ==============================
function safeObserve(observer, element) {
  if (element) observer.observe(element);
}

// ==============================
// TEXT REVEAL
// ==============================
window.addEventListener("load", () => {
  const texts = document.querySelectorAll(".reveal-text");

  texts.forEach((text, index) => {
    setTimeout(() => {
      text.classList.add("animate");
    }, index * 300);
  });
});

// ==============================
// HERO COUNT UP
// ==============================
window.addEventListener("load", () => {
  const counters = document.querySelectorAll(".bottom-right h3");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const isPercent = counter.innerText.includes("%");
    const isPlus = counter.innerText.includes("+");

    let count = 0;
    const speed = target / 200;

    const updateCount = () => {
      if (count < target) {
        count += speed;
        counter.innerText =
          Math.floor(count) + (isPercent ? "%" : isPlus ? "+" : "");
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target + (isPercent ? "%" : isPlus ? "+" : "");
      }
    };

    updateCount();
  });
});

// ==============================
// PROJECT COUNT (ON SCROLL)
// ==============================
const projectSection = document.querySelector(".project-highlight");
const projectCounters = document.querySelectorAll(".stats-cards h2");

let hasAnimated = false;

const startProjectCount = () => {
  projectCounters.forEach((counter, index) => {
    const target = +counter.getAttribute("data-target");
    const suffix = counter.getAttribute("data-suffix") || "";

    let count = 0;
    const speed = target / 120;

    const updateCount = () => {
      if (count < target) {
        count += speed;
        counter.innerText = Math.floor(count) + suffix;
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target + suffix;
      }
    };

    setTimeout(updateCount, index * 200);
  });
};

const projectObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !hasAnimated) {
    startProjectCount();
    hasAnimated = true;
  }
});

safeObserve(projectObserver, projectSection);

// ==============================
// ACCORDION
// ==============================
const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion-header");
  const content = item.querySelector(".accordion-content");

  header.addEventListener("click", () => {
    accordionItems.forEach((i) => {
      if (i !== item) {
        i.classList.remove("active");
        i.querySelector(".accordion-content").style.height = "0px";
      }
    });

    if (item.classList.contains("active")) {
      item.classList.remove("active");
      content.style.height = "0px";
    } else {
      item.classList.add("active");
      content.style.height = content.scrollHeight + "px";
    }
  });
});

// ==============================
// OFFER SECTION REVEAL
// ==============================
const offerSection = document.querySelector(".offer-section");

const offerObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    offerSection.classList.add("show");
  }
});

safeObserve(offerObserver, offerSection);

// ==============================
// SLIDER
// ==============================
const slides = document.querySelectorAll(".slide");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let slideIndex = 0;

function showSlide(i) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[i].classList.add("active");
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  });

  prevBtn.addEventListener("click", () => {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
  });
}

// ==============================
// TESTIMONIAL REVEAL
// ==============================
const testimonialSection = document.querySelector(".testimonial-section");

const testimonialObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    testimonialSection.classList.add("show");
  }
});

safeObserve(testimonialObserver, testimonialSection);

// ==============================
// RATING COUNT
// ==============================
const ratingEl = document.querySelector(".rating");
let hasCounted = false;

const startRating = () => {
  const target = parseFloat(ratingEl.getAttribute("data-target"));
  let count = 0;

  const duration = 1500;
  const stepTime = 20;
  const increment = target / (duration / stepTime);

  const update = () => {
    count += increment;

    if (count < target) {
      ratingEl.innerText = count.toFixed(1);
      setTimeout(update, stepTime);
    } else {
      ratingEl.innerText = target.toFixed(1) + "/5";
    }
  };

  update();
};

const ratingObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !hasCounted) {
    startRating();
    hasCounted = true;
  }
});

safeObserve(ratingObserver, testimonialSection);

// ==============================
// FAQ ACCORDION
// ==============================
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector("span");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    faqItems.forEach((i) => {
      i.classList.remove("active");
      i.querySelector(".faq-answer").style.maxHeight = null;
      i.querySelector(".faq-question span").innerText = "+";
    });

    if (!isOpen) {
      item.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.innerText = "−";
    }
  });
});

// ==============================
// FAQ REVEAL
// ==============================
const faqSection = document.querySelector(".faq-section");

const faqObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.add("show");
    });
  }
});

safeObserve(faqObserver, faqSection);

// ==============================
// CURSOR GLOW
// ==============================
const glow = document.querySelector(".cursor-glow");

if (glow) {
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ==============================
// CONTACT REVEAL
// ==============================
const contactSection = document.querySelector(".contact-section");

const contactObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    contactSection.classList.add("show");
  }
});

safeObserve(contactObserver, contactSection);

// ==============================
// ABOUT IMAGES REVEAL
// ==============================
const aboutImages = document.querySelectorAll(".about-image");
const aboutContainer = document.querySelector(".about-images");

const aboutObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    aboutImages.forEach((img, index) => {
      setTimeout(() => {
        img.classList.add("show");
      }, index * 200);
    });
  }
});

safeObserve(aboutObserver, aboutContainer);

// ==============================
// STORY BLOCK REVEAL
// ==============================
const blocks = document.querySelectorAll(".story-block");

const storyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

blocks.forEach((block) => storyObserver.observe(block));

// ==============================
// TABS
// ==============================
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // REMOVE ALL ACTIVE
    tabs.forEach((btn) => btn.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("active"));

    // ADD ACTIVE TO TAB
    tab.classList.add("active");

    // SHOW TEXT CONTENT
    const textTarget = document.getElementById(tab.dataset.tab);
    if (textTarget) textTarget.classList.add("active");

    // SHOW FEATURE CONTENT
    const featureTarget = document.getElementById(tab.dataset.feature);
    if (featureTarget) featureTarget.classList.add("active");
  });
});

// ==============================
// IMAGE PARALLAX (FIXED EFFECT)
// ==============================
const parallaxSection = document.querySelector(".about-intro");

const backImg = document.querySelector(".img-back img");
const frontImg = document.querySelector(".img-front img");

window.addEventListener("scroll", () => {
  if (!parallaxSection || !backImg || !frontImg) return;

  const rect = parallaxSection.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const progress = rect.top / window.innerHeight;

    backImg.style.transform = `
      translateY(${progress * 200}px)
      scale(1.1)
    `;

    frontImg.style.transform = `
      translateY(${progress * 200}px)
      scale(1.1)
    `;
  }
});
const tabsA = document.querySelectorAll(".residence-tab");
const image = document.getElementById("residence-img");
const title = document.getElementById("room-title");
const desc = document.getElementById("room-desc");
const features = document.getElementById("room-features");

const data = {
  1: {
    img: "feautre1-2.jpg",
    title: "Comfortable Guest Room",
    desc: "A welcoming space designed for visitors.",
    features: [
      "Queen Size Bed",
      "Private Bathroom",
      "Walk-in Closet",
      "Reading Nook",
    ],
  },
  2: {
    img: "feautre1-1.jpg",
    title: "Luxury Living Room",
    desc: "Spacious area for relaxation and gatherings.",
    features: ["Premium Sofa", "Smart TV", "Ambient Lighting"],
  },
  3: {
    img: "feautre1-3.jpg",
    title: "Modern Kitchen",
    desc: "Fully equipped modular kitchen.",
    features: ["Island Counter", "Built-in Appliances", "Storage Units"],
  },
  4: {
    img: "feautre1-4.jpg",
    title: "Kids Room",
    desc: "Playful and safe environment for children.",
    features: ["Bunk Beds", "Study Area", "Toy Storage"],
  },
  5: {
    img: "feautre1-5.jpg",
    title: "Master Bedroom",
    desc: "Elegant and luxurious master suite.",
    features: ["King Size Bed", "Walk-in Closet", "Private Balcony"],
  },
  6: {
    img: "feautre1-6.jpg",
    title: "Modern Bathroom",
    desc: "Stylish and functional bathroom design.",
    features: ["Rain Shower", "Marble Finish", "LED Mirror"],
  },
};

tabsA.forEach((tab) => {
  tab.addEventListener("click", () => {
    // ACTIVE TAB
    tabsA.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const id = tab.dataset.tab;

    // ✅ SAFETY CHECK
    if (!data[id]) return;

    const content = data[id];

    // IMAGE CHANGE
    if (image) image.src = content.img;

    // TEXT CHANGE
    if (title) title.innerText = content.title;
    if (desc) desc.innerText = content.desc;

    // FEATURES CHANGE
    if (features) {
      features.innerHTML = "";
      content.features.forEach((f) => {
        features.innerHTML += `<p>• ${f}</p>`;
      });
    }
  });
});
const teamCards = document.querySelectorAll(".team-card");

const observerF = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("show");
      }, i * 150);
    }
  });
});

teamCards.forEach((card) => observerF.observe(card));
// ==============================
// PROJECT FILTER LOGIC
// ==============================

const typeFilter = document.getElementById("typeFilter");
const locationFilter = document.getElementById("locationFilter");
const budgetFilter = document.getElementById("budgetFilter");
const searchBtn = document.getElementById("searchBtn");

const cards = document.querySelectorAll(".project-card");

// SAFETY CHECK
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const type = typeFilter.value;
    const location = locationFilter.value;
    const budgetLimit = budgetFilter.value;

    cards.forEach((card, index) => {
      const cardType = card.dataset.type;
      const cardLocation = card.dataset.location;
      const cardBudget = Number(card.dataset.price); // ✅ FIXED

      const matchType = type === "all" || cardType === type;
      const matchLocation = location === "all" || cardLocation === location;

      let matchBudget = true;

      if (budgetLimit !== "all") {
        matchBudget = cardBudget <= Number(budgetLimit);
      }

      // FINAL MATCH
      if (matchType && matchLocation && matchBudget) {
        // SHOW WITH ANIMATION
        card.style.display = "block";

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, index * 80);
      } else {
        // HIDE SMOOTHLY
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";

        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
}

window.addEventListener("load", () => {
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      card.style.transition = "0.6s ease";
    }, index * 120);
  });
});
// ==============================
// PROJECT CLICK → SAVE DATA
// ==============================

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    const projectData = {
      title: card.dataset.title,
      img: card.dataset.img,
      type: card.dataset.type,
      area: card.dataset.area,
      date: card.dataset.date,
      price: card.dataset.price,
      beds: card.dataset.beds,
      baths: card.dataset.baths,
      parking: card.dataset.parking,
      sqft: card.dataset.sqft,
      description: card.dataset.description, // 🔥 IMPORTANT
    };

    console.log(projectData); // 🧪 DEBUG

    localStorage.setItem("selectedProject", JSON.stringify(projectData));

    window.location.href = "property-details.html";
  });
});
document.querySelectorAll(".team-card-new").forEach((card) => {
  card.addEventListener("click", (e) => {
    // ❗ Prevent redirect if clicking social icons
    if (e.target.closest(".socials a")) return;

    window.location.href = "team-details.html";
  });
});
