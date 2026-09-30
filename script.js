const menu=document.querySelector(".menu"),links=document.querySelector(".links");
menu.addEventListener("click",()=>links.classList.toggle("open"));
document.querySelectorAll(".links a[href^='#']").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

const reveals=document.querySelectorAll(".reveal");
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");revealObserver.unobserve(e.target);}});
},{threshold:.12});
reveals.forEach(el=>revealObserver.observe(el));

const sections=[...document.querySelectorAll("main section[id]")];
const navLinks=[...document.querySelectorAll(".links a[href^='#']")];
const navBar=document.querySelector(".nav");

const liquidIndicator=document.createElement('span');
liquidIndicator.className='at-liquid-indicator';
liquidIndicator.setAttribute('aria-hidden','true');
topnav?.appendChild(liquidIndicator);

let indicatorReady=false;
function positionLiquidIndicator(link, instant=false){
  if(!topnav || !link || window.innerWidth<=900){
    liquidIndicator.classList.remove('is-visible');
    topnav?.classList.remove('indicator-ready');
    indicatorReady=false;
    return;
  }

  const navRect=topnav.getBoundingClientRect();
  const linkRect=link.getBoundingClientRect();

  if(instant) liquidIndicator.classList.add('no-motion');

  liquidIndicator.style.setProperty('--indicator-x', `${linkRect.left-navRect.left}px`);
  liquidIndicator.style.setProperty('--indicator-y', `${linkRect.top-navRect.top}px`);
  liquidIndicator.style.width=`${linkRect.width}px`;
  liquidIndicator.style.height=`${linkRect.height}px`;
  liquidIndicator.classList.add('is-visible');

  // Only suppress V18.1's static active background AFTER the moving pill
  // has a valid size/position. If this ever fails, V18.1 remains visible.
  if(linkRect.width>0 && linkRect.height>0){
    topnav.classList.add('indicator-ready');
    indicatorReady=true;
  }

  if(instant){
    requestAnimationFrame(()=>requestAnimationFrame(()=>
      liquidIndicator.classList.remove('no-motion')
    ));
  }
}
function updateActiveNav(){
  let current='home';

  // At the bottom of the page, force the final section active.
  // This fixes Contact never becoming active when the viewport is
  // taller than the remaining Contact/footer content.
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 8;

  if (nearBottom && sections.length) {
    current = sections[sections.length - 1].id;
  } else {
    sections.forEach(s=>{
      if(window.scrollY >= s.offsetTop - 140) current=s.id;
    });
  }

  let activeLink=null;
  nav.forEach(a=>{
    const active=a.getAttribute('href')==='#'+current;
    a.classList.toggle('active',active);
    if(active) activeLink=a;
  });
  positionLiquidIndicator(activeLink);
}

window.addEventListener('scroll',updateActiveNav,{passive:true});
window.addEventListener('resize',()=>{
  updateActiveNav();
  const activeLink=nav.find(a=>a.classList.contains('active'));
  positionLiquidIndicator(activeLink,true);
},{passive:true});
updateActiveNav();
requestAnimationFrame(()=>{
  const activeLink=nav.find(a=>a.classList.contains('active'));
  positionLiquidIndicator(activeLink,true);
});
