import '/src/pages/main/main';

const modal = document.querySelector('.modal-layer');

// Modal Open Button
// const showBtn = document.querySelector('.header__aside__button--profile');
// showBtn.addEventListener('mouseover', () => {
//   modal.style.display = 'block';
// });

// showBtn.addEventListener('mouseout', () => {
//   modal.style.display = 'none';
// });

// Modal Close Button
// const hideBtn = document.querySelector('.modal-hide');
// hideBtn.addEventListener('click', () => {
//   modal.style.display = 'none';
// });

// Modal Focus Trap
// const focusableEls = modal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]');
// const firstFocusableEl = focusableEls[0];
// const lastFocusableEl = focusableEls[focusableEls.length - 1];

// const modalTrapFocus = (event) => {
//   if (event.key === 'Escape') {
//     modal.style.display = 'none';
//   }
//   if (event.key === 'Tab') {
//     if (document.activeElement === lastFocusableEl && !event.shiftKey) {
//       firstFocusableEl.focus();
//       event.preventDefault();
//     } else if (document.activeElement === firstFocusableEl && event.shiftKey) {
//       lastFocusableEl.focus();
//       event.preventDefault();
//     }
//   }
// };

// document.addEventListener('keydown', modalTrapFocus);
