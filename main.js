/* ============================================
   SPARKLE CANVAS ANIMATION
   Luxury floating sparkles — behind all content
   ============================================ */

const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Draw an elegant 4-pointed diamond star (like ✦ but smooth)
// Uses cubic bezier curves for silky pointed tips
function drawDiamondStar(ctx, x, y, outerR, innerR) {
  const points = 4;
  const step = (Math.PI * 2) / points;
  const half = step / 2;

  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const outerAngle = i * step - Math.PI / 2;
    const innerAngle = outerAngle + half;
    const nextOuter = outerAngle + step;

    const ox1 = x + Math.cos(outerAngle) * outerR;
    const oy1 = y + Math.sin(outerAngle) * outerR;
    const ix1 = x + Math.cos(innerAngle) * innerR;
    const iy1 = y + Math.sin(innerAngle) * innerR;

    if (i === 0) ctx.moveTo(ox1, oy1);
    else ctx.lineTo(ox1, oy1);

    // Bezier to inner point — creates concave waist
    const cx1 = x + Math.cos(outerAngle + half * 0.3) * innerR * 0.5;
    const cy1 = y + Math.sin(outerAngle + half * 0.3) * innerR * 0.5;
    const cx2 = x + Math.cos(innerAngle - half * 0.4) * innerR * 0.6;
    const cy2 = y + Math.sin(innerAngle - half * 0.4) * innerR * 0.6;
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ix1, iy1);

    // Bezier to next outer point
    const ox2 = x + Math.cos(nextOuter) * outerR;
    const oy2 = y + Math.sin(nextOuter) * outerR;
    const cx3 = x + Math.cos(innerAngle + half * 0.4) * innerR * 0.6;
    const cy3 = y + Math.sin(innerAngle + half * 0.4) * innerR * 0.6;
    const cx4 = x + Math.cos(nextOuter - half * 0.4) * innerR * 0.6;
    const cy4 = y + Math.sin(nextOuter - half * 0.4) * innerR * 0.6;
    ctx.bezierCurveTo(cx3, cy3, cx4, cy4, ox2, oy2);
  }
  ctx.closePath();
}

class Sparkle {
  constructor(initial = true) {
    this.init(initial);
  }

  init(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial
      ? Math.random() * canvas.height
      : canvas.height + 30;

    // Size: much softer, slightly smaller overall
    this.size = Math.random() * 3 + 0.8;

    // Opacity: very subtle, like soft out-of-focus light
    this.alpha = 0;
    this.maxAlpha = Math.random() * 0.25 + 0.1;
    this.fadeIn = true;
    this.twinkleSpeed = Math.random() * 0.005 + 0.002;
    this.twinkleDir = 1;

    // Drift: very slow, elegant upward float
    this.speedX = (Math.random() - 0.5) * 0.08;
    this.speedY = -(Math.random() * 0.15 + 0.05);

    // Gentle rotation for stars
    this.rotation = Math.random() * Math.PI;
    this.rotSpeed = (Math.random() - 0.5) * 0.005;

    // Champagne/Rose Gold palette
    const hue = Math.random() * 20 + 25; // 25–45 degrees (champagne/gold)
    const sat = Math.floor(Math.random() * 20 + 30); // 30–50%
    const lum = Math.floor(Math.random() * 20 + 65); // 65–85%
    this.hsl = `${hue.toFixed(0)}, ${sat}%, ${lum}%`;

    // Type: mostly soft bokeh dots, occasionally a sharp star
    this.type = Math.random() > 0.85 ? 'star' : 'dot';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;

    if (this.fadeIn) {
      this.alpha += this.twinkleSpeed * 1.5;
      if (this.alpha >= this.maxAlpha) {
        this.alpha = this.maxAlpha;
        this.fadeIn = false;
      }
    } else {
      this.alpha += this.twinkleSpeed * this.twinkleDir;
      if (this.alpha >= this.maxAlpha) this.twinkleDir = -1;
      if (this.alpha <= this.maxAlpha * 0.35) this.twinkleDir = 1;
    }

    if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
      this.init(false);
    }
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'star') {
      const outerR = this.size * 3.5;
      const innerR = this.size * 0.8;

      // Outer soft halo glow
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR * 2.5);
      halo.addColorStop(0, `hsla(${this.hsl}, 0.3)`);
      halo.addColorStop(1, `hsla(${this.hsl}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp diamond star body
      drawDiamondStar(ctx, 0, 0, outerR, innerR);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
      grad.addColorStop(0, `hsla(${this.hsl}, 1)`);
      grad.addColorStop(0.5, `hsla(${this.hsl}, 0.7)`);
      grad.addColorStop(1, `hsla(${this.hsl}, 0.1)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Bright centre dot
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hsl}, 1)`;
      ctx.fill();

    } else {
      // Soft radial glow dot
      const r = this.size * 4;
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      grd.addColorStop(0,   `hsla(${this.hsl}, 0.9)`);
      grd.addColorStop(0.25, `hsla(${this.hsl}, 0.5)`);
      grd.addColorStop(1,   `hsla(${this.hsl}, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// 60 sparkles for an elegant, uncluttered feel
const SPARKLE_COUNT = 60;
const sparkles = Array.from({ length: SPARKLE_COUNT }, () => new Sparkle(true));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparkles.forEach(s => {
    s.update();
    s.draw();
  });
  requestAnimationFrame(animate);
}
animate();


/* ============================================
   SCROLL REVEAL
   ============================================ */

const revealElements = document.querySelectorAll('.reveal-on-scroll');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  root: null,
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


/* ============================================
   SMOOTH SCROLL
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
