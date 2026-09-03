(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('mvMistCanvas');
  if (!canvas || reduce.matches || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const PARTICLE_COUNT = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class MistParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.alpha = Math.random() * 0.45 + 0.1;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.fadeSpeed;
      if (this.alpha <= 0 || this.y < 0) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 211, 159, ${this.alpha})`;
      ctx.shadowColor = 'rgba(200, 163, 94, 0.4)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
  }

  function animateMist() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animateMist);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    particles.push(new MistParticle());
  }
  animateMist();
})();
