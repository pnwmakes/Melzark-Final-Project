async function loadImageData() {
    const response = await fetch('data/images.json');
    if (!response.ok) {
        throw new Error('Unable to load image data file.');
    }

    return response.json();
}

function createHeroSlide(slide, index) {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';

    const imageEl = document.createElement('img');
    imageEl.src = slide.src;
    imageEl.alt = slide.alt;

    if (index > 0) {
        imageEl.loading = 'lazy';
        imageEl.decoding = 'async';
    }

    slideEl.appendChild(imageEl);

    if (slide.caption) {
        const captionEl = document.createElement('div');
        captionEl.className = 'slide-caption';

        const titleEl = document.createElement('h2');
        titleEl.textContent = slide.caption.title;

        const textEl = document.createElement('p');
        textEl.textContent = slide.caption.text;

        const buttonEl = document.createElement('a');
        buttonEl.href = slide.caption.buttonHref;
        buttonEl.className = 'visit-btn';
        buttonEl.textContent = slide.caption.buttonText;

        captionEl.append(titleEl, textEl, buttonEl);
        slideEl.appendChild(captionEl);
    }

    return slideEl;
}

function createGalleryImage(image) {
    const linkEl = document.createElement('a');
    linkEl.href = image.src;
    linkEl.target = '_blank';

    const imageEl = document.createElement('img');
    imageEl.src = image.src;
    imageEl.alt = image.alt;
    imageEl.loading = 'lazy';
    imageEl.decoding = 'async';

    linkEl.appendChild(imageEl);
    return linkEl;
}

function initSwiper(totalSlides) {
    return new Swiper('.hero-slider', {
        loop: true,
        loopedSlides: totalSlides,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        speed: 1000,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

async function initDynamicImages() {
    const heroContainer = document.getElementById('hero-slides');
    const galleryContainer = document.getElementById('gallery-grid');

    if (!heroContainer || !galleryContainer) {
        return;
    }

    try {
        const data = await loadImageData();
        const heroSlides = Array.isArray(data.heroSlides) ? data.heroSlides : [];
        const galleryImages = Array.isArray(data.galleryImages)
            ? data.galleryImages
            : [];

        heroSlides.forEach((slide, index) => {
            heroContainer.appendChild(createHeroSlide(slide, index));
        });

        galleryImages.forEach((image) => {
            galleryContainer.appendChild(createGalleryImage(image));
        });

        if (heroSlides.length > 0) {
            initSwiper(heroSlides.length);
        }
    } catch (error) {
        console.error('Image loader failed:', error);
    }
}

initDynamicImages();
