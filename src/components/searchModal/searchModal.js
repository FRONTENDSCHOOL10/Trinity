import { insertLast, getNode } from 'kind-tiger';
import pb from '@/api/pocketbase';

// 검색 모달 렌더링 함수
async function renderSearchModal() {
  const resultList = await pb.collection('allVod').getList(1, 10, {
    sort: '-totalSearchNum, contentName',
  });
  const records = resultList.items;

  console.log(records);

  const popularSearchItems = records
    .map(
      (record) => `
    <li class="popular-searches-item"><a href="#">${record.contentName}</a></li>
    `
    )
    .join('');

  const searchModalTemplate = `
    <div id="searchModal" class="modal">
        <div class="modal-content">
            <div class="search-input-wrapper">
                <label for="searchInput" class="sr-only">컨텐츠 검색창</label>
                <input type="text" id="searchInput" placeholder="검색" autocomplete="off">
                <button id="searchSubmitBtn" type="submit"></button>
            </div>
            <div class="section-wrapper">
                <section class="search-history">
                <h1 class="search-history-title">최근 검색어</h1>
                <ol class="search-history-list">
                    <li class="search-history-item">검색 내역이 없습니다.</li>
                </ol>
                </section>
                <section class="popular-searches">
                    <h1 class="popular-searches-title">실시간 인기 검색어</h1>
                    <ol class="popular-searches-list">
                        ${popularSearchItems}
                    </ol>
                    <p class="popular-searches-date">2022.12.24 오전 03.04 기준</p>
                </section>
            </div>
        </div>
    </div>
    `;

  insertLast('.header', searchModalTemplate);

  const searchModal = getNode('#searchModal');
  const searchBtn = getNode('.header__aside__button--search');
  const searchInput = getNode('#searchInput');
  const searchSubmitBtn = getNode('#searchSubmitBtn');
  const searchHistoryList = getNode('.search-history-list');
  const popularSearchesDate = getNode('.popular-searches-date');
  const popularSearchesList = getNode('.popular-searches-list');

  // 인기 검색어 날짜 업데이트 함수
  function updatePopularSearchesDate() {
    const now = new Date();
    popularSearchesDate.textContent = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} 기준`;
  }

  // 검색 히스토리 로드 함수
  function loadSearchHistory() {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryList.innerHTML = '';
    if (searches.length === 0) {
      let listItem = document.createElement('li');
      listItem.classList.add('search-history-item');
      listItem.textContent = '검색 내역이 없습니다.';
      searchHistoryList.appendChild(listItem);
    } else {
      searches.forEach((search, index) => {
        let listItem = document.createElement('li');
        listItem.classList.add('search-history-item');

        let link = document.createElement('a');
        link.href = '#';
        link.textContent = search;
        link.onclick = function (event) {
          event.preventDefault();

          // searchInput에 검색어 채우기
          searchInput.value = search;
        };
        listItem.appendChild(link);

        let deleteBtn = document.createElement('button');
        let deleteImg = document.createElement('img');
        deleteImg.src = '/icon/search/iconSearchDelete.svg';
        deleteImg.alt = '지우기';
        deleteBtn.appendChild(deleteImg);
        deleteBtn.onclick = function () {
          deleteSearch(index);
        };
        listItem.appendChild(deleteBtn);

        searchHistoryList.appendChild(listItem);
      });

      let clearAllBtn = document.createElement('button');
      let clearAllImg = document.createElement('img');
      clearAllImg.src = '/icon/search/iconSearchDeleteAll.svg';
      clearAllImg.alt = '모두 지우기';
      clearAllBtn.textContent = '모두 지우기';
      clearAllBtn.classList.add('clearAllBtn');
      clearAllBtn.appendChild(clearAllImg);
      clearAllBtn.onclick = clearAllSearches;
      searchHistoryList.appendChild(clearAllBtn);
    }
  }

  // 검색어 저장 함수
  async function saveSearch(term) {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // 중복 검색어 필터링
    searches = searches.filter((search) => search !== term);

    // 검색어 추가
    searches.unshift(term);
    if (searches.length > 10) {
      searches.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searches));

    // 검색어가 records의 contentName과 일치하는지 확인하고, 일치하면 totalSearchNum을 1 증가
    const record = records.find((record) => record.contentName === term);
    if (record) {
      // 레코드를 다시 가져와서 최신 값을 반영하여 업데이트
      const latestRecord = await pb.collection('allVod').getOne(record.id);
      console.log(`현재 totalSearchNum: ${latestRecord.totalSearchNum}`);
      const updatedData = {
        totalSearchNum: (latestRecord.totalSearchNum || 0) + 1,
      };
      await pb.collection('allVod').update(record.id, updatedData);
      console.log(`업데이트 후 totalSearchNum: ${updatedData.totalSearchNum}`);
    }
  }

  // 특정 검색어 삭제 함수
  function deleteSearch(index) {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searches.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(searches));
    loadSearchHistory();
  }

  // 모든 검색어 삭제 함수
  function clearAllSearches() {
    localStorage.removeItem('searchHistory');
    loadSearchHistory();
  }

  const body = document.querySelector('body');
  const header = document.querySelector('.header');

  // 검색 버튼 클릭 이벤트 핸들러
  searchBtn.onclick = async function () {
    if (searchModal.style.display === 'block') {
      searchModal.style.display = 'none';
      body.classList.remove('stop-scrolling');
      header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)';
      header.style.transition = 'background-color 0.5s ease';
      searchBtn.classList.remove('header__aside__button--search-close');
      searchBtn.classList.add('header__aside__button--search');
    } else {
      searchModal.style.display = 'block';
      body.classList.add('stop-scrolling');

      // records 다시 가져오기
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

      // popular-searches-list 내용 업데이트
      popularSearchesList.innerHTML = popularSearchItems;

      // 인기 검색어 아이템 클릭 이벤트 핸들러 추가
      const popularSearchItemsNodes = popularSearchesList.querySelectorAll('.popular-searches-item a');
      popularSearchItemsNodes.forEach((node) => {
        node.onclick = function (event) {
          event.preventDefault();
          searchInput.value = node.textContent;
        };
      });

      loadSearchHistory();
      updatePopularSearchesDate();
      header.style.background = '#000000';
      header.style.transition = 'none';
      searchBtn.classList.remove('header__aside__button--search');
      searchBtn.classList.add('header__aside__button--search-close');
    }
  };

  // 모달 외부 클릭 이벤트 핸들러
  window.onclick = function (event) {
    if (event.target === searchModal) {
      searchModal.style.display = 'none';
      body.classList.remove('stop-scrolling');
      header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)';
      header.style.transition = 'background-color 0.5s ease';
      searchBtn.classList.remove('header__aside__button--search-close');
      searchBtn.classList.add('header__aside__button--search');
    }
  };

  // ESC 키 눌렀을 때 이벤트 핸들러
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      searchModal.style.display = 'none';
      body.classList.remove('stop-scrolling');
      header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)';
      header.style.transition = 'background-color 0.5s ease';
      searchBtn.classList.remove('header__aside__button--search-close');
      searchBtn.classList.add('header__aside__button--search');
    }
  });

  // 검색 처리 함수
  function handleSearch() {
    let searchTerm = searchInput.value.trim();
    if (searchTerm) {
      saveSearch(searchTerm);
      searchInput.value = '';
      loadSearchHistory();

      // 검색어를 쿼리 파라미터로 전달하여 searchResult 페이지로 이동
      window.location.href = `/src/pages/searchResult/index.html?search=${encodeURIComponent(searchTerm)}`;
    }
  }

  // 검색 버튼 클릭 이벤트
  searchSubmitBtn.onclick = function () {
    handleSearch();
  };

  // 검색 입력창 Enter 키 이벤트
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });

  // 화면 크기 변경 시 placeholder 업데이트 함수
  function updatePlaceholder() {
    if (window.innerWidth >= 768) {
      searchInput.placeholder = 'TV프로그램, 영화 제목 및 출연진으로 검색해보세요';
    } else {
      searchInput.placeholder = '검색';
    }
  }

  updatePlaceholder();

  // 화면 크기 변경 이벤트 핸들러
  window.addEventListener('resize', updatePlaceholder);

  // 초기화 시점에 검색 히스토리와 인기 검색어 날짜 업데이트
  loadSearchHistory();
  updatePopularSearchesDate();
}

export default renderSearchModal;
