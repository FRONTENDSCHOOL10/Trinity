import { getNode, insertLast, setStorage } from 'kind-tiger';
// import pb from '@/api/pocketbase';
import defaultAuthData from '/src/api/defaultAuthData';

// import '/src/pages/main/main';

async function renderProfileMenu() {
  const profileMenuTemplate = `
    <div class="profile-modal-wrapper">
      <div class="profile-modal">
        <div class="profile-modal__info">
          <img src="/imgTemporary.png" alt="현재 프로필" class="menu-profile-icon" />
          <div class="profile-modal__info--text">
            <p>프로필 이름</p>
            <a href="">프로필 전환<span class="bracket" aria-hidden="true"> ></span></a>
          </div>
        </div>
        <div class="profile-modal__line" aria-hidden="true"></div>
        <div class="profile-modal__menu">
          <div class="menu-wrapper"><a href="">MY</a></div>
          <div class="menu-wrapper"><a href="">이용권</a></div>
          <div class="menu-wrapper"><a href="">쿠폰등록</a></div>
          <div class="menu-wrapper"><a href="">고객센터</a></div>
          <div class="menu-wrapper"><a href="" class="logout">로그아웃</a></div>
        </div>
      </div>
    </div>
  `;

  insertLast('.header__aside__button--profile', profileMenuTemplate);

  // const users = await pb.collection('mustVod').getFullList();
  // console.log(users);
}

function renderLogoutModal() {
  const logoutModalTemplate = `
    <div class="logout-modal-wrapper">
      <div class="logout-modal-dimm">
        <div class="logout-modal">
          <div class="logout-modal__contents">
            <p>로그아웃 하시겠습니까?</p>
          </div>
          <div class="logout-modal__button">
            <button type="button" class="logout-modal__button--yes logout-yes">확인</button>
            <div class="logout-modal__button--line"></div>
            <button type="button" class="logout-modal__button--no">취소</button>
          </div>
        </div>
      </div>
    </div>
  `;

  insertLast('.header', logoutModalTemplate);
}

function toggleLogoutModal() {
  const body = document.querySelector('body');
  const logoutModal = document.querySelector('.logout-modal-wrapper');

  // Modal Open Button
  const showLogoutBtn = document.querySelector('.logout');
  showLogoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutModal.style.display = 'block';
    body.classList.add('stop-scrolling');
  });

  // Modal Close Button
  const cancleBtn = document.querySelector('.logout-modal__button--no');
  cancleBtn.addEventListener('click', () => {
    logoutModal.style.display = 'none';
    body.classList.remove('stop-scrolling');
  });

  // Modal Focus Trap
  const focusableEls = logoutModal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]');
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  const modalTrapFocus = (e) => {
    if (e.key === 'Escape') {
      logoutModal.style.display = 'none';
    }
    if (e.key === 'Tab') {
      if (document.activeElement === lastFocusableEl && !e.shiftKey) {
        firstFocusableEl.focus();
        e.preventDefault();
      } else if (document.activeElement === firstFocusableEl && e.shiftKey) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    }
  };

  document.addEventListener('keydown', modalTrapFocus);
}

function logout() {
  const logoutYes = document.querySelector('.logout-yes');

  function handelLogout() {
    setStorage('auth', defaultAuthData);
    location.replace('/src/pages/landing/index.html');
  }

  logoutYes.addEventListener('click', handelLogout);
}

// renderProfileMenu();

export { renderProfileMenu, renderLogoutModal, toggleLogoutModal, logout };
