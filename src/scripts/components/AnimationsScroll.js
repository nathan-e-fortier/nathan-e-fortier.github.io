import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default class AnimationsScroll {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
    const mm = gsap.matchMedia();

    mm.add({ desktop: '(min-width: 936px)', mobile: '(max-width: 935px)', bouge: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (!context.conditions.bouge) return;
      this.desktop = context.conditions.desktop;

      this.heros();
      this.titres();
      this.cartes();
      this.forces();
      this.textePropose();
      this.imagesEtapes();
      this.entetesEtapes();
      this.videoResultat();
      this.herosFiche();
      this.defis();
      this.navigationFiche();
      this.videoPresentation();
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  heros() {
    const heros = this.element.querySelector('.heros');
    if (!heros) return;

    const photo = heros.querySelector('.heros_photo');
    const cadre = heros.querySelector('.heros_photo-cadre');
    const portrait = cadre.querySelector('img');
    const baguettes = heros.querySelector('.heros_baguettes');
    const ecouteurs = heros.querySelector('.heros_ecouteurs');
    const titre = heros.querySelector('.heros_titre');
    const legende = heros.querySelector('.heros_legende');
    const fleche = heros.querySelector('.heros_fleche-lien');

    gsap.set(portrait, { xPercent: -50, x: 0 });

    // https://gsap.com/docs/v3/GSAP/Timeline/
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: () => this.herosApresIntro(heros) });

    const images = [...heros.querySelectorAll('img')].map((img) => img.decode().catch(() => {}));
    Promise.all(images).then(() => tl.play());

    // https://gsap.com/docs/v3/Eases/
    tl.from(photo, { scale: 0.4, y: 120, autoAlpha: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' })
      .from(portrait, { yPercent: 35, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.8')
      .from(baguettes, { x: -300, y: -150, rotation: '-=160', autoAlpha: 0, duration: 1, ease: 'back.out(1.4)' }, '-=0.6')
      .from(ecouteurs, { x: 300, y: -150, rotation: '+=120', autoAlpha: 0, duration: 1, ease: 'back.out(1.4)' }, '<0.1')
      .from(legende, { y: 20, autoAlpha: 0, duration: 0.5 }, '-=0.9')
      .from(titre, { y: 40, autoAlpha: 0, duration: 0.7 }, '<0.1')
      .from(fleche, { y: -20, autoAlpha: 0, duration: 0.5, ease: 'bounce.out' }, '-=0.2');

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) tl.restart();
    });
  }

  herosApresIntro(heros) {
    if (this.introFinie) return;
    this.introFinie = true;

    const photo = heros.querySelector('.heros_photo');
    const cadre = heros.querySelector('.heros_photo-cadre');
    const baguettes = heros.querySelector('.heros_baguettes');
    const ecouteurs = heros.querySelector('.heros_ecouteurs');
    const imgBaguettes = baguettes.querySelector('img');
    const imgEcouteurs = ecouteurs.querySelector('img');

    // https://gsap.com/docs/v3/GSAP/gsap.quickTo()
    const calques = [
      { el: cadre, force: 12 },
      { el: imgBaguettes, force: 35 },
      { el: imgEcouteurs, force: -30 },
    ].map(({ el, force }) => ({
      force,
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
    }));

    if (!this.desktop) return;

    heros.addEventListener('mousemove', (e) => {
      const rx = e.clientX / window.innerWidth - 0.5;
      const ry = e.clientY / window.innerHeight - 0.5;
      calques.forEach((c) => {
        c.x(rx * c.force);
        c.y(ry * c.force);
      });
    });

    // https://gsap.com/docs/v3/Plugins/ScrollTrigger/ (scrub)
    const sortie = gsap.timeline({
      scrollTrigger: { trigger: heros, start: 'top top', end: 'bottom top', scrub: true },
    });
    sortie
      .to(photo, { scale: 0.75, ease: 'none' })
      .to(baguettes, { xPercent: -40, yPercent: -20, ease: 'none' }, 0)
      .to(ecouteurs, { xPercent: 40, yPercent: -20, ease: 'none' }, 0);
  }

  titres() {
    const titres = [...this.element.querySelectorAll('h2')].filter((titre) => !titre.closest('[data-scrolly]'));

    titres.forEach((titre) => {
      gsap.set(titre, { perspective: 600 });

      // https://gsap.com/docs/v3/Plugins/SplitText/
      SplitText.create(titre, {
        type: 'words, chars',
        autoSplit: true,
        onSplit: (split) =>
          // https://gsap.com/docs/v3/Plugins/ScrollTrigger/
          gsap.from(split.chars, {
            rotationX: -90,
            y: 30,
            autoAlpha: 0,
            transformOrigin: '50% 50% -20px',
            duration: 0.7,
            ease: 'back.out(2)',
            stagger: 0.025,
            scrollTrigger: { trigger: titre, start: 'top 55%', once: true },
          }),
      });
    });
  }

  cartes() {
    const groupes = ['.carte-outil', '.carte-projet'];

    groupes.forEach((selecteur) => {
      const cartes = this.element.querySelectorAll(selecteur);
      if (!cartes.length) return;

      gsap.set(cartes, { autoAlpha: 0, y: 40 });

      // https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch()
      ScrollTrigger.batch(cartes, {
        start: 'top 90%',
        once: true,
        onEnter: (lot) =>
          // https://gsap.com/resources/getting-started/Staggers
          gsap.to(lot, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.12,
            clearProps: 'transform',
          }),
      });
    });
  }

  forces() {
    this.element.querySelectorAll('.carte-force').forEach((carte, i) => {
      const numero = carte.querySelector('.carte-force_numero');
      const valeur = parseInt(numero.textContent, 10);
      const compteur = { n: 0 };
      numero.textContent = '00';

      const tl = gsap.timeline({ scrollTrigger: { trigger: carte, start: 'top 85%', once: true } });

      tl.from(carte, {
        x: (i % 2 ? 1 : -1) * (this.desktop ? 200 : 60),
        rotation: i % 2 ? 6 : -6,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'back.out(1.4)',
        clearProps: 'transform',
      })
        // https://gsap.com/docs/v3/GSAP/UtilityMethods/snap()
        .to(
          compteur,
          {
            n: valeur,
            duration: 0.8,
            ease: 'power1.out',
            snap: { n: 1 },
            onUpdate: () => (numero.textContent = String(compteur.n).padStart(2, '0')),
          },
          '-=0.5'
        );
    });
  }

  textePropose() {
    const texte = this.element.querySelector('.proposition_texte p');
    if (!texte) return;

    // https://gsap.com/docs/v3/Plugins/SplitText/
    SplitText.create(texte, {
      type: 'words',
      aria: 'none',
      autoSplit: true,
      onSplit: (split) =>
        // https://gsap.com/docs/v3/Plugins/ScrollTrigger/ (scrub)
        gsap.from(split.words, {
          opacity: 0.15,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: texte, start: 'top 95%', end: 'bottom 70%', scrub: true },
        }),
    });
  }

  imagesEtapes() {
    this.element.querySelectorAll('.etape_media').forEach((media) => {
      const images = media.querySelectorAll('.etape_agrandir');

      // https://gsap.com/docs/v3/GSAP/gsap.from()
      gsap.from(media, {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: media, start: 'top 85%', once: true },
      });

      // https://gsap.com/docs/v3/Plugins/ScrollTrigger/ (scrub)
      gsap.fromTo(
        images,
        { yPercent: -2.5, scale: 1.05 },
        {
          yPercent: 2.5,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });
  }

  entetesEtapes() {
    this.element.querySelectorAll('.etape_entete').forEach((entete) => {
      const inverse = entete.closest('.etape_inverse');

      // https://gsap.com/docs/v3/GSAP/gsap.from()
      gsap.from(entete, {
        x: (inverse ? -1 : 1) * (this.desktop ? 80 : 30),
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: entete, start: 'top 85%', once: true },
      });
    });
  }

  videoResultat() {
    const video = this.element.querySelector('.fiche-resultat_video');
    if (!video) return;

    // https://gsap.com/docs/v3/Plugins/ScrollTrigger/ (scrub)
    gsap.fromTo(
      video,
      { clipPath: 'inset(8% 10% round 40px)' },
      {
        clipPath: 'inset(0% 0% round 40px)',
        ease: 'none',
        scrollTrigger: { trigger: video, start: 'top 90%', end: 'top 30%', scrub: true },
      }
    );
  }

  herosFiche() {
    const heros = this.element.querySelector('.fiche-heros');
    if (!heros) return;

    const textes = heros.querySelectorAll(
      '.fiche-heros_retour, .fiche-heros_type, .fiche-heros_titre, .fiche-heros_description, .fiche-heros_contexte, .fiche-heros_lien'
    );
    const tuiles = heros.querySelectorAll('.fiche-heros_collage span');
    const etiquettes = heros.querySelectorAll('.fiche-heros_etiquette, .fiche-heros_ia');
    const roles = heros.querySelectorAll('.fiche-heros_roles li');
    const outils = heros.querySelectorAll('.fiche-heros_outils li');
    const tampon = heros.querySelector('.tampon-prix');
    const distance = this.desktop ? 120 : 50;
    const departs = [
      { x: -distance, y: -distance * 0.5 },
      { x: distance, y: -distance * 0.5 },
      { x: 0, y: distance },
    ];

    // https://gsap.com/docs/v3/GSAP/Timeline/
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(textes, { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: 'transform' })
      .from(
        tuiles,
        {
          x: (i) => departs[i].x,
          y: (i) => departs[i].y,
          scale: 0.85,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          clearProps: 'transform',
        },
        0.15
      )
      .from(etiquettes, { y: 15, autoAlpha: 0, duration: 0.5, stagger: 0.05 }, '-=0.5')
      .from(roles, { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.06, clearProps: 'transform' }, '<')
      // https://gsap.com/docs/v3/Eases/
      .from(outils, { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(2.5)', clearProps: 'transform' }, '<0.1');

    if (tampon) {
      tl.from(tampon, { scale: 0, rotation: -200, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.8)', clearProps: 'transform' }, '-=0.4');
    }
  }

  defis() {
    const liste = this.element.querySelector('.fiche-defis_cartes');
    if (!liste) return;

    const cartes = liste.querySelectorAll('.carte-defi');
    const reponses = this.element.querySelector('.fiche-defis_reponses');
    const centre = (el) => {
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2;
    };

    // https://gsap.com/docs/v3/Plugins/ScrollTrigger/
    const tl = gsap.timeline({ scrollTrigger: { trigger: liste, start: 'top 80%', once: true } });

    // https://gsap.com/docs/v3/GSAP/gsap.from()
    tl.from(cartes, {
      x: (i, carte) => centre(liste) - centre(carte),
      y: 120,
      rotation: (i) => (i % 2 ? 14 : -14),
      autoAlpha: 0,
      duration: 0.9,
      ease: 'back.out(1.3)',
      stagger: 0.18,
      clearProps: 'transform',
    });

    if (reponses) {
      tl.from(reponses, { y: 40, autoAlpha: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' }, '-=0.4');
    }
  }

  navigationFiche() {
    const nav = this.element.querySelector('.fiche-navigation');
    if (!nav) return;

    // https://gsap.com/docs/v3/GSAP/gsap.from()
    gsap.from(nav.querySelectorAll('.bouton'), {
      x: (i) => (i ? 1 : -1) * (this.desktop ? 80 : 30),
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      clearProps: 'transform',
      scrollTrigger: { trigger: nav, start: 'top 95%', once: true },
    });
  }

  videoPresentation() {
    const carte = this.element.querySelector('.carte-video');
    if (!carte) return;

    const coins = carte.querySelectorAll('.carte-video_viseur span');
    const baguettes = carte.querySelector('.carte-video_baguettes');
    const ecouteurs = carte.querySelector('.carte-video_ecouteurs');

    // https://gsap.com/docs/v3/Plugins/ScrollTrigger/ (scrub)
    gsap.fromTo(
      carte,
      { scale: 0.92 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: carte, start: 'top 95%', end: 'top 45%', scrub: true },
      }
    );

    // https://gsap.com/docs/v3/GSAP/gsap.from()
    gsap.from(coins, {
      scale: 1.8,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: carte, start: 'top 60%', once: true },
    });

    const parallaxe = { trigger: carte, start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo(baguettes, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: parallaxe });
    gsap.fromTo(ecouteurs, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { ...parallaxe } });
  }
}