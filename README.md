# @dk/ui — Mini-window framework

Vanilla-ESM UI kit extracted from *Deployable Knowledge*. Provides:
- Mini-window manager (create, move, resize, minimize, close)
- Splitter (resizable columns)
- Element factory + Field registry
- Simple component system (item list) + event bus
- Theme utilities (CSS variables) and base CSS
- Generic config-driven window renderer

No build step. Import directly as ESM.

```html
<link rel="stylesheet" href="/vendor/dk-ui/src/css/theme.css">
<link rel="stylesheet" href="/vendor/dk-ui/src/css/frame.css">
<script type="module">
  import { registerWindowType, createMiniWindowFromConfig, initWindowDnD, initWindowResize, initSplitter } from '/vendor/dk-ui/src/index.js';
  // register app windows here...
</script>
```

## App wiring
- Register your window renderers with `registerWindowType(type, fn)`
- Call `createMiniWindowFromConfig({ id, window_type, title, col })`
- Enable drag & resize with `initWindowDnD()` and `initWindowResize()`
- Use `Field` and `createItemList` to build forms and lists

MIT-licensed.
