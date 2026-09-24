const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });
}

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        if (mainNav) {
            mainNav.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }

        if (menuToggle) {
            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    });
});


const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeIcon();

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem("theme", isDark ? "dark" : "light");

        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const icon = themeToggle?.querySelector("i");

    if (!icon) return;

    const isDark = document.body.classList.contains("dark-mode");

    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
}


const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 80) {
            element.classList.add("visible");
        }
    });
}

window.addEventListener("load", () => {
    document.querySelectorAll(".hero .reveal").forEach((element) => {
        element.classList.add("visible");
    });

    revealOnScroll();
});

window.addEventListener("scroll", revealOnScroll);


const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);

window.addEventListener("load", updateActiveNav);


const siteHeader = document.querySelector(".site-header");

function updateHeader() {
    if (!siteHeader) return;

    if (window.scrollY > 20) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);

window.addEventListener("load", updateHeader);


const modal = document.getElementById("project-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");
const modalBackdrop = document.querySelector(".modal-backdrop");
const previewLinks = document.querySelectorAll(".preview-link");

previewLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const image = link.dataset.image;
        const title = link.dataset.title;

        if (modalImage) {
            modalImage.src = image;
            modalImage.alt = title;
        }

        if (modalTitle) {
            modalTitle.textContent = title;
        }

        if (modal) {
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
    });
});

function closeModal() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

/* Project Filters */

const projectFilters = document.querySelectorAll(".project-filter");
const projectItems = document.querySelectorAll(".project-item");

projectFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
        const selectedFilter = filter.dataset.filter;

        projectFilters.forEach((button) => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        projectItems.forEach((project) => {
            const projectCategory = project.dataset.category;

            const shouldShow =
                selectedFilter === "all" ||
                projectCategory === selectedFilter;

            project.classList.remove("filter-enter");

            if (shouldShow) {
                project.classList.remove("is-hidden");

                requestAnimationFrame(() => {
                    project.classList.add("filter-enter");
                });
            } else {
                project.classList.add("is-hidden");
            }
        });
    });
});



const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (formMessage) {
            formMessage.textContent = "Sending your message...";
        }

        const submitButton = contactForm.querySelector("button[type=submit]");
        submitButton?.setAttribute("disabled", "true");

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Message could not be sent");
            }

            contactForm.reset();

            if (formMessage) {
                formMessage.textContent =
                    "Thanks for reaching out. I'll get back to you soon.";
            }
        } catch (error) {
            if (formMessage) {
                formMessage.textContent =
                    "Something went wrong. Please email me directly instead.";
            }
        } finally {
            submitButton?.removeAttribute("disabled");
        }
    });
}