import { useEffect, useRef } from 'react'

type Props = {
  /** Image to build the portrait from; `fallback` is used if it fails to load. */
  src: string
  fallback: string
  className?: string
}

type Tile = {
  hx: number // home position, css px
  hy: number
  sx: number // scattered start position
  sy: number
  r: number // colour, 0-255
  g: number
  b: number
  a: number // base opacity
  delay: number // s before this tile starts flying home
  phase: number // twinkle phase
  speed: number // twinkle speed
}

// Colours borrowed from the work (sim arena, PCB green, solder, render blues)
// and mixed into the photo so the mosaic reads as "made of projects".
const PALETTE: [number, number, number][] = [
  [86, 140, 255],
  [64, 200, 160],
  [240, 180, 90],
  [190, 120, 255],
  [120, 200, 255],
  [255, 120, 120],
  [210, 230, 120],
]

const ASSEMBLE_S = 1.6

/**
 * A portrait drawn as thousands of small square tiles sampled from an image.
 * Tiles fly in from a scatter on load, twinkle, and drift away from the cursor.
 * Bright pixels become bright tiles; transparent or dark background drops out.
 */
export function PortraitField({ src, fallback, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tiles: Tile[] = []
    let cell = 7
    let width = 0
    let height = 0
    let img: HTMLImageElement | null = null
    let raf = 0
    let start = performance.now()
    let visible = true
    const mouse = { x: -9999, y: -9999 }

    const build = () => {
      if (!img) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Portrait box: most of the hero's height, centred, keeping the image's aspect.
      cell = width < 640 ? 5 : width < 1100 ? 6 : 7
      const boxH = height * (width < 640 ? 0.62 : 0.86)
      const boxW = Math.min(width * 0.94, boxH * (img.width / img.height))
      const realH = boxW * (img.height / img.width)
      const cols = Math.floor(boxW / cell)
      const rows = Math.floor(realH / cell)
      const ox = (width - cols * cell) / 2
      const oy = width < 640 ? height * 0.1 : height * 0.04

      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return
      octx.drawImage(img, 0, 0, cols, rows)
      const data = octx.getImageData(0, 0, cols, rows).data

      tiles = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const alpha = data[i + 3] / 255
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
          // Soft oval falloff so a photo's background fades out at the edges.
          const dx = (x / cols - 0.5) / 0.5
          const dy = (y / rows - 0.45) / 0.6
          const falloff = Math.max(0, 1 - Math.pow(dx * dx + dy * dy, 1.4) * 0.85)
          const weight = alpha * (0.25 + lum * 0.95) * falloff
          if (weight < 0.16 || Math.random() > 0.35 + weight) continue

          const [pr, pg, pb] = PALETTE[(Math.random() * PALETTE.length) | 0]
          const mix = Math.random() < 0.12 ? 0.85 : 0.3 // a few strongly coloured tiles
          const boost = 0.55 + lum * 0.9
          const hx = ox + x * cell
          const hy = oy + y * cell
          const angle = Math.random() * Math.PI * 2
          const dist = 200 + Math.random() * Math.max(width, height) * 0.6
          tiles.push({
            hx,
            hy,
            sx: width / 2 + Math.cos(angle) * dist,
            sy: height / 2 + Math.sin(angle) * dist,
            r: Math.min(255, (r * (1 - mix) + pr * mix) * boost),
            g: Math.min(255, (g * (1 - mix) + pg * mix) * boost),
            b: Math.min(255, (b * (1 - mix) + pb * mix) * boost),
            a: Math.min(1, 0.25 + weight),
            delay: Math.random() * 0.6 + (Math.abs(hy - height / 2) / height) * 0.4,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 2.2,
          })
        }
      }
    }

    const draw = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)
      const size = cell - 1.4
      const repel = 90
      for (const p of tiles) {
        let k = reduced ? 1 : Math.min(1, Math.max(0, (t - p.delay) / ASSEMBLE_S))
        k = 1 - Math.pow(1 - k, 3) // ease out
        let x = p.sx + (p.hx - p.sx) * k
        let y = p.sy + (p.hy - p.sy) * k
        if (!reduced) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < repel * repel) {
            const f = (1 - Math.sqrt(d2) / repel) * 18
            const d = Math.sqrt(d2) || 1
            x += (dx / d) * f
            y += (dy / d) * f
          }
        }
        const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * p.speed + p.phase)
        ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${(p.a * tw * k).toFixed(3)})`
        ctx.fillRect(x, y, size, size)
      }
    }

    const loop = (now: number) => {
      if (visible && !document.hidden) draw(now)
      raf = requestAnimationFrame(loop)
    }

    const load = (url: string, onFail?: () => void) => {
      const im = new Image()
      im.decoding = 'async'
      im.onload = () => {
        img = im
        build()
        start = performance.now()
        if (reduced) draw(start)
        else raf = requestAnimationFrame(loop)
      }
      im.onerror = () => onFail?.()
      im.src = `${import.meta.env.BASE_URL}${url}`
    }
    load(src, () => load(fallback))

    const onResize = () => {
      build()
      if (reduced) draw(performance.now())
    }
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [src, fallback])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
