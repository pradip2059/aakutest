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

const liquidIndicator=document.createElement("span");
liquidIndicator.className="at-liquid-indicator";
liquidIndicator.setAttribute("aria-hidden","true");
navBar?.appendChild(liquidIndicator);

function positionLiquidIndicator(link, instant=false){
  if(!navBar || !link || window.innerWidth<=900){
    liquidIndicator.classList.remove("visible");
    navBar?.classList.remove("indicator-ready");
    return;
  }

  const navRect=navBar.getBoundingClientRect();
  const linkRect=link.getBoundingClientRect();

  if(instant) liquidIndicator.classList.add("no-motion");

  liquidIndicator.style.setProperty("--at-x",`${linkRect.left-navRect.left}px`);
  liquidIndicator.style.setProperty("--at-y",`${linkRect.top-navRect.top}px`);
  liquidIndicator.style.width=`${linkRect.width}px`;
  liquidIndicator.style.height=`${linkRect.height}px`;
  liquidIndicator.classList.add("visible");

  if(linkRect.width>0 && linkRect.height>0){
    navBar.classList.add("indicator-ready");
  }

  if(instant){
    requestAnimationFrame(()=>requestAnimationFrame(()=>
      liquidIndicator.classList.remove("no-motion")
    ));
  }
}

function updateActiveNav(){
  let current=sections[0]?.id || "home";

  const nearBottom=
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 8;

  if(nearBottom && sections.length){
    current=sections[sections.length-1].id;
  }else{
    sections.forEach(s=>{
      if(window.scrollY>=s.offsetTop-135) current=s.id;
    });
  }

  let activeLink=null;
  navLinks.forEach(a=>{
    const active=a.getAttribute("href")==="#"+current;
    a.classList.toggle("active",active);
    if(active) activeLink=a;
  });

  positionLiquidIndicator(activeLink);
}

window.addEventListener("scroll",updateActiveNav,{passive:true});
window.addEventListener("resize",()=>{
  updateActiveNav();
  positionLiquidIndicator(navLinks.find(a=>a.classList.contains("active")),true);
},{passive:true});

updateActiveNav();
requestAnimationFrame(()=>{
  positionLiquidIndicator(navLinks.find(a=>a.classList.contains("active")),true);
});
