document.querySelectorAll('.panel-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('.panel');
    const open = panel.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.dataset.open);
    panel.classList.add('open');
    panel.querySelector('.panel-toggle').setAttribute('aria-expanded', 'true');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const carouselStates = new WeakMap();

function changeCarousel(carousel, direction) {
  const image = carousel.querySelector('img');
  const source = carousel.querySelector('.slides');
  if (!image || !source) return;
  const slides = source.textContent.trim().split('|');
  const state = carouselStates.get(carousel) || { index: 0, startX: 0 };
  state.index = (state.index + direction + slides.length) % slides.length;
  carouselStates.set(carousel, state);
  image.src = slides[state.index];
}

window.inlineSlide = (button, direction) => {
  changeCarousel(button.closest('[data-carousel]'), direction);
};

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const source = carousel.querySelector('.slides');
  if (!source) return;
  source.textContent.trim().split('|').forEach((src) => {
    const preload = document.createElement('img');
    preload.src = src;
  });
  carouselStates.set(carousel, { index: 0, startX: 0 });
  carousel.addEventListener('click', (event) => {
    const control = event.target.closest('.prev,.next');
    if (!control) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    changeCarousel(carousel, control.classList.contains('next') ? 1 : -1);
  }, true);
  carousel.addEventListener('pointerdown', (event) => {
    const state = carouselStates.get(carousel);
    state.startX = event.clientX;
    carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener('pointerup', (event) => {
    const distance = event.clientX - carouselStates.get(carousel).startX;
    if (Math.abs(distance) > 42) changeCarousel(carousel, distance < 0 ? 1 : -1);
  });
});

document.querySelectorAll('.video-carousel').forEach((carousel) => {
  const video = carousel.querySelector('video');
  const button = carousel.querySelector('.video-toggle');
  video.play().catch(() => {});
  button.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      button.textContent = 'Ⅱ';
      button.setAttribute('aria-label', 'Pause video');
    } else {
      video.pause();
      button.textContent = '▶';
      button.setAttribute('aria-label', 'Play video');
    }
  });
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});
