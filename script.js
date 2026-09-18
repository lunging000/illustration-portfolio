const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(card => observer.observe(card));
  reduceMotion.addEventListener('change', event => {
    if (event.matches) document.documentElement.classList.remove('motion-ready');
  });
}
const header = document.querySelector('header');
let scrollPending = false;
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 30);
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) {
    scrollPending = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

const lightbox = document.querySelector('#lightbox');
const preview = lightbox.querySelector('img');
const caption = lightbox.querySelector('.lightbox-caption');
const artworks = [...document.querySelectorAll('.art-button')];
let currentIndex = 0;
let opener;
function showArtwork(index) {
  currentIndex = (index + artworks.length) % artworks.length;
  const button = artworks[currentIndex];
  const img = button.querySelector('img');
  preview.src = img.src;
  preview.alt = img.alt;
  caption.textContent = `${button.closest('figure').querySelector('figcaption').textContent.trim()} · ${currentIndex + 1} / ${artworks.length}`;
}
artworks.forEach((button, index) => {
  button.addEventListener('click', () => {
    opener = button;
    showArtwork(index);
    lightbox.showModal();
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('.lightbox-close').focus();
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showArtwork(currentIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showArtwork(currentIndex + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showArtwork(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  opener?.focus({ preventScroll: true });
});
