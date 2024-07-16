import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderOnlyContentSlider() {
  const onlyVodSliderTemplate = `
    <section class="only-lists">
      <h3>오직 티빙에만 있어요</h3>
      <div class="only-lists__slider">
        <div class="swiper slider-only">
          <div class="swiper-wrapper">
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>
  `;

  insertLast(app, onlyVodSliderTemplate);

  const onlyContent = await pb.collection('onlyVod').getFullList(); // SDK

  onlyContent.forEach((item) => {
    const template = `
      <div class="swiper-slide">
        <a href="">
          <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
          <p class="title">${item.contentName}</p>
        </a>
      </div>
    `;

    insertLast('.only-lists__slider > .slider-only > .swiper-wrapper', template);
  });

  const only_swiper = new Swiper('.slider-only', {
    slidesPerView: 2,
    slidesPerGroup: 2,
    centeredSlides: false,
    // slidesPerGroupSkip: 0,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      1920: {
        slidesPerView: 6,
        slidesPerGroup: 6,
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

export default renderOnlyContentSlider;
