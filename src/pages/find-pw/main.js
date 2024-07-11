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

async function handleFindPw(e) {
    e.preventDefault();

    const userId = findUserId.value;

    try {
        // 전체 사용자 목록을 가져와서 아이디로 필터링
        const users = await pb.collection('users').getFullList();
        const findUser = users.find(user => user.id === userId);
        
        if (findUser) {
            // 비밀번호 변수 설정 (여기서는 'password' 필드가 존재한다고 가정)
            const userPassword = findUser.password;

            const template = `
            <div class="tit__box">
                <h3>입력하신 정보와 일치하는 결과입니다.</h3>
                <b>비밀번호: ${userPassword}</b> <!-- 보안상 위험한 코드 -->
                <p class="desc">개인정보 보호를 위해 아이디 또는 이메일의 일부만 제공합니다.</p>
                <!-- 병합 후 경로 수정 필요할 수도 -->
                <a href="/src/pages/loginPage/index.html">
                <button type="button" class="button--red">로그인하러 가기</button>
                </a>
            </div>
            `;
            
            insertLast('#find__next', template);

            // 입력 필드 초기화
            findUserId.value = '';
            // 버튼 다시 비활성화
            find_pwBtn.disabled = true;

        } else {
            const template = `
            <div class="tit__form">
                <div class="tit__box">
                    <h3>일치하는 결과를 찾을 수 없습니다.</h3>
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
