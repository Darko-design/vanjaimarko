(function () {
  function icons() {
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.6 } });
      return true;
    }
    return false;
  }
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    if (icons() || tries > 60) clearInterval(iv);
  }, 100);

  // reveal on scroll
  var nodes = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    nodes.forEach(function (n) { io.observe(n); });
    setTimeout(function () { nodes.forEach(function (n) { n.classList.add('in'); }); }, 2600);
  } else {
    nodes.forEach(function (n) { n.classList.add('in'); });
  }

  // hamburger
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-menu]');
  var closeBtn = document.querySelector('[data-burger-close]');
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    document.body.classList.toggle('locked', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // faq
  [].slice.call(document.querySelectorAll('.faq__q')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentNode;
      var open = item.classList.contains('open');
      [].slice.call(document.querySelectorAll('.faq__i')).forEach(function (i) {
        i.classList.remove('open');
        var u = i.querySelector('.faq__q u');
        if (u) u.innerHTML = '<i data-lucide="plus"></i>';
      });
      if (!open) {
        item.classList.add('open');
        var u2 = item.querySelector('.faq__q u');
        if (u2) u2.innerHTML = '<i data-lucide="minus"></i>';
      }
      icons();
    });
  });

  // option pills (single choice per group)
  [].slice.call(document.querySelectorAll('[data-opts]')).forEach(function (group) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('.opt');
      if (!b) return;
      [].slice.call(group.querySelectorAll('.opt')).forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var hidden = group.parentNode.querySelector('input[type="hidden"]');
      if (hidden) hidden.value = b.getAttribute('data-value') || b.textContent.trim();
    });
  });

  // before / after slider
  var cmp = document.querySelector('[data-cmp]');
  if (cmp) {
    var after = cmp.querySelector('.cmp__after');
    var bar = cmp.querySelector('.cmp__bar');
    var knob = cmp.querySelector('.cmp__knob');
    var dragging = false;
    function setPos(clientX) {
      var r = cmp.getBoundingClientRect();
      if (!r.width) return;
      var p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(2, Math.min(98, p));
      after.style.clipPath = 'inset(0 0 0 ' + p + '%)';
      bar.style.left = p + '%';
      knob.style.left = p + '%';
    }
    cmp.addEventListener('pointerdown', function (e) { dragging = true; cmp.setPointerCapture(e.pointerId); setPos(e.clientX); });
    cmp.addEventListener('pointermove', function (e) { if (dragging) setPos(e.clientX); });
    cmp.addEventListener('pointerup', function () { dragging = false; });
    cmp.addEventListener('pointercancel', function () { dragging = false; });

    var names = document.querySelectorAll('[data-name]');
    var metas = document.querySelectorAll('[data-meta]');
    [].slice.call(document.querySelectorAll('.tab')).forEach(function (tab) {
      tab.addEventListener('click', function () {
        [].slice.call(document.querySelectorAll('.tab')).forEach(function (t) { t.classList.remove('on'); });
        tab.classList.add('on');
        var n = tab.getAttribute('data-client');
        var m = tab.getAttribute('data-client-meta') || '';
        [].slice.call(names).forEach(function (el) { el.textContent = n; });
        [].slice.call(metas).forEach(function (el) { el.textContent = m; });
        setPos(cmp.getBoundingClientRect().left + cmp.getBoundingClientRect().width / 2);
      });
    });
  }

  // forms
  [].slice.call(document.querySelectorAll('[data-form]')).forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var done = document.querySelector('[data-done="' + form.getAttribute('data-form') + '"]');
      if (done) {
        form.style.display = 'none';
        done.style.display = 'flex';
        if (window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
      }
      icons();
    });
  });
})();
