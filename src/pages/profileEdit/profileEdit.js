import '/src/styles/main.scss';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 프로필 편집');

async function renderProfileEdit() {
    const users = await pb.collection('users').getFullList();
    console.log(users)


    users.forEach((item) => {
        if (item.username === "email1234") {
            for (let i = 0; i < 4; i++) {
                const isActive = item[`isActive${i+1}`];
                
                if(isActive == true){
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

renderProfileEdit();

