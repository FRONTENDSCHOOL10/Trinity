import { getNode, getNodes } from 'kind-tiger';
import defaultAuthData from '@/api/defaultAuthData';
import pb from '@/api/pocketbase';

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = getNode('#searchInput');
    const searchSubmitBtn = getNode('#searchSubmitBtn');
    const searchResultList = getNode('.search-result__list');
  
    function handleSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searches = searches.filter((search) => search !== searchTerm);
        searches.unshift(searchTerm);
        if (searches.length > 10) {
          searches.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(searches));
  
        console.log('Searching for:', searchTerm);
  
        const searchResults = [
          {
            thumbnail: '/path/to/thumbnail.jpg',
            name: '컨텐츠 이름',
            link: '#'
          }
        ];
  
        searchResultList.innerHTML = searchResults.map(result => `
        <h1>검색 결과</h1>
          <li class="search-result__item">
            <a href="${result.link}">
              <img src="/public/image/landing/image1.png" alt="컨텐츠 썸네일" class="search-result__thumbnail"/>
              <span class="search-result__name">${result.name}</span>
            </a>
          </li>
        `).join('');
      }
    }
  
    searchSubmitBtn.addEventListener('click', handleSearch);
  
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });
  });
  