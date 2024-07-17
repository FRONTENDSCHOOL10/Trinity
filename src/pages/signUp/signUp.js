import { getNode, getNodes, getPbImageURL } from 'kind-tiger';
import PocketBase from 'pocketbase';
import downloadImage from './downloadImage';
// import '../../pages/main/main'; footer 불러온거.. 경로 수정 해야함

const pb = new PocketBase('https://plainyogurt.pockethost.io/');

const form = getNode('form');
const userIdInput = getNode('#user-id');
const emailInput = getNode('#email');
const passwordInput = getNode('#user-pw');
const confirmPasswordInput = getNode('#confirm-password');
const submitButton = getNode('#submit-btn');

const defaultImage = await pb.collection('profileImg').getOne('x8am0klvvuoss6i');
console.log(defaultImage)
const defaultAvatarUrl = getPbImageURL(defaultImage, 'field');

document.addEventListener('DOMContentLoaded', function () {
  const agreeAllCheckbox = getNode('#agree-all');
  const serviceCheckCheckbox = getNode('#service-check');
  const checkboxes = document.querySelectorAll('.privacy-policy input[type="checkbox"]');
  const checkedMust = document.querySelectorAll('.checked-must')
  
  const checkedAge = getNode('#age-check');
  const checkedPrivacy = getNode('#privacy-check');
  const checkedTerms = getNode('#terms-check');
  const checkedChannel = getNode('#channel-check');

  agreeAllCheckbox.addEventListener('change', function () {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = agreeAllCheckbox.checked;
      checkFormValidity()
    });
});

  serviceCheckCheckbox.addEventListener('change', function () {
    getNode('#marketing-sms-check').checked = serviceCheckCheckbox.checked;
    getNode('#marketing-email-check').checked = serviceCheckCheckbox.checked;
  });

  checkedMust.forEach(item => item.addEventListener('change', (e) => {
    checkFormValidity()
  }));

  form.addEventListener('submit', handleSignUp);

  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', function () {
      let deleteIcon = this.nextElementSibling;
      if (deleteIcon && deleteIcon.classList.contains('delete-icon')) {
        if (this.value.length > 0) {
          deleteIcon.classList.remove('invisible');
          deleteIcon.classList.add('visible');
        } else {
          deleteIcon.classList.remove('visible');
          deleteIcon.classList.add('invisible');
        }
      }
      checkFormValidity();
    });

    let deleteIcon = input.nextElementSibling;
    if (deleteIcon && deleteIcon.classList.contains('delete-icon')) {
      deleteIcon.addEventListener('click', function () {
        input.value = '';
        deleteIcon.classList.remove('visible');
        deleteIcon.classList.add('invisible');
        checkFormValidity();
      });
    }
  });

  const labels = document.querySelectorAll('.privacy-policy label span');
  const modal = getNode('#signup-modal');
  const modalText = getNode('#signup-modal-text');
  const closeBtn = getNode('.signup-close-btn');

  labels.forEach(labelSpan => {
    labelSpan.addEventListener('click', function (event) {
      event.preventDefault();
      showModal(this.parentElement.htmlFor);
    });
  });

  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  function showModal(id) {
    let content = '';
    switch (id) {
      case 'privacy-check':
        content = '<h1>서비스 이용약관 동의</h1> <p>제1장 총칙<br>제1조 (목적)<br>이 약관은 주식회사 티빙(이하 “회사”)이 PC 웹사이트와 모바일, 태블릿, TV 앱을 이용하여 온라인으로 제공하는 디지털콘텐츠(이하 "콘텐츠") 및 제반 서비스를 이용함에 있어 회사와 이용자의 권리,의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.<br><br>제2조 [정의]<br>이 약관에서 사용하는 용어의 정의는 다음과 같습니다. <br>1. "회사"라 함은 "콘텐츠" 산업과 관련된 경제활동을 영위하는 자로서 “콘텐츠” 제반 서비스를 제공하는 자이며, 이 약관에서는 주식회사 티빙을 말합니다. 2. "이용자"라 함은 "회사"의 PC 웹사이트와 모바일, 태블릿, TV 앱 서비스에 접속하여 이 약관에 따라 "회사"가 제공하는 "콘텐츠" 제반 서비스를 이용하는 회원 및 비회원을 말합니다. 3. "회원"이라 함은 "회사"와 이용계약을 체결하고 "이용자" 아이디(ID)를 부여 받은 "이용자"로서 "회사"의 정보를 지속적으로 제공받으며 "회사"가 제공하는 서비스를 지속적으로 이용할 수 있는 자를 말합니다. 4. "비회원"이라 함은 "회원"이 아니면서 "회사"가 제공하는 서비스를 이용하는 자를 말합니다. 5. “CJ ONE” 회원 : “CJ ONE” 서비스 운영에 동의하고 회원 ID를 부여받은 자 중 “회사”의 서비스 이용에 동의한 회원을 의미하며, “CJ ONE” 회원약관에 의해 운영 됩니다. 6. "콘텐츠"라 함은 정보통신망이용촉진 및 정보보호 등에 관한 법률 제2조 제1항 제1호의 규정에 의한 정보통신망에서 사용되는 부호, 문자, 음성, 음향, 이미지 또는 영상 등으로 표현된 자료 또는 정보로서, 그 보존 및 이용에 있어서 효용을 높일 수 있도록 전자적 형태로 제작 또는 처리된 것을 말합니다. 7. "아이디(ID)"라 함은 "회원"의 식별과 서비스이용을 위하여 "회원"이 정하고 "회사"가 승인하는 문자 또는 숫자의 조합을 말합니다. 8. "비밀번호(PASSWORD)"라 함은 "회원"이 부여 받은 "아이디"와 일치되는 "회원"임을 확인하고 비밀보호를 위해 "회원" 자신이 정한 문자 또는 숫자의 조합을 말합니다. 9. "유료 서비스"라 함은 서비스 이용을 위해 대금을 지불한 후에 이용할 수 있는 서비스를 말합니다. 10. "무료 서비스"라 함은 서비스 이용을 위해 대금을 지불하지 않고 이용할 수 있는 서비스를 말합니다.<br><br>제3조 [신원정보 등의 제공]<br>"회사"는 이 약관의 내용, 상호, 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 모사전송번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호 등을 “이용자”가 쉽게 알 수 있도록 온라인 서비스초기화면에 게시합니다. 다만, 약관은 “이용자”가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.<br><br>제4조 [약관의 개정 등]<br>1. "회사"는 콘텐츠산업진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 전자문서 및 전자거래기본법, 전자금융거래법, 전자서명법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법, 방문판매 등에 관한 법률, 소비자기본법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다. 2. "회사"가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스초기화면에 그 적용일자 7일 전에 게시하거나 기타의 방법을 통해 제공하고, 기존회원에게는 적용일자 및 변경될 내용 중 중요사항에 대해 전자우편주소로 발송합니다. 단, “회원”에게 불리한 약관개정의 경우에는 적용일자 및 변경사유를 명시하여 현행 약관과 함께 그 개정약관의 적용일자 30일 전부터 적용일자 전일까지 공지하며, 공지 외에 전자우편주소 등의 전자적 수단을 통해 따로 명확히 통지하도록 합니다. 3. "회사"가 약관을 개정할 경우에는 개정약관 공지 후 개정약관의 적용에 대한 "이용자"의 동의 여부를 확인합니다. "이용자"가 개정약관의 적용에 동의하지 않는 경우 "회사" 또는 "이용자"는 이용계약을 해지할 수 있으며, "이용자"가 개정약관의 적용일까지 거부의 의사를 밝히지 않을 경우에 개정약관에 동의하는 것으로 간주합니다.<br><br>제5조 [약관의 해석]<br>이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 콘텐츠산업진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 개인정보 보호법 등 관련 법령 또는 상관례에 따르며, 유료서비스 “이용자”의 경우에는 유료 이용약관의 적용을 받습니다.<br><br>제2장 회원가입<br>제6조 [회원가입]<br>1. 회원가입은 "이용자"가 약관의 내용에 대하여 동의를 한 다음 회사가 정한 가입 양식에 따라 필요한 정보를 기입하고 "회사"에 제출함으로써 이루어집니다. 2. "회원"은 반드시 자신의 진정한 정보를 입력하여야 하며, 회원이 제공한 정보가 변경되었을 경우 즉시 "회사"의 관리자에게 그 변경사항을 알려야 합니다. 3. "회사"는 다음 각 호에 해당하는 이용계약 신청에 대하여는 승인을 유보 또는 거부할 수 있습니다. 1) 다른 사람의 명의를 사용하여 신청한 경우 2) 이용계약 신청서의 내용을 허위로 기재한 경우 3) 사회의 안녕, 질서를 저해할 목적으로 신청한 경우 4) 기타 회사가 정한 이용신청 요건이 미비되었을 경우 4. "회원"의 가입은 "회사"의 승낙이 "이용자"에게 도달한 시점에 성립됩니다. 다만, "회사"의 귀책사유로 인한 승인의 지연 또는 승낙을 유보한 경우에는 "회원"에게 그 사유와 승낙일시를 지체 없이 통지하여야 합니다.<br><br>제7조 [회원의 의무]<br>1. "회원"은 다음 각 호의 행위를 하여서는 아니 됩니다. 1) 신청 또는 변경 시 허위 내용의 등록 2) 타인의 정보 도용 3) "회사"가 게시한 정보의 변경 4) "회사"가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시 5) "회사"와 기타 제삼자의 저작권 등 지적재산권에 대한 침해 6) "회사"와 기타 제삼자의 명예를 손상시키거나 업무를 방해하는 행위 7) 외설 또는 폭력적인 메시지, 화상, 음성 기타 공서양속에 반하는 정보를 회사가 제공하는 모든 콘텐츠상에 게시 또는 제공하는 경우 8) 회사의 동의 없이 영리목적의 광고성 정보를 전송하는 경우 9) "회사"의 서비스 및 정보를 이용한 영리활동 10) "회사"가 정한 정보이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시 11) "회사"와 기타 제삼자의 저작권 등 지적재산권에 대한 침해 12) "회사"와 기타 제삼자의 명예를 손상시키거나 업무를 방해하는 행위 13) 외설 또는 폭력적인 메시지, 화상, 음성 기타 공서양속에 반하는 정보를 회사가 제공하는 모든 콘텐츠상에 게시 또는 제공하는 경우 14) 회사의 동의 없이 영리목적의 광고성 정보를 전송하는 경우 15) 회사의 서비스 및 정보를 이용한 영리활동 16) 회사가 금지한 정보(컴퓨터 프로그램 등)의 송신 또는 게시 17) 회사의 저작권 등 지적재산권에 대한 침해 18) 회사의 명예를 손상시키거나 업무를 방해하는 행위 19) 외설 또는 폭력적인 메시지, 화상, 음성 기타 공서양속에 반하는 정보를 게시하는 행위 20) 회사가 제공하는 서비스를 통하여 얻은 정보를 회사의 동의 없이 서비스 이외의 목적으로 사용하는 행위 21) 기타 불법적이거나 부당한 행위<br><br>제8조 [회사의 의무]<br>1. "회사"는 "이용자"가 안전하게 "콘텐츠"를 이용할 수 있도록 개인정보보호를 위한 보안 시스템을 갖추어야 하며, 개인정보보호정책을 공시하고 준수합니다. 2. "회사"는 "이용자"가 "콘텐츠"를 안전하게 이용할 수 있도록 정기적으로 "콘텐츠"를 검수하고, "콘텐츠"에 대한 손해 보상의 방법을 마련합니다. 3. "회사"는 "콘텐츠"와 관련된 정보를 제공할 의무를 부담하지만 "이용자"는 회사가 제공한 정보를 참조하여 직접적으로 또는 간접적으로 발생한 결과에 대해 회사에 책임을 묻지 않습니다.<br><br>제3장 서비스의 제공<br>제9조 [서비스의 제공]<br>1. "회사"는 "이용자"에게 "콘텐츠"를 제공합니다. 2. "회사"는 "이용자"에게 "콘텐츠"를 안전하게 제공하고 안전한 "콘텐츠" 이용을 제공하기 위해 "콘텐츠"의 질적 수준을 지속적으로 관리 및 제공해야 합니다. 3. "회사"는 "이용자"가 안전하게 "콘텐츠"를 이용할 수 있도록 "회사"와 "이용자" 간의 명확한 의사소통 및 커뮤니케이션을 위해 "콘텐츠"에 대한 정보 및 정책을 제공할 의무를 부담합니다. 4. "회사"는 "이용자"의 개인정보를 보호하기 위해 다음과 같은 방법을 마련합니다. 5. "회사"는 "콘텐츠"의 질적 수준을 지속적으로 관리하고 제공하여야 합니다.<br><br>제10조 [서비스의 변경 및 중지]<br>1. "회사"는 특정한 사정이나 제한된 사유로 인하여 "이용자"에게 불가피하게 "콘텐츠"의 변경 또는 중지를 할 수 있습니다. 2. "회사"는 "이용자"에게 "콘텐츠"의 변경 또는 중지를 사전에 공지하고 사유를 밝혀야 합니다. 3. "회사"는 "이용자"에게 불가피하게 "콘텐츠"의 변경 또는 중지를 통보한 후 제공해야 할 "콘텐츠"와 동일한 수준의 "콘텐츠"를 제공합니다. 4. "회사"는 "이용자"가 "콘텐츠"의 변경 또는 중지로 인해 손해를 입은 경우, 그 손해를 배상할 의무를 부담합니다.<br><br>제11조 [정보의 제공 및 광고의 게재]<br>1. "회사"는 "이용자"에게 다양한 방법으로 "콘텐츠"에 대한 정보를 제공할 수 있습니다. 2. "회사"는 "이용자"의 개인정보를 보호하기 위해 다음과 같은 방법을 마련합니다. 3. "회사"는 "콘텐츠"에 대한 정보를 제공할 의무를 부담합니다.<br><br>제12조 [개인정보의 보호]<br>1. "회사"는 "이용자"의 개인정보를 보호하기 위해 다음과 같은 방법을 마련합니다. 2. "회사"는 "이용자"가 제공한 개인정보를 보호하기 위해 "회사"의 개인정보취급방침을 만들고, "이용자"에게 통지합니다. 3. "회사"는 "이용자"가 제공한 개인정보를 보호하기 위해 "회사"의 개인정보취급방침을 준수하고, "이용자"가 제공한 개인정보를 보호하기 위해 "회사"의 개인정보취급방침을 준수하며, "이용자"가 제공한 개인정보를 보호하기 위해 이걸 다 읽네... 인정!!</p>';
        break;
      case 'terms-check':
        content = `<h1>개인정보 수집 및 서비스 활용 동의</h1> <table><thead><tr><th>수집/이용 목적</th><th>수집 항목</th><th>보유 및 이용기간</th></tr></thead><tbody><tr><td>TVING ID 회원 가입 및 회원관리</td><td>TVING ID, 이메일 주소, 비밀번호, 휴대폰 번호, 이름</td><td>회원탈퇴 후 5일까지</td></tr><tr><td>SNS ID 회원 가입 및 회원관리</td><td><ul>
                    <li>Naver: 이름, 이메일 주소, 성별, 출생연도, 휴대폰 번호</li>
                    <li>Kakao: 이름, 이메일 주소, 닉네임, 휴대폰 번호</li>
                    <li>Facebook: 이름, 이메일 주소, 프로필 사진, 휴대폰 번호</li>
                    <li>Twitter: 이름, 이메일 주소, 휴대폰 번호</li>
                    <li>Apple: 이름, 이메일 주소, 휴대폰 번호</li>
                </ul>
            </td>
            <td>회원탈퇴 후 5일까지</td>
        </tr>
        <tr>
            <td>CJ ONE 통합회원 가입 및 회원관리</td>
            <td>CJ ONE ID, CJ ONE 회원번호, 비밀번호, 이름, 영어이름, CI, 성별, 휴대폰 번호, 이메일 주소, 생년월일</td>
            <td>회원탈퇴 후 5일까지</td>
        </tr>
        <tr>
            <td>사용자 인증을 통한 본인 및 연령 확인</td>
            <td>이름, CI, DI, 생년월일, 성별, 휴대폰 번호</td>
            <td>회원탈퇴 후 5일까지</td>
        </tr>
        <tr>
            <td>만 14세 미만 회원가입 법정대리인 동의</td>
            <td>ID, 요청일시, 법정대리인의 성인여부, 법정대리인의 인증일시</td>
            <td>회원탈퇴 후 5일까지</td>
        </tr>
        <tr>
            <td>상품 구매 환불</td>
            <td>이름, 휴대폰 번호, 계좌주명, 계좌번호, 요금청구 및 결제 기록</td>
            <td>상품 구매 및 환불 후 5년까지</td>
        </tr>
        <tr>
            <td>서비스 개선 및 안정화, 서비스 부정 이용 방지, 서비스 분석 및 통계, 최적화/추천 컨텐츠 및 서비스 제공</td>
            <td>이름, ID, 이메일 주소, 서비스 이용기록, 생년월일, 기기정보</td>
            <td>회원탈퇴 후 5일까지</td>
        </tr>
        <tr>
            <td>고객 문의 및 응대 (웹/앱 게시판 및 고객센터)</td>
            <td>이름, ID, 이메일 주소, 휴대폰 번호, 서비스 이용기록, 기기정보</td>
            <td>접수 후 3년까지</td>
        </tr>
        <tr>
            <td>제휴/광고/입점 문의 및 응대</td>
            <td>이름, 회사명, 이메일 주소, 휴대폰 번호, 대표 전화번호</td>
            <td>접수 후 3년까지</td>
        </tr></tbody></table>
        <p>※ 이용자는 개인정보의 수집 및 이용 동의를 거부할 권리가 있습니다.<br>회원가입 시 수집하는 최소한의 개인정보, 즉, 필수 항목에 대한 수집 및 이용 동의를 거부하실 경우, 회원가입을 진행하실 수 없습니다.</p>`;
        break;
      case 'channel-check':
        content = `<h1>채널 홈페이지 개인정보 제 3자 제공 동의</h1>
                <table>
            <thead>
                <tr>
                    <th>수집/이용 목적</th>
                    <th>수집 항목</th>
                    <th>보유 및 이용기간</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>서비스/업데이트 정보 제공, 맞춤형 서비스/광고 제공, 이벤트/마케팅/광고 활용</td>
                    <td>회원번호, 이름, ID, 이메일 주소, 휴대폰 번호, 디바이스 토큰, 서비스 이용기록, 성별, 생년월일, ADID</td>
                    <td>동의 철회 또는 회원탈퇴시까지</td>
                </tr>
            </tbody>
        </table>
        <p>※ 이용자는 개인정보의 수집 및 이용 선택 동의를 거부할 권리가 있습니다 단, 개인정보 수집 및 이용 동의를 거부하실 경우, 마케팅 관련 서비스를 제공 받으실 수 없습니다.</p>
        `;
        break;
      case 'service-check':
        content = `<h1>[선택] 개인정보 수집 및 서비스 활용 동의(마케팅 정보 수신 동의)</h1>
        <p>티빙은 회원님이 동의하신 개인정보를 이용하여 푸시알림, SMS(MMS), 이메일를 통해서비스 이벤트 및 업데이트, 마케팅 정보, 고객 맞춤 서비스 정보를 전송할 수 있습니다.<br>
        본 동의는 거부하실 수 있으나, 거부 시 이벤트 및 프로모션 안내, 유용한 정보를 받아보실 수 없습니다.<br>
        광고성정보수신의 변경은 "MY > 회원정보 수정 > 마케팅정보 수신 동의" 에서 언제든지 변경할 수 있습니다.</p>`;
        break;
      default:
        content = '';
    }
    modalText.innerHTML = content;
    modal.style.display = 'block';
  }

  function checkFormValidity() {
    const isFormValid = userIdInput.value && emailInput.value && passwordInput.value && confirmPasswordInput.value && checkedAge.checked && checkedPrivacy.checked && checkedTerms.checked && checkedChannel.checked;
    if (isFormValid) {
      submitButton.classList.add('submitPossible');
    } else {
      submitButton.classList.remove('submitPossible');
    }
  }

});


function togglePasswordVisibility(element) {
  const pwInput = getNode("#user-pw");
  pwInput.classList.toggle('active');

  if (pwInput.classList.contains('active')) {
    element.querySelector('img').src = '/icon/signUp/iconWatched.svg';
    pwInput.setAttribute('type', 'text');
  } else {
    element.querySelector('img').src = '/icon/signUp/iconWatching.svg';
    pwInput.setAttribute('type', 'password');
  }
}

function toggleConfirmPasswordVisibility(element) {
  const confirmPwInput = getNode("#confirm-password");
  confirmPwInput.classList.toggle('active');

  if (confirmPwInput.classList.contains('active')) {
    element.querySelector('img').src = '/icon/signUp/iconWatched.svg';
    confirmPwInput.setAttribute('type', 'text');
  } else {
    element.querySelector('img').src = '/icon/signUp/iconWatching.svg';
    confirmPwInput.setAttribute('type', 'password');
  }
}

document.querySelectorAll('.pw-visible').forEach(icon => {
  icon.addEventListener('click', function () {
    togglePasswordVisibility(this);
  });
});

document.querySelectorAll('.comfirm-pw-visible').forEach(icon => {
  icon.addEventListener('click', function () {
    toggleConfirmPasswordVisibility(this);
  });
});

async function handleSignUp(e) {
  e.preventDefault();

  const userId = getNode('#user-id').value;
  const userPw = getNode('#user-pw').value;
  const confirmPassword = getNode('#confirm-password').value;
  const email = getNode('#email').value;

  if (!pwReg(userPw)) {
    displayError(passwordInput, '영문, 숫자, 특수문자 조합 8~15자리로 입력하세요.');
    return;
  } else {
    removeError(passwordInput);
  }

  if (!idReg(userId)) {
    displayError(userIdInput, '아이디는 영문 또는 영문, 숫자 조합 6~12자리로 구성되어야 합니다.');
    return;
  } else {
    removeError(userIdInput);
  }

  if (!emailReg(email)) {
    displayError(emailInput, '유효한 이메일 주소를 입력하세요.');
    return;
  } else {
    removeError(emailInput);
  }

  if (userPw !== confirmPassword) {
    displayError(confirmPasswordInput, '비밀번호가 일치하지 않습니다.');
    return;
  } else {
    removeError(confirmPasswordInput);
  }

  try {
    const newUser = await pb.collection('users').create({
      "username": userId,
      "email": email,
      "emailVisibility": true,
      "password": userPw,
      "passwordConfirm": confirmPassword,
      // "isActive1": true,
      // "isLocked1": false,
      // "profileName1": "test",
      // "isActive2": false,
      // "isLocked2": false,
      // "profileName2": "test",
      // "isActive3": false,
      // "isLocked3": false,
      // "profileName3": "test",
      // "isActive4": false,
      // "isLocked4": false,
      // "profileName4": "test",
    });



    const imgBlob = await downloadImage(defaultAvatarUrl);
  
    // const formData = new FormData();

    // newUser.append('username', userId);
    // newUser.append('email', email);
    // newUser.append('password', userPw);
    // newUser.append('passwordConfirm', confirmPassword);
    newUser.append('profileImg1', imgBlob, 'profileImg1.jpg');

    // const response = await pb.collection('users').create(newUser);

    alert('회원가입이 완료되었습니다.');
    location.href = '/src/pages/login/index.html';

  } catch (error) {
    if (error.message.includes('already exists')) {
      alert('이미 가입된 계정입니다.');
    } else {
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }

}

function idReg(text) {
  const re = /^[a-zA-Z0-9]{6,12}$/;
  return re.test(text);
}

function pwReg(text) {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,15}$/;
  return re.test(String(text));
}

function emailReg(text) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}

function displayError(input, message) {
  const errorElement = input.nextElementSibling.nextElementSibling;
  errorElement.classList.add('error');
  errorElement.textContent = message;
}

function removeError(input) {
  const errorElement = input.nextElementSibling.nextElementSibling;
  errorElement.classList.remove('error');
  errorElement.textContent = 'ㅤ';
}


