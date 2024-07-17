import getPbImageURL from '@/api/getPbImageURL';
import pb from '@/api/pocketbase';
import { insertLast } from 'kind-tiger';

// const app = document.getElementById('app');

async function renderAdBanner() {
  const adBannerTemplate = `
    <section class="ad-banner">
    </section>
  `;

  insertLast(app, adBannerTemplate);

  const adBanner = await pb.collection('adBanner').getFullList(); // SDK

  adBanner.forEach((item) => {
    const template = `
      <a href="/">
        <img src="${getPbImageURL(item, 'img')}" alt="${item.alt}">
      </a>
    `;

    insertLast('.ad-banner', template);
  });
}

export default renderAdBanner;
