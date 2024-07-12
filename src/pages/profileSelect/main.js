import '/src/styles/scss/main.scss';
import defaultAuthData from '/src/api/defaultAuthData';
import getPbImageURL from '/src/api/getPbImageURL';
import { comma, setDocumentTitle, setStorage, insertLast, getNode, getStorage } from 'kind-tiger';
import pb from '@/api/pocketbase';
// import '/src/pages/main/main'; // header 확인 

setDocumentTitle('TAING / 프로필 선택');

const profileItemHeader = document.querySelector('.profileItemHeader');
const profileItem = document.querySelector('.profileItem');
const profileName = document.querySelector('.profileName');
const btnEdit = document.querySelector('.btnEdit');
const icon = document.querySelector('.icon > img');
const bg = document.querySelector('.bg');
console.log(bg)

const profileForm = document.querySelector('.profile__form');
const loggedInUser = {
    profileImg: '/public/profileModify/profile-01.svg',
    profileName: '유저네임',
    isActive: true,
    isLocked: true // true 또는 false로 설정
};

if(!localStorage.getItem('auth')){
    setStorage('auth',defaultAuthData)
}

async function renderProfile(){

    // users 데이터 가져오기
    const users = await pb.collection('users').getFullList();

    const {isAuth} = await getStorage('auth');

    users.forEach((item)=>{
        if(item.username == "testUser1"){
            // console.log(item.username)
            // console.log(item.profileImg1)
            // console.log(item.profileImg2)
            // console.log(item.profileName1)
            console.log(item.isActive1)
            console.log(item.isLocked1)
            
            const template = `
            <li class="profile__form--item profileItem">
                <a class="item__form" href="/" role="button">
                    <figure class="user-profile">
                        <img src="${getPbImageURL(item, `profileImg1`)}" alt="프로필">
                        <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                    </figure>
                    <span class="bg"></span>
                    <span class="icon"><img src="/public/profileModify/rock.svg" alt="잠금 아이콘"></span>
                </a>
                <p class="name profileName">${item.profileName1}</p>
            </li>
            <li class="profile__form--item profileItem">
                <a class="item__form" href="/" role="button">
                    <figure class="user-profile">
                        <img src="${getPbImageURL(item, `profileImg2`)}" alt="프로필">
                        <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                    </figure>
                    <span class="bg"></span>
                    <span class="icon"><img src="/public/profileModify/rock.svg" alt="잠금 아이콘"></span>
                </a>
                <p class="name profileName">${item.profileName2}</p>
            </li>
            <li class="profile__form--item profileItem">
                <a class="item__form" href="/" role="button">
                    <figure class="user-profile">
                        <img src="${getPbImageURL(item, `profileImg3`)}" alt="프로필">
                        <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                    </figure>
                    <span class="bg"></span>
                    <span class="icon"><img src="/public/profileModify/rock.svg" alt="잠금 아이콘"></span>
                </a>
                <p class="name profileName">${item.profileName3}</p>
            </li>
            <li class="profile__form--item profileItem">
                <a class="item__form" href="/" role="button">
                    <figure class="user-profile">
                        <img src="${getPbImageURL(item, `profileImg4`)}" alt="프로필">
                        <figcaption class="sr-only">${item.username}의 프로필</figcaption>
                    </figure>
                    <span class="bg"></span>
                    <span class="icon"><img src="/public/profileModify/rock.svg" alt="잠금 아이콘"></span>
                </a>
                <p class="name profileName">${item.profileName4}</p>
            </li>
        `
        // if(item.isLocked == true){
        //     const template = `<img src="/public/profileModify/rock.svg" alt="잠금 아이콘">
        //     `
        //     insertLast('.icon',template);
        // } else {
        //     icon.style.display = 'none';
        //     bg.style.display = 'none';
        // }

        insertLast('.profile__form',template);
        } else {
            
        }
    })



}
  
renderProfile();