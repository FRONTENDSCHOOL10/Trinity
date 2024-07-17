import '/src/styles/main.scss';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast, insertFirst, insertAfter, getStorage, setStorage, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';
import downloadImage from '@/api/downloadImage';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';

setDocumentTitle('TAING / 프로필 만들기');

async function checkIsAuth() {
  const auth = await getStorage('auth');

  // 로그인 되어있지 않으면 랜딩 페이지로 보내는 코드
  if (!auth.isAuth) {
    location.replace('/src/pages/landing/index.html');
  }
}

checkIsAuth();

if (!localStorage.getItem('selectedProfileIndex')) {
  setStorage('selectedProfileIndex', '1');
}

/* -------------------------------------------------------------------------- */
/*                                  헤더 렌더링 코드                           */
/* -------------------------------------------------------------------------- */
headerScript();

/* -------------------------------------------------------------------------- */
/*                                프로필 생성 렌더링 코드                       */
/* -------------------------------------------------------------------------- */
const body = getNode('body');
let profileNameInput;
let handleLock;
const createBtn = getNode('.btnCreateEdit');
const cancleBtn = getNode('.btnCancleEdit');
const deleteBtn = getNode('.btnDeleteEdit');

let authData;
let user;
let profileIndex;
let profileName;
let profileImageUrl;
let profileImage;
let profileIsActive;
let profileIsLocked;
let imgCollection;

async function renderProfileCreate() {
  profileIndex = await getStorage('selectedProfileIndex');
  authData = await getStorage('auth');
  user = authData.user;

  profileName = user['profileName' + profileIndex];
  profileImageUrl = getPbImageURL(authData.user, `profileImg${profileIndex}`);
  profileIsActive = user['isActive' + profileIndex];
  profileIsLocked = user['isLocked' + profileIndex];

  getNode('#handleLock').checked = profileIsLocked;

  const imgTemplate = `
          <li class="profile-create__form--item profileItem">
              <button class="item__form" type="button">
                  <figure class="user-profile">
                      <img src="${profileImageUrl}" alt="프로필" id="profileImg">
                      <figcaption class="sr-only"></figcaption>
                  </figure>
                  <span class="bg"></span>
                  <span class="icon"><img src="/icon/profile/iconEditProfile.svg" alt="편집 아이콘"></span>
              </button>
              <p class="name profileName"></p>
          </li>
          `;

  insertFirst('.profile-create__form', imgTemplate);

  const inputTemplate = `
  <input type="text" id="profileNameInput" placeholder="프로필 이름" autocomplete="off" />
  `;

  insertFirst('.profile-create__form--name', inputTemplate);

  profileNameInput = getNode('#profileNameInput');
  profileNameInput.value = profileName;

  renderImgListModal();
  toggleImgListModal();
}

function renderImgListModal() {
  const imageListModalTemplate = `
    <div class="imglist-modal-wrapper">
      <div class="imglist-modal-dimm">
        <div class="imglist-modal">
        <p>이미지 선택</p>
        <button type="button" class="imglist-modal__close-button" aria-label="닫기 버튼"></button>
          <div class="imglist-modal__contents">
          </div>
        </div>
      </div>
    </div>
  `;

  insertLast('.header', imageListModalTemplate);

  renderImgSlider();
}

async function renderImgSlider() {
  imgCollection = await pb.collection('profileImg').getFullList();
  let imgCategoryKor = [];
  let imgCategoryEng = [];

  imgCollection.forEach((item) => {
    if (!imgCategoryKor.includes(item.categoryKor) && !imgCategoryEng.includes(item.categoryEng)) {
      imgCategoryKor.push(item.categoryKor);
      imgCategoryEng.push(item.categoryEng);
    }
  });

  for (const category of imgCategoryKor) {
    const index = imgCategoryKor.indexOf(category);
    const categoryTemplate = `
      <p>${category}</p>
      <div class="swiper profileImgSwiper">
        <div class="swiper-wrapper ${imgCategoryEng[index]}">
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;

    insertLast('.imglist-modal__contents', categoryTemplate);
  }

  imgCollection.forEach((item) => {
    const category = '.' + item.categoryEng;

    const imgSlideTemplate = `
    <div class="swiper-slide">
      <button class="img-button">
        <img src="${getPbImageURL(item, 'img')}" alt="" id="selectedImg" />
      </button>
    </div>
    `;

    insertLast(category, imgSlideTemplate);
  });

  const imgBtn = document.querySelectorAll('.img-button');

  imgBtn.forEach((item) => {
    item.addEventListener('click', selectImg);
  });

  const profileImgSwiper = new Swiper('.profileImgSwiper', {
    slidesPerView: 3,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 5,
      },
      // 1920: {
      //   slidesPerView: 7,
      // },
    },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
  });
}

function toggleImgListModal() {
  const body = document.querySelector('body');
  const profileImgListModal = document.querySelector('.imglist-modal-wrapper');

  // Modal Open Button
  const showImgListBtn = document.querySelector('.item__form');
  showImgListBtn.addEventListener('click', (e) => {
    e.preventDefault();
    profileImgListModal.style.display = 'block';
    body.classList.add('stop-scrolling');
  });

  // Modal Close Button
  const cancleBtn = document.querySelector('.imglist-modal__close-button');
  cancleBtn.addEventListener('click', () => {
    profileImgListModal.style.display = 'none';
    body.classList.remove('stop-scrolling');
  });

  // Modal Focus Trap
  const focusableEls = profileImgListModal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]');
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  const modalTrapFocus = (e) => {
    if (e.key === 'Escape') {
      profileImgListModal.style.display = 'none';
    }
    if (e.key === 'Tab') {
      if (document.activeElement === lastFocusableEl && !e.shiftKey) {
        firstFocusableEl.focus();
        e.preventDefault();
      } else if (document.activeElement === firstFocusableEl && e.shiftKey) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    }
  };

  document.addEventListener('keydown', modalTrapFocus);
}

function selectImg() {
  const imgSrc = this.children[0].getAttribute('src');
  getNode('#profileImg').setAttribute('src', imgSrc);
  profileImageUrl = imgSrc;
  getNode('.imglist-modal-wrapper').style.display = 'none';
  body.classList.remove('stop-scrolling');
}

async function createProfile() {
  profileImage = await downloadImage(profileImageUrl);

  const modiUser = new FormData();

  modiUser.append(`profileName${profileIndex}`, profileNameInput.value);
  modiUser.append(`profileImg${profileIndex}`, profileImage, 'profileImg.jpg');
  modiUser.append(`isActive${profileIndex}`, true);
  modiUser.append(`isLocked${profileIndex}`, getNode('#handleLock').checked);

  await pb.collection('users').update(user.id, modiUser);

  const reloadUser = await pb.collection('users').getOne(user.id);

  setStorage('auth', {
    isAuth: true,
    user: reloadUser,
    token: user.token,
  });

  location.replace('/src/pages/profileSelect/index.html');
}

function cancleCreate() {
  setStorage('selectedProfileIndex', '1');
  location.replace('/src/pages/profileSelect/index.html');
}

async function deleteProfile() {
  if (profileIndex === '1' && !user.isActive2 && !user.isActive3 && !user.isActive4) {
    alert('마지막 프로필은 삭제할 수 없습니다.');
  } else if (profileIndex === '4') {
    const defaultAvatarUrl = getPbImageURL(imgCollection[0], 'img');
    const imgBlob = await downloadImage(defaultAvatarUrl);

    const modiUser = new FormData();

    modiUser.append('profileName4', '프로필4');
    modiUser.append('profileImg4', imgBlob, 'profileImg4.jpg');
    modiUser.append('isActive4', false);
    modiUser.append('isLocked4', false);

    await pb.collection('users').update(user.id, modiUser);

    const reloadUser = await pb.collection('users').getOne(user.id);

    setStorage('auth', {
      isAuth: true,
      user: reloadUser,
      token: user.token,
    });

    alert('프로필이 삭제되었습니다.');

    location.replace('/src/pages/profileSelect/index.html');
  } else if (profileIndex === '1' || profileIndex === '2' || profileIndex === '3') {
    for (let i = Number(profileIndex); i <= 3; i++) {
      const nextProfileIndex = Number(profileIndex) + 1;
      const nextProfileIsActive = user['isActive' + nextProfileIndex];
      if (nextProfileIsActive) {
        const defaultAvatarUrl = getPbImageURL(imgCollection[0], 'img');
        const imgBlob = await downloadImage(defaultAvatarUrl);

        const nextProfileName = user['profileName' + nextProfileIndex];
        const nextProfileImageUrl = getPbImageURL(authData.user, `profileImg${nextProfileIndex}`);
        const nextProfileIsLocked = user['isLocked' + nextProfileIndex];

        profileImage = await downloadImage(nextProfileImageUrl);

        const modiUser = new FormData();

        modiUser.append(`profileName${profileIndex}`, nextProfileName);
        modiUser.append(`profileImg${profileIndex}`, profileImage, 'profileImg.jpg');
        modiUser.append(`isActive${profileIndex}`, true);
        modiUser.append(`isLocked${profileIndex}`, nextProfileIsLocked);
        modiUser.append(`profileName${nextProfileIndex}`, '새로운 프로필');
        modiUser.append(`profileImg${nextProfileIndex}`, imgBlob, 'profileImg.jpg');
        modiUser.append(`isActive${nextProfileIndex}`, false);
        modiUser.append(`isLocked${nextProfileIndex}`, false);

        await pb.collection('users').update(user.id, modiUser);

        const reloadUser = await pb.collection('users').getOne(user.id);

        setStorage('auth', {
          isAuth: true,
          user: reloadUser,
          token: user.token,
        });

        alert('프로필이 삭제되었습니다.');

        location.replace('/src/pages/profileSelect/index.html');
      } else {
        const defaultAvatarUrl = getPbImageURL(imgCollection[0], 'img');
        const imgBlob = await downloadImage(defaultAvatarUrl);

        const modiUser = new FormData();

        modiUser.append(`profileName${profileIndex}`, '새로운 프로필');
        modiUser.append(`profileImg${profileIndex}`, imgBlob, 'profileImg.jpg');
        modiUser.append(`isActive${profileIndex}`, false);
        modiUser.append(`isLocked${profileIndex}`, false);

        await pb.collection('users').update(user.id, modiUser);

        const reloadUser = await pb.collection('users').getOne(user.id);

        setStorage('auth', {
          isAuth: true,
          user: reloadUser,
          token: user.token,
        });

        alert('프로필이 삭제되었습니다.');

        location.replace('/src/pages/profileSelect/index.html');
      }
    }
  }
}

createBtn.addEventListener('click', createProfile);
cancleBtn.addEventListener('click', cancleCreate);
deleteBtn.addEventListener('click', deleteProfile);

renderProfileCreate();

/* -------------------------------------------------------------------------- */
/*                                   푸터 렌더링                               */
/* -------------------------------------------------------------------------- */
renderFooter();
footerScript();
