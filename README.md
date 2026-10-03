# afhim-clothing

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

# AFHIM Clothing Demo

This presentation build runs without a backend or network API. Demo accounts and inquiry records are bundled in `src/data/demo-data.json`. New and edited inquiries are saved in the current browser's local storage; they do not modify the bundled JSON file or sync between devices.

## Demo Sign-In

Use `jane`, `mark`, or `leah` with password `demo123`.

## Run And Build

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. The compiled site is written to `dist/` and can be served as static files. To preview the production build locally, run `npm run preview`.

To reset local inquiry edits and restore the bundled sample data, clear this site's local storage in the browser.
