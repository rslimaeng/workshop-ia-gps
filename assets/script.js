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
