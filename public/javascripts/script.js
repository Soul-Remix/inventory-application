const menu = document.querySelector('.menu');
const hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('show-nav');
});
