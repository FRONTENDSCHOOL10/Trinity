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
        if (toggleIcon.src.includes('play.svg')) {
            swiper.autoplay.start();
            toggleIcon.src = '/src/components/main_banner_slide/img/pause.svg';
        } else {
            swiper.autoplay.stop();
            toggleIcon.src = '/src/components/main_banner_slide/img/play.svg';
        }
    });

    const updateButtonImages = () => {
        const prevButton = document.querySelector('.swiper-button-prev img');
        const nextButton = document.querySelector('.swiper-button-next img');

        if (window.innerWidth <= 768) {
            prevButton.src = '/src/components/main_banner_slide/img/prev_mobile.svg';
            nextButton.src = '/src/components/main_banner_slide/img/next_mobile.svg';
        } else if (window.innerWidth > 768 && window.innerWidth < 1440) {
            prevButton.src = '/src/components/main_banner_slide/img/prev_tablet.svg';
            nextButton.src = '/src/components/main_banner_slide/img/next_tablet.svg';
        } else {
            prevButton.src = '/src/components/main_banner_slide/img/prev_desktop.svg';
            nextButton.src = '/src/components/main_banner_slide/img/next_desktop.svg';
        }
    };

    updateButtonImages();

    window.addEventListener('resize', updateButtonImages);
});
