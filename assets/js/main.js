const navToggle = document.querySelector('.site-nav__toggle');
const navList = document.querySelector('.site-nav__list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const heroSlider = document.querySelector('.hero__slider');
const heroSlides = Array.from(document.querySelectorAll('.hero__slide'));
const heroDots = Array.from(document.querySelectorAll('.hero__dots button'));
let heroIndex = 0;
let heroTimer;

function updateHeroHeight(index) {
  if (!heroSlider || !heroSlides.length) return;
  const activeSlide = heroSlides[index];
  const slideContent = activeSlide?.querySelector('.hero__container');
  if (!slideContent) return;

  const contentHeight = slideContent.scrollHeight;
  const viewportBaseline = Math.max(window.innerHeight * 0.75, 480);
  const targetHeight = Math.max(contentHeight, viewportBaseline);
  heroSlider.style.height = `${targetHeight}px`;
}

function showHeroSlide(index) {
  heroSlides.forEach((slide, i) => {
    const isActive = i === index;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === index);
  });
  heroIndex = index;
  updateHeroHeight(index);
}

function nextHeroSlide() {
  const nextIndex = (heroIndex + 1) % heroSlides.length;
  showHeroSlide(nextIndex);
}

function startHeroRotation() {
  heroTimer = setInterval(nextHeroSlide, 6000);
}

function stopHeroRotation() {
  clearInterval(heroTimer);
}

if (heroSlides.length && heroDots.length) {
  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopHeroRotation();
      showHeroSlide(index);
      startHeroRotation();
    });
  });

  showHeroSlide(heroIndex);
  startHeroRotation();

  window.addEventListener('resize', () => updateHeroHeight(heroIndex));
  window.addEventListener('load', () => updateHeroHeight(heroIndex));
}

const testimonialSlides = Array.from(document.querySelectorAll('.testimonial'));
const testimonialDots = Array.from(document.querySelectorAll('.testimonial__dots button'));
let testimonialIndex = 0;

function showTestimonial(index) {
  testimonialSlides.forEach((slide, i) => {
    const isActive = i === index;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === index);
  });
  testimonialIndex = index;
}

function nextTestimonial() {
  const nextIndex = (testimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(nextIndex);
}

let testimonialTimer;

function startTestimonialRotation() {
  testimonialTimer = setInterval(nextTestimonial, 7000);
}

function stopTestimonialRotation() {
  clearInterval(testimonialTimer);
}

if (testimonialSlides.length && testimonialDots.length) {
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopTestimonialRotation();
      showTestimonial(index);
      startTestimonialRotation();
    });
  });

  showTestimonial(testimonialIndex);
  startTestimonialRotation();
}
