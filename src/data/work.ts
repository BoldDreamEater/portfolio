// Imagery for the Work fly-through. Paths are relative to the site root.

/**
 * The cover each project shows as its card in the 3D scene. Projects with no
 * imagery of their own (or under NDA) get a typographic card drawn at runtime
 * from their title and tags, so nothing pretends to be a photo of work that
 * cannot be shown.
 */
export const covers: Record<string, string | undefined> = {
  'luna-ros2-robot': 'projects/luna/luna-render.webp',
  'nanosat-eps': 'projects/eps/battery-charger.webp',
  'eyrc-hola-explorer': 'projects/eyantra/task-3b.webp',
  '8051-stepper': 'projects/8051-setup.webp',
}

/** Small images scattered through the scene around the project cards. */
export const tiles: string[] = [
  ...['2a', '2b', '2c', '3a', '3b'].flatMap((t) => [2, 7, 12].map((s) => `work/sim-${t}-${s}.webp`)),
  'work/t-battery-charger.webp',
  'work/t-escon-v2.5.webp',
  'work/t-payload-v2.webp',
  'work/t-backplane-v3.webp',
  'work/t-solar-panel.webp',
  'work/t-luna-render.webp',
  'work/t-luna-plan.webp',
  'work/t-8051-setup.webp',
  'work/t-8051-motor.webp',
  'work/t-8051-proteus.webp',
]

/**
 * The hero portrait source. Until a photo is added this points at the Luna
 * render, so the particle field still has a subject to form.
 */
export const portrait = 'hero/portrait.webp'
export const portraitFallback = 'projects/luna/luna-render.webp'
