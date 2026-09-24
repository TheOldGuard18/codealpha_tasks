const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");

const closeBtn = document.getElementById("closeLightbox");
const prevBtn = document.getElementById("prevImage");
const nextBtn = document.getElementById("nextImage");


const galleryImages = [
    {
        src: "images/nature/nature-1.jpg",
        category: "nature",
        title: "Into the Wild"
    },
    {
        src: "images/nature/nature-2.jpg",
        category: "nature",
        title: "Nature's Beauty"
    },
    {
        src: "images/nature/nature-3.jpg",
        category: "nature",
        title: "Green Escape"
    },
    {
        src: "images/nature/nature-4.jpg",
        category: "nature",
        title: "Wild Horizons"
    },
    {
        src: "images/nature/nature-5.jpg",
        category: "nature",
        title: "Peaceful Waters"
    },
    {
        src: "images/nature/nature-6.jpg",
        category: "nature",
        title: "Earth's Colors"
    },
    {
        src: "images/nature/nature-7.jpg",
        category: "nature",
        title: "Mountain View"
    },
    {
        src: "images/nature/nature-8.jpg",
        category: "nature",
        title: "Natural Wonder"
    },

{
    src: "images/cars/car-1.jpg",
    category: "cars",
    title: "Urban Machine"
},
{
    src: "images/cars/car-2.jpg",
    category: "cars",
    title: "Midnight Drive"
},
{
    src: "images/cars/car-3.jpg",
    category: "cars",
    title: "Speed & Style"
},
{
    src: "images/cars/car-4.jpg",
    category: "cars",
    title: "Road Warrior"
},
{
    src: "images/cars/car-5.jpg",
    category: "cars",
    title: "Luxury Motion"
},
{
    src: "images/cars/car-6.jpg",
    category: "cars",
    title: "Street Legend"
},
{
    src: "images/cars/car-7.jpg",
    category: "cars",
    title: "Modern Classic"
},
{
    src: "images/cars/car-8.jpg",
    category: "cars",
    title: "Built to Perform"
},

    {
        src: "images/architecture/architecture-1.jpg",
        category: "architecture",
        title: "Modern Structure"
    },
    {
        src: "images/architecture/architecture-2.jpg",
        category: "architecture",
        title: "Urban Geometry"
    },
    {
        src: "images/architecture/architecture-3.jpg",
        category: "architecture",
        title: "Architectural Lines"
    },
    {
        src: "images/architecture/architecture-4.jpg",
        category: "architecture",
        title: "City Forms"
    },
    {
        src: "images/architecture/architecture-5.jpg",
        category: "architecture",
        title: "Concrete & Glass"
    },
    {
        src: "images/architecture/architecture-6.jpg",
        category: "architecture",
        title: "Urban Perspective"
    },
    {
        src: "images/architecture/architecture-7.jpg",
        category: "architecture",
        title: "Designed Spaces"
    },
    {
        src: "images/architecture/architecture-8.jpg",
        category: "architecture",
        title: "City Architecture"
    },

    {
        src: "images/travel/travel-1.jpg",
        category: "travel",
        title: "The Journey"
    },
    {
        src: "images/travel/travel-2.jpg",
        category: "travel",
        title: "Wanderlust"
    },
    {
        src: "images/travel/travel-3.jpg",
        category: "travel",
        title: "New Horizons"
    },
    {
        src: "images/travel/travel-4.jpg",
        category: "travel",
        title: "Adventure Awaits"
    },
    {
        src: "images/travel/travel-5.jpg",
        category: "travel",
        title: "Memories on the Road"
    }
];


let filteredImages = [...galleryImages];
let currentIndex = 0;


function renderGallery(filter = "all") {

    if (filter === "all") {
        filteredImages = [...galleryImages];
    } else {
        filteredImages = galleryImages.filter(
            image => image.category === filter
        );
    }

    galleryGrid.innerHTML = "";

    filteredImages.forEach((image, index) => {

        const article = document.createElement("article");

        article.className = "gallery-item";

        article.innerHTML = `
    <img 
        src="${image.src}" 
        alt="${image.title}"
        loading="lazy"
    >

    <div class="image-overlay">
        <span>${image.category}</span>
        <h3>${image.title}</h3>
    </div>
`;

        article.addEventListener("click", () => {
            openLightbox(index);
        });

        galleryGrid.appendChild(article);
    });
}


function openLightbox(index) {

    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";
}


function updateLightbox() {

    const image = filteredImages[currentIndex];

    if (!image) return;

    lightboxImage.src = image.src;

    lightboxImage.alt = image.title;

    lightboxCategory.textContent = image.category;

    lightboxTitle.textContent = image.title;

    lightboxCounter.textContent =
        `${currentIndex + 1} / ${filteredImages.length}`;
}


function showNextImage() {

    currentIndex++;

    if (currentIndex >= filteredImages.length) {
        currentIndex = 0;
    }

    updateLightbox();
}


function showPreviousImage() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = filteredImages.length - 1;
    }

    updateLightbox();
}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        const filter = button.dataset.filter;

        renderGallery(filter);
    });
});


closeBtn.addEventListener("click", closeLightbox);

nextBtn.addEventListener("click", showNextImage);

prevBtn.addEventListener("click", showPreviousImage);


lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }
});


document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }
});


renderGallery();