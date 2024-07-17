import { getNode, isString, getStorage, setStorage, insertLast, setDocumentTitle } from 'kind-tiger';
import pb from '@/api/pocketbase';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';
import defaultAuthData from '@/api/defaultAuthData';

setDocumentTitle('TAING / 로그인');

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

if (!localStorage.getItem('selectedProfileIndex')) {
  setStorage('selectedProfileIndex', null);
}

const findButton = getNode('.button--login');
const loginRemember = getNode('.login__remember');
const loginIcon = getNode('#login-icon');
const saveLoginCheckbox = getNode('.login__checkbox');
const idInput = getNode('#id-input');
const passwordInput = getNode('#pw-input');

const idAlert = getNode('.alerting__id');
const pwAlert = getNode('.alerting__pw');

const SECRET_KEY = 'your-secret-key'; // 비밀 키는 환경 변수나 안전한 곳에 저장하세요.

let saveLoginInfo = false;

const spinnerWrapper = document.querySelector('#spinner-wrapper');
const spinner = document.querySelector('#spinner');

/* -------------------------------------------------------------------------- */
/*                                  헤더 렌더링 코드                           */
/* -------------------------------------------------------------------------- */
headerScript();

/* -------------------------------------------------------------------------- */
/*                                  푸터 렌더링 코드                           */
/* -------------------------------------------------------------------------- */
renderFooter();
footerScript();

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
    pb.authStore.save(decryptedToken, auth.user);
    function loadSpinner() {
      spinnerWrapper.style.display = 'flex'; // 로딩 시작
      // 2초 후에 로딩 완료
      window.setTimeout(function () {
        spinner.style.display = 'none'; // 로딩 완료 후에 스피너 숨기기
        const template = `
            <img src="/icon/loadSpinner/loadSpinnerFinish.svg" alt="완료 아이콘" style="width: 40px; height: 40px;"/>
            <p class="tit">자동 로그인되었습니다,</p>
            <p class="desc"></p>
        `;
        insertLast('.finish__form', template);
        // 2초 후에 템플릿 숨기기
        window.setTimeout(function () {
          spinnerWrapper.style.display = 'none';
          location.reload();
        }, 2000);
      }, 2000);
    }
    loadSpinner();
    location.href = '/src/pages/profileSelect/index.html'; // 로그인 후 이동할 페이지
  }

  const showPasswordButton = getNode('.login__button-show-password');
  const clearButtons = document.querySelectorAll('.login__button-clear');

  showPasswordButton.addEventListener('click', togglePasswordVisibility);
  clearButtons.forEach((button) => button.addEventListener('click', handleClearInput));

  loginRemember.addEventListener('click', handleToggle);
  loginIcon.addEventListener('keydown', handleKeyToggle);
  findButton.addEventListener('click', handleLogin);

  // validateInputs(); // 초기 입력값 검사하여 로그인 버튼 상태 설정
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

  const userID = getNode('#id-input').value;
  const userPW = getNode('#pw-input').value;

  validateInputs();

  //1. 유저 입력을 받아들임
  //2. 해당 입력이 이메일이면, 이메일로 pb에 요청
  //2.1 해당 입력이 ID 면, ID로 pb에 요청

  if (!validateString(userID) && !emailReg(userID)) {
    spinnerWrapper.style.display = 'flex';
    spinner.style.display = 'none';
    const template = `
            <img src="/icon/loadSpinner/loadSpinnerError.svg" alt="오류 아이콘" style="width: 40px; height: 40px;"/>
            <p class="tit">올바른 형식의 아이디나 이메일을 입력하세요.</p>
            <p class="desc"></p>
        `;
    insertLast('.finish__form', template);
    // 2초 후에 템플릿 숨기기
    window.setTimeout(function () {
      spinnerWrapper.style.display = 'none';
      location.reload();
    }, 2000);
    return;
  }

  if (!pwReg(userPW)) {
    alert('비밀번호는 8자리 이상이어야 합니다.');
    return;
  }

  try {
    const { record, token } = await pb.collection('users').authWithPassword(userID, userPW);
    saveAuthData(record, token);
    function loadSpinner() {
      spinnerWrapper.style.display = 'flex'; // 로딩 시작
      // 2초 후에 로딩 완료
      window.setTimeout(function () {
        spinner.style.display = 'none'; // 로딩 완료 후에 스피너 숨기기
        const template = `
            <img src="/icon/loadSpinner/loadSpinnerFinish.svg" alt="완료 아이콘" style="width: 40px; height: 40px;"/>
            <p class="tit">로그인 완료!</p>
            <p class="desc">지금 바로 이용권을 구독하고 타잉 오리지널과<br/>
            최신 인기 TV프로그램, 영화를 무제한으로 만나보세요!</p>
        `;
        insertLast('.finish__form', template);
        // 2초 후에 템플릿 숨기기
        window.setTimeout(function () {
          spinnerWrapper.style.display = 'none';
          location.reload();
        }, 2000);
      }, 2000);
    }
    loadSpinner();
  } catch (error) {
    function loadSpinner() {
      spinnerWrapper.style.display = 'flex'; // 로딩 시작
      // 2초 후에 로딩 완료
      window.setTimeout(function () {
        spinner.style.display = 'none'; // 로딩 완료 후에 스피너 숨기기
        const template = `
          <img src="/icon/loadSpinner/loadSpinnerError.svg" alt="오류 아이콘" style="width: 40px; height: 40px;"/>
          <p class="tit">인증된 사용자가 아닙니다.</p>
          <p class="desc">다시 입력해 주세요.</p>
      `;
        insertLast('.finish__form', template);
        // 2초 후에 템플릿 숨기기
        window.setTimeout(function () {
          spinnerWrapper.style.display = 'none';
          location.reload();
        }, 2000);
      }, 2000);
    }
    loadSpinner();
  }
}

/**
 * 사용자 정보를 로컬 스토리지에 저장합니다.
 * @param {Object} record - 사용자 정보 객체
 * @param {string} token - 인증 토큰
 */

function saveAuthData(record, token) {
  // CryptoJS가 없는 경우에 대한 대체 동작
  const encryptedToken = token; // 암호화 없이 토큰 저장

  // localStorage에 저장
  setStorage('auth', {
    isAuth: !!record,
    user: record,
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
  const idValue = idInput.value;
  const passwordValue = passwordInput.value;
  const idOrEmailValid = validateString(idValue) || emailReg(idValue);
  const passwordValid = pwReg(passwordValue);

  if (!idOrEmailValid) {
    idAlert.classList.remove('hidden');
  } else {
    idAlert.classList.add('hidden');
  }

  if (!passwordValid) {
    pwAlert.classList.remove('hidden');
  } else {
    pwAlert.classList.add('hidden');
  }
}

/**
 * 비밀번호 입력 필드의 가시성을 토글합니다.
 */
function togglePasswordVisibility() {
  const passwordInput = getNode('#pw-input');
  const showPasswordButton = getNode('.login__button-show-password');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    showPasswordButton.style.backgroundImage = "url('/icon/login/iconVisible.svg')";
  } else {
    passwordInput.type = 'password';
    showPasswordButton.style.backgroundImage = "url('/icon/login/iconInvisible.svg')";
  }
}

/**
 * 입력 필드를 지웁니다.
 * @param {Event} event - 클릭 이벤트
 */
function handleClearInput(event) {
  const inputId = event.currentTarget.previousElementSibling.id;
  clearInput(inputId);
}

/**
 * 주어진 ID의 입력 필드를 지웁니다.
 * @param {string} inputId - 입력 필드의 ID
 */
function clearInput(inputId) {
  const input = getNode(`#${inputId}`);
  if (input) {
    input.value = '';
  }
}

/**
 * 이메일 유효성을 검사합니다.
 * @param {string} text - 이메일 텍스트
 * @returns {boolean} - 유효한 이메일인지 여부
 */
function emailReg(text) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(text).toLowerCase());
}

/**
 * 비밀번호 유효성을 검사합니다.
 * @param {string} text - 비밀번호 텍스트
 * @returns {boolean} - 유효한 비밀번호인지 여부
 */
function pwReg(text) {
  return text.length >= 8;
}

/**
 * 아이디의 유효성을 검사합니다.
 * @param {string} input - 아이디 텍스트
 * @returns {boolean} - 유효한 아이디 형식인지 여부
 */
function validateString(input) {
  // 정규 표현식: 영문 소문자만 또는 영문 소문자와 숫자 조합
  const regex = /^[a-z0-9]{6,12}$/;

  // 입력 문자열이 조건에 맞는지 검증
  if (regex.test(input)) {
    return true;
  } else {
    return false;
  }
}
