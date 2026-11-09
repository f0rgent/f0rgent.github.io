# glass.js

Liquid glass for HTML canvas in one small file. No WebGL, no shaders, works in Safari.
It is the effect behind the [Snooze](https://f0rgent.github.io/snooze/) lock screen.

Live demo: https://f0rgent.github.io/glass/

```html
<script src="glass.js"></script>
<script>
  const g = createGlass(ctx);              // your visible 2d context
  g.setBackdrop(wallpaperCanvas);          // what sits behind the glass; call again when it changes
  g.glass(g.rect(80, 80, 420, 140, 44), { tint: 0.12 });
  g.glass(g.circle(300, 500, 90), { dark: 0.35 });
  g.glass(g.text('7:00', 600, 700, '800 300px Inter'));
</script>
```

| option | what it does | default |
|---|---|---|
| `thick` | width of the lensing band on the rim | auto |
| `tint` | white wash over the body | 0.1 |
| `mag` | zoom of the blurred body | 1.06 |
| `edgeMag` | zoom of the rim band | 1.32 |
| `caustic` | warm light thrown below the glass | 0.22 |
| `spec` | specular hotspot on or off | true |
| `rim` | rim line width | 2 |
| `dark` | smoked glass, 0 to 1 | 0 |

The prompt to rebuild it in your own stack is on the demo page.

MIT. Made by [@f0rgent](https://x.com/f0rgent).
