// ==========================================
// 3. INTERACTIVE ENGINE WITH QUALITY FIXES
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    let thumbs = [];
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("img");
    const viewer = document.getElementById("viewer");

    let index = 0;
    let scale = 1, x = 0, y = 0;
    let initialScale = 1;
    let vx = 0, vy = 0;
    let lastX = 0, lastY = 0;
    let lastMoveTime = 0; // Tracks clean release mechanics
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

    function openLightbox(i) {
        index = (i + thumbs.length) % thumbs.length;
        
        // Step 1: Smoothly dissolve the current asset away
        img.style.opacity = "0";

        // Step 2: Calmly wait 450ms for the old photo to clear out of sight
        setTimeout(() => {
            img.style.display = "none"; // Hide to change source behind the scenes

            
            img.src = thumbs[index].dataset.full;
            
            if(!lightbox.classList.contains("active")) {
                lightbox.style.display = "block";
                updateViewerDimensions();
                img.offsetHeight; 
                lightbox.classList.add("active");
            }
        }, 450);

        // Step 3: Once the new masterpiece finishes loading, ease it back in smoothly
        img.onload = () => {
            img.style.display = "block";
            fitToScreen();
            
            // Nested frames ensure layout dimensions settle before fading up.
            // This completely eliminates the forward warping pop.
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
        // Uses hardware-accelerated translate3d to offload rendering burdens to GPU
        img.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    function constrainBoundaries() {
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;

        // FIXED: Infinite unrestricted roaming boundaries let you pan freely right from the start
        const maxX = Math.max(vw / 2, (w - vw) / 2 + vw / 2);
        const maxY = Math.max(vh / 2, (h - vh) / 2 + vh / 2);

        if (x > maxX) x = maxX;
        if (x < -maxX) x = -maxX;
        if (y > maxY) y = maxY;
        if (y < -maxY) y = -maxY;
    }

    // New unified injection logic to translate vectors directly under focus anchors
    function handleZoomAtPoint(clientX, clientY, zoomFactor) {
        const oldScale = scale;
        scale = Math.max(0.2, Math.min(12, scale * zoomFactor));

        // Maps cursor distances relative to the viewport origin lines
        const targetX = clientX - (vw / 2);
        const targetY = clientY - (vh / 2);

        // Adjusts translation coordinates dynamically to offset tracking drag drift
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
            // FIXED: Natural multi-touch array math mapping parameters
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
            // FIXED: Dynamic multi-finger vector tracking
            const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            const factor = dist / pinchDist;
            
            const oldScale = scale;
            scale = Math.max(0.2, Math.min(12, pinchScale * factor));

            // Pinch Focal Anchoring Calculations
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
                // Luxury heavy kinetic friction braking weights the image
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
            // FIXED: If user stops moving for >45ms before lifting finger, kill momentum instantly
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
        // FIXED: Wheel scroll scales into cursor focal location paths smoothly
        handleZoomAtPoint(e.clientX, e.clientY, zoomFactor);
    }, { passive: false });

  document.querySelectorAll(".artist-gallery").forEach(gallery => {

    const galleryImages = [...gallery.querySelectorAll("img")];

    galleryImages.forEach((thumb, i) => {

        thumb.onclick = () => {
            thumbs = galleryImages;
            openLightbox(i);
        };

    });

});

    document.querySelector(".close").onclick = () => {
        lightbox.classList.remove("active");
        setTimeout(() => { lightbox.style.display = "none"; }, 500); 
    };

    document.querySelector(".next").onclick = (e) => { e.stopPropagation(); openLightbox(index + 1); };
    document.querySelector(".prev").onclick = (e) => { e.stopPropagation(); openLightbox(index - 1); };

    document.querySelectorAll(".ui-btn").forEach(btn => {
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    viewer.addEventListener("click", (e) => {
        if (e.target.classList.contains("ui-btn")) return;

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
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") document.querySelector(".close").click();
        if (e.key === "ArrowRight") openLightbox(index + 1);
        if (e.key === "ArrowLeft") openLightbox(index - 1);
    });
});
