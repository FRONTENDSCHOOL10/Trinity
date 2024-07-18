import '/src/styles/main.scss';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast, getStorage, setStorage, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';
import defaultAuthData from '@/api/defaultAuthData';

setDocumentTitle('TAING / 프로필 선택');

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

async function checkIsAuth() {
  const auth = await getStorage('auth');

  // 로그인 되어있지 않으면 랜딩 페이지로 보내는 코드
  if (!auth.isAuth) {
    location.replace('/src/pages/landing/index.html');
  }
}

if (!localStorage.getItem('selectedProfileIndex')) {
  setStorage('selectedProfileIndex', '1');
}

checkIsAuth();

// 헤더와 푸터 스크립트 실행
headerScript();
renderFooter();
footerScript();

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
        let isAddable = false;

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
                                <span class="icon"><img src="/icon/profile/iconLockedProfile.svg" alt="잠금 아이콘"></span>
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

          // 마지막 프로필이 없다면(4개 미만) 마지막 프로필엔 프로필 추가 화면에 출력
          if (isActive == false && isAddable == false) {
            isAddable = !isAddable;
          }

          if (isAddable == true) {
            const template = `
                          <li class="profile__form--item profileItem" data-profile-index="${i + 1}" data-profile-select="true">
                              <a class="item__form" href="/src/pages/profileCreate/index.html" role="button">
                                  <figure class="user-profile">
                                      <span className="addable" aria-hidden="true"></span>
                                      <figcaption class="sr-only">프로필 추가 가능</figcaption>
                                  </figure>
                                  <span class="addable"></span>
                                  <span class="icon"><img src="/icon/profile/iconPlus.png" alt="추가 아이콘"></span>
                              </a>
                              <p class="name profileName">프로필 추가</p>
                          </li>
                      `;
            insertLast('.profile__form', template);
            break;
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
          const profileIndex = item.getAttribute('data-profile-index');
          const profileCreate = item.getAttribute('data-profile-select');

          // 프로필 추가 선택시
          if (profileCreate) {
            localStorage.setItem('selectedProfileIndex', profileIndex);
            window.location.href = '/src/pages/profileCreate/index.html';
          } else {
            // 열려있는 프로필
            console.log(`profileIndex:${profileIndex}`);
            localStorage.setItem('selectedProfileIndex', profileIndex);
            window.location.href = '/';
          }
        }
      });
    });
  }
}

renderProfileSelect();
