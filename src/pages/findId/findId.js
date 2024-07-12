import '/src/styles/main.scss';
import { setDocumentTitle, setStorage, insertLast, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 아이디 찾기');

const find_idBtn = getNode('.find-id');
const findUseremail = getNode('#findUserEmail');
const errorMessage = '이메일 형식으로 입력해 주세요.';
const btnClear = document.querySelector('.btnClear');

// 초기 버튼 비활성화
find_idBtn.disabled = true;

// 초기 find__next 비활성화
const find_next = document.getElementById('find__next');
find_next.style.display = 'none';

// 초기 btnClear 숨기기
btnClear.style.display = 'none';

// 초기 유효성 메시지 추가
find_showError();

// 이메일 유효성 검사
function emailReg(text) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}

// 에러메세지 show
function find_showError() {
  const errorElement = getNode('#findUserEmailError');
  if (!errorElement) {
    const errorSpan = `
            <span class="error__message" id="findUserEmailError">${errorMessage}</span>
        `;
    insertLast('.input__form', errorSpan);
  }
}

// 에러메세지 clear
function find_clearError() {
  const errorElement = getNode('#findUserEmailError');
  if (errorElement) {
    errorElement.remove();
  }
}

// 유효성 검사를 통한 에러메세지
function find_id_validation(e) {
  const target = e.currentTarget;
  if (target.value.length > 5 && emailReg(target.value)) {
    // 6자 이상 && emailReg에 충족할 경우
    // css에 find-confirm:disabled
    find_idBtn.disabled = false;
    find_clearError();
  } else {
    find_idBtn.disabled = true;
    find_showError();
  }
}

findUseremail.addEventListener('input', find_id_validation);

// 입력 시 옆에 X 마크 띄우기
function inputClear() {
  const inputValue = findUseremail.value.trim(); // 입력 값에서 공백 제거

  if (inputValue.length > 0) {
    btnClear.style.display = 'block'; // 입력 값이 있으면 btnClear 보이기
  } else {
    btnClear.style.display = 'none'; // 입력 값이 없으면 btnClear 숨기기
  }
}

findUseremail.addEventListener('input', inputClear); // 입력 이벤트 감지

// 버튼 클릭 시 입력 값 초기화
btnClear.addEventListener('click', function (e) {
  e.preventDefault();
  findUseremail.value = ''; // 입력 필드 값을 초기화
  btnClear.style.display = 'none'; // btnClear 숨기기
  find_idBtn.disabled = true; // 버튼 비활성화
});

// 이메일 입력으로 사용자 아이디 받기
async function handleLogin(e) {
  e.preventDefault();

  const email = findUseremail.value;

  try {
    const users = await pb.collection('users').getFullList();
    const findId = users.find((user) => user.email === email);

    if (findId) {
      setDocumentTitle('TAING / 아이디 찾기 결과 있음');

      const maskedEmail = `${findId.username.slice(0, -4)}${'*'.repeat(4)}`;

      find_next.style.display = 'flex';

      const template = `
                <div class="tit__form">
                    <div class="tit__box">
                        <h3>입력하신 정보와 일치하는 회원입니다.</h3>
                        <p class="tt">${maskedEmail}</p> 
                        <p class="desc">개인정보 보호를 위해 아이디 또는 이메일의 일부만 제공합니다.</p>
                        <!-- 병합 후 경로 수정 필요할 수도 -->
                        <a href="/src/pages/login/index.html">
                        <button type="button" class="button--red">로그인하러 가기</button>
                        </a>
                    </div>
                </div>
            `;

      insertLast('#find__next', template);
    } else {
      setDocumentTitle('TAING / 아이디 찾기 결과 없음');

      find_next.style.display = 'flex';

      const template = `
            <div class="tit__form">
                <div class="tit__box">
                    <h3>입력하신 정보와 일치하는 <br/>회원을 찾을 수 없습니다.
                    </h3>
                    <p class="desc">연속 10회 틀릴 경우
                    <br/>
                    아이디 찾기 기능이 일시적으로 제한됩니다.
                    </p>
                    <a href="/src/pages/findId/index.html">
                        <button type="button" class="button--white">아이디 다시 찾기</button>
                    </a>
                </div>
            </div>
            `;

      insertLast('#find__next', template);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  // 리셋 후 입력 필드 초기화
  findUseremail.value = '';
  // 리셋 후 초기 오류 메시지 추가
  find_showError();
  // 리셋 후 초기 버튼 비활성화
  find_idBtn.disabled = true;
}

find_idBtn.addEventListener('click', handleLogin);
