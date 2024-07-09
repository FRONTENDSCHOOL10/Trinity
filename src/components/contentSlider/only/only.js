var only_swiper = new Swiper('.slider-only', {
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
