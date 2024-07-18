import { getNode, insertAfter } from 'kind-tiger';
import pb from '@/api/pocketbase';
import getPbImageURL from '@/api/getPbImageURL';

import { renderHeader } from '@/layout/header/header';
import renderSearchModal from '@/components/searchModal/searchModal';
import renderProfileMenu from '@/components/profileMenu/profileMenu';
import { renderFooter, footerScript } from '@/layout/footer/footer';

/* -------------------------------------------------------------------------- */
/*                                    헤더 코드                                */
/* -------------------------------------------------------------------------- */
renderHeader();
renderSearchModal();
renderProfileMenu();

/* -------------------------------------------------------------------------- */
/*                                  푸터 렌더링 코드                           */
/* -------------------------------------------------------------------------- */
renderFooter();
footerScript();

/* -------------------------------------------------------------------------- */
/*                                  검색결과창 코드                            */
/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = getNode('#searchInput');
  const searchSubmitBtn = getNode('#searchSubmitBtn');
  const searchInputWrapper = getNode('.search-input-wrapper');

  // URL 쿼리 파라미터에서 검색어 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get('search');

  // 검색어가 있으면 입력 필드에 채워넣기
  if (keyword) {
    searchInput.value = keyword;
    handleSearch(keyword);
  }

  async function handleSearch(searchTerm) {
    if (searchTerm) {
      console.log('Searching for:', searchTerm);

      // Pocketbase에 검색 요청 보내기
      try {
        const response = await pb.collection('allVod').getFullList({
          filter: `contentName ~ "${searchTerm}"`,
        });

        console.log(response);

        const searchResults = response.map((item) => ({
          img: getPbImageURL(item, 'img'),
          contentName: item.contentName,
          imgAlt: item.imgAlt,
        }));

        const searchResultHtml = `
          <div class="search-result">
            <div class="search-result__content">
              <ul class="search-result__list">
                ${searchResults
                  .map(
                    (result) => `
                    <li class="search-result__item">
                      <a href="#">
                        <img src="${result.img}" alt="${result.imgAlt}" class="search-result__thumbnail"/>
                        </a>
                      <span class="search-result__name">${result.contentName}</span>
                    </li>
                  `
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        `;

        if (searchResults.length > 0) {
          insertAfter(searchInputWrapper, searchResultHtml);
        } else {
          // 검색 결과가 없을 때 인기 검색어 가져오기
          const resultList = await pb.collection('allVod').getList(1, 10, {
            sort: '-totalSearchNum, contentName',
          });
          const records = resultList.items;

          const popularSearchItems = records
            .map(
              (record) => `
              <li class="popular-searches-item"><a href="#"># ${record.contentName}</a></li>
              `
            )
            .join('');

          const noResultHtml = `
            <div class="no-result">
              <img src="/public/icon/loadSpinner/loadSpinnerError.svg" alt="검색 결과 없음 에러" />
              <h1>검색 결과가 없습니다.</h1>
              <p class="no-result-text">TAING은 더 많은 정보를 제공하고자 노력했습니다...</p>
              <ul class="popular-result">
                <p class="popular-subtitle">요즘 인기 검색어를 추천해 드릴게요.</p>
                  <ul class="popular-result-inside">
                    ${popularSearchItems}
                  </ul>
              </ul>
            </div>
          `;

          insertAfter(searchInputWrapper, noResultHtml);

          // 인기 검색어 항목에 클릭 이벤트 추가
          const popularItems = document.querySelectorAll('.popular-searches-item a');
          popularItems.forEach((item) => {
            item.addEventListener('click', (event) => {
              event.preventDefault();
              const searchTerm = item.textContent;
              searchInput.value = searchTerm;
            });
          });
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        insertAfter(
          searchInputWrapper,
          `
          <div class="no-result">
            <img src="/public/icon/loadSpinner/loadSpinnerError.svg" alt="검색 결과 없음 에러" />
            <h1>검색 결과를 가져오는 중 오류가 발생했습니다.</h1>
            <p class="no-result-text">잠시 후 다시 시도해 주세요.</p>
          </div>
        `
        );
      }
    }
  }

  function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      window.location.replace(`/src/pages/searchResult/index.html?search=${searchTerm}`);
    }
  }

  searchSubmitBtn.addEventListener('click', performSearch);

  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
});
