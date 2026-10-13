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

/* =========================================================
   FAQ ACCORDION
   One question open at a time. Open/closed state is a class on
   .faq-item (the animation lives in faq.css) plus aria-expanded
   on the button, so no inline styles are needed.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("faq-list");
  if (!list) return;

  function setOpen(item, open) {
    item.classList.toggle("open", open);
    item.querySelector(".faq-row").setAttribute("aria-expanded", String(open));
  }

  list.addEventListener("click", (e) => {
    const row = e.target.closest(".faq-row");
    if (!row) return;

    const item = row.closest(".faq-item");
    const willOpen = !item.classList.contains("open");

    list.querySelectorAll(".faq-item.open").forEach((other) => {
      if (other !== item) setOpen(other, false);
    });

    setOpen(item, willOpen);
  });
});
