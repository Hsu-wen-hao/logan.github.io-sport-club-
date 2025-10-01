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
    dots[index].classList.remove('is-active');
    index = next;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
  };

  const tick = () => {
    const next = (index + 1) % slides.length;
    setActive(next);
  };

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      if (dotIndex === index) return;
      clearInterval(timer);
      setActive(dotIndex);
      timer = setInterval(tick, interval);
    });
  });

  timer = setInterval(tick, interval);
}

createCarousel('.hero-slide', '.hero__dots button');
createCarousel('.testimonial', '.testimonial__dots button', 8000);
