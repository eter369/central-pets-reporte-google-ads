/* Central Pets — interacciones del reporte */
(function(){
  'use strict';
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Barra de progreso ---- */
  var bar = document.querySelector('.progress');
  function onScroll(){
    var h = document.documentElement;
    var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if(bar) bar.style.width = (p*100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- Scrollspy ---- */
  var secs = [].slice.call(document.querySelectorAll('section[id]'));
  var links = [].slice.call(document.querySelectorAll('nav a'));
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(a){ a.classList.remove('active'); });
        var a = map[e.target.id];
        if(a){
          a.classList.add('active');
          a.scrollIntoView ? null : null; // avoid scrollIntoView
        }
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  secs.forEach(function(s){ spy.observe(s); });

  /* ---- Reveal al hacer scroll ---- */
  var revs = [].slice.call(document.querySelectorAll('.reveal'));
  if(rm){ revs.forEach(function(el){ el.classList.add('in'); }); }
  else{
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:.08});
    revs.forEach(function(el){ ro.observe(el); });
  }

  /* ---- Contadores animados ---- */
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var prefix = el.getAttribute('data-prefix')||'';
    var suffix = el.getAttribute('data-suffix')||'';
    if(rm){ el.textContent = prefix + target.toFixed(dec) + suffix; return; }
    var dur = 1300, t0 = null;
    function step(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts - t0)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      var val = (target*eased).toFixed(dec);
      el.textContent = prefix + val + suffix;
      if(p<1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  var co = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ animateCount(e.target); co.unobserve(e.target); }
    });
  }, {threshold:.5});
  counters.forEach(function(el){ co.observe(el); });

  /* ---- Barras de presupuesto ---- */
  var fills = [].slice.call(document.querySelectorAll('.fill[data-w]'));
  var fo = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var el = e.target;
        setTimeout(function(){ el.style.width = el.getAttribute('data-w') + '%'; }, 150);
        fo.unobserve(el);
      }
    });
  }, {threshold:.4});
  fills.forEach(function(el){ fo.observe(el); });

})();
