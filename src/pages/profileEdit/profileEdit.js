import '/src/styles/main.scss';
import defaultAuthData from '/src/api/defaultAuthData';
import getPbImageURL from '/src/api/getPbImageURL';
import { comma, setDocumentTitle, setStorage, insertLast, getNode, getStorage } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 프로필 편집');

const profileItemHeader = document.querySelector('.profileItemHeader');
const profileItem = document.querySelector('.profileItem');
const profileName = document.querySelector('.profileName');
const btnEdit = document.querySelector('.btnEdit');




// const icon = document.querySelector('.item__form .icon');
// console.log(icon);

const profileForm = document.querySelector('.profile__form');
const loggedInUser = {
  profileImg: '/public/icon/profile/imgProfile01.png',
  profileName: '유저네임',
  isActive: true,
  isLocked: true, // true 또는 false로 설정
};

if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}


const that = document.querySelector('.profile__form');
console.log(that)

// for (let i = 0; i < 6; i++) {

//     // 조건이 참이라면 남아있는 본문은 실행되지 않습니다.
//     if (i == 0) continue;
  
//     // 여기에 하고싶은거
    
//   }

async function renderProfile() {
    const users = await pb.collection('users').getFullList();
    console.log(users)


    users.forEach((item) => {
        if (item.username === "email1234") {
            for (let i = 1; i <= 4; i++) {
                const isLocked = item[`isLocked${i}`];
                console.log(isLocked)

                const template = `
                    <li class="profile__form--item profileItem">
                        <a class="item__form" href="/" role="button">
                            <figure class="user-profile">
                                <img src="${getPbImageURL(item, `profileImg${i}`)}" alt="프로필">
                                <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                            </figure>
                            <span class="bg"></span>
                            <span class="icon"><img src="/public/icon/profile/iconEditProfile.svg" alt="편집 아이콘"></span>
                        </a>
                        <p class="name profileName">${item[`profileName${i}`]}</p>
                    </li>
                `
                // const isLocked = item[`isLocked${i}`];
                const icon = document.querySelector('.item__form .icon');
                const bg = document.querySelector('.item__form .bg');
                if(isLocked == true) {
                    // console.log(isLocked)
                    console.log(item[`profileName${i}`]) 
                    // icon.style.display = 'none';
                    // bg.style.display = 'none';

                } else {
                    icon.style.display = 'none';
                    bg.style.display = 'none';
                }
                ;

                // 프로필 아이템에 아이콘 추가하기
                // 일단 isLocked 이 true랑 false있으니까 이걸루해보쟈
                // const isLocked = item[`isLocked${i}`];
                
                // if(isLocked == false) {
                //     console.log(isLocked)
                // } else {
                //     console.log(isLocked)
                //     // const icon = document.querySelector('.item__form .icon');
                //     // icon.style.display = 'block';

                // }

                insertLast('.profile__form', template);
            }
        } else {
            // 특정 조건에 대한 처리
            // console.error('Error fetching user:', error);
        }
    });
}

renderProfile();

