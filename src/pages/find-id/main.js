import '/src/styles/css/main.css';
import { setDocumentTitle, setStorage, insertLast, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 아이디 찾기');

const find_idBtn = getNode('.find-id');
const findUseremail = getNode('#userEmail');
const errorMessage = '이메일 형식으로 입력해 주세요.';

function emailReg(text) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(text).toLowerCase());
}

function find_showError() {
    const errorElement = getNode('#userEmailError');
    if (!errorElement) {
        const errorSpan = `
            <span class="error__message" id="userEmailError">${errorMessage}</span>
        `;
        insertLast('.input__form', errorSpan);
    }
}

// 초기에 오류 메시지 추가
find_showError()

function find_clearError() {
    const errorElement = getNode('#userEmailError');
    if (errorElement) {
        errorElement.remove();
    }
}

function find_id_validation(e) {
    const target = e.currentTarget;
    if (target.value.length > 5 && emailReg(target.value)) {
        // css에 find-confirm:disabled 스타일 지정필요
        find_idBtn.disabled = false;
        find_clearError();
    } else {
        find_idBtn.disabled = true;
        find_showError();
    }
}

findUseremail.addEventListener('input', find_id_validation);

// 초기 버튼 비활성화
find_idBtn.disabled = true;

async function handleLogin(e) {
    e.preventDefault();

    const email = findUseremail.value;

    try {
        const users = await pb.collection('users').getFullList();
        const userEmail = users.find(user => user.email === email);
        console.log(userEmail);
        if (userEmail) {
            const template = `
                <div class="tit__form">
                    <div class="tit__box">
                        <h3>입력하신 정보와 일치하는 결과입니다.</h3>
                        <b>${userEmail.id}</b> 
                        <p class="desc">개인정보 보호를 위해 아이디 또는 이메일의 일부만 제공합니다.</p>
                        <!-- 병합 후 경로 수정 필요할 수도 -->
                        <a href="/src/pages/loginpage/index.html">
                        <button type="button" class="button--red">로그인하러 가기</button>
                        </a>
                    </div>
                </div>
            `;

            insertLast('#find__next', template);
            
        } else {
            const template = `
            <div class="tit__form">
                <div class="tit__box">
                    <h3>일치하는 결과를 찾을 수 없습니다.
                    </h3>
                    <p class="desc">연속 10회 틀릴 경우
                    <br/>
                    아이디 찾기 기능이 일시적으로 제한됩니다.
                    </p>
                    <a href="/src/components/find-id/index.html">
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

    // 입력 필드 초기화
    findUseremail.value = '';
    // 리셋 된 후 초기 오류 메시지 추가
    find_showError()
    // 리셋 된 후 초기 버튼 비활성화
    find_idBtn.disabled = true;
}

find_idBtn.addEventListener('click', handleLogin);
