const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function () {
      if (prefersReducedMotion) return; // skip the particle field for users who asked for reduced motion

      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      let W, H, particles = [], mouse = { x: -1000, y: -1000 };

      // fewer particles on smaller/lower-powered screens keeps this smooth on mobile
      const particleCount = innerWidth < 768 ? 45 : 120;

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

      for (let i = 0; i < particleCount; i++) particles.push(new Particle());

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


    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      const statusEl = document.getElementById('formStatus');
      const submitBtn = contactForm.querySelector('.form-submit');
      const defaultBtnHTML = submitBtn.innerHTML;

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending... <i class="fas fa-spinner fa-spin"></i></span>';
        statusEl.textContent = '';

        try {
          const ajaxEndpoint = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
          const res = await fetch(ajaxEndpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(contactForm)
          });

          if (res.ok) {
            submitBtn.innerHTML = '<span>Message Sent! <i class="fas fa-check"></i></span>';
            submitBtn.style.background = 'linear-gradient(135deg,var(--neon),var(--neon2))';
            statusEl.textContent = "Thanks — I'll get back to you soon.";
            contactForm.reset();
          } else {
            throw new Error('Request failed');
          }
        } catch (err) {
          submitBtn.innerHTML = '<span>Failed — Try Again <i class="fas fa-exclamation-triangle"></i></span>';
          submitBtn.style.background = 'linear-gradient(135deg,var(--neon2),var(--neon3))';
          statusEl.textContent = 'Something went wrong. Please email me directly instead.';
        }

        setTimeout(() => {
          submitBtn.innerHTML = defaultBtnHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3500);
      });
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


    // LeetCode Dashboard Integration
    const LEETCODE_FALLBACK = {
      solved: 426,
      total: 3991,
      easySolved: 259,
      easyTotal: 954,
      mediumSolved: 163,
      mediumTotal: 2084,
      hardSolved: 4,
      hardTotal: 953,
      attempting: 26,
      contestRating: 1630,
      globalRanking: 175371,
      totalParticipants: 875878,
      rank: 271440,
      completion: "10.67%"
    };

    function updateCircleProgress(percentage) {
      const circle = document.getElementById('circleProgress');
      if (!circle) return;
      const radius = (circle.r && circle.r.baseVal) ? circle.r.baseVal.value : 60;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    function animateLeetCodeDashboard() {
      const easyBar = document.getElementById('ltEasyBar');
      const mediumBar = document.getElementById('ltMediumBar');
      const hardBar = document.getElementById('ltHardBar');
      
      if (easyBar) easyBar.style.width = easyBar.dataset.pct + '%';
      if (mediumBar) mediumBar.style.width = mediumBar.dataset.pct + '%';
      if (hardBar) hardBar.style.width = hardBar.dataset.pct + '%';
      
      const completionEl = document.getElementById('ltCompletion');
      if (completionEl) {
        const completionVal = parseFloat(completionEl.textContent);
        if (!isNaN(completionVal)) {
          updateCircleProgress(completionVal);
        }
      }
    }

    function triggerAnimationIfVisible() {
      const leetcodeSection = document.getElementById('leetcode');
      if (leetcodeSection) {
        const rect = leetcodeSection.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
        if (isVisible) {
          animateLeetCodeDashboard();
        }
      }
    }

    function renderLeetCodeStats(data) {
      const solvedEl = document.getElementById('ltSolved');
      const totalEl = document.getElementById('ltTotal');
      const attemptingEl = document.getElementById('ltAttempting');
      
      const easySolvedEl = document.getElementById('ltEasySolved');
      const easyTotalEl = document.getElementById('ltEasyTotal');
      const easyBar = document.getElementById('ltEasyBar');
      
      const mediumSolvedEl = document.getElementById('ltMediumSolved');
      const mediumTotalEl = document.getElementById('ltMediumTotal');
      const mediumBar = document.getElementById('ltMediumBar');
      
      const hardSolvedEl = document.getElementById('ltHardSolved');
      const hardTotalEl = document.getElementById('ltHardTotal');
      const hardBar = document.getElementById('ltHardBar');
      
      const contestRatingEl = document.getElementById('ltContestRating');
      const globalRankingEl = document.getElementById('ltGlobalRanking');
      const rankEl = document.getElementById('ltRank');
      const completionEl = document.getElementById('ltCompletion');
      
      if (solvedEl) solvedEl.textContent = data.solved;
      if (totalEl) totalEl.textContent = '/' + data.total;
      if (attemptingEl) attemptingEl.textContent = data.attempting;
      
      if (easySolvedEl) easySolvedEl.textContent = data.easySolved;
      if (easyTotalEl) easyTotalEl.textContent = data.easyTotal;
      
      if (mediumSolvedEl) mediumSolvedEl.textContent = data.mediumSolved;
      if (mediumTotalEl) mediumTotalEl.textContent = data.mediumTotal;
      
      if (hardSolvedEl) hardSolvedEl.textContent = data.hardSolved;
      if (hardTotalEl) hardTotalEl.textContent = data.hardTotal;
      
      if (contestRatingEl) {
        contestRatingEl.textContent = data.contestRating ? data.contestRating.toLocaleString() : 'N/A';
      }
      if (globalRankingEl) {
        if (data.globalRanking && data.totalParticipants) {
          globalRankingEl.innerHTML = `${data.globalRanking.toLocaleString()} <span class="metric-slash">/</span> ${data.totalParticipants.toLocaleString()}`;
        } else {
          globalRankingEl.textContent = 'N/A';
        }
      }
      if (rankEl) {
        rankEl.textContent = data.rank ? data.rank.toLocaleString() : 'N/A';
      }
      if (completionEl) {
        completionEl.textContent = data.completion;
      }
      
      const easyPct = ((data.easySolved / data.easyTotal) * 100).toFixed(1);
      const mediumPct = ((data.mediumSolved / data.mediumTotal) * 100).toFixed(1);
      const hardPct = ((data.hardSolved / data.hardTotal) * 100).toFixed(1);
      
      if (easyBar) {
        easyBar.dataset.pct = easyPct;
        easyBar.style.width = '0%';
      }
      if (mediumBar) {
        mediumBar.dataset.pct = mediumPct;
        mediumBar.style.width = '0%';
      }
      if (hardBar) {
        hardBar.dataset.pct = hardPct;
        hardBar.style.width = '0%';
      }
      
      // Reset circle offset
      const circle = document.getElementById('circleProgress');
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDashoffset = circumference;
      }
      
      triggerAnimationIfVisible();
    }

    async function loadLeetCodeDashboard(forceFetch = false) {
      const username = 'Jothiprakash9865';
      const cacheKey = 'leetcode_stats';
      
      if (!forceFetch) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const data = JSON.parse(cached);
            renderLeetCodeStats(data);
            return;
          } catch (e) {
            localStorage.removeItem(cacheKey);
          }
        }
      }
      
      try {
        const [solvedRes, contestRes, profileRes] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`).then(r => r.ok ? r.json() : null),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`).then(r => r.ok ? r.json() : null),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}`).then(r => r.ok ? r.json() : null)
        ]);
        
        if (!solvedRes) throw new Error('Render API returned invalid solved statistics');
        
        const solved = solvedRes.solvedProblem || LEETCODE_FALLBACK.solved;
        const easySolved = solvedRes.easySolved || LEETCODE_FALLBACK.easySolved;
        const mediumSolved = solvedRes.mediumSolved || LEETCODE_FALLBACK.mediumSolved;
        const hardSolved = solvedRes.hardSolved || LEETCODE_FALLBACK.hardSolved;
        
        const attemptAllCount = solvedRes.totalSubmissionNum && solvedRes.totalSubmissionNum[0] ? solvedRes.totalSubmissionNum[0].count : 0;
        const acAllCount = solvedRes.acSubmissionNum && solvedRes.acSubmissionNum[0] ? solvedRes.acSubmissionNum[0].count : 0;
        const attempting = Math.max(0, attemptAllCount - acAllCount) || LEETCODE_FALLBACK.attempting;
        
        const easyTotal = LEETCODE_FALLBACK.easyTotal;
        const mediumTotal = LEETCODE_FALLBACK.mediumTotal;
        const hardTotal = LEETCODE_FALLBACK.hardTotal;
        const total = easyTotal + mediumTotal + hardTotal;
        
        const contestRating = contestRes && contestRes.contestRating ? Math.round(contestRes.contestRating) : LEETCODE_FALLBACK.contestRating;
        const globalRanking = contestRes && contestRes.contestGlobalRanking ? contestRes.contestGlobalRanking : LEETCODE_FALLBACK.globalRanking;
        const totalParticipants = contestRes && contestRes.totalParticipants ? contestRes.totalParticipants : LEETCODE_FALLBACK.totalParticipants;
        
        const rank = profileRes && profileRes.ranking ? profileRes.ranking : LEETCODE_FALLBACK.rank;
        const completion = ((solved / total) * 100).toFixed(2) + '%';
        
        const stats = {
          solved,
          total,
          easySolved,
          easyTotal,
          mediumSolved,
          mediumTotal,
          hardSolved,
          hardTotal,
          attempting,
          contestRating,
          globalRanking,
          totalParticipants,
          rank,
          completion
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(stats));
        renderLeetCodeStats(stats);
      } catch (err) {
        console.warn('API error, using fallback stats:', err);
        renderLeetCodeStats(LEETCODE_FALLBACK);
      }
    }

    // Set up scroll triggers
    const leetcodeSection = document.getElementById('leetcode');
    const leetcodeObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateLeetCodeDashboard();
        }
      });
    }, { threshold: 0.12 });
    
    if (leetcodeSection) leetcodeObserver.observe(leetcodeSection);

    // Initial Load
    loadLeetCodeDashboard();

    // Set up Refresh Button handler
    const refreshBtn = document.getElementById('leetcodeRefresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        if (refreshBtn.classList.contains('spinning')) return;
        
        refreshBtn.classList.add('spinning');
        localStorage.removeItem('leetcode_stats');
        await loadLeetCodeDashboard(true);
        
        setTimeout(() => {
          refreshBtn.classList.remove('spinning');
        }, 800);
      });
    }