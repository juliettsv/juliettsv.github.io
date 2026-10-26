document.querySelectorAll('.panel-toggle').forEach((button)=>{
  button.addEventListener('click',()=>{
    const panel=button.closest('.panel');
    const open=panel.classList.toggle('open');
    button.setAttribute('aria-expanded',String(open));
  });
});

document.querySelectorAll('[data-open]').forEach((button)=>{
  button.addEventListener('click',()=>{
    const panel=document.getElementById(button.dataset.open);
    panel.classList.add('open');
    panel.querySelector('.panel-toggle').setAttribute('aria-expanded','true');
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

function advanceCarousel(button,direction){
  const carousel=button.closest('[data-carousel]');
  const image=carousel?.querySelector('img');
  const raw=carousel?.querySelector('.slides')?.textContent.trim();
  if(!image||!raw)return;
  const slides=raw.split('|');
  const current=Number(carousel.dataset.index||0);
  const index=(current+direction+slides.length)%slides.length;
  carousel.dataset.index=String(index);
  image.src=slides[index];
}

document.querySelectorAll('.carousel .prev,.carousel .next').forEach((button)=>{
  button.onclick=(event)=>{
    event.stopPropagation();
    advanceCarousel(button,button.classList.contains('next')?1:-1);
  };
});

const carouselState=new WeakMap();

const moveCarousel=(carousel,direction)=>{
  const image=carousel.querySelector('img');
  const raw=carousel.querySelector('.slides')?.textContent.trim();
  if(!image||!raw)return;
  const slides=raw.split('|');
  const previous=carouselState.get(carousel)?.index||0;
  const index=(previous+direction+slides.length)%slides.length;
  carouselState.set(carousel,{index,startX:0});
  image.src=slides[index];
};

document.querySelectorAll('[data-carousel]').forEach((carousel)=>{
  const raw=carousel.querySelector('.slides')?.textContent.trim();
  if(!raw)return;
  raw.split('|').forEach((src)=>{const preload=document.createElement('img');preload.src=src});
  carouselState.set(carousel,{index:0,startX:0});
});

document.addEventListener('pointerdown',(event)=>{
  const carousel=event.target.closest('[data-carousel]');
  if(!carousel)return;
  const current=carouselState.get(carousel)||{index:0,startX:0};
  carouselState.set(carousel,{...current,startX:event.clientX});
  carousel.setPointerCapture?.(event.pointerId);
});

document.addEventListener('pointerup',(event)=>{
  const carousel=event.target.closest('[data-carousel]');
  if(!carousel)return;
  const current=carouselState.get(carousel)||{index:0,startX:event.clientX};
  const distance=event.clientX-current.startX;
  if(Math.abs(distance)>42){
    const button=carousel.querySelector(distance<0?'.next':'.prev');
    if(button)advanceCarousel(button,distance<0?1:-1);
  }
});

document.querySelectorAll('.video-carousel').forEach((carousel)=>{
  const video=carousel.querySelector('video');
  const button=carousel.querySelector('.video-toggle');
  if(!video||!button)return;
  video.play().catch(()=>{});
  button.addEventListener('click',()=>{
    if(video.paused){video.play();button.textContent='Ⅱ';button.setAttribute('aria-label','Pause video')}
    else{video.pause();button.textContent='▶';button.setAttribute('aria-label','Play video')}
  });
});

document.querySelectorAll('a[href="#"]').forEach((link)=>link.addEventListener('click',(event)=>event.preventDefault()));
