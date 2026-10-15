
"use strict";

// Mobile navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  // Close the menu after selecting a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });

  // Close the mobile menu when returning to desktop layout
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    }
  });
}

// Interactive myth-versus-fact cards
const mythCards = document.querySelectorAll(".myth-card");

mythCards.forEach(card => {
  card.addEventListener("click", () => {
    const isExpanded =
      card.getAttribute("aria-expanded") === "true";

    // Close the other cards
    mythCards.forEach(otherCard => {
      otherCard.setAttribute("aria-expanded", "false");

      const otherToggle = otherCard.querySelector(".myth-toggle");
      if (otherToggle) {
        otherToggle.textContent = "＋";
      }
    });

    // Toggle the selected card
    if (!isExpanded) {
      card.setAttribute("aria-expanded", "true");

      const toggle = card.querySelector(".myth-toggle");
      if (toggle) {
        toggle.textContent = "−";
      }
    }
  });
});

// Log that the page's interactive features are ready
console.log("SUGAMYA PCOS learning page is ready.");