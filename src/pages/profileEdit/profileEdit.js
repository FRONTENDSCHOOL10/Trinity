import '/src/styles/main.scss';
import defaultAuthData from '@/api/defaultAuthData';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast, setStorage } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 프로필 편집');

async function renderProfileEdit() {
    const users = await pb.collection('users').getFullList();

      // 로컬 스토리지에 저장되어있는 유저 아이디(username)을 불러옴
    const authData = localStorage.getItem('auth');

    if (authData) {
        const authObject = JSON.parse(authData);
        const authUsername = authObject.user.username;

        users.forEach((item) => {
            if (item.username === authUsername) {
                for (let i = 0; i < 4; i++) {
                    const isActive = item[`isActive${i + 1}`];
        
                    // 열려있는 프로필을 화면에 출력
                    if (isActive == true) {
                    const template = `
                        <li class="profile__form--item profileItem">
                            <a class="item__form" href="/" role="button">
                                <figure class="user-profile">
                                    <img src="${getPbImageURL(item, `profileImg${i+1}`)}" alt="프로필">
                                    <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                                </figure>
                                <span class="bg"></span>
                                <span class="icon"><img src="/public/icon/profile/iconEditProfile.svg" alt="편집 아이콘"></span>
                            </a>
                            <p class="name profileName">${item[`profileName${i+1}`]}</p>
                        </li>
                    `
                    insertLast('.profile__form', template);
                    }
                }
            }
        });
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
            
            // 사용자 ID 추출
            const userID = authObj.user.id;
            console.log(userID);

            if (userID) {
            // 사용자 계정 삭제
            await pb.collection('users').delete(userID);

            // 인증 정보 클리어
            pb.authStore.clear();
            localStorage.removeItem('auth');  // 인증 정보 삭제
            setStorage('auth', defaultAuthData);

            alert('회원 탈퇴가 완료되었습니다.');
            
            location.replace('/src/pages/landing/index.html');

            } else {
            console.error('사용자 ID를 찾을 수 없습니다.');
            alert('사용자 ID를 찾을 수 없습니다.');
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