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

document.querySelectorAll('[data-carousel]').forEach((carousel)=>{
  const image=carousel.querySelector('img');
  const raw=carousel.querySelector('.slides')?.textContent.trim();
  if(!image||!raw)return;
  const slides=raw.split('|');
  let index=0;
  const show=(next)=>{index=(next+slides.length)%slides.length;image.src=slides[index]};
  carousel.querySelector('.prev')?.addEventListener('click',()=>show(index-1));
  carousel.querySelector('.next')?.addEventListener('click',()=>show(index+1));
});

document.querySelectorAll('a[href="#"]').forEach((link)=>link.addEventListener('click',(event)=>event.preventDefault()));
