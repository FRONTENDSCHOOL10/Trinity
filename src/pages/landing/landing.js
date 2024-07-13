import { setDocumentTitle, setStorage } from 'kind-tiger';
import defaultAuthData from '@/api/defaultAuthData';
import { headerScript } from '@/layout/header/header';
import { renderFooter, footerScript } from '@/layout/footer/footer';

setDocumentTitle('TAING');

// 로그인 정보가 로컬에 없으면 기본 로그인 정보 객체를 로컬 스토리지에 저장
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}

headerScript();

renderFooter();
footerScript();