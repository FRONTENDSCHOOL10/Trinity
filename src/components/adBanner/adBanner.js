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
        <picture>
          <source srcset="${getPbImageURL(item, 'img')}" media="(max-width:768px)">
          <source srcset="${getPbImageURL(item, 'img2x')}" media="(max-width:1920px)">
          <img src="${getPbImageURL(item, 'img3x')}" alt="${item.imgAlt}">
        </picture>
      </a>
    `;

    insertLast('.ad-banner', template);
  });
}

export default renderAdBanner;
