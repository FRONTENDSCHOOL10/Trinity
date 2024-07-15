import '/src/styles/main.scss';
import getPbImageURL from '/src/api/getPbImageURL';
import { setDocumentTitle, insertLast } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 프로필 선택');

async function renderProfile() {
    const users = await pb.collection('users').getFullList();
    console.log(users);

    users.forEach((item) => {
        if (item.username === "user") {
            for (let i = 0; i < 4; i++) {
                const isActive = item[`isActive${i+1}`];
                const isLocked = item[`isLocked${i+1}`];
                console.log(isActive);

                if (isActive == true && isLocked == true) {
                    const template = `
                        <li class="profile__form--item profileItem">
                            <a class="item__form" href="/" role="button">
                                <figure class="user-profile">
                                    <img src="${getPbImageURL(item, `profileImg${i+1}`)}" alt="프로필">
                                    <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                                </figure>
                                <span class="bg"></span>
                                <span class="icon"><img src="/public/icon/profile/iconLockedProfile.svg" alt="편집 아이콘"></span>
                            </a>
                            <p class="name profileName">${item[`profileName${i+1}`]}</p>
                        </li>
                    `;
                    insertLast('.profile__form',template);                    
                }
                if (isActive == true && isLocked == false) {
                    const template = `
                    <li class="profile__form--item profileItem">
                        <a class="item__form" href="/" role="button">
                            <figure class="user-profile">
                                <img src="${getPbImageURL(item, `profileImg${i+1}`)}" alt="프로필">
                                <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                            </figure>
                        </a>
                        <p class="name profileName">${item[`profileName${i+1}`]}</p>
                    </li>
                `;
                insertLast('.profile__form', template); 
                }
            }
        }
    });
}

renderProfile();
