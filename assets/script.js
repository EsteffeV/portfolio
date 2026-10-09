/* Esteffe Violet — interactions du site
   Reprend le comportement de la V1 : menu mobile, cartes dépliables,
   filtres du portfolio et filtres des publications. */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { closeNav(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); toggle.focus(); }
    });
  }

  /* ---------- Cartes dépliables ---------- */
  document.querySelectorAll('.expand-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var detail = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (detail) { detail.hidden = expanded; }
    });
  });

  /* ---------- Fabrique de filtres ---------- */
  function setupFilters(opts) {
    var toggleBtn = document.getElementById(opts.toggleId);
    var panel = document.getElementById(opts.panelId);
    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', function () {
        var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    }

    var checks = document.querySelectorAll(opts.checkSelector);
    var cards = document.querySelectorAll(opts.cardSelector);
    var count = document.getElementById(opts.countId);
    var empty = document.getElementById(opts.emptyId);
    var reset = document.getElementById(opts.resetId);
    if (!checks.length || !cards.length) { return; }

    var apply = function () {
      var selected = {};
      checks.forEach(function (chk) {
        if (chk.checked) {
          selected[chk.dataset.group] = selected[chk.dataset.group] || [];
          selected[chk.dataset.group].push(chk.value);
        }
      });
      var visible = 0;
      cards.forEach(function (card) {
        var show = opts.groups.every(function (g) {
          if (!selected[g]) { return true; }
          var values = (card.dataset[g] || '').split(' ');
          return values.some(function (v) { return selected[g].indexOf(v) !== -1; });
        });
        card.style.display = show ? '' : 'none';
        if (show) { visible++; }
      });
      if (count) {
        count.textContent = visible + ' ' + (visible > 1 ? opts.plural : opts.singular);
      }
      if (empty) { empty.hidden = visible !== 0; }
    };

    checks.forEach(function (chk) { chk.addEventListener('change', apply); });
    if (reset) {
      reset.addEventListener('click', function () {
        checks.forEach(function (chk) { chk.checked = false; });
        apply();
      });
    }
  }

  setupFilters({
    toggleId: 'filterToggle', panelId: 'filterPanel',
    checkSelector: '.filter-check', cardSelector: '.project-card[data-secteur]',
    countId: 'resultCount', emptyId: 'noResults', resetId: 'filterReset',
    groups: ['secteur', 'methode'], singular: 'projet', plural: 'projets'
  });

  setupFilters({
    toggleId: 'pubFilterToggle', panelId: 'pubFilterPanel',
    checkSelector: '.pub-filter-check', cardSelector: '.project-card[data-format]',
    countId: 'pubResultCount', emptyId: 'pubNoResults', resetId: 'pubFilterReset',
    groups: ['format'], singular: 'publication', plural: 'publications'
  });

});
