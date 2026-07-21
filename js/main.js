(function(){
  "use strict";
  function init(){
    var nav=document.getElementById('nav');
    var links=document.getElementById('navLinks');
    var tog=document.getElementById('navToggle');
    var check=document.getElementById('navCheck');

    if(nav){ window.addEventListener('scroll',function(){ nav.classList.toggle('scrolled', window.scrollY>60); }, {passive:true}); }

    function syncMenu(){
      var open=!!(check&&check.checked);
      document.body.style.overflow=open?'hidden':'';
    }
    if(check){ check.addEventListener('change',syncMenu); }
    function closeMenu(){ if(check){ check.checked=false; syncMenu(); } }
    if(links){ Array.prototype.forEach.call(links.querySelectorAll('a'), function(a){ a.addEventListener('click', closeMenu); }); }
    window.addEventListener('keydown', function(e){ if(e.key==='Escape'||e.keyCode===27) closeMenu(); });

    var yr=document.getElementById('yr'); if(yr){ yr.textContent=new Date().getFullYear(); }

    var reduced=false;
    try{ reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

    // scroll-reveal
    try{
      if('IntersectionObserver' in window && !reduced){
        var sels=['section .wrap.center','.cat-head','.about-copy','.items','.gal-grid .ph','.contact-grid>div','.drink-block','.reserve-box'];
        var els=[];
        sels.forEach(function(s){ Array.prototype.forEach.call(document.querySelectorAll(s), function(el){ els.push(el); }); });
        Array.prototype.forEach.call(document.querySelectorAll('.gal-grid, .drink-cols'), function(grp){
          Array.prototype.forEach.call(grp.children, function(ch,i){ ch.style.transitionDelay=(i*60)+'ms'; });
        });
        els.forEach(function(el){ el.classList.add('reveal'); });
        var io=new IntersectionObserver(function(entries){
          entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
        },{threshold:0.12, rootMargin:'0px 0px -6% 0px'});
        els.forEach(function(el){ io.observe(el); });
      }
    }catch(err){}

    // typewriter on headings + hero tagline
    function typeEl(el){
      if(el.getAttribute('data-typed'))return;
      el.setAttribute('data-typed','1');
      var nodes=[];
      (function walk(n){ Array.prototype.forEach.call(n.childNodes,function(ch){ if(ch.nodeType===3)nodes.push(ch); else walk(ch); }); })(el);
      var texts=nodes.map(function(n){return n.nodeValue;});
      var total=texts.join('').length;
      if(!total)return;
      el.style.minHeight=el.getBoundingClientRect().height+'px';
      nodes.forEach(function(n){ n.nodeValue=''; });
      el.classList.add('type-caret');
      var iv=Math.max(14,Math.min(34,Math.round(1100/total)));
      var ni=0,ci=0;
      var t=setInterval(function(){
        if(ni>=nodes.length){ clearInterval(t); el.classList.remove('type-caret'); el.style.minHeight=''; return; }
        ci++; nodes[ni].nodeValue=texts[ni].slice(0,ci);
        if(ci>=texts[ni].length){ ni++; ci=0; }
      }, iv);
    }
    try{
      if('IntersectionObserver' in window && !reduced){
        var targets=document.querySelectorAll('.hero p.lead, h2.section-title, .cat-head h2');
        var tio=new IntersectionObserver(function(entries){
          entries.forEach(function(en){
            if(en.isIntersecting){
              var el=en.target; tio.unobserve(el);
              var delay=el.classList.contains('lead')?550:120;
              setTimeout(function(){ typeEl(el); }, delay);
            }
          });
        },{threshold:0.5});
        Array.prototype.forEach.call(targets,function(el){ tio.observe(el); });
      }
    }catch(err){}
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
