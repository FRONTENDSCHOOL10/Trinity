import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

async function renderHeader() {
  const headerTemplate = `
    <h1 class="sr-only">TAING</h1>

    <a href="/" class="header__logo"></a>

    <nav class="header__nav">
      <h2 class="sr-only">메인 메뉴</h2>

      <ul class="header__nav__program" role="group">
        <li class="header__nav__program__item header__nav__program__item--live" role="none">
          <a href="/">
            <span class="sr-only">라이브</span>
            <span class="header__nav__program__item--live header__nav__program__item--live__img"></span>
            실시간
          </a>
        </li>
        <li class="header__nav__program__item header__nav__program__item--tv" role="none">
          <a href="/"> TV프로그램 </a>
        </li>
        <li class="header__nav__program__item header__nav__program__item--movie" role="none">
          <a href="/"> 영화 </a>
        </li>
        <li class="header__nav__program__item header__nav__program__item--paramount" role="none">
          <a href="/">
            <span class="sr-only">파라마운트</span>
            <span class="header__nav__program__item--paramount__img"></span>
          </a>
        </li>
      </ul>

      <aside class="header__aside">
        <button type="button" aria-label="검색창 열기" class="header__aside__button header__aside__button--search"></button>
        <button type="button" aria-label="프로필 메뉴 열기" class="header__aside__button header__aside__button--profile"></button>
      </aside>
    </nav>
  `;

  insertLast('.header', headerTemplate);

  // const event = await pb.collection('event').getFullList(); // SDK

  // event.forEach((item) => {
  //   const template = `
  //   `;

  //   insertLast('.header', template);
  // });
}
export default renderHeader;
