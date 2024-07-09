var quick_swiper = new Swiper('.slider-horizontal', {
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
