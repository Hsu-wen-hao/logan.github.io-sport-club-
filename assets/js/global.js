const navToggle = document.querySelector('.site-nav__toggle');
const navList = document.querySelector('.site-nav__list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', (!expanded).toString());
    navList.classList.toggle('is-open');
  });
}

function createCarousel(slideSelector, dotSelector, interval = 6000) {
  const slides = document.querySelectorAll(slideSelector);
  const dots = document.querySelectorAll(dotSelector);
  if (!slides.length || !dots.length) return;

  let index = 0;
  let timer = null;

  const setActive = (next) => {
    slides[index].classList.remove('is-active');
    slides[index].setAttribute('aria-hidden', 'true');
    dots[index].classList.remove('is-active');
    dots[index].setAttribute('aria-pressed', 'false');
    index = next;
    slides[index].classList.add('is-active');
    slides[index].removeAttribute('aria-hidden');
    dots[index].classList.add('is-active');
    dots[index].setAttribute('aria-pressed', 'true');
  };

  const tick = () => {
    const next = (index + 1) % slides.length;
    setActive(next);
  };

  slides.forEach((slide) => {
    if (!slide.classList.contains('is-active')) {
      slide.setAttribute('aria-hidden', 'true');
    }
  });

  dots.forEach((dot, dotIndex) => {
    dot.setAttribute('aria-pressed', dot.classList.contains('is-active') ? 'true' : 'false');
    dot.addEventListener('click', () => {
      if (dotIndex === index) return;
      clearInterval(timer);
      setActive(dotIndex);
      timer = setInterval(tick, interval);
    });
  });

  timer = setInterval(tick, interval);
}

createCarousel('.hero:not(.hero--shop) .hero-slide', '.hero:not(.hero--shop) .hero__dots button');
createCarousel('.hero--shop .hero-slide', '.hero--shop .hero__dots button', 7000);
createCarousel('.testimonial', '.testimonial__dots button', 8000);
