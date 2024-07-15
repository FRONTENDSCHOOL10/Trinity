import { getNode } from 'kind-tiger';

document.addEventListener('DOMContentLoaded', (event) => {
    const searchModal = getNode("#searchModal");
    const searchBtn = getNode("#searchBtn");
    const searchInput = getNode("#searchInput");
    const searchSubmitBtn = getNode("#searchSubmitBtn");
    const searchHistoryList = getNode(".search-history-list");
    const popularSearchesDate = getNode(".popular-searches-date");

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
                link.onclick = function(event) {
                    event.preventDefault();
                };
                listItem.appendChild(link);
            
                let deleteBtn = document.createElement('button');
                let deleteImg = document.createElement('img');
                deleteImg.src = '/icon/search/iconSearchDelete.svg';
                deleteImg.alt = '지우기';
                deleteBtn.appendChild(deleteImg);
                deleteBtn.onclick = function() {
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

    searchBtn.onclick = function() {
        if (searchModal.style.display === "block") {
            searchModal.style.display = "none";
        } else {
            searchModal.style.display = "block";
            loadSearchHistory();
            updatePopularSearchesDate();
        }
    }

    window.onclick = function(event) {
        if (event.target === searchModal) {
            searchModal.style.display = "none";
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            searchModal.style.display = "none";
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

    searchSubmitBtn.onclick = function() {
        handleSearch();
    }

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    function updatePlaceholder() {
        if (window.innerWidth >= 768) {
            searchInput.placeholder = "TV프로그램, 영화 제목 및 출연진으로 검색해보세요";
        } else {
            searchInput.placeholder = "검색";
        }
    }

    updatePlaceholder();

    window.addEventListener('resize', updatePlaceholder);
});
