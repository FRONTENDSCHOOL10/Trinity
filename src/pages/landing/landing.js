import { setStorage } from 'kind-tiger';
import defaultAuthData from '@/api/defaultAuthData';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

headerScript();
renderFooter();
footerScript();

const initializeSwiper = () => {
  new Swiper('.mySwiper1', {
    effect: 'coverflow',
    spaceBetween: 30,
    slideShadows: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    loop: true,
    loopAdditionalSlides: 2,
    preloadImages: true,
    lazy: {
      loadPrevNext: true,
    },
  });
};

const addClickListenerToButton = (buttonSelector) => {
  const button = document.querySelector(buttonSelector);
  if (button) {
    button.style.cursor = 'pointer';
    button.addEventListener('click', (event) => {
      const anchorTag = button.querySelector('a');
      if (anchorTag) {
        window.location.href = anchorTag.href;
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initializeSwiper();
  addClickListenerToButton('.onboarding__button');
  addClickListenerToButton('.enroll__button');
});
