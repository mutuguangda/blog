import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      foreground: 'var(--foreground)',
      'foreground-2': 'var(--foreground-2)',
      background: 'var(--background)',
      primary: 'var(--primary)',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        serif: 'Noto Serif SC:400,600,800',
        mono: 'Monaspace Neon:400,600',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
