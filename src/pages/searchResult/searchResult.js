import { getNode, insertAfter } from 'kind-tiger';
import pb from '@/api/pocketbase';
import getPbImageURL from '@/api/getPbImageURL';

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
        // const encodedSearchTerm = encodeURIComponent(searchTerm);
        // console.log(encodedSearchTerm);
        const response = await pb.collection('allVod').getFullList({
          filter: `contentName ~ "${searchTerm}"`,
        });

        console.log(`response:${response}`);

        const searchResults = response.items.map((item) => ({
          img: getPbImageURL(item, 'img'),
          contentName: item.name,
        }));

        const searchResultHtml = `
          <div class="search-result">
            <div class="search-result__content">
              <ul class="search-result__list">
                ${searchResults
                  .map(
                    (result) => `
                    <li class="search-result__item">
                      <a href="${result.link}">
                        <img src="${result.img}" alt="컨텐츠 썸네일" class="search-result__thumbnail"/>
                        <span class="search-result__name">${result.name}</span>
                      </a>
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
              <li class="popular-searches-item"><a href="#">${record.contentName}</a></li>
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
                ${popularSearchItems}
              </ul>
            </div>
          `;

          insertAfter(searchInputWrapper, noResultHtml);
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

  searchSubmitBtn.addEventListener('click', () => handleSearch(searchInput.value.trim()));

  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      handleSearch(searchInput.value.trim());
    }
  });
});
