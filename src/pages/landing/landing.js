import { setDocumentTitle, setStorage, getNode, insertLast } from 'kind-tiger';
import defaultAuthData from '@/api/defaultAuthData';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';

setDocumentTitle('TAING');

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

headerScript();

const app = document.getElementById('app');

renderFooter();
footerScript();

const swiper1 = new Swiper('.mySwiper1', {
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
