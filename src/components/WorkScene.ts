import * as THREE from 'three'

export type SceneProject = {
  slug: string
  title: string
  subtitle: string
  meta: string // e.g. "2026 · Complete"
  tags: string[]
  cover?: string // image path; a typographic card is drawn when absent
  confidential?: boolean
}

const SPACING = 14 // world units between consecutive projects along -z
const CAMERA_BACK = 8.5 // camera distance in front of the current card
const BG = 0x0a0a0a
const PALETTE = [0x568cff, 0x40c8a0, 0xf0b45a, 0xbe78ff, 0x78c8ff, 0xff7878, 0xd2e678, 0xecebe7]

/** Draws `img` into a canvas with rounded corners and returns it as a texture. */
function roundedTexture(img: CanvasImageSource, w: number, h: number, radius: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  g.beginPath()
  g.roundRect(0, 0, w, h, radius)
  g.clip()
  g.fillStyle = '#141414'
  g.fillRect(0, 0, w, h)
  // cover-fit
  const iw = (img as HTMLImageElement).width
  const ih = (img as HTMLImageElement).height
  const s = Math.max(w / iw, h / ih)
  g.drawImage(img, (w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** A typographic card for projects with no imagery of their own. */
function typeCard(p: SceneProject) {
  const w = 1024
  const h = 640
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  g.beginPath()
  g.roundRect(0, 0, w, h, 28)
  g.clip()
  const grad = g.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#1b1b1b')
  grad.addColorStop(1, '#0f0f0f')
  g.fillStyle = grad
  g.fillRect(0, 0, w, h)
  g.strokeStyle = 'rgba(255,255,255,0.10)'
  g.lineWidth = 3
  g.beginPath()
  g.roundRect(1.5, 1.5, w - 3, h - 3, 27)
  g.stroke()

  g.fillStyle = '#8f8e88'
  g.font = '500 26px "JetBrains Mono", monospace'
  g.fillText(p.meta.toUpperCase(), 56, 80)
  if (p.confidential) {
    const label = 'UNDER NDA'
    const tw = g.measureText(label).width
    g.strokeStyle = 'rgba(240,180,90,0.6)'
    g.fillStyle = 'rgba(240,180,90,0.9)'
    g.beginPath()
    g.roundRect(w - 56 - tw - 32, 50, tw + 32, 44, 22)
    g.stroke()
    g.fillText(label, w - 56 - tw - 16, 80)
  }

  // Title, wrapped to at most three lines of italic serif
  g.fillStyle = '#f2f1ed'
  let size = 112
  g.font = `italic 400 ${size}px "Instrument Serif", Georgia, serif`
  const words = p.title.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (g.measureText(test).width > w - 112 && line) {
      lines.push(line)
      line = word
    } else line = test
  }
  lines.push(line)
  if (lines.length > 2) {
    size = 84
    g.font = `italic 400 ${size}px "Instrument Serif", Georgia, serif`
  }
  lines.slice(0, 3).forEach((l, i) => g.fillText(l, 52, 220 + i * size * 0.98))

  g.fillStyle = '#a3a29d'
  g.font = '400 30px Inter, system-ui, sans-serif'
  const sub = p.subtitle.length > 62 ? `${p.subtitle.slice(0, 60)}…` : p.subtitle
  g.fillText(sub, 56, h - 130)

  g.font = '500 22px "JetBrains Mono", monospace'
  let x = 56
  for (const tag of p.tags.slice(0, 4)) {
    const tw = g.measureText(tag).width
    if (x + tw + 28 > w - 56) break
    g.strokeStyle = 'rgba(255,255,255,0.16)'
    g.beginPath()
    g.roundRect(x, h - 92, tw + 28, 40, 8)
    g.stroke()
    g.fillStyle = '#c9c8c3'
    g.fillText(tag, x + 14, h - 64)
    x += tw + 40
  }

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image()
    im.decoding = 'async'
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = url
  })
}

type Card = { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; home: THREE.Vector3; slug: string }

/**
 * The Work fly-through: one large card per project spaced along -z, a scatter
 * of small image tiles and thousands of tiny coloured squares. The camera
 * follows a float "progress" (0 = first project); the current card eases to
 * the centre and brightens.
 */
export class WorkScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120)
  private cards: Card[] = []
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2(9, 9)
  private parallax = new THREE.Vector2()
  private target = 0
  private progress = 0
  private raf = 0
  private running = false
  private disposables: { dispose(): void }[] = []
  private resizeObserver: ResizeObserver
  private hoverSlug: string | null = null
  private cardFactor = 1 // < 1 on portrait screens so a card fits the width

  private canvas: HTMLCanvasElement
  private base: string
  private onPick: (slug: string) => void
  private onHover: (slug: string | null) => void

  constructor(
    canvas: HTMLCanvasElement,
    projects: SceneProject[],
    tiles: string[],
    base: string,
    onPick: (slug: string) => void,
    onHover: (slug: string | null) => void,
  ) {
    this.canvas = canvas
    this.base = base
    this.onPick = onPick
    this.onHover = onHover
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setClearColor(BG, 1)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.scene.fog = new THREE.Fog(BG, 7, 46)

    const depth = (projects.length - 1) * SPACING
    this.addCards(projects)
    this.addTiles(tiles, depth)
    this.addDust(depth)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    this.resize()
    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerleave', this.onPointerLeave)
    canvas.addEventListener('click', this.onClick)
  }

  /** Float project index the camera should travel to. */
  setProgress(p: number) {
    this.target = p
  }

  /** Start or pause the render loop (paused while the section is off-screen). */
  setRunning(on: boolean) {
    if (on === this.running) return
    this.running = on
    if (on) this.raf = requestAnimationFrame(this.tick)
    else cancelAnimationFrame(this.raf)
  }

  dispose() {
    this.setRunning(false)
    this.resizeObserver.disconnect()
    this.canvas.removeEventListener('pointermove', this.onPointerMove)
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave)
    this.canvas.removeEventListener('click', this.onClick)
    this.disposables.forEach((d) => d.dispose())
    this.renderer.dispose()
  }

  // ── construction ──────────────────────────────────────────────────────────

  private addCards(projects: SceneProject[]) {
    projects.forEach((p, i) => {
      const geo = new THREE.PlaneGeometry(1, 1)
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: true })
      const mesh = new THREE.Mesh(geo, mat)
      // Alternate sides so the path weaves; the active card eases to the centre.
      const side = i % 2 === 0 ? -1 : 1
      const home = new THREE.Vector3(side * (2.2 + (i % 3) * 0.6), ((i * 37) % 5) * 0.45 - 0.9, -i * SPACING)
      mesh.position.copy(home)
      mesh.scale.set(4.4, 2.75, 1)
      mesh.userData = { w: 4.4, h: 2.75, k: 1 }
      this.scene.add(mesh)
      this.cards.push({ mesh, home, slug: p.slug })
      this.disposables.push(geo, mat)

      const apply = (tex: THREE.Texture, aspect: number) => {
        mat.map = tex
        mat.needsUpdate = true
        mesh.userData.h = mesh.userData.w / aspect
        this.disposables.push(tex)
      }
      if (p.cover) {
        loadImage(this.base + p.cover)
          .then((im) => {
            const aspect = Math.min(1.8, Math.max(1, im.width / im.height))
            apply(roundedTexture(im, 1024, Math.round(1024 / aspect), 28), aspect)
          })
          .catch(() => apply(typeCard(p), 1.6))
      } else {
        // Wait for the display fonts so the canvas text uses them.
        Promise.all([
          document.fonts.load('italic 112px "Instrument Serif"'),
          document.fonts.load('500 26px "JetBrains Mono"'),
          document.fonts.load('400 30px Inter'),
        ])
          .catch(() => undefined)
          .then(() => apply(typeCard(p), 1.6))
      }
    })
  }

  private addTiles(tiles: string[], depth: number) {
    const rand = mulberry32(7)
    tiles.forEach((url) => {
      loadImage(this.base + url)
        .then((im) => {
          const aspect = im.width / im.height
          const tex = roundedTexture(im, 256, Math.round(256 / aspect), 14)
          this.disposables.push(tex)
          for (let k = 0; k < 3; k++) {
            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, fog: true })
            const geo = new THREE.PlaneGeometry(1, 1 / aspect)
            const m = new THREE.Mesh(geo, mat)
            const s = 0.5 + rand() * 1.1
            m.scale.setScalar(s)
            m.position.copy(scatter(rand, depth, 3.4))
            this.scene.add(m)
            this.disposables.push(mat, geo)
          }
        })
        .catch(() => undefined)
    })
  }

  private addDust(depth: number) {
    const rand = mulberry32(42)
    const count = window.innerWidth < 640 ? 1400 : 2600
    const geo = new THREE.PlaneGeometry(1, 1)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, fog: true })
    const dust = new THREE.InstancedMesh(geo, mat, count)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const col = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const s = 0.03 + Math.pow(rand(), 4) * 0.2
      const pos = scatter(rand, depth, 1.6)
      m.compose(pos, q, new THREE.Vector3(s, s * (0.62 + rand() * 0.2), 1))
      dust.setMatrixAt(i, m)
      // Mostly dim greys, with some of the palette for colour.
      if (rand() < 0.4) col.setHex(PALETTE[(rand() * PALETTE.length) | 0]).multiplyScalar(0.35 + rand() * 0.5)
      else col.setScalar(0.12 + rand() * 0.38)
      dust.setColorAt(i, col)
    }
    this.scene.add(dust)
    this.disposables.push(geo, mat)
  }

  // ── runtime ───────────────────────────────────────────────────────────────

  private resize() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    // Narrow screens: pull back so the 4.4-unit card still fits.
    this.camera.fov = w / h < 0.9 ? 60 : 50
    this.cardFactor = w / h < 0.9 ? Math.min(1, (w / h) * 1.85) : 1
    this.camera.updateProjectionMatrix()
  }

  private tick = (now: number) => {
    const t = now / 1000
    this.progress += (this.target - this.progress) * 0.08
    const active = Math.round(this.progress)

    // Camera glides down the corridor with a little pointer parallax.
    const camZ = -this.progress * SPACING + CAMERA_BACK
    this.camera.position.x += (this.parallax.x * 0.7 - this.camera.position.x) * 0.05
    this.camera.position.y += (this.parallax.y * 0.45 - this.camera.position.y) * 0.05
    this.camera.position.z = camZ
    this.camera.lookAt(this.camera.position.x * 0.4, this.camera.position.y * 0.4, camZ - CAMERA_BACK)

    this.cards.forEach((c, i) => {
      const d = Math.abs(i - this.progress)
      const focus = Math.max(0, 1 - d) // 1 when current, 0 one step away
      // Pull towards the centre as it becomes current.
      const tx = c.home.x * (1 - focus)
      const ty = c.home.y * (1 - focus) + Math.sin(t * 0.6 + i) * 0.06
      c.mesh.position.x += (tx - c.mesh.position.x) * 0.12
      c.mesh.position.y += (ty - c.mesh.position.y) * 0.12
      c.mesh.rotation.y = (c.home.x > 0 ? -1 : 1) * 0.18 * (1 - focus)
      const hovered = this.hoverSlug === c.slug && i === active
      const opacity = c.mesh.material.map ? 0.35 + focus * 0.65 : 0
      c.mesh.material.opacity += (opacity - c.mesh.material.opacity) * 0.15
      const u = c.mesh.userData as { w: number; h: number; k: number }
      u.k += ((hovered ? 1.04 : 1) - u.k) * 0.15
      c.mesh.scale.set(u.w * u.k * this.cardFactor, u.h * u.k * this.cardFactor, 1)
    })

    this.updateHover(active)
    this.renderer.render(this.scene, this.camera)
    if (this.running) this.raf = requestAnimationFrame(this.tick)
  }

  private updateHover(active: number) {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const card = this.cards[active]
    const hit = card ? this.raycaster.intersectObject(card.mesh).length > 0 : false
    const slug = hit ? card.slug : null
    if (slug !== this.hoverSlug) {
      this.hoverSlug = slug
      this.canvas.style.cursor = slug ? 'pointer' : ''
      this.onHover(slug)
    }
  }

  private onPointerMove = (e: PointerEvent) => {
    const r = this.canvas.getBoundingClientRect()
    this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    this.parallax.copy(this.pointer)
  }

  private onPointerLeave = () => {
    this.pointer.set(9, 9)
    this.parallax.set(0, 0)
  }

  private onClick = () => {
    if (this.hoverSlug) this.onPick(this.hoverSlug)
  }
}

/** Random point in the corridor volume, kept out of a central tube of radius `clear`. */
function scatter(rand: () => number, depth: number, clear: number) {
  for (;;) {
    const x = (rand() * 2 - 1) * 15
    const y = (rand() * 2 - 1) * 9
    const z = 6 - rand() * (depth + 26)
    if (Math.hypot(x, y * 1.4) > clear) return new THREE.Vector3(x, y, z)
  }
}

/** Small seeded PRNG so the layout is identical on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
