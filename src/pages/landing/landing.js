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

  const swiper2 = new Swiper('.customized-swiper-top', {
    spaceBetween: 10,
    breakpoints: {
      320: {
        spaceBetween: 10,
      },
      768: {
        spaceBetween: 15,
      },
      1024: {
        spaceBetween: 15,
      },
      1920: {
        spaceBetween: 20,
      },
    },
    // centeredSlides: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
    loop: true,
    loopAdditionalSlides: 4,
    slidesPerView: 'auto',
    speed: 50000,
    allowTouchMove: false,
    slidesPerGroup: 4,
    freeMode: {
      enabled: true,
      momentum: false,
    },
  });

  const swiper3 = new Swiper('.customized-swiper-bottom', {
    spaceBetween: 10,
    breakpoints: {
      320: {
        spaceBetween: 10,
      },
      768: {
        spaceBetween: 15,
      },
      1024: {
        spaceBetween: 15,
      },
      1920: {
        spaceBetween: 20,
      },
    },
    initialSlide: 2,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
    loop: true,
    loopAdditionalSlides: 4,
    slidesPerView: 'auto',
    speed: 30000,
    allowTouchMove: false,
    slidesPerGroup: 4,
    freeMode: {
      enabled: true,
      momentum: false,
    },
    loopFillGroupWithBlank: true, // 추가된 옵션
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

// GSAP 애니메이션 초기화 함수
const initializeAnimations = () => {
  // GSAP과 ScrollTrigger 플러그인 활성화
  gsap.registerPlugin(ScrollTrigger);

  // section 0 애니메이션
  const tl0 = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-section-0',
      start: 'top center',
      toggleActions: 'play none none none',
    },
  });

  tl0
    .from('.onboarding__phrase__title', {
      y: 50,
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
    })
    .from(
      '.onboarding__phrase__sub',
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=1'
    )
    .from('.onboarding__button', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });

  // onboarding 배경 확대 애니메이션
  const backgroundImage = document.querySelector('.onboarding__background');
  gsap.to(backgroundImage, {
    scale: 1.1,
    duration: 20,
  });

  // section 1 애니메이션
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-section-1',
      start: 'top center',
      toggleActions: 'play none none none',
    },
  });

  tl1
    .from('.original__phrase__main', {
      y: 50,
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
    })
    .from(
      '.original__phrase__sub',
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=1.5'
    )
    .from('.original__contents', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });

  // section 2 애니메이션
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-section-2',
      start: 'top center',
      toggleActions: 'play none none none',
    },
  });

  tl2
    .from('.customized__info', {
      y: 50,
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
    })
    .from(
      '.customized__container',
      {
        y: 50,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
      },
      '-=1.5'
    );

  // section 3 애니메이션
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: '.customized__container',
      start: 'top center',
      toggleActions: 'play none none none',
    },
  });

  tl3
    .from('.enroll__logo', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })
    .from('.enroll__title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })
    .from('.enroll__button', {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
};

// DOMContentLoaded 이벤트가 발생하면 실행
document.addEventListener('DOMContentLoaded', () => {
  // Swiper 초기화
  initializeSwiper();

  // 온보딩 버튼에 클릭 이벤트 리스너 추가
  addClickListenerToButton('.onboarding__button');

  // enroll 버튼에 클릭 이벤트 리스너 추가
  addClickListenerToButton('.enroll__button');

  // GSAP 애니메이션 초기화
  initializeAnimations();
});
