# Vendored runtime

`three-0.186.1.iife.min.js` is a browser IIFE bundle produced from the official
`three@0.186.1` npm package's `build/three.module.js` with esbuild 0.25.12. It
exports the official module namespace as the global `THREE` object so the final
standalone `file://` document needs no module loader or network request.

- Upstream: https://github.com/mrdoob/three.js
- Package: `three@0.186.1`
- Source module SHA-256 is pinned by the npm package lock metadata used at vendor time.
- Generated IIFE SHA-256 after whitespace normalization: `e2f97b5c1343ec6432120447ba43c51dc4532eeccc5f71d03e641454bf87ce01`
- License: `THREE-LICENSE.txt`
