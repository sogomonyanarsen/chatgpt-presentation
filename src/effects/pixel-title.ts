import { clamp } from '../core/dom';

interface Block {
  x: number;
  y: number;
  z: number;
  /** Extra depth that unfolds during the dive, so blocks pass the camera at different moments. */
  dz: number;
  shade: number;
  /** Random start offset for the “assemble” intro. */
  ox: number;
  oy: number;
  delay: number;
}

interface Options {
  text: string;
  font: string;
  /** Element whose (untransformed) layout box the pixel word should occupy. */
  anchor: HTMLElement;
}

/** Offset of `el` relative to `ancestor`, ignoring CSS transforms. */
const offsetWithin = (el: HTMLElement, ancestor: HTMLElement): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  for (
    let node: HTMLElement | null = el;
    node && node !== ancestor;
    node = node.offsetParent as HTMLElement | null
  ) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
};

const FOCAL = 600;
const ASSEMBLE_MS = 1600;

/**
 * Renders text as a cloud of square “pixels” in 3D space.
 * - On load the pixels assemble from noise into the word.
 * - `setProgress(0→1)` moves the camera *through* the word: blocks fly past the viewer.
 * - Pointer movement adds subtle depth parallax.
 */
export class PixelTitle {
  private readonly ctx: CanvasRenderingContext2D;
  private blocks: Block[] = [];
  private cell = 10;
  private width = 0;
  private height = 0;
  private centerX = 0;
  private centerY = 0;
  private progress = 0;
  private assemble = 0;
  private readonly bornAt = performance.now();
  private pointerX = 0;
  private pointerY = 0;
  private rafId = 0;
  private dirty = true;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: Options,
    animated: boolean,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas unsupported');
    this.ctx = ctx;
    this.assemble = animated ? 0 : 1;
    this.layout();
    window.addEventListener('resize', this.layout, { passive: true });
    if (animated) window.addEventListener('pointermove', this.onPointer, { passive: true });
    this.rafId = requestAnimationFrame(this.tick);
  }

  setProgress(value: number): void {
    const next = clamp(value, 0, 1);
    if (next !== this.progress) {
      this.progress = next;
      this.dirty = true;
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.layout);
    window.removeEventListener('pointermove', this.onPointer);
  }

  private readonly onPointer = (e: PointerEvent): void => {
    this.pointerX = e.clientX / window.innerWidth - 0.5;
    this.pointerY = e.clientY / window.innerHeight - 0.5;
    this.dirty = true;
  };

  /** Rasterise the word on an offscreen canvas and sample it into a block grid. */
  private readonly layout = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { anchor } = this.options;
    const container = this.canvas.parentElement ?? document.body;
    const offset = offsetWithin(anchor, container);
    const targetWidth = anchor.offsetWidth;
    this.centerX = offset.x + targetWidth / 2;
    this.centerY = offset.y + anchor.offsetHeight / 2;
    this.cell = clamp(Math.round(targetWidth / 120), 3, 12);

    const off = document.createElement('canvas');
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) return;

    const fontSize = 100;
    octx.font = `${fontSize}px ${this.options.font}`;
    off.width = Math.ceil(octx.measureText(this.options.text).width);
    off.height = Math.ceil(fontSize * 1.1);
    octx.font = `${fontSize}px ${this.options.font}`;
    octx.textBaseline = 'middle';
    octx.fillStyle = '#fff';
    octx.fillText(this.options.text, 0, off.height / 2);

    // One sample per output cell.
    const cols = Math.round(targetWidth / this.cell);
    const step = off.width / cols;
    const rows = Math.round(off.height / step);
    const data = octx.getImageData(0, 0, off.width, off.height).data;

    const blocks: Block[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = Math.floor(c * step + step / 2);
        const py = Math.floor(r * step + step / 2);
        const alpha = data[(py * off.width + px) * 4 + 3] ?? 0;
        if (alpha < 128) continue;
        blocks.push({
          x: (c - cols / 2) * this.cell,
          y: (r - rows / 2) * this.cell,
          // Shallow depth spread keeps the word crisp at rest; it fans out as the camera dives.
          z: Math.random() * 24 - 12,
          dz: Math.random() * 220 - 60,
          shade: 0.72 + Math.random() * 0.28,
          ox: (Math.random() - 0.5) * this.width * 1.4,
          oy: (Math.random() - 0.5) * this.height * 1.4,
          delay: Math.random() * 0.45,
        });
      }
    }
    this.blocks = blocks;
    this.dirty = true;
  };

  private readonly tick = (now: number): void => {
    if (this.assemble < 1) {
      // Time-based (not frame-based) so the intro lasts the same on 60 Hz and 120 Hz screens.
      this.assemble = Math.min(1, (now - this.bornAt) / ASSEMBLE_MS);
      this.dirty = true;
    }
    if (this.dirty) {
      this.draw();
      this.dirty = false;
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  private draw(): void {
    const { ctx, width, height, cell } = this;
    ctx.clearRect(0, 0, width, height);

    // Ease the camera so the dive accelerates into the word.
    const camZ = this.progress ** 2.2 * (FOCAL + 140);
    const cx = this.centerX + this.pointerX * -24;
    const cy = this.centerY + this.pointerY * -16;

    for (const b of this.blocks) {
      const t = clamp((this.assemble - b.delay) / (1 - 0.45), 0, 1);
      const ease = 1 - (1 - t) ** 4;
      const x = b.x + b.ox * (1 - ease);
      const y = b.y + b.oy * (1 - ease);

      const depth = FOCAL + b.z + b.dz * this.progress - camZ;
      if (depth <= 8) continue;
      const scale = FOCAL / depth;
      const size = cell * scale * 0.92;
      const sx = cx + (x + this.pointerX * b.z * 0.6) * scale;
      const sy = cy + (y + this.pointerY * b.z * 0.6) * scale;
      if (sx + size < 0 || sx > width || sy + size < 0 || sy > height) continue;

      const fade = clamp(depth / 160, 0, 1) * ease;
      const v = Math.round(235 * b.shade);
      ctx.fillStyle = `rgb(${v} ${v} ${v} / ${fade})`;
      ctx.fillRect(Math.round(sx), Math.round(sy), Math.ceil(size), Math.ceil(size));
    }
  }
}
