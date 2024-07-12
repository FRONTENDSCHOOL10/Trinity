import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderMainVisualSlider() {
  const mainVisualSlideTemplate = `
    <section class="main-visual">
        <h2 class="sr-only">메인 배너 드라마 슬라이드</h2>
        <div class="main-banner-container swiper-container">
            <div class="swiper-wrapper">
            </div>
        </div>
    </section>
  `;

  insertLast(app, mainVisualSlideTemplate);

  const mainVisual = await pb.collection('mainVisual').getFullList(); // SDK

  mainVisual.forEach((item) => {
    const template = `
      <div class="main-banner-slide swiper-slide">
        <img src="${getPbImageURL(item, 'img')}" data-description="${item.description}" alt="${item.imgAlt}">
        <div class="banner-overlay"></div>
      </div>
    `;

    insertLast('.main-banner-container > .swiper-wrapper', template);
  });

  const mainVisualBtnTemplate = `
    <button class="swiper-button-prev-custom swiper-button-prev">
      <img src="/public/icon/main/slidePrev.svg" alt="이전">
      <span class="sr-only">이전 슬라이드</span>
    </button>
    <button class="swiper-button-next-custom swiper-button-next">
      <img src="/public/icon/main/slideNext.svg" alt="다음">
      <span class="sr-only">다음 슬라이드</span>
    </button>
    <div class="main-banner-info">
      <p class="main-banner-subtext"></p>
      <button class="main-banner-toggle-btn">
        <img id="toggleIcon" src="/public/icon/main/slidePause.svg" alt="Play">
        <span class="sr-only">슬라이드 재생/정지</span>
      </button>
      <div class="main-banner-pagination swiper-pagination"></div>
      <a href="/" class="main-banner-more">자세히보기 <span class="sr-only">자세히 보기 링크</span></a>
    </div>
    `;

  insertLast('.main-banner-container', mainVisualBtnTemplate);

  const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      slideChange: function () {
        const activeSlide = this.slides[this.activeIndex];
        const imgElement = activeSlide.querySelector('.main-banner-slide > img');
        const description = imgElement.getAttribute('data-description');
        const subtextElement = document.querySelector('.main-banner-subtext');
        subtextElement.textContent = description;
      },
    },
  });

  const toggleButton = document.querySelector('.main-banner-toggle-btn');
  const toggleIcon = document.querySelector('#toggleIcon');

  toggleButton.addEventListener('click', () => {
    if (toggleIcon.src.includes('slidePlay.svg')) {
      swiper.autoplay.start();
      toggleIcon.src = '/public/icon/main/slidePause.svg';
    } else {
      swiper.autoplay.stop();
      toggleIcon.src = '/public/icon/main/slidePlay.svg';
    }
  });
}

export default renderMainVisualSlider;
