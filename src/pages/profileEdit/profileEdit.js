import '/src/styles/main.scss';
import defaultAuthData from '/src/api/defaultAuthData';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, setStorage, insertLast } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 프로필 편집');

if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}


const that = document.querySelector('.profile__form');
console.log(that)

async function renderProfile() {
    const users = await pb.collection('users').getFullList();
    console.log(users)


    users.forEach((item) => {
        if (item.username === "email1234") {
            for (let i = 0; i < 4; i++) {
                const isActive = item[`isActive${i+1}`];
                
                if(isActive == true) {;
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

                } else {
                    console.log('비활성한 프로필을 비활성화 하였습니다.')
                }
            }
        } else {
            console.log('프로필을 찾지 못하였다?');
        }
    });
}

renderProfile();

