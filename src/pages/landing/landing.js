import { setStorage } from 'kind-tiger';
import defaultAuthData from '@/api/defaultAuthData';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

// 헤더와 푸터 스크립트 실행
headerScript();
renderFooter();
footerScript();

// Swiper 초기화 함수
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

// 버튼에 클릭 이벤트 리스너를 추가하는 함수
const addClickListenerToButton = (buttonSelector) => {
  const button = document.querySelector(buttonSelector);
  if (button) {
    // 클릭 이벤트 리스너 추가
    button.addEventListener('click', (event) => {
      const anchorTag = button.querySelector('a');
      if (anchorTag) {
        // a 태그의 href로 이동
        window.location.href = anchorTag.href;
      }
    });
  }
};

// DOMContentLoaded 이벤트가 발생하면 실행
document.addEventListener('DOMContentLoaded', () => {
  // Swiper 초기화
  initializeSwiper();

  // 온보딩 버튼에 클릭 이벤트 리스너 추가
  addClickListenerToButton('.onboarding__button');

  // enroll 버튼에 클릭 이벤트 리스너 추가
  addClickListenerToButton('.enroll__button');
});
