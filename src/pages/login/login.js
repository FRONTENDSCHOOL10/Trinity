import { getNode, isString, getStorage, setStorage } from 'kind-tiger';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://plainyogurt.pockethost.io/');
const findButton = getNode('.button--login');
const loginRemember = getNode('.login__remember');
const loginIcon = getNode('#login-icon');
const saveLoginCheckbox = getNode('.login__checkbox');
const emailInput = getNode('#email-input');
const passwordInput = getNode('#pw-input');
const SECRET_KEY = 'your-secret-key'; // 비밀 키는 환경 변수나 안전한 곳에 저장하세요.

/**
 * 클로저를 사용하여 saveLoginInfo 변수를 보호합니다.
 */
(function () {
  let saveLoginInfo = false;

  /**
   * 페이지 로드 시 실행되어, 로컬 스토리지에 저장된 인증 정보를 확인하고 자동 로그인을 처리합니다.
   */
  document.addEventListener('DOMContentLoaded', () => {
    // 로컬 스토리지에 로그인 정보 저장
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && auth.isAuth) {
      saveLoginInfo = true;
      loginIcon.classList.add('active');
      const decryptedToken = getDecryptedToken(auth.token);
      pb.authStore.save(decryptedToken, auth.userInfo);
      alert('자동 로그인되었습니다.');
      location.href = '/index.html'; // 로그인 후 이동할 페이지
    }

    const showPasswordButton = getNode('.login__button-show-password');
    const clearButtons = document.querySelectorAll('.login__button-clear');

    showPasswordButton.addEventListener('click', togglePasswordVisibility);
    clearButtons.forEach((button) => button.addEventListener('click', handleClearInput));

    loginRemember.addEventListener('click', handleToggle);
    loginIcon.addEventListener('keydown', handleKeyToggle);
    findButton.addEventListener('click', handleLogin);

    emailInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);
  });

  /**
   * 로그인 아이콘을 토글하고 저장된 로그인 정보를 업데이트합니다.
   */
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

  /**
   * 로그인 아이콘 또는 로그인 기억 체크박스를 클릭했을 때의 이벤트 핸들러입니다.
   * @param {Event} e - 클릭 이벤트
   */
  function handleToggle(e) {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains('login__icon') || target.closest('.login__remember')) {
      toggleLoginIcon();
    }
  }

  /**
   * 스페이스바를 눌렀을 때 로그인 아이콘을 토글합니다.
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  function handleKeyToggle(e) {
    if (e.keyCode === 32) {
      // 스페이스바의 키 코드
      e.preventDefault();
      toggleLoginIcon();
    }
  }

  /**
   * 로그인 버튼을 클릭했을 때의 이벤트 핸들러입니다.
   * @param {Event} e - 클릭 이벤트
   */
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

  /**
   * 사용자 정보를 로컬 스토리지에 저장합니다.
   * @param {Object} userInfo - 사용자 정보 객체
   * @param {string} token - 인증 토큰
   */
  function saveAuthData(userInfo, token) {
    // CryptoJS가 없는 경우에 대한 대체 동작
    const encryptedToken = token; // 암호화 없이 토큰 저장

    // localStorage에 저장
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

  /**
   * 저장된 인증 토큰을 반환합니다.
   * @param {string} encryptedToken - 암호화된 토큰
   * @returns {string} - 복호화된 토큰
   */
  function getDecryptedToken(encryptedToken) {
    // CryptoJS가 없는 경우에 대한 대체 동작
    // 단순히 저장된 토큰을 반환 (암호화가 없으므로)
    return encryptedToken;
  }

  /**
   * 이메일과 비밀번호 입력값의 유효성을 검사하고, 유효한 경우 로그인 버튼을 활성화합니다.
   */
  function validateInputs() {
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    const emailValid = emailReg(emailValue);
    const passwordValid = pwReg(passwordValue);

    if (emailValid && passwordValid) {
      findButton.removeAttribute('disabled');
    } else {
      findButton.setAttribute('disabled', 'true');
    }
  }
})();

/**
 * 비밀번호 입력 필드의 가시성을 토글합니다.
 */
function togglePasswordVisibility() {
  const passwordInput = getNode('#pw-input');
  const showPasswordButton = getNode('.login__button-show-password');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    showPasswordButton.style.backgroundImage = "url('/public/icon/login/iconVisible.svg')";
  } else {
    passwordInput.type = 'password';
    showPasswordButton.style.backgroundImage = "url('/public/icon/login/iconInVisibleForMT.svg')";
  }
}

/**
 * 입력 필드를 지웁니다.
 * @param {Event} event - 클릭 이벤트
 */
function handleClearInput(event) {
  const inputId = event.currentTarget.getAttribute('onclick').match(/'(.*)'/)[1];
  clearInput(inputId);
}

/**
 * 주어진 ID의 입력 필드를 지웁니다.
 * @param {string} inputId - 입력 필드의 ID
 */
function clearInput(inputId) {
  getNode(`#${inputId}`).value = '';
}

/**
 * 이메일 유효성을 검사합니다.
 * @param {string} text - 이메일 텍스트
 * @returns {boolean} - 유효한 이메일인지 여부
 */
function emailReg(text) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}

/**
 * 비밀번호 유효성을 검사합니다.
 * @param {string} text - 비밀번호 텍스트
 * @returns {boolean} - 유효한 비밀번호인지 여부
 */
function pwReg(text) {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$/;
  return re.test(String(text).toLowerCase());
}
