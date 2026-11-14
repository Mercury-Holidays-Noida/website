/**
 * Mercury Holidays - Luxury Terminal Experience Script
 * "YOU PACK, WE PLAN"
 */

// ==========================================================
// CONFIGURATION: Google Sheets Integration
// Paste your Google Apps Script Web App URL below:
// ==========================================================
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxplSafQ3Cldu4Io0_3Ty9GCKYPUPHmsphrI8K-c8aV-c0If78o-ORNP6tcNPlAcdQtsA/exec";

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initLiveClocks();
  initPassTilt();
  initChimeAudio();
  initSplitFlap();
  initAtmosphericThemes();
  initQuoteReveal();
  initModalListeners();
});

/* ==========================================================
   1. Live Clocks (Noida HQ in IST & FIDS Board)
   ========================================================== */
function initLiveClocks() {
  const noidaClock = document.getElementById('noida-clock');
  const fidsTime = document.getElementById('fids-time');
  const boardingSlot = document.getElementById('live-boarding-slot');
  const currentYear = document.getElementById('current-year');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  function update() {
    const now = new Date();
    
    // Indian Standard Time (IST) is UTC + 5:30
    const istOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const istFormatter = new Intl.DateTimeFormat('en-GB', istOptions);
    const timeString = istFormatter.format(now);

    if (noidaClock) {
      noidaClock.textContent = `${timeString} IST`;
    }

    if (fidsTime) {
      fidsTime.textContent = timeString;
    }

    // Dynamic next boarding window
    if (boardingSlot) {
      const mins = now.getMinutes();
      const roundedMins = (Math.ceil(mins / 15) * 15) % 60;
      const hour = (now.getHours() + (roundedMins === 0 && mins > 45 ? 1 : 0)) % 24;
      const pad = (n) => String(n).padStart(2, '0');
      boardingSlot.textContent = `${pad(hour)}:${pad(roundedMins)} HRS`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================
   2. Web Audio API - Luxury Cabin Chime Synthesizer
   (Offline, pure native math, crystal-clear Boeing 787 / lounge chime)
   ========================================================== */
let audioCtx = null;

function playCabinChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Chime Note 1: High harmonic tone (F5 - 698.46 Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Chime Note 2: Resolving warm tone (C5 - 523.25 Hz)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.35);

    gain2.gain.setValueAtTime(0, now + 0.35);
    gain2.gain.linearRampToValueAtTime(0.28, now + 0.4);
    gain2.gain.exponentialRampToValueAtTime(0.0008, now + 1.8);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.35);
    osc2.stop(now + 1.8);

    showToast("🔔 Cabin chime activated: Welcome aboard Mercury Holidays");
  } catch (e) {
    console.log("AudioContext requires user gesture:", e);
  }
}

function initChimeAudio() {
  const chimeBtn = document.getElementById('chime-btn');
  if (chimeBtn) {
    chimeBtn.addEventListener('click', () => {
      playCabinChime();
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('audio-toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================
   3. Interactive 3D Perspective Tilt on Boarding Pass
   ========================================================== */
function initPassTilt() {
  const cardBox = document.getElementById('pass-tilt-card');
  if (!cardBox) return;

  const card = cardBox.querySelector('.luxury-boarding-pass');
  const glare = cardBox.querySelector('.foil-glare');

  cardBox.addEventListener('mousemove', (e) => {
    const rect = cardBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    if (glare) {
      const glareX = (x / rect.width) * 100;
      glare.style.transform = `translateX(${glareX - 50}%)`;
    }
  });

  cardBox.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  });
}

/* ==========================================================
   4. Ambient Atmospheric Particles & Sky Canvas
   ========================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Stardust & Flight Particles
  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);

  const colors = [
    'rgba(245, 130, 32, 0.45)',  // Mercury Sun Amber
    'rgba(16, 185, 129, 0.45)',  // Emerald Jade
    'rgba(232, 197, 117, 0.55)', // Champagne Gold
    'rgba(255, 255, 255, 0.35)'  // Pristine Starlight
  ];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.1, // gentle upward drift
      alpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
  }

  // Shooting star / Contrail effect
  const shootingStars = [];
  function maybeAddShootingStar() {
    if (Math.random() < 0.015 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 6 + 7,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 0.8,
        decay: 0.018
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render & update ambient floating particles
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      p.alpha += p.alphaSpeed;
      if (p.alpha <= 0.2 || p.alpha >= 0.85) {
        p.alphaSpeed *= -1;
      }

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Render subtle shooting contrails
    maybeAddShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const endX = s.x - Math.cos(s.angle) * s.length;
      const endY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(245, 130, 32, ${s.opacity})`);
      grad.addColorStop(0.5, `rgba(232, 197, 117, ${s.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= s.decay;

      if (s.opacity <= 0) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   5. Split-Flap Destination Animation
   ========================================================== */
function initSplitFlap() {
  const flipper = document.getElementById('dest-flipper');
  if (!flipper) return;

  const targetText = "LAUNCHING SOON";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦•-";
  
  function cycleText() {
    let iteration = 0;
    const interval = setInterval(() => {
      flipper.textContent = targetText
        .split("")
        .map((letter, index) => {
          if (letter === " ") return " ";
          if (index < iteration) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2.5;
    }, 45);
  }

  // Trigger cycle periodically
  setInterval(cycleText, 9000);
}

/* ==========================================================
   6. Atmospheric Theme Palette Switcher
   (Grading inspired by Asian sunrise & emerald horizons)
   ========================================================== */
function initAtmosphericThemes() {
  const buttons = document.querySelectorAll('.palette-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.getAttribute('data-theme');
      document.body.className = '';
      
      if (theme === 'aurora-emerald') {
        document.body.classList.add('theme-atmosphere');
      } else if (theme === 'aurora-vermilion') {
        document.body.classList.add('theme-vermilion');
      } else if (theme === 'aurora-azure') {
        document.body.classList.add('theme-azure');
      } else if (theme === 'aurora-alpine') {
        document.body.classList.add('theme-alpine');
      }

      showToast(`Atmosphere calibrated: ${btn.textContent.trim()}`);
    });
  });
}

/* ==========================================================
   7. Quote Smooth Text Reveal
   ========================================================== */
function initQuoteReveal() {
  const quoteElem = document.getElementById('quote-reveal');
  if (!quoteElem) return;

  // Add subtle pulse on hover
  quoteElem.addEventListener('mouseenter', () => {
    quoteElem.style.textShadow = '0 0 25px rgba(245, 130, 32, 0.4)';
  });
  quoteElem.addEventListener('mouseleave', () => {
    quoteElem.style.textShadow = '';
  });
}

/* ==========================================================
   8. Personalized Boarding Pass Registration & Modal
   ========================================================== */
function handleRegistration(e) {
  e.preventDefault();
  const nameInput = document.getElementById('traveler-name');
  const emailInput = document.getElementById('traveler-email');

  const travelerName = nameInput.value.trim() || 'VALUED TRAVELER';
  const travelerEmail = emailInput ? emailInput.value.trim() : '';

  // Persistent storage in localStorage
  const newPassenger = {
    id: 'MH-' + Math.floor(100000 + Math.random() * 900000),
    name: travelerName,
    email: travelerEmail,
    seat: '1A',
    status: 'Priority Confirmed',
    timestamp: new Date().toISOString(),
    noidaTime: new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(new Date()) + ' IST'
  };

  try {
    const existing = JSON.parse(localStorage.getItem('mercury_holidays_passengers') || '[]');
    existing.push(newPassenger);
    localStorage.setItem('mercury_holidays_passengers', JSON.stringify(existing));
    console.log('✅ Passenger registered & stored in localStorage:', newPassenger);
  } catch (err) {
    console.warn('Could not write to localStorage:', err);
  }

  // Sync to Google Sheets if Webhook URL is configured
  if (typeof GOOGLE_SHEETS_URL !== 'undefined' && GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.trim().startsWith('http')) {
    const formData = new FormData();
    formData.append('id', newPassenger.id);
    formData.append('name', newPassenger.name);
    formData.append('email', newPassenger.email);
    formData.append('seat', newPassenger.seat);
    formData.append('status', newPassenger.status);
    formData.append('noidaTime', newPassenger.noidaTime);
    formData.append('timestamp', newPassenger.timestamp);

    fetch(GOOGLE_SHEETS_URL.trim(), {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      console.log('✈ Data synced with Google Sheet successfully.');
    })
    .catch((err) => {
      console.warn('Google Sheets sync notice:', err);
    });
  }
  
  // Update live card displays
  const passDisplay = document.getElementById('pass-passenger-display');
  const stubDisplay = document.getElementById('stub-passenger-display');
  const modalDisplay = document.getElementById('modal-passenger-name');

  if (passDisplay) passDisplay.textContent = travelerName.toUpperCase();
  if (stubDisplay) stubDisplay.textContent = travelerName.toUpperCase();
  if (modalDisplay) modalDisplay.textContent = travelerName.toUpperCase();

  // Play audio chime
  playCabinChime();

  // Trigger celebration stardust
  triggerConfetti();

  // Open modal
  openPassModal();

  showToast(`Boarding Clearance Issued for ${travelerName}!`);
}

/**
 * Helper to export all registered passenger details as CSV
 */
window.exportPassengerManifest = function() {
  try {
    const records = JSON.parse(localStorage.getItem('mercury_holidays_passengers') || '[]');
    if (!records.length) {
      showToast('No passenger registrations stored yet in this browser.');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Seat', 'Status', 'Registration Time (IST)'];
    const rows = records.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      r.seat,
      r.status,
      `"${r.noidaTime}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mercury_Holidays_Manifest_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${records.length} passenger records to CSV!`);
  } catch (e) {
    console.error('Export error:', e);
  }
};

function openPassModal() {
  const modal = document.getElementById('pass-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

function closePassModal() {
  const modal = document.getElementById('pass-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
  const confetti = document.getElementById('confetti-canvas');
  if (confetti) {
    confetti.remove();
  }
}

function closeModalOnBackdrop(e) {
  if (e.target && e.target.id === 'pass-modal') {
    closePassModal();
  }
}

function initModalListeners() {
  const closeX = document.getElementById('modal-x-close');
  const closeBottom = document.getElementById('modal-bottom-close');
  const modal = document.getElementById('pass-modal');

  ['click', 'touchend'].forEach(evt => {
    if (closeX) {
      closeX.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        closePassModal();
      }, { passive: false });
    }
    if (closeBottom) {
      closeBottom.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        closePassModal();
      }, { passive: false });
    }
    if (modal) {
      modal.addEventListener(evt, (e) => {
        if (e.target === modal) {
          e.preventDefault();
          closePassModal();
        }
      }, { passive: false });
    }
  });
}

// Keyboard ESC listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePassModal();
  }
});

/* ==========================================================
   9. Native Celebration Stardust / Confetti
   ========================================================== */
function triggerConfetti() {
  // Remove any existing confetti canvas
  const oldConfetti = document.getElementById('confetti-canvas');
  if (oldConfetti) oldConfetti.remove();

  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'confetti-canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9990';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#f58220', '#10b981', '#e8c575', '#ffffff', '#ef4444'];

  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 12,
      alpha: 1
    });
  }

  let startTime = Date.now();
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    for (let c of confettiPieces) {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.35; // gravity
      c.rotation += c.rSpeed;
      c.alpha = Math.max(0, 1 - elapsed / 2200);

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.alpha;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      ctx.restore();
    }

    if (elapsed < 2200) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  draw();
}
