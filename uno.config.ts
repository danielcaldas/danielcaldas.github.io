// uno.config.ts
import { defineConfig, presetMini, presetTypography, transformerDirectives } from 'unocss'

export default defineConfig({
  //@ts-ignore
  injectReset: false,
  mode: 'per-module',
  injectEntry: process.env['NODE_ENV'] === 'development',
  transformers: [transformerDirectives()],
  presets: [
    presetMini(),
    // Typography is styled in src/styles/index.css under `.prose.content`.
    // Only defensive wrapping rules live here.
    presetTypography({
      cssExtend: {
        p: {
          'word-break': 'break-word',
        },
        li: {
          'word-break': 'break-word',
        },
        'blockquote p': {
          'word-break': 'break-word',
        },
        code: {
          'white-space': 'pre-wrap',
          'word-break': 'break-word',
        },
        'code::before': {
          content: 'none',
        },
        'code::after': {
          content: 'none',
        },
      },
    }),
  ],
})
