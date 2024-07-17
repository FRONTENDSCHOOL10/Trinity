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
          <!-- Skeleton UI -->
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
          <div class="swiper-slide skeleton-must">
            <div class="skeleton-img-must"></div>
            <div class="skeleton-overlay-must"></div>
          </div>
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

  document.querySelectorAll('.skeleton-must').forEach((skeletonSlide) => {
    skeletonSlide.parentNode.removeChild(skeletonSlide);
  });

  mustContent.forEach((item) => {
    if (!item.isRanked || item.isMust) {
      let template;
      if (item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.imgAlt}">
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
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
              <p class="title">${item.contentName}</p>
              <span class="adult-only"></span>
            </a>
          </div>
        `;
      } else if (!item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
              <p class="title">${item.contentName}</p>
              <span class="original"></span>
            </a>
          </div>
        `;
      } else {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
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
