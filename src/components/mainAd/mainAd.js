import { getNode, insertFirst, insertLast, setStorage, getStorage } from 'kind-tiger';
import pb from '@/api/pocketbase';
import defaultAuthData from '/src/api/defaultAuthData';
import getPbImageURL from '@/api/getPbImageURL';

import '/src/pages/main/main';

const timeDefault = {
  time: null,
};

if (!localStorage.getItem('adTimer')) {
  setStorage('adTimer', timeDefault);
}

async function renderMainAd() {
  const MainAdTemplate = `
    <div class="main-ad-modal-wrapper">
      <div class="main-ad-modal-dimm">
        <div class="main-ad-modal">
          <a href="/" class="main-ad-modal__link"></a>
          <div class="main-ad-modal__button">
            <button type="button" class="main-ad-modal__button--today-close">오늘 하루 보지 않기</button>
            <div class="main-ad-modal__button--line"></div>
            <button type="button" class="main-ad-modal__button--close">닫기</button>
          </div>  
      </div>
    </div>
  `;

  insertLast('.header', MainAdTemplate);
}

async function getAdData() {
  const mainAd = await pb.collection('mainAd').getFullList(); // SDK
  const ActiveAd = mainAd.find((ad) => ad.isActive === true);

  const AdTemplate = `
    <img src="${getPbImageURL(ActiveAd, 'img')}" alt="${ActiveAd.imgAlt}" class="main-ad-modal__link--img" />
  `;

  insertFirst('.main-ad-modal__link', AdTemplate);
}

async function openMainAdModal() {
  const body = document.querySelector('body');
  const mainAdModal = document.querySelector('.main-ad-modal-wrapper');

  const adTimer = await getStorage('adTimer');
  const timeCloseDay = new Date(adTimer.time);
  const timeNow = new Date();

  const diffHour = (timeNow.getTime() - timeCloseDay.getTime()) / (60 * 60 * 1000);

  // Modal Open > 오늘 하루 보지 않기 버튼이 누르고 24시간이 지나면 광고창 다시 띄우기
  if (!timeCloseDay || diffHour >= 24) {
    document.addEventListener('DOMContentLoaded', () => {
      getAdData();
      mainAdModal.style.display = 'block';
      body.classList.add('stop-scrolling');
    });

    // Modal Day Close Button
    const dayCancleBtn = document.querySelector('.main-ad-modal__button--today-close');
    dayCancleBtn.addEventListener('click', () => {
      const timeNow = {
        time: new Date(),
      };

      setStorage('adTimer', timeNow);
      mainAdModal.style.display = 'none';
      body.classList.remove('stop-scrolling');

      mainAdModal.remove();
    });

    // Modal Close Button
    const closeBtn = document.querySelector('.main-ad-modal__button--close');
    closeBtn.addEventListener('click', () => {
      mainAdModal.style.display = 'none';
      body.classList.remove('stop-scrolling');

      mainAdModal.remove();
    });

    // Modal Focus Trap
    const focusableEls = mainAdModal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]');
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    const modalTrapFocus = (e) => {
      if (e.key === 'Escape') {
        mainAdModal.style.display = 'none';
        body.classList.remove('stop-scrolling');
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
}

export { renderMainAd, openMainAdModal };
