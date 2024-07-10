import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderMustContentSlider() {
  const mustContentSliderTemplate = `
  <section class="must-lists">
    <h3>티빙에서 꼭 봐야하는 콘텐츠</h3>
    <div class="must-lists__slider">
      <div class="swiper slider-vertical">
        <div class="swiper-wrapper">
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
  </section>
  `;

  insertLast(app, mustContentSliderTemplate);

  const mustContent = await pb.collection('mustVod').getFullList(); // SDK

  mustContent.forEach((item) => {
    if (!item.isRanked || item.isMust) {
      let template;
      if (item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <picture>
                <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
                <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
                <img src="${getPbImageURL(item, 'img3x')}" alt="${item.imgAlt}">
              </picture>
              <p class="title">${item.contentName}</p>
              <span class="adult-only"></span>
              <span class="original"></span>
            </a>
          </div>
        `;
      } else if (item.isAdultOnly && !item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <picture>
                <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
                <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
                <img src="${getPbImageURL(item, 'img3x')}" alt="${item.alt}">
              </picture>
              <p class="title">${item.contentName}</p>
              <span class="adult-only"></span>
            </a>
          </div>
        `;
      } else if (!item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <picture>
                <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
                <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
                <img src="${getPbImageURL(item, 'img3x')}" alt="${item.alt}">
              </picture>
              <p class="title">${item.contentName}</p>
              <span class="original"></span>
            </a>
          </div>
        `;
      } else {
        template = `
          <div class="swiper-slide">
            <a href="">
              <picture>
                <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
                <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
                <img src="${getPbImageURL(item, 'img3x')}" alt="${item.alt}">
              </picture>
              <p class="title">${item.contentName}</p>
            </a>
          </div>
        `;
      }

      insertLast('.must-lists__slider > .slider-vertical > .swiper-wrapper', template);
    }
  });

  const mustSwiper = new Swiper('.slider-vertical', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    centeredSlides: false,
    // slidesPerGroupSkip: 0,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
      1920: {
        slidesPerView: 7,
        slidesPerGroup: 7,
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

  // return mustContent;
}

export default renderMustContentSlider;
