document.addEventListener('DOMContentLoaded', () => {
  let shortcutBtns = document.querySelectorAll('.shortcut__btn');
  let shortcutLists = document.querySelectorAll('.shortcut__group');

  function toggleShortcut(index) {
    return function () {
      shortcutLists.forEach((list, i) => {
        if (i === index) {
          list.classList.toggle('is--active');
        } else {
          list.classList.remove('is--active');
        }
      });
    };
  }

  shortcutBtns.forEach((btn, i) => {
    btn.addEventListener('click', toggleShortcut(i));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.shortcut__btn') && !e.target.closest('.shortcut__group')) {
      shortcutLists.forEach((list) => {
        list.classList.remove('is--active');
      });
    }
  });
});
