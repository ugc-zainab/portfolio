// script.js
// Barre de progression
const progress = document.querySelector('.progress span');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.body.scrollHeight - window.innerHeight;
  progress.style.width = `${(s/h)*100}%`;
});

// Menu mobile
const toggle = document.querySelector('.nav__toggle');
const navlist = document.querySelector('#navlist');
if (toggle){
  toggle.addEventListener('click',()=>{
    const open = navlist.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  })
}

// Apparition au scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  })
},{threshold:.15});

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Effet typing (héros)
const typing = document.querySelector('.typing');
if(typing){
  const words = ['contenu percutant','contenu qui convertit','contenu authentique'];
  let i=0;
  setInterval(()=>{
    i=(i+1)%words.length;
    typing.textContent = words[i];
  }, 2200);
}

// Compteurs KPI
function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const isFloat = !Number.isInteger(target);
  const dur = 1600;
  const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now-start)/dur);
    let val = target * p;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
document.querySelectorAll('.num').forEach(el=>{
  const obs = new IntersectionObserver((ents)=>{
    ents.forEach(en=>{
      if(en.isIntersecting){ animateCount(el); obs.unobserve(el); }
    })
  });
  obs.observe(el);
});

// Carousel témoignages
(function(){
  const slides = document.querySelectorAll('.carousel .slide');
  if(!slides.length) return;
  let idx=0; slides[idx].classList.add('active');
  const prev = document.querySelector('.carousel .prev');
  const next = document.querySelector('.carousel .next');
  function show(i){ slides[idx].classList.remove('active'); idx = (i+slides.length)%slides.length; slides[idx].classList.add('active'); }
  prev?.addEventListener('click',()=>show(idx-1));
  next?.addEventListener('click',()=>show(idx+1));
  setInterval(()=>show(idx+1), 5000);
})();

// Modal showreel
const modal = document.querySelector('#reelModal');
const openBtn = document.querySelector('#openReel');
const closeBtn = modal?.querySelector('.modal__close');
openBtn?.addEventListener('click', ()=> modal.showModal());
closeBtn?.addEventListener('click', ()=> modal.close());
modal?.addEventListener('click', (e)=>{ if(e.target === modal) modal.close(); });

// Année pied de page
document.getElementById('year').textContent = new Date().getFullYear();
// Gestion du formulaire avec popup
const form = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche la soumission classique

    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Optionnel : désactiver le bouton pendant l'envoi
    submitBtn.textContent = 'Envoi...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/xjkezlgg', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        // Afficher la popup
        successModal.style.display = 'flex';
        form.reset(); // Réinitialise le formulaire
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
        console.error('Erreur Formspree:', await response.text());
      }
    } catch (error) {
      alert('Impossible d’envoyer le message. Vérifiez votre connexion.');
      console.error('Erreur réseau:', error);
    } finally {
      // Réactiver le bouton
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Fermer la popup
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
  });
}

// Fermer en cliquant en dehors
if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.style.display = 'none';
    }
  });
}