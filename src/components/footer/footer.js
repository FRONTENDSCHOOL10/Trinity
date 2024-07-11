import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

function footerScript() {
  document.addEventListener('DOMContentLoaded', () => {
    let shortcutBtns = document.querySelectorAll('.shortcut__btn');
    let shortcutLists = document.querySelectorAll('.shortcut__group');

    function toggleShortcut(index) {
      return function () {
        shortcutLists.forEach((list, i) => {
          if (i === index) {
            list.classList.toggle('is--active');
          } else {
            list.classList.remove('is--active');
          }
        });
      };
    }

    shortcutBtns.forEach((btn, i) => {
      btn.addEventListener('click', toggleShortcut(i));
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.shortcut__btn') && !e.target.closest('.shortcut__group')) {
        shortcutLists.forEach((list) => {
          list.classList.remove('is--active');
        });
      }
    });
  });
}

async function renderFooter() {
  const footerTemplate = `
    <h2 class="sr-only">푸터</h2>
    <!-- footer 내용 전체를 감싸는 wrapper -->
    <div class="footer__wrapper">
      <!-- footer 상단 공지 부분 감싸는 wrapper -->
      <!-- 이 div에 type-simple을 추가하면 simple type으로 지정되어 공지사항 및 바로가기 창 사라짐 -->
      <div class="footer__wrapper__upper">
        <!-- 공지사항 -->
        <div class="footer__noticeLink">
          <a href="https://www.tving.com/help/notice" class="footer__notice">공지사항</a>
          <a href="https://www.tving.com/help/notice/137938" class="footer__information">[안내] 합병보고 주주총회에 갈음하는 공고</a>
        </div>
        <!-- 브랜드 바로가기, 그룹계열사 바로가기 -->
        <ul class="footer__shortcut">
          <li class="shortcut">
            <button class="shortcut__btn">브랜드 바로가기<span class="shortcut__plus">+</span></button>
            <ul class="shortcut__group">
              <li><a href="https://tvn.cjenm.com/ko/tvNstory-main/" target="_blank">tvN</a></li>
              <li><a href="https://tvnsports.cjenm.com/ko/" target="_blank">tvN STORY</a></li>
              <li><a href="https://tvn.cjenm.com/ko/tvNstory-main/" target="_blank">tvN DRAMA</a></li>
              <li><a href="https://tvn.cjenm.com/ko/tvNshow-main/" target="_blank">tvN SHOW</a></li>
              <li><a href="https://tvn.cjenm.com/ko/tvNshow-main/" target="_blank">OCN</a></li>
              <li><a href="https://zhtv.cjenm.com/ko/" target="_blank">중화TV</a></li>
              <li><a href="https://uxn.cjenm.com/ko/" target="_blank">UXN</a></li>
              <li><a href="https://catchon.cjenm.com/ko/" target="_blank">CATCH ON</a></li>
              <li><a href="https://tooniverse.cjenm.com/ko/" target="_blank">tooniverse</a></li>
            </ul>
          </li>
          <!-- | span으로 삽입 -->
          <li class="shortcut"><span class="shortcut__bar" aria-hidden="true">|</span></li>
          <li class="shortcut">
            <button class="shortcut__btn">그룹 계열사 바로가기<span class="shortcut__plus">+</span></button>
            <ul class="shortcut__group">
              <li><a href="https://www.cj.net/" target="_blank">CJ주식회사</a></li>
              <li><a href="https://www.cjenm.com/ko/" target="_blank">CJ ENM 엔터테인먼트부문</a></li>
              <li><a href="https://www.cgv.co.kr/" target="_blank">CJ CGV</a></li>
              <li><a href="https://www.cj.co.kr/kr/index" target="_blank">CJ제일제당(식품)</a></li>
              <li><a href="https://www.cjfreshway.com/index.jsp" target="_blank">CJ프레시웨이</a></li>
              <li><a href="https://www.cjfoodville.co.kr/main.asp" target="_blank">CJ푸드빌</a></li>
              <li><a href="http://www.cjmd1.co.kr/main/main.aspx" target="_blank">CJ엠디원</a></li>
              <li><a href="https://www.cj.co.kr/kr/about/business/bio" target="_blank">CJ제일제당(바이오)</a></li>
              <li><a href="https://display.cjonstyle.com/p/homeTab/main?hmtabMenuId=H00005" target="_blank">CJ ENM 커머스부문</a></li>
              <li><a href="https://www.cjlogistics.com/ko/main" target="_blank">CJ대한통운</a></li>
              <li><a href="https://www.cjtelenix.com/" target="_blank">CJ텔레닉스</a></li>
              <li><a href="https://www.oliveyoung.co.kr/store/main/main.do?oy=0" target="_blank">CJ올리브영</a></li>
              <li><a href="https://www.cjenc.co.kr:444/kr/Default.asp" target="_blank">CJ대한통운(건설)</a></li>
              <li><a href="https://www.cjolivenetworks.co.kr/" target="_blank">CJ올리브네트웍스</a></li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- <hr class="footer__wrapper__line" /> -->

      <!-- 링크 목록 -->
      <ul class="footer__hrContainer">
        <li><a href="https://www.tving.com/help/notice" class="footer__hrList">고객센터</a></li>
        <li><a href="https://www.tving.com/policy/terms" class="footer__hrList">이용약관</a></li>
        <li><a href="https://www.tving.com/policy/privacy" class="footer__hrList">개인정보처리방침</a></li>
        <li><a href="https://www.tving.com/policy/youth" class="footer__hrList">청소년 보호정책</a></li>
        <li><a href="https://www.tving.com/policy/legal" class="footer__hrList">법적 고지</a></li>
        <li><a href="https://www.tving.com/event/list" class="footer__hrList">이벤트</a></li>
        <li><a href="https://team.tving.com/" class="footer__hrList">인재채용</a></li>
      </ul>

      <!-- 회사정보 표기 -->
      <div class="footer__ownerinfoContainer">
        <p class="hr__lineHeight">
          대표이사: 김멋사<span class="hr__divLine" aria-hidden="true">ㅣ</span><a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1888801893&apv_perm_no=">사업자정보확인</a><span class="hr__divLine" aria-hidden="true">ㅣ</span> 사업자등록번호: 없음니다<span class="hr__divLine" aria-hidden="true">ㅣ</span>
          통신판매신고번호:2024-서울마포-3호
        </p>
        <p class="hr__lineHeight">
          사업장: 서울특별시 마포구 상암산로 34, DMC 디지털큐브 15층(상암동)
          <span class="hr__divLine" aria-hidden="true">ㅣ</span>
          호스팅사업자: 씨제이올리브네트윅스(주)
        </p>
        <p class="hr__lineHeight">
          <a href="https://www.tving.com/help/qna" class="">고객문의 바로가기</a><span class="hr__divLine" aria-hidden="true">ㅣ</span> <a href="mailto:tving@cj.net">대표메일: tving@cj.net</a><span class="hr__divLine" aria-hidden="true">ㅣ</span>
          <a href="https://www.tving.com/help/notice">고객센터: 1670-1525(평일/주말 09~18시, 공휴일 휴무)</a>
        </p>
        <p class="hr__lineHeight">
          ENM 시청자 상담실 (편성 문의 및 시청자 의견): 080-080-0780
          <span class="hr__divLine" aria-hidden="true">ㅣ</span>
          Mnet 고객센터 (방송편성문의): 1855-1631
        </p>
      </div>

      <!-- SNS 공유버튼 -->
      <ul class="footer__icon">
        <li class="icon icon__youtube">
          <a href="https://www.youtube.com/c/TVING_official/" class="youtube" target="_blank" aria-label="유튜브">
            <span class="sr-only">유튜브 링크</span>
          </a>
        </li>
        <li class="icon icon__instagram">
          <a href="https://www.instagram.com/tving.official/" class="instagram" target="_blank" aria-label="인스타그램">
            <span class="sr-only">인스타그램 링크</span>
          </a>
        </li>
        <li class="icon icon__twitter">
          <a href="https://x.com/tvingdotcom/" class="twitter" target="_blank" aria-label="트위터">
            <span class="sr-only">트위터 링크</span>
          </a>
        </li>
        <li class="icon icon__facebook">
          <a href="https://www.facebook.com/CJTVING/" class="facebook" target="_blank" aria-label="페이스북">
            <span class="sr-only">페이스북 링크</span>
          </a>
        </li>
      </ul>
      <!-- 저작권 표기 -->
      <div class="footer__copyright">
        <small class="footer__copyrigtInfo"> Copyright © 주식회사 티빙 All right reserved. </small>
      </div>
    </div>
  `;

  insertLast('.footer', footerTemplate);

  // const event = await pb.collection('event').getFullList(); // SDK

  // event.forEach((item) => {
  //   const template = `
  //   `;

  //   insertLast('.footer', template);
  // });
}

export { footerScript, renderFooter };
