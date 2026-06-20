document.addEventListener("DOMContentLoaded", () => {
    
    // --- PRELOADER REMOVAL TRACKER ---
    const preloader = document.getElementById("preloader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            if(preloader) {
                preloader.classList.add("loaded");
                // Trigger camera flash burst right after shutter opens
                triggerCameraFlash();
            }
        }, 600);
    });

    // --- STUDIO FLASH FUNCTION ---
    function triggerCameraFlash() {
        const flashEl = document.getElementById("cameraFlash");
        if(flashEl) {
            flashEl.classList.add("flash-fire");
            flashEl.addEventListener("animationend", () => {
                flashEl.classList.remove("flash-fire");
            }, { once: true });
        }
    }

    // --- MOBILE CAMERA MODE DIAL NAVIGATION ---
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileLinks = document.querySelectorAll(".mobile-nav-item");

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", () => {
            const isOpened = mobileNav.classList.toggle("open");
            menuToggle.classList.toggle("active", isOpened);
            document.body.style.overflow = isOpened ? "hidden" : "";
        });

        // Close layout drawer on items selection
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("open");
                menuToggle.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
    }

    // --- MASONRY SORT / FILTER ENGINE ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const selector = button.getAttribute("data-filter");

            galleryItems.forEach(item => {
                const category = item.getAttribute("data-category");
                if (selector === "all" || category === selector) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });
        });
    });

    // --- LIGHTBOX GALLERY MODULE ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeLightbox = document.getElementById("closeLightbox");
    const imageWrappers = document.querySelectorAll(".image-inner-wrapper");

    imageWrappers.forEach(wrapper => {
        wrapper.addEventListener("click", () => {
            let activeImg = null;

            // If it's a slideshow track, identify which image is currently active based on CSS visibility
            if (wrapper.classList.contains("slideshow-track")) {
                const imgs = wrapper.querySelectorAll(".portfolio-img");
                // Find the image layer that is currently fading into view (opacity > 0)
                activeImg = Array.from(imgs).find(img => {
                    const opacity = window.getComputedStyle(img).opacity;
                    return parseFloat(opacity) > 0;
                }) || imgs[0]; // Fallback to first if layout is hidden or unrendered
            } else {
                // Standard portfolio items fallback
                activeImg = wrapper.querySelector(".portfolio-img");
            }

            const title = wrapper.querySelector(".overlay-details h3")?.textContent || "";
            const category = wrapper.querySelector(".overlay-details p")?.textContent || "";

            if(activeImg && lightbox && lightboxImg) {
                lightboxImg.src = activeImg.src;
                if(lightboxCaption) {
                    lightboxCaption.innerHTML = `<strong>${title}</strong> — ${category}`;
                }
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    if (closeLightbox && lightbox) {
        const exitLightbox = () => {
            lightbox.classList.remove("active");
            if (mobileNav && !mobileNav.classList.contains("open")) {
                document.body.style.overflow = "";
            }
        };
        closeLightbox.addEventListener("click", exitLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) exitLightbox();
        });
    }

    // --- DSLR BACK TO TOP PROGRESS METERS ---
    const scrollTopBtn = document.getElementById("scrollToTopBtn");
    const progressCircle = document.getElementById("scrollProgressCircle");
    
    if (progressCircle) {
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        function updateScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight > 0) {
                const progress = scrollTop / docHeight;
                const offset = circumference - (progress * circumference);
                progressCircle.style.strokeDashoffset = offset;
            }

            if (scrollTopBtn) {
                if (scrollTop > 500) {
                    scrollTopBtn.classList.add("reveal");
                } else {
                    scrollTopBtn.classList.remove("reveal");
                }
            }
        }

        window.addEventListener("scroll", updateScrollProgress, { passive: true });
        
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }
});