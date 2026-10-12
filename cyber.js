/**
 * Tech-A-Thon Cyber Engine
 * Matrix Rain, Glowing Cursor, Scroll Reveals, Terminal CLI & Lightbox Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initCursorGlow();
  initScrollAnimations();
  initNavbar();
  initInteractiveTerminal();
  initGalleryLightbox();
});

/* 1. MATRIX RAIN EFFECT */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const characters = '0101010101<>{}[]/*+=~^ABCDEF0123456789TECHATHONARSD';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00e5ff';
    ctx.font = `${fontSize}px 'Roboto Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      if (Math.random() > 0.88) {
        ctx.fillStyle = '#00ffaa';
      } else if (Math.random() > 0.96) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.65)';
      }

      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 35);
}

/* 2. DYNAMIC CURSOR GLOW */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* 3. SCROLL REVEAL ANIMATIONS */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* 4. NAVBAR SCROLL & MOBILE TOGGLE */
function initNavbar() {
  const nav = document.querySelector('.cyber-nav');
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.innerHTML = menu.classList.contains('open') ? '&#x2715;' : '&#9776;';
    });
  }
}

/* 5. INTERACTIVE TERMINAL CLI */
function initInteractiveTerminal() {
  const terminalBody = document.querySelector('.terminal-body');
  const cliInput = document.querySelector('.terminal-cli-input');
  if (!terminalBody || !cliInput) return;

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = cliInput.value.trim();
      if (!val) return;

      const pCmd = document.createElement('p');
      pCmd.innerHTML = `<span class="terminal-prompt">guest@techathon:~$</span> ${escapeHtml(val)}`;
      terminalBody.insertBefore(pCmd, cliInput.parentElement);

      handleCommand(val.toLowerCase(), terminalBody, cliInput.parentElement);

      cliInput.value = '';
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  function handleCommand(cmd, container, inputRow) {
    const res = document.createElement('p');
    res.style.marginTop = '4px';
    res.style.marginBottom = '8px';

    if (cmd === 'help') {
      res.style.color = 'var(--primary)';
      res.innerHTML = `Available commands:<br>
      - <span style="color:#fff">events</span> : View society events & workshops<br>
      - <span style="color:#fff">about</span> : Learn about Tech-A-Thon vision<br>
      - <span style="color:#fff">team</span> : View faculty and student leadership<br>
      - <span style="color:#fff">gallery</span> : View event photography archive<br>
      - <span style="color:#fff">motto</span> : Print society motto<br>
      - <span style="color:#fff">clear</span> : Clear terminal screen`;
    } else if (cmd === 'events') {
      res.style.color = 'var(--emerald)';
      res.innerHTML = `[+] Redirecting to Events dossier... <a href="events.html" style="color:var(--primary); text-decoration:underline;">Click to open Events</a>`;
    } else if (cmd === 'about') {
      res.style.color = 'var(--emerald)';
      res.innerHTML = `[+] Redirecting to About dossier... <a href="about.html" style="color:var(--primary); text-decoration:underline;">Click to open About</a>`;
    } else if (cmd === 'team') {
      res.style.color = 'var(--emerald)';
      res.innerHTML = `[+] Redirecting to Team roster... <a href="team.html" style="color:var(--primary); text-decoration:underline;">Click to open Team</a>`;
    } else if (cmd === 'gallery') {
      res.style.color = 'var(--emerald)';
      res.innerHTML = `[+] Redirecting to Photo Vault... <a href="gallery.html" style="color:var(--primary); text-decoration:underline;">Click to open Gallery</a>`;
    } else if (cmd === 'motto') {
      res.style.color = '#fff';
      res.innerHTML = `&gt; THINK. BUILD. EVOLVE. (ARSD College Computer Science Society)`;
    } else if (cmd === 'clear') {
      const children = Array.from(container.children);
      children.forEach(child => {
        if (child !== inputRow) container.removeChild(child);
      });
      return;
    } else {
      res.style.color = '#ff5f56';
      res.innerHTML = `bash: command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.`;
    }

    container.insertBefore(res, inputRow);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m];
    });
  }
}

/* 6. LIGHTBOX MODAL FOR GALLERY */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  const modal = document.createElement('div');
  modal.id = 'cyber-lightbox';
  modal.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(3, 7, 18, 0.95);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    padding: 20px;
    cursor: zoom-out;
    backdrop-filter: blur(10px);
  `;
  modal.innerHTML = `
    <div style="position: relative; max-width: 90vw; max-height: 90vh;">
      <img id="lightbox-img" src="" alt="Enlarged" style="max-width: 100%; max-height: 85vh; border-radius: 8px; border: 1px solid var(--primary); box-shadow: 0 0 30px var(--primary-glow); display: block; margin: 0 auto;">
      <p id="lightbox-cap" style="font-family: var(--font-mono); color: var(--emerald); text-align: center; margin-top: 15px; font-size: 0.95rem;"></p>
      <button id="lightbox-close" style="position: absolute; top: -40px; right: 0; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer;">&times;</button>
    </div>
  `;
  document.body.appendChild(modal);

  const imgEl = modal.querySelector('#lightbox-img');
  const capEl = modal.querySelector('#lightbox-cap');
  const closeBtn = modal.querySelector('#lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-overlay h3');
      if (img) {
        imgEl.src = img.src;
        capEl.textContent = cap ? cap.textContent : img.alt || '';
        modal.style.display = 'flex';
      }
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) {
      modal.style.display = 'none';
    }
  });
}
