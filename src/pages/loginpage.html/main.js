import { getNode, isString, getStorage, setStorage } from 'kind-tiger';
import { PocketBase } from 'pocketbase';

const pb = new PocketBase('https://plainyogurt.pockethost.io/');

const findButton = getNode('.login-button');

async function getLocalItems(key) {
  if (isString(key)) {
    return await JSON.parse(localStorage.getItem(key));
  }
}

async function setLocalItem(key, value) {
  if (isString(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const userEmail = document.querySelector('#email-input').value;
  const userPW = document.querySelector('#pw-input').value;

  pb.collection('users')
    .authWithPassword(userEmail, userPW)
    .then(
      async () => {
        const { model, token } = await getLocalItems('pocketbase_auth');

        setLocalItem('auth', {
          isAuth: !!model,
          userInfo: model,
          token,
        });

        alert('환영합니다.');
        location.href = '/index.html';
      },
      () => {
        alert('인증된 사용자가 아닙니다.');
      }
    );
}

findButton.addEventListener('click', handleLogin);
