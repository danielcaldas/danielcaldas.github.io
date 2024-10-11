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
    presetTypography({
      cssExtend: {
        a: {
          textDecoration: 'none',
          'font-size': '.9em',
          textDecorationThickness: '0.1em',
          textDecorationColor: 'rgb(var(--color-text-link))',
        },
        li: {
          'word-break': 'break-all',
        },
        'li code': {
          'white-space': 'pre-wrap',
          'word-break': 'break-word',
          margin: '0.2rem',
          padding: '0.15em 0.3em',
          'border-radius': '0.2em',
          'background-color': 'var(--color-code-bg)',
        },
        'li code::after': {
          content: 'none',
        },
        'li code::before': {
          content: 'none',
        },
        'a:hover': {
          color: 'rgb(var(--color-text-link-hover))',
        },
        'pre code': {
          margin: '0.2rem',
          padding: '0.15em 0.3em',
          'border-radius': '0.2em',
          'background-color': 'var(--color-code-bg)',
        },
        'p code::after': {
          content: 'none',
        },
        'p code::before': {
          content: 'none',
        },
        'blockquote p': {
          'word-break': 'break-all',
        },
        'blockquote code': {
          'white-space': 'pre-wrap',
          'word-break': 'break-word',
          margin: '0.2rem',
          padding: '0.15em 0.3em',
          'border-radius': '0.2em',
          'background-color': 'var(--color-code-bg)',
        },
        img: {
          display: 'block',
          margin: '0 auto',
        },
        cite: {
          'text-align': 'center',
          with: '100%',
          display: 'block',
          'font-size': '0.8em',
        },
      },
    }),
  ],
})
