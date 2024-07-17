import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast, insertAfter, getStorage } from 'kind-tiger';

async function renderWatchingContentSlider() {
  const auth = await getStorage('auth');
  const selectedProfileIndex = await getStorage('selectedProfileIndex');
  const userInfo = auth.user;
  let ChosenProfileName;
  let ChosenProfileWatchingDataID;

  for (const key in userInfo) {
    if (key.includes(`profileName${selectedProfileIndex}`)) {
      ChosenProfileName = userInfo[key];
    } else if (key.includes(`profileWatching${selectedProfileIndex}`)) {
      ChosenProfileWatchingDataID = userInfo[key];
    }
  }

  let ChosenProfileWatchingData;

  try {
    ChosenProfileWatchingData = await pb.collection('userWatching').getOne(ChosenProfileWatchingDataID);
  } catch (e) {
    return;
  }

  if (!ChosenProfileWatchingData.currentWatching) {
    return;
  }

  const watchingContentSliderTemplate = `
    <section class="watching-lists">
      <h3>${ChosenProfileName}님이 시청하는 콘텐츠</h3>
      <div class="watching-lists__slider">
        <div class="swiper slider-vertical">
          <div class="swiper-wrapper">
            <!-- Skeleton UI -->
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
            <div class="swiper-slide skeleton-watching">
              <div class="skeleton-overlay-watching"></div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>
  `;

  insertAfter('.must-lists', watchingContentSliderTemplate);

  let currentWatching = [];

  for (const key in ChosenProfileWatchingData.currentWatching) {
    currentWatching.push(key);
  }

  const watchingContent = await pb.collection('allVod').getFullList();

  document.querySelectorAll('.skeleton-watching').forEach((skeletonSlide) => {
    skeletonSlide.parentNode.removeChild(skeletonSlide);
  });

  watchingContent.forEach((item) => {
    if (currentWatching.includes(item.contentName)) {
      let template;
      if (item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.imgAlt}" class="poster">
              <p class="title">${ChosenProfileWatchingData.currentWatching[item.contentName][0]}화<button type="button" class="more"><span class="sr-only">더보기</span></button></p>
              <span class="adult-only"></span>
              <span class="original"></span>
              <div class="line" style="width:${ChosenProfileWatchingData.currentWatching[item.contentName][1]}%;"></div>
              <img src="/icon/main/iconReplay.svg" alt="다시 재생하기 버튼" class="replay" />
            </a>
          </div>
        `;
      } else if (item.isAdultOnly && !item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}" class="poster">
              <p class="title">${ChosenProfileWatchingData.currentWatching[item.contentName][0]}화<button type="button" class="more"><span class="sr-only">더보기</span></button></p>
              <div class="line" style="width:${ChosenProfileWatchingData.currentWatching[item.contentName][1]}%;"></div>
              <img src="/icon/main/iconReplay.svg" alt="다시 재생하기 버튼" class="replay" />
            </a>
          </div>
        `;
      } else if (!item.isAdultOnly && item.isPlatformOnly) {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}" class="poster">
              <p class="title">${ChosenProfileWatchingData.currentWatching[item.contentName][0]}화<button type="button" class="more"><span class="sr-only">더보기</span></button></p>
              <span class="original"></span>
              <div class="line" style="width:${ChosenProfileWatchingData.currentWatching[item.contentName][1]}%;"></div>
              <img src="/icon/main/iconReplay.svg" alt="다시 재생하기 버튼" class="replay" />
            </a>
          </div>
        `;
      } else {
        template = `
          <div class="swiper-slide">
            <a href="">
              <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}" class="poster">
              <p class="title">${ChosenProfileWatchingData.currentWatching[item.contentName][0]}화<button type="button" class="more"><span class="sr-only">더보기</span></button></p>
              <div class="line" style="width:${ChosenProfileWatchingData.currentWatching[item.contentName][1]}%;"></div>
              <img src="/icon/main/iconReplay.svg" alt="다시 재생하기 버튼" class="replay" />
            </a>
          </div>
        `;
      }

      insertLast('.watching-lists__slider > .slider-vertical > .swiper-wrapper', template);
    }
  });

  const watchingSwiper = new Swiper('.slider-vertical', {
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

export default renderWatchingContentSlider;
