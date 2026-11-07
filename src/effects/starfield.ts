import { clamp } from '../core/dom';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
}

const DEPTH = 1000;
const FOCAL = 320;

/**
 * Fixed full-screen starfield on a 2D canvas.
 * Stars live in 3D space and are projected each frame; scroll velocity pushes the camera forward,
 * turning dots into streaks — the “warp” you feel when diving between chapters.
 */
export class Starfield {
  private readonly ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private speed = 0;
  private targetSpeed = 0;
  private boost = 0;
  private rafId = 0;
  private running = false;
  private paused = false;
  private resizeTimer = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly animated: boolean,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas unsupported');
    this.ctx = ctx;
    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    if (animated) this.start();
    else this.drawFrame();
  }

  /** Feed raw scroll velocity (px/frame). */
  setVelocity(velocity: number): void {
    this.targetSpeed = clamp(Math.abs(velocity) * 0.9, 0, 60);
  }

  /** Extra forward thrust (0–1) for dive transitions, independent of scroll speed. */
  setBoost(amount: number): void {
    this.boost = clamp(amount, 0, 1);
  }

  /**
   * Stop drawing while something opaque covers the whole canvas (e.g. a timeline panel).
   * Saves a full-screen canvas redraw every frame for thousands of pixels of scroll.
   */
  setPaused(paused: boolean): void {
    if (paused === this.paused || !this.animated) return;
    this.paused = paused;
    if (paused) this.stop();
    else if (!document.hidden) this.start();
  }

  private readonly onResize = (): void => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(this.resize, 150);
  };

  private readonly resize = (): void => {
    const previousWidth = this.width;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Mobile URL bars change only the height: keep the existing stars so nothing “pops”.
    if (this.width !== previousWidth || this.stars.length === 0) {
      const count = Math.round(clamp((this.width * this.height) / 2600, 180, 700));
      this.stars = Array.from({ length: count }, () => this.spawn(Math.random() * DEPTH));
    }
    if (!this.running) this.drawFrame();
  };

  private spawn(z: number): Star {
    return {
      x: (Math.random() - 0.5) * this.width * 2.2,
      y: (Math.random() - 0.5) * this.height * 2.2,
      z,
      size: Math.random() < 0.08 ? 2 : 1,
    };
  }

  private readonly onVisibility = (): void => {
    if (!this.animated) return;
    if (document.hidden) this.stop();
    else if (!this.paused) this.start();
  };

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private readonly tick = (): void => {
    this.speed += (this.targetSpeed + this.boost * 40 - this.speed) * 0.08;
    this.targetSpeed *= 0.92;
    this.drawFrame();
    if (this.running) this.rafId = requestAnimationFrame(this.tick);
  };

  private drawFrame(): void {
    const { ctx, width, height } = this;
    const cx = width / 2;
    const cy = height / 2;
    const travel = 0.35 + this.speed;
    const streak = clamp(this.speed / 8, 0, 6);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#e9e9ea';
    ctx.strokeStyle = '#e9e9ea';

    for (const star of this.stars) {
      star.z -= travel;
      if (star.z <= 1) Object.assign(star, this.spawn(DEPTH));

      const scale = FOCAL / star.z;
      const sx = cx + star.x * scale;
      const sy = cy + star.y * scale;
      if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

      const alpha = clamp(1 - star.z / DEPTH, 0.05, 1);
      ctx.globalAlpha = alpha;

      if (streak > 0.4) {
        const prevScale = FOCAL / (star.z + travel * streak);
        ctx.lineWidth = star.size * alpha * 1.4;
        ctx.beginPath();
        ctx.moveTo(cx + star.x * prevScale, cy + star.y * prevScale);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        // Square “pixels” rather than circles — keeps the digital aesthetic.
        const s = Math.max(1, star.size * alpha * 1.6);
        ctx.fillRect(Math.round(sx), Math.round(sy), s, s);
      }
    }
    ctx.globalAlpha = 1;
  }
}
