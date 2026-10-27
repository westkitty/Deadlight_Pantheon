from pathlib import Path
import base64,json
here=Path(__file__).resolve().parent
refs={k:'data:image/jpeg;base64,'+base64.b64encode((here/'assets'/f'{k}.jpg').read_bytes()).decode('ascii') for k in ['malach','seraphine','oryx','thaum','iona','azrath']}
js='\n'.join((here/s).read_text(encoding='utf-8') for s in ['story.js','engine.js','world.js','app.js'])
js=js.replace('__EMBED_STILLS__',','.join(f'{json.dumps(k)}:{json.dumps(v)}' for k,v in refs.items()))
tpl=(here/'index.template.html').read_text(encoding='utf-8')
html=tpl.replace('__INTRO_IMAGE__',refs['malach']).replace('__EMBED_JS__',js)
out=here.parent/'index.html'
out.write_text(html,encoding='utf-8')
print('Built',out,'bytes:',out.stat().st_size)
