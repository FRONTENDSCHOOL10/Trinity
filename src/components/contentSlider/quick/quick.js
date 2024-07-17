import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderQuickVodContentSlider() {
  const quickVodSliderTemplate = `
    <section class="quick-lists">
      <h3>Quick VOD</h3>
      <div class="quick-lists__slider">
        <div class="swiper slider-horizontal">
          <div class="swiper-wrapper">
            <!-- Skeleton UI -->
            <div class="swiper-slide skeleton-quick">
              <div class="skeleton-overlay-quick"></div>
            </div>
            <div class="swiper-slide skeleton-quick">
              <div class="skeleton-overlay-quick"></div>
            </div>
            <div class="swiper-slide skeleton-quick">
              <div class="skeleton-overlay-quick"></div>
            </div>
            <div class="swiper-slide skeleton-quick">
              <div class="skeleton-overlay-quick"></div>
            </div>
            <div class="swiper-slide skeleton-quick">
              <div class="skeleton-overlay-quick"></div>
            </div>
            <div class="swiper-slide skeleton-quick">
              <div class="skeleton-overlay-quick"></div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>
  `;

  insertLast(app, quickVodSliderTemplate);

  const quickContent = await pb.collection('quickVod').getFullList(); // SDK

  document.querySelectorAll('.skeleton-quick').forEach((skeletonSlide) => {
    skeletonSlide.parentNode.removeChild(skeletonSlide);
  });

  quickContent.forEach((item) => {
    const template = `
      <div class="swiper-slide">
        <a href="">
          <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
          <p class="title">${item.contentName}</p>
          <p class="info">${item.info}화</p>
          <span class="quick-vod"></span>
        </a>
      </div>
    `;

    insertLast('.quick-lists__slider > .slider-horizontal > .swiper-wrapper', template);
  });

  const liveSwiper = new Swiper('.slider-horizontal', {
    slidesPerView: 2,
    slidesPerGroup: 2,
    centeredSlides: false,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1920: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
    },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

export default renderQuickVodContentSlider;
