/* =========================================================
   SITE HEADER — mobile nav burger (shared header, every artist page)
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
  // if the page scrolls or the viewport is widened back past the mobile
  // breakpoint while it's open.
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
   JESSE DEE — BOOKING ENQUIRY (moshikomi-* component)
   Page-specific script for /japanese-irezumi/jesse-dee.html
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const booking = document.getElementById("jesse-booking");
  const form = document.getElementById("jesse-booking-form");

  if (!booking || !form) return;


  /* ---------------------------------------------------------
     JESSE DETAILS
     --------------------------------------------------------- */

  const JESSE_EMAIL = "jessedeetattoo@gmail.com";
  const JESSE_INSTAGRAM = "jessedeetattooer";
  const JESSE_IG_DM = `https://ig.me/m/${JESSE_INSTAGRAM}`;


  /* ---------------------------------------------------------
     ELEMENTS
     --------------------------------------------------------- */

  const emailEntryButton =
    document.getElementById("jesse-book-email");

  const instagramEntryButton =
    document.getElementById("jesse-book-instagram");

  const closeButton =
    booking.querySelector(".moshikomi-close");

  const steps =
    booking.querySelectorAll(".moshikomi-step");

  const nextButtons =
    booking.querySelectorAll(".moshikomi-btn-next");

  const backButtons =
    booking.querySelectorAll(".moshikomi-btn-back");

  const reviewButton =
    booking.querySelector(".moshikomi-btn-review");

  const review =
    document.getElementById("jesse-booking-review");

  const sendSection =
    document.getElementById("jesse-booking-send");

  const sendEmail =
    document.getElementById("jesse-send-email");

  const sendInstagram =
    document.getElementById("jesse-send-instagram");

  const placementOtherField =
    document.getElementById("placement-other-field");

  const largerProjectField =
    document.getElementById("larger-project-field");


  let currentStep = 1;


  /* ---------------------------------------------------------
     OPEN
     --------------------------------------------------------- */

  function openBooking() {

    booking.classList.add("moshikomi-open");
    booking.setAttribute("aria-hidden", "false");

    document.body.classList.add("moshikomi-locked");

    currentStep = 1;

    showStep(1);

    sendSection.classList.remove("moshikomi-visible");
    sendSection.setAttribute("aria-hidden", "true");

  }


  /* ---------------------------------------------------------
     CLOSE
     --------------------------------------------------------- */

  function closeBooking() {

    booking.classList.remove("moshikomi-open");
    booking.setAttribute("aria-hidden", "true");

    document.body.classList.remove("moshikomi-locked");

  }


  emailEntryButton?.addEventListener("click", (event) => {

    event.preventDefault();

    openBooking();

  });


  instagramEntryButton?.addEventListener("click", (event) => {

    event.preventDefault();

    openBooking();

  });


  closeButton.addEventListener("click", closeBooking);


  booking.addEventListener("click", (event) => {

    if (event.target === booking) {
      closeBooking();
    }

  });


  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      booking.classList.contains("moshikomi-open")
    ) {
      closeBooking();
    }

  });


  /* ---------------------------------------------------------
     SHOW STEP
     --------------------------------------------------------- */

  function showStep(stepNumber) {

    steps.forEach((step) => {

      step.classList.toggle(
        "active",
        Number(step.dataset.step) === stepNumber
      );

    });

    currentStep = stepNumber;

  }


  /* ---------------------------------------------------------
     VALIDATE CURRENT STEP
     --------------------------------------------------------- */

  function validateCurrentStep() {

    const step =
      booking.querySelector(
        `.moshikomi-step[data-step="${currentStep}"]`
      );

    if (!step) return true;


    const requiredFields =
      step.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );


    for (const field of requiredFields) {

      if (!field.checkValidity()) {

        field.reportValidity();

        return false;

      }

    }


    return true;

  }


  /* ---------------------------------------------------------
     NEXT
     --------------------------------------------------------- */

  nextButtons.forEach((button) => {

    button.addEventListener("click", () => {

      if (!validateCurrentStep()) {
        return;
      }


      if (currentStep < 5) {

        showStep(currentStep + 1);

      }

    });

  });


  /* ---------------------------------------------------------
     BACK
     --------------------------------------------------------- */

  backButtons.forEach((button) => {

    button.addEventListener("click", () => {

      if (currentStep > 1) {

        showStep(currentStep - 1);

      }

    });

  });


  /* ---------------------------------------------------------
     CONDITIONAL PLACEMENT
     --------------------------------------------------------- */

  const placementInputs =
    form.querySelectorAll(
      'input[name="placement"]'
    );


  placementInputs.forEach((input) => {

    input.addEventListener("change", () => {

      const isOther =
        input.value === "Other" &&
        input.checked;


      placementOtherField.hidden = !isOther;


      const otherInput =
        placementOtherField.querySelector("input");


      if (!isOther) {

        otherInput.value = "";

      }

    });

  });


  /* ---------------------------------------------------------
     CONDITIONAL LARGER PROJECT
     --------------------------------------------------------- */

  const largerProjectInputs =
    form.querySelectorAll(
      'input[name="largerProject"]'
    );


  largerProjectInputs.forEach((input) => {

    input.addEventListener("change", () => {

      const showField =
        input.checked &&
        (
          input.value === "Yes" ||
          input.value === "Maybe"
        );


      largerProjectField.hidden = !showField;


      const details =
        largerProjectField.querySelector("textarea");


      if (!showField) {

        details.value = "";

      }

    });

  });


  /* ---------------------------------------------------------
     REVIEW BUTTON
     --------------------------------------------------------- */

  reviewButton.addEventListener("click", () => {

    if (!validateCurrentStep()) {
      return;
    }


    buildReview();

    showStep(5);

  });


  /* ---------------------------------------------------------
     BUILD REVIEW
     --------------------------------------------------------- */

  function buildReview() {

    const data =
      new FormData(form);


    let placement =
      data.get("placement") || "";


    if (placement === "Other") {

      const other =
        data.get("placementOther");

      if (other) {

        placement =
          `Other — ${other}`;

      }

    }


    const fields = [

      ["Name", data.get("name")],

      ["Email", data.get("email") || "Not provided"],

      ["Instagram", data.get("instagram") || "Not provided"],

      ["Tattoo", data.get("tattoo")],

      ["Placement", placement],

      ["Scale", data.get("scale")],


      ["Colour", data.get("colour")],

      ["Project type", data.get("projectType")],

      ["Larger project", data.get("largerProject")],

      [
        "Larger project details",
        data.get("largerProjectDetails") || "None provided"
      ],

      ["Idea / details", data.get("details")],

      [
        "References / inspiration",
        data.get("references") || "None provided"
      ],

      [
        "Preferred timeframe",
        data.get("timeframe") || "Not specified"
      ],

      [
        "Additional information",
        data.get("additional") || "None provided"
      ]

    ];


    review.innerHTML =
      fields.map(([label, value]) => {

        return `
          <div class="moshikomi-review-row">

            <div class="moshikomi-review-label">
              ${escapeHTML(label)}
            </div>

            <div class="moshikomi-review-value">
              ${escapeHTML(value)}
            </div>

          </div>
        `;

      }).join("");

  }


  /* ---------------------------------------------------------
     FINAL FORM SUBMISSION
     --------------------------------------------------------- */

  form.addEventListener("submit", (event) => {

    event.preventDefault();


    steps.forEach((step) => {

      step.classList.remove("active");

    });


    sendSection.classList.add("moshikomi-visible");

    sendSection.setAttribute("aria-hidden", "false");

  });


  /* ---------------------------------------------------------
     BUILD MESSAGE
     --------------------------------------------------------- */

  function buildMessage() {

    const data =
      new FormData(form);


    let placement =
      data.get("placement") || "";


    if (placement === "Other") {

      const other =
        data.get("placementOther");

      if (other) {

        placement =
          `Other — ${other}`;

      }

    }


    return `TATTOO ENQUIRY — JESSE DEE

NAME
${data.get("name")}

EMAIL
${data.get("email") || "Not provided"}

INSTAGRAM
${data.get("instagram") || "Not provided"}


PROJECT

WHAT I'M LOOKING TO GET
${data.get("tattoo")}

PLACEMENT
${placement}

SCALE
${data.get("scale")}

APPROXIMATE SIZE
${data.get("size")}

COLOUR
${data.get("colour")}

PROJECT TYPE
${data.get("projectType")}

PART OF A LARGER PROJECT
${data.get("largerProject")}

LARGER PROJECT DETAILS
${data.get("largerProjectDetails") || "None provided"}


THE IDEA

${data.get("details")}


REFERENCES / INSPIRATION

${data.get("references") || "None provided"}


PREFERRED TIMEFRAME

${data.get("timeframe") || "Not specified"}


ADDITIONAL INFORMATION

${data.get("additional") || "None provided"}`;

  }


  /* ---------------------------------------------------------
     EMAIL
     --------------------------------------------------------- */

  sendEmail.addEventListener("click", () => {

    const data =
      new FormData(form);

    const name =
      data.get("name") || "New Enquiry";


    const subject =
      `Tattoo Enquiry — Jesse Dee — ${name}`;


    const body =
      buildMessage();


    const mailto =
      `mailto:${JESSE_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;


    window.location.href = mailto;

  });


  /* ---------------------------------------------------------
     INSTAGRAM
     --------------------------------------------------------- */

  sendInstagram.addEventListener("click", async () => {

    const message =
      buildMessage();


    try {

      await navigator.clipboard.writeText(message);

    } catch (error) {

      /*
       Clipboard access may be unavailable on some browsers.
       The Instagram link will still open.
      */

      console.warn(
        "Could not copy enquiry to clipboard."
      );

    }


    window.location.href = JESSE_IG_DM;

  });


  /* ---------------------------------------------------------
     ESCAPE HTML
     --------------------------------------------------------- */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }

});


/* =========================================================
   JESSE DEE — SELECTED WORK GALLERY + LIGHTBOX (kansho-*)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const thumbs = [...document.querySelectorAll(".nagame-gallery img")];
  const lightbox = document.getElementById("kansho-lightbox");

  if (!lightbox || thumbs.length === 0) return;

  const img = document.getElementById("kansho-img");
  const viewer = document.getElementById("kansho-viewer");
  const captionTop = document.getElementById("kansho-caption-top");
  const captionSub = document.getElementById("kansho-caption-sub");

  let index = 0;
  let scale = 1, x = 0, y = 0;
  let initialScale = 1;
  let vx = 0, vy = 0;
  let lastX = 0, lastY = 0;
  let lastMoveTime = 0;
  let isDragging = false;

  let pointers = new Map();
  let pinchDist = 0;
  let pinchScale = 1;
  let lastTap = 0;

  let vw = 0, vh = 0;

  function updateViewerDimensions() {
    vw = viewer.clientWidth;
    vh = viewer.clientHeight;
  }
  window.addEventListener("resize", updateViewerDimensions);

  function updateCaption() {
    if (!captionTop || !captionSub) return;
    const data = thumbs[index].dataset;
    const artist = data.artist || "";
    const style = data.style || "";
    captionTop.textContent = [artist, style].filter(Boolean).join(" · ");
    captionSub.textContent = data.subject || "";
  }

  function openLightbox(i) {
    index = (i + thumbs.length) % thumbs.length;
    updateCaption();

    img.style.opacity = "0";

    setTimeout(() => {
      img.style.display = "none";
      img.src = thumbs[index].dataset.full;

      if (!lightbox.classList.contains("kansho-active")) {
        lightbox.style.display = "block";
        updateViewerDimensions();
        img.offsetHeight;
        lightbox.classList.add("kansho-active");
      }
    }, 450);

    img.onload = () => {
      img.style.display = "block";
      fitToScreen();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          img.style.opacity = "1";
        });
      });

      preloadAsset(index + 1);
      preloadAsset(index - 1);
    };
  }

  function fitToScreen() {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    scale = Math.min(vw / iw, vh / ih);
    initialScale = scale;
    x = 0; y = 0; vx = 0; vy = 0;
    updateMatrix();
  }

  function preloadAsset(i) {
    const targetIndex = (i + thumbs.length) % thumbs.length;
    if (!thumbs[targetIndex]) return;
    const preloadBuffer = new Image();
    preloadBuffer.src = thumbs[targetIndex].dataset.full;
  }

  function updateMatrix() {
    constrainBoundaries();
    img.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }

  function constrainBoundaries() {
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;

    const maxX = Math.max(vw / 2, (w - vw) / 2 + vw / 2);
    const maxY = Math.max(vh / 2, (h - vh) / 2 + vh / 2);

    if (x > maxX) x = maxX;
    if (x < -maxX) x = -maxX;
    if (y > maxY) y = maxY;
    if (y < -maxY) y = -maxY;
  }

  function handleZoomAtPoint(clientX, clientY, zoomFactor) {
    const oldScale = scale;
    scale = Math.max(0.2, Math.min(12, scale * zoomFactor));

    const targetX = clientX - (vw / 2);
    const targetY = clientY - (vh / 2);

    x = targetX - (targetX - x) * (scale / oldScale);
    y = targetY - (targetY - y) * (scale / oldScale);

    updateMatrix();
  }

  viewer.addEventListener("pointerdown", (e) => {
    viewer.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = Date.now();

    if (pointers.size === 1) {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = 0; vy = 0;
      lastMoveTime = now;
    } else if (pointers.size === 2) {
      isDragging = false;
      const pts = [...pointers.values()];
      pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchScale = scale;
    }
  });

  viewer.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;

    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = Date.now();

    if (isDragging && pointers.size === 1) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      x += dx;
      y += dy;
      vx = dx;
      vy = dy;
      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveTime = now;
      updateMatrix();
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const factor = dist / pinchDist;

      const oldScale = scale;
      scale = Math.max(0.2, Math.min(12, pinchScale * factor));

      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const targetX = midX - (vw / 2);
      const targetY = midY - (vh / 2);

      x = targetX - (targetX - x) * (scale / oldScale);
      y = targetY - (targetY - y) * (scale / oldScale);

      updateMatrix();
    }
  });

  function runMomentumEngine() {
    if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
      if (!isDragging && pointers.size === 0) {
        x += vx;
        y += vy;
        vx *= 0.83;
        vy *= 0.83;
        updateMatrix();
        requestAnimationFrame(runMomentumEngine);
      }
    }
  }

  const clearPointerTracking = (e) => {
    pointers.delete(e.pointerId);
    const now = Date.now();

    if (pointers.size === 0) {
      isDragging = false;
      if (now - lastMoveTime > 45) {
        vx = 0;
        vy = 0;
      }
      runMomentumEngine();
    } else if (pointers.size === 1) {
      const remainingPointer = [...pointers.values()][0];
      lastX = remainingPointer.x;
      lastY = remainingPointer.y;
      isDragging = true;
    }
  };

  viewer.addEventListener("pointerup", clearPointerTracking);
  viewer.addEventListener("pointercancel", clearPointerTracking);

  viewer.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.10 : 0.90;
    handleZoomAtPoint(e.clientX, e.clientY, zoomFactor);
  }, { passive: false });

  thumbs.forEach((thumb, i) => {
    thumb.onclick = () => openLightbox(i);
  });

  document.querySelector(".kansho-close").onclick = () => {
    lightbox.classList.remove("kansho-active");
    setTimeout(() => { lightbox.style.display = "none"; }, 500);
  };

  document.querySelector(".kansho-next").onclick = (e) => { e.stopPropagation(); openLightbox(index + 1); };
  document.querySelector(".kansho-prev").onclick = (e) => { e.stopPropagation(); openLightbox(index - 1); };

  viewer.addEventListener("click", (e) => {
    if (e.target.classList.contains("kansho-ctrl")) return;

    const executionTimestamp = Date.now();
    if (executionTimestamp - lastTap < 250) {
      if (scale <= (initialScale + 0.1)) {
        scale = 4.0;
        const targetX = e.clientX - (vw / 2);
        const targetY = e.clientY - (vh / 2);
        x = targetX - (targetX - 0) * 4;
        y = targetY - (targetY - 0) * 4;
      } else {
        fitToScreen();
      }
      updateMatrix();
    }
    lastTap = executionTimestamp;
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("kansho-active")) return;
    if (e.key === "Escape") document.querySelector(".kansho-close").click();
    if (e.key === "ArrowRight") openLightbox(index + 1);
    if (e.key === "ArrowLeft") openLightbox(index - 1);
  });
});

/* =========================================================
   WRITTEN PIECES (hanashi-* component)
   Japanese Irezumi + Neo-Traditional. Any .hanashi-open element opens the
   overlay named in its aria-controls; an optional data-section is the id of
   the heading inside it to scroll to.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const triggers = document.querySelectorAll(".hanashi-open");
  if (!triggers.length) return;

  let activePanel = null;
  let lastTrigger = null;

  function openPanel(trigger) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    const modal = panel.querySelector(".hanashi-modal");
    activePanel = panel;
    lastTrigger = trigger;
    panel.classList.add("hanashi-visible");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("hanashi-locked");

    const section = trigger.dataset.section
      ? panel.querySelector("#" + trigger.dataset.section)
      : null;
    modal.scrollTop = section ? Math.max(section.offsetTop - 24, 0) : 0;
    panel.querySelector(".hanashi-close").focus({ preventScroll: true });
  }

  function closePanel() {
    if (!activePanel) return;
    activePanel.classList.remove("hanashi-visible");
    activePanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("hanashi-locked");
    activePanel = null;
    if (lastTrigger) lastTrigger.focus();
  }

  triggers.forEach((t) => t.addEventListener("click", () => openPanel(t)));

  document.querySelectorAll(".hanashi-overlay").forEach((panel) => {
    panel.querySelector(".hanashi-close").addEventListener("click", closePanel);
    panel.addEventListener("click", (e) => {
      if (e.target === panel) closePanel();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activePanel) closePanel();
  });
});
