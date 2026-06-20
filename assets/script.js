// assets/script.js — compartilhado por todas as páginas

// ── Scroll Reveal ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Topbar: marcar link ativo ──────────────────────────────────
(function markActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.topbar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.includes(href) && href !== '/' && href !== '../' && href !== '../../') {
      a.classList.add('active');
    }
  });
})();

// ── Copy to clipboard (banco de prompts) ──────────────────────
document.addEventListener('click', function(e) {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const targetId = btn.getAttribute('data-copy');
  const target = document.getElementById(targetId);
  if (!target) return;
  navigator.clipboard.writeText(target.textContent.trim()).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  });
});

// ── Filter prompts (banco de prompts) ─────────────────────────
function initFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      // Toggle active
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Show/hide cards
      document.querySelectorAll('[data-function]').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-function') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
initFilter();

// ── Prompt 18: Voltar ao topo (todos os módulos) ──────────────
(function backToTop() {
  // Cria botão dinamicamente (não precisa alterar HTML de cada módulo)
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Voltar ao topo');
  btn.innerHTML = '↑';
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  var showAt = 600; // px de scroll antes de aparecer
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > showAt) btn.classList.add('visible');
        else btn.classList.remove('visible');
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── Prompt 18: Badge "módulo atual" na topbar ─────────────────
(function topbarCurrent() {
  var path = window.location.pathname;
  var match = path.match(/\/m([1-5])\//);
  if (!match) return;
  var rotulo = 'M' + match[1];
  var inner = document.querySelector('.topbar-inner');
  if (!inner) return;
  var logo = inner.querySelector('.topbar-logo');
  if (!logo) return;
  var badge = document.createElement('span');
  badge.className = 'topbar-current';
  badge.textContent = rotulo;
  logo.insertAdjacentElement('afterend', badge);
})();

// ── Prompt 18: Banco de Prompts — contador dinâmico ───────────
(function bancoContador() {
  var filtros = document.querySelectorAll('[data-filter]');
  if (!filtros.length) return;
  var lista = document.querySelector('.prompts-list');
  if (!lista) return;
  // Cria elemento contador acima do grid
  var contador = document.createElement('p');
  contador.className = 'banco-contador site-container';
  contador.id = 'bancoContador';
  // Insere antes do .prompts-list
  lista.parentNode.insertBefore(contador, lista);

  function atualizar() {
    var cards = document.querySelectorAll('.prompt-card');
    var total = cards.length;
    var visiveis = 0;
    cards.forEach(function(c) {
      if (c.style.display !== 'none') visiveis++;
    });
    if (visiveis === total) {
      contador.innerHTML = 'Mostrando <strong>' + total + '</strong> prompts.';
    } else {
      contador.innerHTML = 'Mostrando <strong>' + visiveis + '</strong> de ' + total + ' prompts.';
    }
  }

  // Liga em cada filtro (depois do initFilter — usa MutationObserver pra reagir a style.display)
  // Mais simples: re-roda após cada clique
  filtros.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Aguarda o initFilter executar primeiro
      setTimeout(atualizar, 0);
    });
  });
  // Estado inicial
  atualizar();
})();

// ── Prompt 18: Entregáveis interativos (5 módulos) ────────────
(function entregaveisInterativos() {
  var lista = document.querySelector('.entregavel-list');
  if (!lista) return;
  var path = window.location.pathname;
  var match = path.match(/\/m([1-5])\//);
  if (!match) return;
  var key = 'gps-workshop-entregavel-m' + match[1];
  var stored = {};
  try { stored = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) {}

  var items = lista.querySelectorAll('li[data-entregavel]');
  var progressoEl = document.querySelector('.entregavel-progress');

  function atualizarProgresso() {
    var total = items.length;
    var marcados = 0;
    items.forEach(function(li) {
      if (li.classList.contains('checked')) marcados++;
    });
    if (progressoEl) {
      if (marcados === 0) {
        progressoEl.innerHTML = 'Marque conforme conclui — seu progresso fica salvo neste navegador.';
      } else if (marcados === total) {
        progressoEl.innerHTML = '✓ <strong>Módulo concluído!</strong> Você marcou todos os ' + total + ' itens.';
      } else {
        progressoEl.innerHTML = '<strong>' + marcados + ' de ' + total + '</strong> itens concluídos.';
      }
    }
  }

  items.forEach(function(li) {
    var id = li.getAttribute('data-entregavel');
    if (stored[id]) li.classList.add('checked');
    li.addEventListener('click', function() {
      li.classList.toggle('checked');
      var current = {};
      items.forEach(function(other) {
        var oid = other.getAttribute('data-entregavel');
        if (other.classList.contains('checked')) current[oid] = true;
      });
      try { localStorage.setItem(key, JSON.stringify(current)); } catch(e) {}
      atualizarProgresso();
    });
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
  });
  atualizarProgresso();
})();

// Accordion — 2 Propósitos (M2)
(function () {
  document.querySelectorAll('.proposito-acc-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.proposito-acc-item').classList.toggle('open');
    });
  });
}());
