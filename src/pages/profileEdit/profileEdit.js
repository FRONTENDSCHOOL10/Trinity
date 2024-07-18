import '/src/styles/main.scss';
import defaultAuthData from '@/api/defaultAuthData';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast, setStorage, getStorage } from 'kind-tiger';
import pb from '@/api/pocketbase';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';

setDocumentTitle('TAING / 프로필 편집 목록');

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

checkIsAuth();

if (!localStorage.getItem('selectedProfileIndex')) {
  setStorage('selectedProfileIndex', '1');
}

// 헤더와 푸터 스크립트 실행
headerScript();
renderFooter();
footerScript();

async function renderProfileEdit() {
  const users = await pb.collection('users').getFullList();

  // 로컬 스토리지에 저장되어있는 유저 아이디(username)을 불러옴
  const authData = localStorage.getItem('auth');

  if (authData) {
    const authObject = JSON.parse(authData);
    const authUsername = authObject.user.username;

    users.forEach((item) => {
      if (item.username === authUsername) {
        let isAddable = false;
        let addableIndex = null;

        for (let i = 0; i < 4; i++) {
          const isActive = item[`isActive${i + 1}`];
          const isLocked = item[`isLocked${i + 1}`];

          // 잠금처리 되어있는 프로필을 화면에 출력
          if (isActive == true && isLocked == true) {
            const template = `
                          <li class="profile__form--item profileItem" data-locked="true" data-profile-index="${i + 1}">
                              <a class="item__form" href="#" role="button">
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
                          <li class="profile__form--item profileItem" data-profile-index="${i + 1}">
                              <a class="item__form" href="/src/pages/profileEditing/index.html" role="button">
                                  <figure class="user-profile">
                                      <img src="${getPbImageURL(item, `profileImg${i + 1}`)}" alt="프로필">
                                      <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                                  </figure>
                                  <span class="bg"></span>
                                  <span class="icon"><img src="/icon/profile/iconEditProfile.svg" alt="편집 아이콘"></span>
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

    document.querySelectorAll('.profile__form--item').forEach((i) => {
      i.addEventListener('click', handleProfileSelect);
    });
  }
}

async function handleProfileSelect(e) {
  const profileItem = e.currentTarget;
  console.log(profileItem);
  if (profileItem) {
    const profileIndex = profileItem.getAttribute('data-profile-index');
    const profileLocked = profileItem.getAttribute('data-locked');
    console.log(profileLocked);

    if (profileLocked) {
      alert('잠금된 프로필입니다.');
    } else {
      console.error('');
    }

    if (profileIndex) {
      await setStorage('selectedProfileIndex', profileIndex);
      console.log(`선택된 프로필 인덱스: ${profileIndex}`);
    } else {
      console.error('프로필 인덱스를 찾을 수 없음.');
    }
  }
}

renderProfileEdit();

const btnUserbreak = document.querySelector('.btnUserbreak');

async function handleDeleteAccount() {
  const authData = localStorage.getItem('auth');
  if (authData) {
    try {
      // JSON 문자열을 객체로 파싱
      const authObj = JSON.parse(authData);

      // 사용자 ID 및 이메일/유저네임 추출
      const userID = authObj.user.id;
      const userEmailOrUsername = authObj.user.email || authObj.user.username;
      console.log(userID);

      if (userID && userEmailOrUsername) {
        // 사용자에게 탈퇴 확인을 요청하는 알림 - hsw 통한의 경험을 바탕으로한 코드
        const userConfirmed = confirm('정말 삭제하시겠습니까?');

        if (userConfirmed) {
          // 비밀번호 입력받기
          const password = prompt('비밀번호를 입력해주세요:');

          if (password) {
            try {
              // 인증 정보 확인
              const authResult = await pb.collection('users').authWithPassword(userEmailOrUsername, password);

              if (authResult) {
                // 사용자 계정 삭제
                await pb.collection('users').delete(userID);

                // 인증 정보 클리어
                pb.authStore.clear();
                localStorage.removeItem('auth'); // 인증 정보 삭제
                await setStorage('auth', defaultAuthData);

                alert('회원 탈퇴가 완료되었습니다.');

                location.replace('/src/pages/landing/index.html');
              } else {
                alert('비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
              }
            } catch (authError) {
              console.error('비밀번호 인증 실패:', authError);
              alert('비밀번호 인증에 실패했습니다. 다시 시도해주세요.');
            }
          } else {
            alert('비밀번호를 입력해야 합니다.');
          }
        } else {
          alert('회원탈퇴를 취소했습니다.');
        }
      } else {
        console.error('사용자 ID 또는 이메일/유저네임을 찾을 수 없습니다.');
        alert('사용자 ID 또는 이메일/유저네임을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  } else {
    console.error('인증 데이터를 찾을 수 없습니다.');
    alert('인증 데이터를 찾을 수 없습니다.');
  }
}

btnUserbreak.addEventListener('click', handleDeleteAccount);
