/* ---------------- HERO SLIDER ---------------- */

const textSlides = document.querySelectorAll(".text-slide");
const imageSlides = document.querySelectorAll(".image-slide");

let heroIndex = 0;

function changeHeroSlide() {
  if (textSlides.length === 0) return;

  textSlides[heroIndex].classList.remove("active");
  imageSlides[heroIndex].classList.remove("active");

  heroIndex++;

  if (heroIndex >= textSlides.length) {
    heroIndex = 0;
  }

  textSlides[heroIndex].classList.add("active");
  imageSlides[heroIndex].classList.add("active");
}

setInterval(changeHeroSlide, 3000);

/* ---------------- CART SYSTEM ---------------- */

const addCartButtons = document.querySelectorAll(".add-cart");
const cartIcon = document.querySelector(".cart-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = button.dataset.price;
    const image = button.dataset.image;

    const item = {
      name,
      price,
      image,
    };

    cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));

    /* BUTTON FEEDBACK */

    button.classList.add("added");
    button.innerHTML = "Added ✓";

    setTimeout(() => {
      button.classList.remove("added");
      button.innerHTML = "Add to Cart";
    }, 1200);

    /* CART ICON ANIMATION */

    cartIcon.classList.add("cart-bump");

    setTimeout(() => {
      cartIcon.classList.remove("cart-bump");
    }, 300);

    /* OPEN CART DRAWER */

    openCart();
  });
});

/* ---------------- CART DRAWER ---------------- */

const cartBtn = document.querySelector(".cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");

cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openCart();
});

cartOverlay.addEventListener("click", closeCart);
cartClose.addEventListener("click", closeCart);

function openCart() {
  renderCartDrawer();

  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

/* ---------------- RENDER CART ---------------- */

function renderCartDrawer() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    cartItems.innerHTML += `
    
    <div class="cart-item">

      <img src="${item.image}">

      <div>

        <h4>${item.name}</h4>

        <p>₹${item.price}</p>

        <button class="remove-btn" onclick="removeDrawerItem(${index})">
        Remove
        </button>

      </div>

    </div>

    `;

    total += Number(item.price);
  });

  cartTotal.innerText = total;
}

/* ---------------- REMOVE ITEM ---------------- */

function removeDrawerItem(index) {
  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCartDrawer();
}

/* ---------------- FAVORITES SYSTEM ---------------- */

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const favIcons = document.querySelectorAll(".fav-icon");

favIcons.forEach((icon) => {
  const name = icon.dataset.name;

  if (favorites.find((item) => item.name === name)) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }

  icon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const product = {
      name: icon.dataset.name,
      image: icon.dataset.image,
      price: icon.dataset.price,
    };

    const exists = favorites.find((item) => item.name === product.name);

    if (exists) {
      favorites = favorites.filter((item) => item.name !== product.name);

      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    } else {
      favorites.push(product);

      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });
});

/* ---------------- MOBILE MENU ---------------- */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
