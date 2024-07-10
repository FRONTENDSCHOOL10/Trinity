document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      slideChange: function () {
        const activeSlide = this.slides[this.activeIndex];
        const imgElement = activeSlide.querySelector('img');
        const description = imgElement.getAttribute('alt');
        const subtextElement = document.querySelector('.main-banner-subtext');
        subtextElement.textContent = description;
      },
    },
  });

  const toggleButton = document.querySelector('.main-banner-toggle-btn');
  const toggleIcon = document.querySelector('#toggleIcon');

  toggleButton.addEventListener('click', () => {
    if (toggleIcon.src.includes('slidePlay.svg')) {
      swiper.autoplay.start();
      toggleIcon.src = '/src/assets/icon/slidePause.svg';
    } else {
      swiper.autoplay.stop();
      toggleIcon.src = '/src/assets/icon/slidePlay.svg';
    }
  });

  const updateButtonImages = () => {
    const prevButton = document.querySelector('.swiper-button-prev img');
    const nextButton = document.querySelector('.swiper-button-next img');

    if (window.innerWidth <= 768) {
      prevButton.src = '/src/assets/icon/slidePrevMobile.svg';
      nextButton.src = '/src/assets/icon/slideNextMobile.svg';
    } else if (window.innerWidth > 768 && window.innerWidth < 1440) {
      prevButton.src = '/src/assets/icon/slidePrevTablet.svg';
      nextButton.src = '/src/assets/icon/slideNextTablet.svg';
    } else {
      prevButton.src = '/src/assets/icon/slidePrevDesktop.svg';
      nextButton.src = '/src/assets/icon/slideNextDesktop.svg';
    }
  };

  updateButtonImages();
  window.addEventListener('resize', updateButtonImages);
});
