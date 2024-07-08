var swiper = new Swiper('.slider-vertical', {
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
