import { getNode } from 'kind-tiger';

document.addEventListener('DOMContentLoaded', (event) => {
    let searchModal = getNode("#searchModal");
    let searchBtn = getNode("#searchBtn");

    searchBtn.onclick = function() {
        if (searchModal.style.display === "block") {
            searchModal.style.display = "none";
        } else {
            searchModal.style.display = "block";
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
});
