/* =========================================================
   SITE HEADER — mobile nav burger (same as the artist pages)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("header-burger");
  const nav = document.getElementById("site-nav");
  if (!burger || !nav) return;

  function closeNav() {
    nav.classList.remove("nav-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the dropdown after picking a link, on any click outside it, and
  // if the page scrolls or the viewport is widened past the mobile breakpoint.
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("nav-open") && !nav.contains(e.target) && e.target !== burger) {
      closeNav();
    }
  });
  window.addEventListener("scroll", () => {
    if (nav.classList.contains("nav-open")) closeNav();
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      closeNav();
    }
  });
});
