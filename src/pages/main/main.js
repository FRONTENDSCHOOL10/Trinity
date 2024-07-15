import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { getNode, getStorage, insertLast, insertAfter, setDocumentTitle, setStorage } from 'kind-tiger';
import defaultAuthData from '@/api/defaultAuthData';
import { renderHeader } from '@/layout/header/header';
import { renderSearchModal, searchModal } from '@/components/searchModal/searchModal';
import { renderProfileMenu, renderLogoutModal, toggleLogoutModal, logout } from '@/components/profileMenu/profileMenu';
import { renderMainAd, openMainAdModal } from '@/components/mainAd/mainAd';
import renderMainVisualSlider from '@/components/mainVisual/mainVisual';
import renderMustContentSlider from '@/components/contentSlider/must/must';
import renderQuickVodContentSlider from '@/components/contentSlider/quick/quick';
import renderPopularContentSlider from '@/components/contentSlider/popular/popular';
import renderLiveContentSlider from '@/components/contentSlider/live/live';
import renderOnlyContentSlider from '@/components/contentSlider/only/only';
import renderAdBanner from '@/components/adBanner/adBanner';
import renderEventSlider from '@/components/eventSlider/eventSlider';
import { renderFooter, footerScript } from '@/layout/footer/footer';

setDocumentTitle('TAING');

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

const auth = localStorage.getItem('auth');

// 로그인 되어있지 않으면 랜딩 페이지로 보내는 코드
if (!auth.isAuth) {
  location.replace('/src/pages/landing/index.html');
}

renderHeader();
renderSearchModal();
searchModal();
renderProfileMenu();
renderLogoutModal();
toggleLogoutModal();
logout();

renderMainAd();
openMainAdModal();

/* -------------------------------------------------------------------------- */
/*                                메인 비주얼 렌더링 코드                               */
/* -------------------------------------------------------------------------- */
const app = document.getElementById('app');

renderMainVisualSlider();

/* -------------------------------------------------------------------------- */
/*                               콘텐츠 슬라이더 렌더링 코드                              */
/* -------------------------------------------------------------------------- */

// 꼭 봐야하는 콘텐츠
renderMustContentSlider();
// const vodContent = renderMustContentSlider();

// quickVOD
renderQuickVodContentSlider();

// 인기 프로그램
renderPopularContentSlider();

// live 채널
renderLiveContentSlider();

// 독점 콘텐츠
renderOnlyContentSlider();

/* -------------------------------------------------------------------------- */
/*                                광고 배너 렌더링 코드                                */
/* -------------------------------------------------------------------------- */
renderAdBanner();

/* -------------------------------------------------------------------------- */
/*                               이벤트 슬라이더 렌더링 코드                              */
/* -------------------------------------------------------------------------- */
renderEventSlider();

/* -------------------------------------------------------------------------- */
/*                                  푸터 렌더링 코드                                 */
/* -------------------------------------------------------------------------- */
renderFooter();
footerScript();
