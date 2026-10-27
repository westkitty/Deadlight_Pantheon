"""Optional, offline browser smoke checks. Requires Python Playwright + Chromium locally.

Run: python3 tests/smoke.py

No server or network access is required; self-contained HTML is injected directly.
Graphics are inspected structurally because test-host Chromium may not expose WebGL.
"""
from pathlib import Path
import json
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
QA = ROOT / 'qa' / 'current'


def run():
    QA.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        binary = shutil.which('chromium') or shutil.which('google-chrome')
        if not binary:
            mac_chrome = Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
            if mac_chrome.is_file():
                binary = str(mac_chrome)
        options = {'headless': True, 'args': ['--no-sandbox']}
        if binary: options['executable_path'] = binary
        browser = playwright.chromium.launch(**options)
        page = browser.new_page(viewport={'width': 1320, 'height': 820}, accept_downloads=True)
        errors = []
        requests = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda req: requests.append(req.url))
        page.set_content(HTML, wait_until='load')

        assert page.locator('#enter-world').count() == 1
        assert page.locator('#wayfinder').count() == 1
        assert page.evaluate('Object.keys(ECHO_PLATES).length') == 18
        assert page.evaluate('BOOK.length') == 6
        assert page.evaluate('BOOK.reduce((n,b)=>n+b.scenes.length,0)') == 18

        structure = page.evaluate("""() => {
          const results=[];
          for(let index=0;index<6;index++){
            const mock={root:new Node(),gl:{deleteTexture(){}},texCache:new Map()};
            const stage=buildWorld(mock,index);
            let nodes=0, bad=0, textures=0;
            const walk=n=>{nodes++;for(const val of [...n.pos,...n.rot,...n.scale])if(!Number.isFinite(val))bad++;if(n.mat?.texture)textures++;for(const child of n.children)walk(child)};
            walk(stage.root);
            animateStage(stage,1.25,.016);
            walk(stage.root);
            results.push({realm:stage.world,nodes,bad,altars:stage.altars.length,details:stage.realmDetails.length,titan:!!stage.titan});
          }
          return results;
        }""")
        assert all(s['bad'] == 0 and s['altars'] == 3 and s['titan'] and s['nodes'] > 200 for s in structure), structure
        assert len({s['nodes'] for s in structure}) == 6, structure
        print('PASS 3D scene graph:', json.dumps(structure))

        page.locator('#enter-world').click()
        page.wait_for_timeout(800)
        runtime = page.evaluate("""() => ({
          three: typeof THREE === 'undefined' ? null : THREE.REVISION,
          fallback: !!APP.webglUnavailable,
          engine: ENGINE ? ENGINE.stats() : null,
          canvas: {width:view.width,height:view.height,data:view.toDataURL('image/png').length}
        })""")
        if runtime['engine']:
            assert runtime['three'] == '186', runtime
            assert runtime['engine']['renderer'] == 'Three.js r186', runtime
            assert runtime['engine']['calls'] > 0 and runtime['engine']['triangles'] > 0, runtime
            assert runtime['canvas']['width'] > 0 and runtime['canvas']['height'] > 0 and runtime['canvas']['data'] > 1000, runtime
            page.screenshot(path=str(QA / 'three-live-desktop.png'))
            print('PASS live bundled Three.js renderer:', json.dumps(runtime))

            timing = page.evaluate("""() => new Promise(resolve => {
              const samples=[];let last=performance.now();
              const tick=now=>{samples.push(now-last);last=now;if(samples.length<90)requestAnimationFrame(tick);else{
                const sorted=samples.slice(1).sort((a,b)=>a-b),pick=p=>sorted[Math.min(sorted.length-1,Math.floor(sorted.length*p))];
                resolve({samples:sorted.length,mean:+(sorted.reduce((a,b)=>a+b,0)/sorted.length).toFixed(2),p50:+pick(.50).toFixed(2),p95:+pick(.95).toFixed(2),max:+sorted[sorted.length-1].toFixed(2)});
              }};requestAnimationFrame(tick);
            })""")
            assert timing['samples'] == 89, timing
            (QA / 'frame-time.json').write_text(json.dumps(timing, indent=2), encoding='utf-8')
            print('PASS measured software-WebGL frame timing:', json.dumps(timing))

            transitions = []
            for chapter in range(6):
                page.evaluate('(chapter)=>goChapter(chapter)', chapter)
                page.wait_for_timeout(180)
                stats = page.evaluate('ENGINE.stats()')
                assert stats['renderer'] == 'Three.js r186' and stats['calls'] > 0, stats
                assert stats['geometries'] <= 8 and stats['textures'] <= 18, stats
                page.locator('#view').screenshot(path=str(QA / f'realm-{chapter}.png'))
                transitions.append({'chapter':chapter, **stats})
            (QA / 'renderer-transitions.json').write_text(json.dumps(transitions, indent=2), encoding='utf-8')
            print('PASS six live renderer transitions with bounded resources:', json.dumps(transitions))
            page.evaluate('goChapter(0)')
            page.wait_for_timeout(150)
            for label, x, z, yaw in [('front',0,14,0),('side',-6,-20,-.185),('near',0,-30,0)]:
                page.evaluate('(v)=>{PLAYER.x=v.x;PLAYER.z=v.z;PLAYER.camYaw=v.yaw;renderGame(performance.now(),.016)}', {'x':x,'z':z,'yaw':yaw})
                page.wait_for_timeout(80)
                page.locator('#view').screenshot(path=str(QA / f'malach-{label}.png'))
            page.evaluate('goChapter(0)')
            page.wait_for_timeout(120)

            occupancy = []
            for width, height in [(1920,1080),(1440,900),(390,844),(360,800)]:
                page.set_viewport_size({'width':width,'height':height})
                page.wait_for_timeout(120)
                result = page.evaluate('measureOverlayOccupancy()')
                assert result['percent'] < 20, result
                occupancy.append({'viewport':f'{width}x{height}','state':'walking','percent':result['percent']})
                page.evaluate('jumpToNext()')
                page.wait_for_timeout(140)
                result = page.evaluate('measureOverlayOccupancy()')
                assert result['percent'] < 20, result
                occupancy.append({'viewport':f'{width}x{height}','state':'interaction-prompt','percent':result['percent']})
            (QA / 'overlay-occupancy.json').write_text(json.dumps(occupancy, indent=2), encoding='utf-8')
            print('PASS exploration overlay occupancy:', json.dumps(occupancy))
            page.set_viewport_size({'width':1320,'height':820})
            # Preserve live-render evidence, then move into the deterministic visual fallback
            # so the complete narrative matrix remains testable on every browser host.
            page.evaluate("activateFallback('Browser-suite fallback')")
        else:
            print('PARTIAL live renderer unavailable; continuing complete fallback suite:', json.dumps(runtime))

        page.evaluate('openMap()')
        assert page.locator('#sheet').evaluate('(e)=>e.classList.contains("active")')
        assert page.locator('#app').get_attribute('inert') is not None
        page.locator('.map-chapter[data-chapter="0"]').click()
        assert page.locator('#sheet').evaluate('(e)=>!e.classList.contains("active")')

        # Future-scene bypass must remain blocked, including Codex replay buttons.
        page.evaluate('openScene(0,2)')
        assert not page.locator('#sheet').evaluate('(e)=>e.classList.contains("active")')
        assert page.evaluate("!saved.events['0:2']")

        # Complete chapter six out of order; ending MUST remain sealed.
        page.evaluate('goChapter(5)')
        for event in range(3):
            page.locator('#static-next').click()
            assert page.locator('#sheet').evaluate('(e)=>e.classList.contains("active")')
            source = page.locator('.sheet-art').get_attribute('style')
            assert 'data:image/jpeg;base64,' in source
            assert page.locator('.image-source').inner_text().find('ORIGINAL REFERENCE') != -1
            page.locator(f'[data-choice="{[0,1,1][event]}"]').click()
            page.locator('[data-close]').first.click()
            assert page.evaluate(f'saved.events["5:{event}"]')
        page.locator('#static-next').click()
        assert page.locator('#sheet').evaluate('(e)=>e.classList.contains("active")')
        assert 'Six impossible mercies' in page.locator('#sheet').inner_text() or 'six impossible mercies' in page.locator('#sheet').inner_text()
        assert not page.locator('#sheet').inner_text().lower().find('the third possibility') >= 0
        page.locator('[data-close]').first.click()
        print('PASS ending gated without other 15 memories')

        # Complete all, alternating choices to reach the third (balanced) ending.
        for chapter in range(5):
            page.evaluate('(i)=>goChapter(i)',chapter)
            for event in range(3):
                page.locator('#static-next').click()
                assert page.locator('.sheet-art').get_attribute('style').find('data:image/jpeg;base64,') >= 0
                # All individual recovered frames should differ from chapter default plate.
                assert page.evaluate('(x)=>sceneImage(x[0],x[1]) !== REFERENCES[BOOK[x[0]].ref]', [chapter,event])
                page.locator(f'[data-choice="{(chapter*3+event)%2}"]').click()
                assert page.locator('.balance-note').count() >= 1
                page.locator('[data-close]').first.click()
        assert page.evaluate('progressTotal()') == 18
        assert page.locator('#overall-text').inner_text().startswith('18 / 18')
        page.evaluate('goChapter(5)')
        page.locator('#static-next').click()
        ending = page.locator('#sheet').inner_text()
        assert 'THE THIRD POSSIBILITY' in ending, ending[:1000]
        assert page.evaluate('witnessBalance().unbound + witnessBalance().sealed') == 18
        print('PASS 18 narrative decisions, source frames, local world decision state and balanced ending')
        # Both extreme endings are selectable; this test does not change permanent source data.
        original = page.evaluate('({...saved.decisions})')
        for choice, headline in [(0, 'THE UNFINISHED MERCY'), (1, 'THE MERIDIAN SEALED')]:
            page.evaluate('(option) => {for(const key of Object.keys(saved.decisions))saved.decisions[key]=option;openEnding();}',choice)
            assert headline in page.locator('#sheet').inner_text(), headline
        page.evaluate('(old) => {saved.decisions=old;openEnding();}',original)
        assert 'THE THIRD POSSIBILITY' in page.locator('#sheet').inner_text()
        # A witnessed choice changes the geometry's visible signal, not only its narration.
        colors = page.evaluate('''() => {
          const mock={root:new Node(),gl:{deleteTexture(){}},texCache:new Map()};
          const savedChoice=saved.decisions['0:0'];
          saved.decisions['0:0']=0; const a=buildWorld(mock,0).altars[0];
          const unbound={color:a.orb.mat.c,visible:a.witness.visible};
          saved.decisions['0:0']=1; const b=buildWorld(mock,0).altars[0];
          const sealed={color:b.orb.mat.c,visible:b.witness.visible};
          saved.decisions['0:0']=savedChoice;
          return {unbound,sealed};
        }''')
        assert colors['unbound']['color'] != colors['sealed']['color']
        assert colors['unbound']['visible'] and colors['sealed']['visible']
        print('PASS three endings and persistent in-world witness colors', colors)


        # Choice recall persisted in the active session, no decision rewrite upon replay.
        page.locator('[data-close]').first.click()
        page.evaluate('goChapter(0)')
        page.evaluate('openScene(0,0)')
        assert page.locator('.witness-recall').count() == 1
        assert page.locator('[data-choice]').count() == 0
        page.keyboard.press('Tab')
        assert page.evaluate('document.activeElement.closest("#sheet")!==null')
        page.keyboard.press('Escape')
        assert not page.locator('#sheet').evaluate('(e)=>e.classList.contains("active")')
        print('PASS testimony recall, modal keyboard behavior, choice immutability')

        # Synthetic GPU-loss event must not kill the textual story or navigation.
        page.evaluate('''() => document.getElementById('view').dispatchEvent(new Event('webglcontextlost',{cancelable:true}))''')
        assert page.evaluate('APP.webglUnavailable && !document.getElementById("static-world").hidden')
        page.evaluate('''() => document.getElementById('view').dispatchEvent(new Event('webglcontextrestored'))''')
        page.wait_for_timeout(300)
        recovery = page.evaluate('''() => ({restored:!!ENGINE&&!APP.webglUnavailable,fallback:APP.webglUnavailable&&!document.getElementById("static-world").hidden,renderer:ENGINE?ENGINE.stats().renderer:null})''')
        assert recovery['restored'] or recovery['fallback'], recovery
        if recovery['restored']:
            assert recovery['renderer'] == 'Three.js r186', recovery
            print('PASS GPU-loss fallback and live Three.js restoration', recovery)
        else:
            print('PASS GPU-loss fallback; restoration unavailable on this host', recovery)

        # Check mobile fallback layout with no sideways scrolling.
        page.set_viewport_size({'width':390,'height':844})
        page.evaluate('openMap()')
        page.wait_for_timeout(150)
        metrics = page.evaluate('''() => ({viewport:innerWidth, scroll:document.documentElement.scrollWidth, sheet:document.querySelector('#sheet-content').scrollWidth})''')
        assert metrics['scroll'] <= metrics['viewport'] + 2, metrics
        assert page.locator('.map-chapter').count() == 6
        assert not errors, errors
        assert not requests, requests
        print('PASS mobile atlas, no horizontal body overflow, no requests, no runtime errors',metrics)
        browser.close()

if __name__=='__main__':
    run()
