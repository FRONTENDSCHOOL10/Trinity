import { insertLast } from 'kind-tiger';

// import '/src/pages/main/main';

import { getNode } from 'kind-tiger';

async function renderSearchModal() {
  const searchModalTemplate = `
    <div id="searchModal" class="modal">
        <div class="modal-content">
            <div class="search-input-wrapper">
                <label for="searchInput" class="sr-only">컨텐츠 검색창</label>
                <input type="text" id="searchInput" placeholder="검색" autocomplte="off">
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
                        <li class="popular-searches-item"><a href="#">재벌집 막내아들</a></li>
                        <li class="popular-searches-item"><a href="#">삼위일체</a></li>
                        <li class="popular-searches-item"><a href="#">트리니티</a></li>
                        <li class="popular-searches-item"><a href="#">삼위일체</a></li>
                        <li class="popular-searches-item"><a href="#">트리니티</a></li>
                        <li class="popular-searches-item"><a href="#">삼위일체</a></li>
                        <li class="popular-searches-item"><a href="#">트리니티</a></li>
                        <li class="popular-searches-item"><a href="#">삼위일체</a></li>
                        <li class="popular-searches-item"><a href="#">트리니티</a></li>
                        <li class="popular-searches-item"><a href="#">삼위일체</a></li>
                    </ol>
                    <p class="popular-searches-date">2022.12.24 오전 03.04 기준</p>
                </section>
            </div>
        </div>
    </div>
    `;

  insertLast('.header', searchModalTemplate);

  // const event = await pb.collection('event').getFullList(); // SDK

  // event.forEach((item) => {
  //   const template = `
  //   `;

  //   insertLast('.header', template);
  // });
}

function searchModal() {
  document.addEventListener('DOMContentLoaded', (event) => {
    const searchModal = getNode('#searchModal');
    const searchBtn = getNode('.header__aside__button--search');
    const searchInput = getNode('#searchInput');
    const searchSubmitBtn = getNode('#searchSubmitBtn');
    const searchHistoryList = getNode('.search-history-list');
    const popularSearchesDate = getNode('.popular-searches-date');

    function updatePopularSearchesDate() {
      const now = new Date();
      popularSearchesDate.textContent = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} 기준`;
    }

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

    function saveSearch(term) {
      let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
      searches.unshift(term);
      if (searches.length > 10) {
        searches.pop();
      }
      localStorage.setItem('searchHistory', JSON.stringify(searches));
    }

    function deleteSearch(index) {
      let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
      searches.splice(index, 1);
      localStorage.setItem('searchHistory', JSON.stringify(searches));
      loadSearchHistory();
    }

    function clearAllSearches() {
      localStorage.removeItem('searchHistory');
      loadSearchHistory();
    }

    const body = document.querySelector('body');
    const header = document.querySelector('.header');

    searchBtn.onclick = function () {
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
        loadSearchHistory();
        updatePopularSearchesDate();
        header.style.background = '#000000';
        header.style.transition = 'none';
        searchBtn.classList.remove('header__aside__button--search');
        searchBtn.classList.add('header__aside__button--search-close');
      }
    };

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

    function handleSearch() {
      let searchTerm = searchInput.value.trim();
      if (searchTerm) {
        saveSearch(searchTerm);
        searchInput.value = '';
        loadSearchHistory();
      }
    }

    searchSubmitBtn.onclick = function () {
      handleSearch();
    };

    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });

    function updatePlaceholder() {
      if (window.innerWidth >= 768) {
        searchInput.placeholder = 'TV프로그램, 영화 제목 및 출연진으로 검색해보세요';
      } else {
        searchInput.placeholder = '검색';
      }
    }

    updatePlaceholder();

    window.addEventListener('resize', updatePlaceholder);
  });
}

export { renderSearchModal, searchModal };
