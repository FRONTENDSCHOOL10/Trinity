import '/src/styles/main.scss';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast, getStorage, setStorage, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 프로필 선택');

async function renderProfileSelect() {
  const users = await pb.collection('users').getFullList();

  // 로컬 스토리지에 저장되어있는 유저 아이디(username)을 불러옴
  const authData = localStorage.getItem('auth');

  if (authData) {
    const authObject = JSON.parse(authData);
    const authUsername = authObject.user.username;

    // 현재 로그인한 유저의 프로필 목록을 출력하는 함수 부분
    users.forEach((item) => {
      if (item.username === authUsername) {
        for (let i = 0; i < 4; i++) {
          const isActive = item[`isActive${i + 1}`];
          const isLocked = item[`isLocked${i + 1}`];

          // 잠금처리 되어있는 프로필을 화면에 출력
          if (isActive == true && isLocked == true) {
            const template = `
                        <li class="profile__form--item profileItem" data-locked="true" data-profile-index="${i + 1}">
                            <a class="item__form" href="/" role="button">
                                <figure class="user-profile">
                                    <img src="${getPbImageURL(item, `profileImg${i + 1}`)}" alt="프로필">
                                    <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                                </figure>
                                <span class="bg"></span>
                                <span class="icon"><img src="/icon/profile/iconLockedProfile.svg" alt="편집 아이콘"></span>
                            </a>
                            <p class="name profileName">${item[`profileName${i + 1}`]}</p>
                        </li>
                    `;
            insertLast('.profile__form', template);
          }

          // 열려있는 프로필을 화면에 출력
          if (isActive == true && isLocked == false) {
            const template = `
                    <li class="profile__form--item profileItem" data-locked="false"  data-profile-index="${i + 1}">
                        <a class="item__form" href="/" role="button">
                            <figure class="user-profile">
                                <img src="${getPbImageURL(item, `profileImg${i + 1}`)}" alt="프로필">
                                <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                            </figure>
                        </a>
                        <p class="name profileName">${item[`profileName${i + 1}`]}</p>
                    </li>
                `;
            insertLast('.profile__form', template);
          }
        }
      }
    });

    // 열려있는 프로필 중에서 클릭한 프로필의 내용을 로컬스토리지에 저장
    document.querySelectorAll('.profileItem').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        const isProfileLocked = item.getAttribute('data-locked') === 'true';
        if (isProfileLocked) {
          alert('닫혀있는 프로필입니다.');
        } else {
          // 열려있는 프로필
          const profileIndex = item.getAttribute('data-profile-index');
          console.log(`profileIndex:${profileIndex}`);
          localStorage.setItem('selectedProfileIndex', profileIndex);
          window.location.href = '/';
        }
      });
    });
  }
}

renderProfileSelect();