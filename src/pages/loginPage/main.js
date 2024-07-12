import { getNode, setStorage } from 'kind-tiger';
import PocketBase from 'pocketbase';
// import CryptoJS from 'crypto-js'; // CryptoJS 모듈 주석 처리

const pb = new PocketBase('https://plainyogurt.pockethost.io/');
const findButton = getNode('.button--login');
const loginRemember = getNode('.login__remember');
const loginIcon = getNode('#login-icon');
const saveLoginCheckbox = getNode('.login__checkbox');
const SECRET_KEY = 'your-secret-key'; // 비밀 키는 환경 변수나 안전한 곳에 저장하세요.

let saveLoginInfo = false;

// 페이지 로드 시 localStorage에서 자동 로그인 정보 확인
document.addEventListener('DOMContentLoaded', () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth && auth.isAuth) {
    saveLoginInfo = true;
    loginIcon.classList.add('active');
    const decryptedToken = getDecryptedToken(auth.token);
    pb.authStore.save(decryptedToken, auth.userInfo);
    alert('자동 로그인되었습니다.');
    location.href = '/index.html'; // 로그인 후 이동할 페이지
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const showPasswordButton = getNode('.login__button-show-password');
  const clearButtons = document.querySelectorAll('.login__button-clear');

  showPasswordButton.addEventListener('click', togglePasswordVisibility);
  clearButtons.forEach((button) => button.addEventListener('click', handleClearInput));

  loginRemember.addEventListener('click', handleToggle);
  loginIcon.addEventListener('keydown', handleKeyToggle);
  findButton.addEventListener('click', handleLogin);
});

function togglePasswordVisibility() {
  const passwordInput = getNode('#pw-input');
  const showPasswordButton = getNode('.login__button-show-password');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    showPasswordButton.style.backgroundImage = "url('/login/IconVisible.svg')";
  } else {
    passwordInput.type = 'password';
    showPasswordButton.style.backgroundImage = "url('/login/IconInVisibleForMT.svg')";
  }
}

function handleClearInput(event) {
  const inputId = event.currentTarget.getAttribute('onclick').match(/'(.*)'/)[1];
  clearInput(inputId);
}

function clearInput(inputId) {
  getNode(`#${inputId}`).value = '';
}

function toggleLoginIcon() {
  saveLoginCheckbox.checked = !saveLoginCheckbox.checked;
  saveLoginInfo = saveLoginCheckbox.checked;
  loginIcon.classList.toggle('active');
  loginIcon.setAttribute('aria-checked', saveLoginCheckbox.checked.toString());

  if (loginIcon.classList.contains('active')) {
    loginRemember.style.color = 'white';
  } else {
    loginRemember.style.color = '';
  }
}

function handleToggle(e) {
  e.preventDefault();
  const target = e.target;
  if (target.classList.contains('login__icon') || target.closest('.login__remember')) {
    toggleLoginIcon();
  }
}

function handleKeyToggle(e) {
  if (e.keyCode === 32) {
    // 스페이스바의 키 코드
    e.preventDefault();
    toggleLoginIcon();
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const userEmail = getNode('#email-input').value;
  const userPW = getNode('#pw-input').value;

  try {
    const authData = await pb.collection('users').authWithPassword(userEmail, userPW);
    const { model, token } = authData;

    if (saveLoginInfo) {
      saveAuthData(model, token);
    }

    alert('환영합니다.');
    location.href = '/index.html'; // 로그인 후 이동할 페이지
  } catch (error) {
    alert('인증된 사용자가 아닙니다.');
  }
}

function saveAuthData(userInfo, token) {
  // CryptoJS가 없는 경우에 대한 대체 동작
  const encryptedToken = token; // 암호화 없이 토큰 저장

  //   localStorage에 저장
  localStorage.setItem(
    'auth',
    JSON.stringify({
      isAuth: true,
      userInfo,
      token: encryptedToken,
    })
  );

  setStorage('auth', {
    isAuth: true,
    userInfo,
    token: encryptedToken,
  });
}

function getDecryptedToken(encryptedToken) {
  // CryptoJS가 없는 경우에 대한 대체 동작
  // 단순히 저장된 토큰을 반환 (암호화가 없으므로)
  return encryptedToken;
}