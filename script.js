(function () {
      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      let W, H, particles = [], mouse = { x: -1000, y: -1000 };

      function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
      resize(); window.addEventListener('resize', resize);
      window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

      class Particle {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W; this.y = Math.random() * H;
          this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
          this.r = Math.random() * 1.5 + 0.5;
          this.alpha = Math.random() * 0.6 + 0.2;
          this.color = Math.random() > 0.5 ? '0,212,255' : '123,47,255';
        }
        update() {
          this.x += this.vx; this.y += this.vy;
          if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < 120; i++) particles.push(new Particle());

      function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - d / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }

          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0,212,255,${0.25 * (1 - d / 160)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(loop);
      }
      loop();
    })();


    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });


    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', scrollY > 60);
    });


    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.add('open');
    });
    document.getElementById('closeMenu').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.remove('open');
    });
    document.querySelectorAll('.mobile-link').forEach(a => {
      a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
    });


    const themeBtn = document.getElementById('themeBtn');
    let dark = true;
    themeBtn.addEventListener('click', () => {
      dark = !dark;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });


    const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');

          e.target.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.dataset.pct + '%';
          });
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));


    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.dataset.pct + '%';
          });
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));


    function handleSubmit(btn) {
      btn.innerHTML = '<span>Sending... <i class="fas fa-spinner fa-spin"></i></span>';
      setTimeout(() => {
        btn.innerHTML = '<span>Message Sent! <i class="fas fa-check"></i></span>';
        btn.style.background = 'linear-gradient(135deg,#00ff88,#00b37a)';
        setTimeout(() => {
          btn.innerHTML = '<span>Send Message &nbsp;<i class="fas fa-paper-plane"></i></span>';
          btn.style.background = '';
        }, 3000);
      }, 1500);
    }


    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let cur = '';
      sections.forEach(s => {
        if (scrollY >= s.offsetTop - 200) cur = s.id;
      });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--neon)' : '';
      });
    });