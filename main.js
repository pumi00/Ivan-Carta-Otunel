/* ─── TAB SWITCHING ─── */
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.page;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    /* Update sub-navigation menus visibility and body background class */
    document.querySelectorAll('.subnav').forEach(s => s.classList.remove('active'));
    const subnav = document.getElementById(`subnav-${target}`);
    if (subnav) {
      subnav.classList.add('active');
      // Reset active link to first section when switching page
      const firstLink = subnav.querySelector('.subnav-link');
      if (firstLink) {
        subnav.querySelectorAll('.subnav-link').forEach(l => l.classList.remove('active'));
        firstLink.classList.add('active');
        subnav.scrollTo({ left: 0 });
      }
    }

    if (target === 'carta') {
      document.body.classList.remove('page-vinos');
      document.body.classList.add('page-carta');
    } else {
      document.body.classList.remove('page-carta');
    }

    if (target === 'vinos') {
      document.body.classList.remove('page-carta');
      document.body.classList.add('page-vinos');
    } else {
      document.body.classList.remove('page-vinos');
    } 

    


    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active', 'entering');
    });

    const page = document.getElementById(target);
    page.classList.add('active');

    /* trigger reflow so the animation fires */
    void page.offsetWidth;
    page.classList.add('entering');

    /* reset scroll position */
    window.scrollTo({ top: 0, behavior: 'smooth' });

    /* re-run observer on newly visible sections */
    revealVisible();
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
      if (!el.classList.contains('visible')) {
        io.observe(el);
      }
    });
  } else {
    /* fallback: show all immediately */
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

/* ─── SCROLLSPY (ACTIVE LINK HIGHLIGHTING) ─── */
let isScrollingFromClick = false;
let scrollTimeout;

function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('section[id]');
  const options = {
    root: null,
    rootMargin: '-160px 0px -30% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    if (isScrollingFromClick) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.subnav-link[href="#${id}"]`);
        
        if (activeLink) {
          const parent = activeLink.closest('.subnav');
          parent.querySelectorAll('.subnav-link').forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
          
          // Center the active tab in the horizontally scrollable bar
          activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));

  // Handle clicking on subnav links with offset scroll and scrollspy bypass
  document.querySelectorAll('.subnav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      isScrollingFromClick = true;
      clearTimeout(scrollTimeout);
      
      const parent = link.closest('.subnav');
      parent.querySelectorAll('.subnav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      
      scrollTimeout = setTimeout(() => {
        isScrollingFromClick = false;
      }, 800);
    });
  });
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  revealVisible();
  staggerItems();
  initScrollSpy();
});