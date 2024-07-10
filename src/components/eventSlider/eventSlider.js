import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderEventSlider() {
  const eventSliderTemplate = `
    <section class="event-lists">
      <h3>이벤트</h3>
      <div class="event-lists__slider">
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

  insertLast(app, eventSliderTemplate);

  const event = await pb.collection('event').getFullList(); // SDK

  event.forEach((item) => {
    const template = `
      <div class="swiper-slide">
        <a href="">
          <picture>
            <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
            <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
            <img src="${getPbImageURL(item, 'img3x')}" alt="${item.imgAlt}">
          </picture>
        </a>
      </div>
    `;

    insertLast('.event-lists__slider > .slider-horizontal > .swiper-wrapper', template);
  });

  const event_Swiper = new Swiper('.slider-horizontal', {
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
export default renderEventSlider;
