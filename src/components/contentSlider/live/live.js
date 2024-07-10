import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderLiveContentSlider() {
  const liveVodSliderTemplate = `
    <section class="live-lists">
      <h3>인기 LIVE 채널</h3>
      <div class="live-lists__slider">
        <div class="swiper slider-horizontal">
          <div class="swiper-wrapper">
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>
  `;

  insertLast(app, liveVodSliderTemplate);

  const liveContent = await pb.collection('live').getFullList(); // SDK

  liveContent.forEach((item) => {
    const template = `
      <div class="swiper-slide">
        <a href="">
          <picture>
            <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
            <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
            <img src="${getPbImageURL(item, 'img3x')}" alt="${item.imgAlt}">
          </picture>
          <span class="rank">${item.rank}</span>
          <p class="title">${item.contentName}</p>
          <p class="info">${item.info}</p>
          <p class="sub-info">${item.subInfo}%</p>
        </a>
      </div>
    `;

    insertLast('.live-lists__slider > .slider-horizontal > .swiper-wrapper', template);
  });

  const liveSwiper = new Swiper('.slider-horizontal', {
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

export default renderLiveContentSlider;
