/* ─── TAB SWITCHING ─── */
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.page;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    /* ── Fondo según página ── */
    document.body.classList.remove('page-carta', 'page-vinos');
    document.body.classList.add(`page-${target}`);

    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active', 'entering');
    });

    const page = document.getElementById(target);
    if (page) {
      page.classList.add('active');
      void page.offsetWidth;
      page.classList.add('entering');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    revealVisible();
    staggerItems();
  });
});

/* ─── SCROLL REVEAL ─── */
function revealVisible() {
  const els = document.querySelectorAll(
    '.page.active [data-section], .page.active .allergen-legend'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    els.forEach(el => {
      if (!el.classList.contains('visible')) io.observe(el);
    });
  } else {
    els.forEach(el => el.classList.add('visible'));
  }
}

/* ─── ITEM ROW STAGGER ─── */
function staggerItems() {
  document.querySelectorAll('.page.active .item').forEach((item, i) => {
    item.style.transitionDelay = `${Math.min(i * 18, 220)}ms`;
  });
}

/* ─── STICKY HERO SHRINK ─── */
const hero = document.querySelector('.hero-inner');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 60 && lastScroll <= 60) {
    hero.style.paddingTop    = '1.2rem';
    hero.style.paddingBottom = '1rem';
    hero.style.transition    = 'padding 0.3s ease';
  } else if (y <= 60 && lastScroll > 60) {
    hero.style.paddingTop    = '2.5rem';
    hero.style.paddingBottom = '1.8rem';
  }
  lastScroll = y;
}, { passive: true });

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  revealVisible();
  staggerItems();
});