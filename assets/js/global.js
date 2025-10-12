const navToggle = document.querySelector('.site-nav__toggle');
const navDrawer = document.querySelector('.site-nav__drawer');
const navList = document.querySelector('.site-nav__list');
const navOverlay = document.querySelector('.site-nav__overlay');
const navClose = document.querySelector('.site-nav__close');

const focusableSelector =
  'a[href]:not([tabindex="-1"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

let navIsOpen = false;
let lastFocusedElement = null;
let lastTabDirection = 'forward';

function getFocusableElements() {
  if (!navDrawer) return [];
  const elements = Array.from(navDrawer.querySelectorAll(focusableSelector));
  return elements.filter(
    (element) => !element.hasAttribute('hidden') && element.getClientRects().length > 0
  );
}

function setNavState(open) {
  if (!navToggle || !navDrawer || !navList) return;

  navIsOpen = open;
  navToggle.setAttribute('aria-expanded', open.toString());
  navDrawer.classList.toggle('is-open', open);
  navDrawer.setAttribute('aria-hidden', (!open).toString());
  navList.classList.toggle('is-open', open);

  if (navOverlay) {
    navOverlay.classList.toggle('is-open', open);
    navOverlay.setAttribute('tabindex', open ? '0' : '-1');
  }

  if (navClose) {
    navClose.setAttribute('tabindex', open ? '0' : '-1');
  }

  document.body.classList.toggle('is-locked', open);

  if (open) {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    } else if (navToggle) {
      navToggle.focus();
    }
    lastFocusedElement = null;
    lastTabDirection = 'forward';
  }
}

function handleKeydown(event) {
  if (!navIsOpen) return;

  if (event.key === 'Tab') {
    const focusable = getFocusableElements();
    if (!focusable.length) return;

    lastTabDirection = event.shiftKey ? 'backward' : 'forward';
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    setNavState(false);
  }
}

if (navToggle && navList && navDrawer) {
  if (navClose) {
    navClose.setAttribute('tabindex', '-1');
  }

  if (navOverlay) {
    navOverlay.setAttribute('tabindex', '-1');
  }

  navToggle.addEventListener('click', () => {
    setNavState(!navIsOpen);
  });

  if (navClose) {
    navClose.addEventListener('click', () => {
      setNavState(false);
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      setNavState(false);
    });

    navOverlay.addEventListener('focus', () => {
      if (!navIsOpen) return;
      const focusable = getFocusableElements();
      if (!focusable.length) return;

      if (lastTabDirection === 'backward') {
        focusable[focusable.length - 1].focus();
      } else {
        focusable[0].focus();
      }
    });
  }

  navList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a');
    if (link && navIsOpen) {
      setNavState(false);
    }
  });

  const submenuToggles = navList.querySelectorAll('.site-nav__submenu-toggle');
  submenuToggles.forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) return;
    const controls = toggle.getAttribute('aria-controls');
    const submenu = controls ? document.getElementById(controls) : null;
    const parentItem = toggle.closest('li');

    if (!submenu) return;

    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    submenu.hidden = !expanded;
    if (parentItem) {
      parentItem.classList.toggle('is-expanded', expanded);
    }

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;
      toggle.setAttribute('aria-expanded', nextState.toString());
      submenu.hidden = !nextState;
      if (parentItem) {
        parentItem.classList.toggle('is-expanded', nextState);
      }
    });
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
