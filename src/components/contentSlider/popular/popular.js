import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderPopularContentSlider() {
  const popularContentSliderTemplate = `
    <section class="popular-lists">
      <h3>실시간 인기 프로그램</h3>
      <div class="popular-lists__slider">
        <div class="swiper slider-vertical">
          <div class="swiper-wrapper">
            <!-- Skeleton UI -->
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
            <div class="swiper-slide skeleton-popular">
              <div class="skeleton-overlay-popular"></div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>
  `;

  insertLast(app, popularContentSliderTemplate);

  const popularContent = await pb.collection('popularVod').getFullList({
    sort: 'rank',
  }); // SDK

  document.querySelectorAll('.skeleton-popular').forEach((skeletonSlide) => {
    skeletonSlide.parentNode.removeChild(skeletonSlide);
  });

  popularContent.forEach((item) => {
    if (item.isRanked && !!item.rank) {
      let template;
      if (item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
              <span class="rank">${item.rank}</span>
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
              <span class="rank">${item.rank}</span>
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
              <span class="rank">${item.rank}</span>
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
              <span class="rank">${item.rank}</span>
              <p class="title">${item.contentName}</p>
            </a>
          </div>
        `;
      }

      insertLast('.popular-lists__slider > .slider-vertical > .swiper-wrapper', template);
    }
  });

  const popularSwiper = new Swiper('.slider-vertical', {
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
}

export default renderPopularContentSlider;
