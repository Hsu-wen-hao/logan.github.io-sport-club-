const navToggle = document.querySelector('.site-nav__toggle');
const navList = document.querySelector('.site-nav__list');
const pageBody = document.body;

if (navToggle && navList && pageBody) {
  const openLabel = navToggle.getAttribute('data-label-open') || navToggle.textContent.trim();
  const closeLabel = navToggle.getAttribute('data-label-close') || '關閉';
  const navLinks = navList.querySelectorAll('a');
  const mobileBreakpoint = window.matchMedia('(max-width: 768px)');

  const closeNav = () => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = openLabel;
    pageBody.classList.remove('nav-open');
  };

  const openNav = () => {
    navList.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.textContent = closeLabel;
    pageBody.classList.add('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navList.classList.contains('is-open')) {
        closeNav();
      }
    });
  });

  navList.addEventListener('click', (event) => {
    if (event.target === navList) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navList.classList.contains('is-open')) {
      closeNav();
    }
  });

  const handleBreakpointChange = (event) => {
    if (!event.matches) {
      closeNav();
    }
  };

  if (typeof mobileBreakpoint.addEventListener === 'function') {
    mobileBreakpoint.addEventListener('change', handleBreakpointChange);
  } else if (typeof mobileBreakpoint.addListener === 'function') {
    mobileBreakpoint.addListener(handleBreakpointChange);
  }
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
