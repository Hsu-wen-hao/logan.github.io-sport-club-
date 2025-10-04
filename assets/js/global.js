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

const MEMBER_STORAGE_KEY = 'motionClubMember';
const SESSION_STORAGE_KEY = 'motionClubSession';

const canUseStorage = (() => {
  try {
    const testKey = '__motion_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('本地儲存空間無法使用，會員資料僅會保留於此瀏覽器工作階段。', error);
    return false;
  }
})();

const storage = {
  read(key) {
    if (!canUseStorage) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('讀取儲存資料時發生錯誤', error);
      return null;
    }
  },
  write(key, value) {
    if (!canUseStorage) return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('寫入儲存資料時發生錯誤', error);
      return false;
    }
  },
  remove(key) {
    if (!canUseStorage) return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('移除儲存資料時發生錯誤', error);
    }
  },
};

const getStoredMember = () => {
  const raw = storage.read(MEMBER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email) {
      return parsed;
    }
  } catch (error) {
    console.warn('解析會員資料時發生錯誤', error);
  }
  return null;
};

const saveMember = (member) => {
  if (!member || !member.email) return false;
  return storage.write(MEMBER_STORAGE_KEY, JSON.stringify(member));
};

const getSessionEmail = () => storage.read(SESSION_STORAGE_KEY);
const setSessionEmail = (email) => {
  if (!email) {
    storage.remove(SESSION_STORAGE_KEY);
    return;
  }
  storage.write(SESSION_STORAGE_KEY, email);
};

const clearSession = () => storage.remove(SESSION_STORAGE_KEY);

const isMemberLoggedIn = () => {
  const member = getStoredMember();
  const sessionEmail = getSessionEmail();
  return Boolean(member && sessionEmail && member.email === sessionEmail);
};

const updateAuthUI = () => {
  const loggedIn = isMemberLoggedIn();
  document.querySelectorAll('[data-auth="guest"]').forEach((el) => {
    el.hidden = loggedIn;
  });
  document.querySelectorAll('[data-auth="member"]').forEach((el) => {
    el.hidden = !loggedIn;
  });
  document.querySelectorAll('[data-auth-cta]').forEach((cta) => {
    if (!(cta instanceof HTMLElement)) return;
    const guestText = cta.getAttribute('data-guest-text');
    const guestHref = cta.getAttribute('data-guest-href');
    const memberText = cta.getAttribute('data-member-text');
    const memberHref = cta.getAttribute('data-member-href');
    if (loggedIn) {
      if (memberText) cta.textContent = memberText;
      if (memberHref) cta.setAttribute('href', memberHref);
    } else {
      if (guestText) cta.textContent = guestText;
      if (guestHref) cta.setAttribute('href', guestHref);
    }
  });
};

const showFormMessage = (form, message, type = 'error') => {
  const messageEl = form.querySelector('[data-form-message]');
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.className = `form-message form-message--${type}`;
  messageEl.hidden = false;
};

const clearFormMessage = (form) => {
  const messageEl = form.querySelector('[data-form-message]');
  if (!messageEl) return;
  messageEl.textContent = '';
  messageEl.hidden = true;
};

const populateMemberDashboard = () => {
  const member = getStoredMember();
  if (!member) return;

  const name = member.name || '動能會員';
  const sport = member.sport || '尚未設定';
  const plan = member.plan || '一般會員';
  const goal = member.goal || '';
  const createdAt = member.createdAt ? new Date(member.createdAt) : new Date();
  const today = new Date();
  const days = Math.max(0, Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)));

  document.querySelectorAll('[data-member-name]').forEach((el) => {
    el.textContent = name;
  });
  document.querySelectorAll('[data-member-sport]').forEach((el) => {
    el.textContent = sport;
  });
  document.querySelectorAll('[data-member-plan]').forEach((el) => {
    el.textContent = plan;
  });
  document.querySelectorAll('[data-member-days]').forEach((el) => {
    el.textContent = days.toString();
  });
  const joinDate = document.querySelector('[data-member-join-date]');
  if (joinDate) {
    joinDate.textContent = createdAt.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  const goalEl = document.querySelector('[data-member-goal]');
  if (goalEl) {
    goalEl.textContent = goal ? `目前目標：${goal}` : '註冊時尚未填寫訓練目標，歡迎與教練討論設定。';
  }
};

const registerForm = document.querySelector('[data-auth-form="register"]');
const loginForm = document.querySelector('[data-auth-form="login"]');

const currentPage = document.body?.dataset?.page || '';

if (currentPage === 'member' && !isMemberLoggedIn()) {
  window.location.href = 'login.html';
}

if ((currentPage === 'register' || currentPage === 'login') && isMemberLoggedIn()) {
  window.location.href = 'member-home.html';
}

updateAuthUI();

document.querySelectorAll('[data-action="logout"]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    clearSession();
    updateAuthUI();
    if (document.body?.dataset?.page === 'member') {
      window.location.href = 'login.html';
    } else {
      window.location.href = 'index.html';
    }
  });
});

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFormMessage(registerForm);
    const formData = new FormData(registerForm);
    const name = (formData.get('fullName') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim().toLowerCase();
    const password = (formData.get('password') || '').toString();
    const confirmPassword = (formData.get('confirmPassword') || '').toString();
    const sport = (formData.get('sport') || '').toString();
    const plan = (formData.get('plan') || '').toString();
    const goal = (formData.get('goal') || '').toString().trim();
    const agreed = formData.get('terms');

    if (!name) {
      showFormMessage(registerForm, '請輸入姓名。', 'error');
      return;
    }
    if (!email) {
      showFormMessage(registerForm, '請輸入有效的 Email。', 'error');
      return;
    }
    if (password.length < 6) {
      showFormMessage(registerForm, '密碼需至少 6 碼，包含英文與數字。', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showFormMessage(registerForm, '兩次輸入的密碼不一致。', 'error');
      return;
    }
    if (!sport) {
      showFormMessage(registerForm, '請選擇主要訓練項目。', 'error');
      return;
    }
    if (!plan) {
      showFormMessage(registerForm, '請選擇偏好方案。', 'error');
      return;
    }
    if (!agreed) {
      showFormMessage(registerForm, '請勾選同意會員條款。', 'error');
      return;
    }

    const existing = getStoredMember();
    const createdAt = existing && existing.email === email ? existing.createdAt : new Date().toISOString();

    const memberData = {
      name,
      email,
      password,
      sport,
      plan,
      goal,
      createdAt,
    };

    if (!saveMember(memberData)) {
      showFormMessage(registerForm, '儲存會員資料時發生錯誤，請稍後再試。', 'error');
      return;
    }

    setSessionEmail(email);
    updateAuthUI();
    showFormMessage(registerForm, '註冊成功，正在為你前往會員中心。', 'success');

    window.setTimeout(() => {
      window.location.href = 'member-home.html';
    }, 600);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFormMessage(loginForm);
    const formData = new FormData(loginForm);
    const email = (formData.get('email') || '').toString().trim().toLowerCase();
    const password = (formData.get('password') || '').toString();

    if (!email || !password) {
      showFormMessage(loginForm, '請輸入 Email 與密碼。', 'error');
      return;
    }

    const member = getStoredMember();
    if (!member || member.email.toLowerCase() !== email) {
      showFormMessage(loginForm, '找不到此帳號，請確認 Email 或先註冊會員。', 'error');
      return;
    }

    if (member.password !== password) {
      showFormMessage(loginForm, '密碼不正確，請再試一次。', 'error');
      return;
    }

    setSessionEmail(member.email);
    updateAuthUI();
    showFormMessage(loginForm, '登入成功，立即帶你前往會員中心。', 'success');

    window.setTimeout(() => {
      window.location.href = 'member-home.html';
    }, 400);
  });
}

if (currentPage === 'member' && isMemberLoggedIn()) {
  populateMemberDashboard();
}
