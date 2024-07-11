import '/src/styles/scss/main.scss';
import { setDocumentTitle, setStorage, insertLast, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 비밀번호 찾기');

const find_pwBtn = getNode('.find-pw');
const findUserId = getNode('#findUserId');
const btnClear = document.querySelector('.btnClear');

// 초기 버튼 비활성화
find_pwBtn.disabled = true;

// 초기 find__next 비활성화
const find_next = document.getElementById('find__next');
find_next.style.display = 'none';

// 초기 btnClear 숨기기
btnClear.style.display = 'none';


// 입력했을 경우 btn 활성화
function find_pw_validation(e) {
    const target = e.currentTarget;
    if (target.value.length > 0) { 
        // 한글자라도 입력되었을 경우
        find_pwBtn.disabled = false;
    } else {
        find_pwBtn.disabled = true;
    }
}

findUserId.addEventListener('input', find_pw_validation);


// 입력 시 옆에 X 마크 띄우기 
function inputClear() {
    const inputValue = findUserId.value.trim(); // 입력 값에서 공백 제거

    if (inputValue.length > 0) {
        btnClear.style.display = 'block'; // 입력 값이 있으면 btnClear 보이기
    } else {
        btnClear.style.display = 'none'; // 입력 값이 없으면 btnClear 숨기기
    }
}

findUserId.addEventListener('input', inputClear); // 입력 이벤트 감지


// 버튼 클릭 시 입력 값 초기화
btnClear.addEventListener('click', function(e) {
    e.preventDefault();
    findUserId.value = ''; // 입력 필드 값을 초기화
    btnClear.style.display = 'none'; // btnClear 숨기기
    find_pwBtn.disabled = true; // 버튼 비활성화
});


// 아이디 입력으로 사용자 확인 후 이메일 받기
async function handleFindPw(e) {
    e.preventDefault();

    const userId = findUserId.value;

    try {
        // 전체 사용자 목록을 가져와서 아이디로 필터링
        const users = await pb.collection('users').getFullList();
        const findUser = users.find(user => user.username === userId);
        
        if (findUser) {
            find_next.style.display = 'flex';
            const template = `
            <div class="tit__form">
                <div class="tit__box">
                    <h3>입력하신 정보와 일치하는 회원입니다.</h3>
                    <p class="tt">${findUser.email}</p>
                    <p class="desc">개인정보 보호를 위해 가입하신 이메일로 전달해드렸습니다.</p>
                    <p class="desc"></p>
                    <!-- 병합 후 경로 수정 필요할 수도 -->
                    <a href="/src/pages/loginpage/index.html">
                    <button type="button" class="button--red">로그인하러 가기</button>
                    </a>
                </div>
            </div>
            `;
            
            insertLast('#find__next', template);

            // 입력 필드 초기화
            findUserId.value = '';
            // 버튼 비활성화
            find_pwBtn.disabled = true;

        } else {
            find_next.style.display = 'flex';

            const template = `
            <div class="tit__form">
                <div class="tit__box">
                    <h3>입력하신 정보와 일치하는 <br/>회원을 찾을 수 없습니다.</h3>
                    <p class="tt sr-only"></p>
                    <p class="desc"></p>
                    <!-- 병합 후 경로 수정 필요할 수도 -->
                    <a href="/src/pages/find-pw/index.html">
                    <button type="button" class="button--gray">비밀번호 다시 찾기</button>
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
    findUserId.value = '';
    // 리셋 후 초기 버튼 비활성화
    find_pwBtn.disabled = true;
}

find_pwBtn.addEventListener('click', handleFindPw);
