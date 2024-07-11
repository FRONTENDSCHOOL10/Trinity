import '/src/styles/css/main.css';
import { setDocumentTitle, setStorage, insertLast, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';

setDocumentTitle('TAING / 비밀번호 찾기');

const find_pwBtn = getNode('.find-pw');
const findUserId = getNode('#findUserId');

function find_pw_validation(e) {
    const target = e.currentTarget;
    if (target.value.length > 0) {
        find_pwBtn.disabled = false;
    } else {
        find_pwBtn.disabled = true;
    }
}

// 사용자 입력 필드에 이벤트 리스너 추가
findUserId.addEventListener('input', find_pw_validation);

// 초기 상태에서 버튼 비활성화
find_pwBtn.disabled = true;

// find__next 비활성화
const find_next = document.getElementById('find__next');
find_next.style.display = 'none';

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
            // 버튼 다시 비활성화
            find_pwBtn.disabled = true;

        } else {
            find_next.style.display = 'flex';

            const template = `
            <div class="tit__form">
                <div class="tit__box">
                    <h3>입력하신 정보와 일치하는 회원을 찾을 수 없습니다.</h3>
                    <p class="tt"></p>
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

    // 입력 필드 초기화
    findUserId.value = '';
    // 리셋 된 후 초기 버튼 비활성화
    find_pwBtn.disabled = true;
}

find_pwBtn.addEventListener('click', handleFindPw);
