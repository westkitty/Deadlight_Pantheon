"""Compile one standalone, network-free HTML file from the authored source tree."""
from pathlib import Path
import base64
import json

HERE = Path(__file__).resolve().parent
ASSETS = HERE / 'assets'
VENDOR = HERE / 'vendor'
NAMES = ['malach', 'seraphine', 'oryx', 'thaum', 'iona', 'azrath']

def embed_jpeg(path: Path) -> str:
    return 'data:image/jpeg;base64,' + base64.b64encode(path.read_bytes()).decode('ascii')

references = {key: embed_jpeg(ASSETS / f'{key}.jpg') for key in NAMES}
manifest = json.loads((ASSETS / 'echo_manifest.json').read_text(encoding='utf-8'))
assert set(manifest) == set(NAMES)
echoes = {f'{key}-{index}': embed_jpeg(ASSETS / 'echo' / f'{key}-{index}.jpg')
          for key, times in manifest.items() for index, _ in enumerate(times)}
assert len(echoes) == 18, 'Exactly 18 memory stills are required'

parts = ['story.js', 'engine.js', 'world.js', 'realm-identity.js', 'app.js']
js = '\n'.join((HERE / part).read_text(encoding='utf-8') for part in parts)
three = (VENDOR / 'three-0.186.1.iife.min.js').read_text(encoding='utf-8')
legacy_start = js.index('\nclass LegacyGLWorld{')
legacy_end = js.index('\n// The authored Node graph', legacy_start)
js = js[:legacy_start] + js[legacy_end:]
js = js.replace('__EMBED_STILLS__', ','.join(f'{json.dumps(key)}:{json.dumps(val)}' for key, val in references.items()))
js = js.replace('__EMBED_ECHOS__', ','.join(f'{json.dumps(key)}:{json.dumps(val)}' for key, val in echoes.items()))
js = js.replace('__EMBED_ECHO_TIMES__', json.dumps(manifest, separators=(',', ':')))
tpl = (HERE / 'index.template.html').read_text(encoding='utf-8')
html = (tpl.replace('__INTRO_IMAGE__', references['malach'])
           .replace('__EMBED_THREE__', three)
           .replace('__EMBED_JS__', js))
assert '__EMBED_' not in html and '__INTRO_IMAGE__' not in html
assert 'class LegacyGLWorld' not in html
out = HERE.parent / 'index.html'
out.write_text(html, encoding='utf-8')
print(f'Built {out}: {out.stat().st_size:,} bytes, six realm stills and {len(echoes)} witness plates')
