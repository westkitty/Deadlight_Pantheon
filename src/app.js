let ENGINE=null,STAGE=null,LAST=0,ACC=0,TOAST_TIMER=0,LINE_TIMER=0,UI_TIMER=0;
const CAMERA={shake:0,kick(amt){if(APP.motion)this.shake=Math.min(.45,this.shake+amt);}};
const worldEl=document.querySelector('#world'),viewEl=document.querySelector('#view'),sheet=document.querySelector('#sheet'),sheetContent=document.querySelector('#sheet-content');
const PLAYER={x:0,z:14,vx:0,vz:0,camYaw:0,camPitch:.15,camDist:10,face:0,joyX:0,joyY:0,running:false,lastX:0,lastY:0};
const KEY={},pointerState={view:false,id:null,lastX:0,lastY:0,joy:false,joyId:null};
const el=id=>document.getElementById(id);
const canConclude=()=>progressTotal()===18;
let focusBeforeSheet=null;
function setMotion(enabled){APP.motion=!!enabled;document.documentElement.classList.toggle('calm',!APP.motion);try{localStorage.setItem('deadlight-motion',APP.motion?'on':'off')}catch(e){}}
function nextObjective(){const i=firstPending(APP.chapter);return i===3?{pos:PORTAL_POS,label:APP.chapter===5&&!canConclude()?'REVISIT MISSING REALMS':'MERIDIAN GATE'}:{pos:ALTA_POS[i],label:'MEMORY '+(i+1)+' / '+BOOK[APP.chapter].scenes[i].object};}
function focusableInSheet(){return [...sheet.querySelectorAll('button:not(:disabled),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>x.getClientRects().length)};
const safe=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function toast(message){const e=el('toast');e.textContent=message;e.classList.add('on');clearTimeout(TOAST_TIMER);TOAST_TIMER=setTimeout(()=>e.classList.remove('on'),3300)}
function cinematic(message){const e=el('cinematic-line');e.textContent=message;e.style.opacity='1';clearTimeout(LINE_TIMER);LINE_TIMER=setTimeout(()=>e.style.opacity='0',3000)}
function chapterImage(i){return REFERENCES[BOOK[i].ref]}
function progressTotal(){return Object.keys(saved.events).filter(k=>saved.events[k]).length}
function headerShell(kicker,inner){return `<div class="sheet-header"><div class="sheet-kicker">${kicker}</div><button class="sheet-close" data-close aria-label="Close panel">CLOSE ✕</button></div>${inner}`}
function showSheet(html,kind='panel'){if(!APP.dialog)focusBeforeSheet=document.activeElement;APP.dialog=true;sheet.classList.add('active');sheetContent.innerHTML=html;sheet.dataset.kind=kind;el('app').inert=true;const first=sheet.querySelector('[data-close]');first?.focus();}
function hideSheet(){APP.dialog=false;sheet.classList.remove('active');sheetContent.innerHTML='';el('app').inert=false;const prior=focusBeforeSheet;focusBeforeSheet=null;const preferred=prior?.isConnected&&!prior.closest('[hidden]')?prior:(ENGINE?viewEl:el('static-next'));preferred?.focus({preventScroll:true});}
function enterWorld(){el('intro').hidden=true;APP.started=true;el('rail').classList.remove('open');if(!ENGINE&&!APP.webglUnavailable){try{ENGINE=new GLWorld(viewEl);}catch(e){console.info('WebGL renderer unavailable:',e.message);ENGINE=null;APP.webglUnavailable=true;worldEl.classList.add('no-webgl');el('static-world').hidden=false;toast('3D rendering is unavailable. The original scenes and all 18 memories remain accessible.');} } loadChapter(APP.chapter,true);if(!ENGINE)openMap();else viewEl.focus({preventScroll:true});LAST=performance.now();if(!window.__deadlightFrame&&!window.__deadlightStartTimer)window.__deadlightStartTimer=setTimeout(()=>{window.__deadlightStartTimer=0;LAST=performance.now();window.__deadlightFrame=requestAnimationFrame(frame)},80);}
function staticFallback(){if(!APP.webglUnavailable)return;const b=BOOK[APP.chapter],next=firstPending(APP.chapter);el('still-ref').src=chapterImage(APP.chapter);el('still-ref').alt='Original film reference depicting '+b.name;el('still-title').textContent=b.name;el('still-desc').textContent=next===3?(APP.chapter===5&&!canConclude()?'Three memories preserved here. Other realms still contain missing testimony. Open the Atlas to finish them.':'All three memories have been preserved. Continue to the next realm, or revisit any testimony.'):b.kingdom+' Next memory: '+b.scenes[next].title+'.';el('static-next').textContent=next===3?(APP.chapter===5?(canConclude()?'OPEN FINAL TESTIMONY':'FIND THE MISSING MEMORIES'):'CONTINUE TO NEXT REALM'):'WITNESS THE NEXT SCENE  ▸';}
function loadChapter(i,reset=false){APP.near=null;APP.chapter=i;saved.chapter=i;persist();SOUND.setRealm(i);PLAYER.x=0;PLAYER.z=14;PLAYER.camYaw=0;PLAYER.camPitch=.15;PLAYER.face=0;PLAYER.joyX=0;PLAYER.joyY=0;KEY.w=KEY.a=KEY.s=KEY.d=false;if(ENGINE)STAGE=buildWorld(ENGINE,i);worldEl.style.setProperty('--scene-image',`url("${chapterImage(i)}")`);worldEl.style.backgroundColor=WORLD_STYLES[BOOK[i].world].sky;
 el('location-label').textContent=`${BOOK[i].domain} / DEADLIGHT ${BOOK[i].num}`;el('chapter-title').textContent=BOOK[i].name;el('chapter-quote').textContent=BOOK[i].epithet.toLowerCase().replace(/^./,m=>m.toUpperCase());el('location').textContent=BOOK[i].chapter.toUpperCase();updateNavigation();updateUI();staticFallback();el('rail').classList.remove('open');cinematic(BOOK[i].quote);
}
function updateNavigation(){const nav=el('chapters');nav.innerHTML=BOOK.map((b,i)=>`<button class="chapter ${i===APP.chapter?'active':''}" data-chapter="${i}" aria-label="Explore ${safe(b.name)}" aria-current="${i===APP.chapter?'true':'false'}"><img class="ch-thumb" src="${chapterImage(i)}" alt="Still of ${safe(b.name)} from the original reference video"><div style="min-width:0"><div class="ch-num">${b.num} / ${firstPending(i)===3?'COMPLETE':'DEADLIGHT'}</div><div class="ch-name">${safe(b.name)}</div><div class="ch-epithet">${safe(b.epithet)}</div></div><span class="ch-state">${firstPending(i)===3?'✓':''}</span></button>`).join('');el('overall-fill').style.width=(progressTotal()/18*100)+'%';el('overall-text').textContent=`${progressTotal()} / 18 memories witnessed`}
function updateUI(){const b=BOOK[APP.chapter],next=firstPending(APP.chapter);el('scene-nodes').innerHTML=[0,1,2].map(i=>`<button class="scene-dot ${saved.events[APP.chapter+':'+i]?'done '+(saved.decisions[APP.chapter+':'+i]===0?'memory-unbound':'memory-sealed'):''}" data-stage="${i}" title="${safe(b.scenes[i].title)}: ${saved.events[APP.chapter+':'+i]?'replay':'unwitnessed'}" aria-label="${safe(b.scenes[i].title)}"><span>${saved.events[APP.chapter+':'+i]?'✓':i+1}</span></button>${i<2?'<div class="node-line"></div>':''}`).join('');el('guide').textContent=next===3?'The three testimonies are complete. Approach the illuminated gate to continue, or open the atlas.':`Next: ${b.scenes[next].title.toLowerCase()}. Follow the floating memory beacon.`;
 const balance=witnessBalance();el('witness-impact').textContent=`${balance.unbound} UNBOUND / ${balance.sealed} SEALED`;if(next===3&&APP.chapter===5&&!canConclude())el('guide').textContent='This gate needs the entire archive. Open the Atlas and recover the remaining testimonies.';updateNavigation();if(STAGE)applyProgress(STAGE);staticFallback();}
function nearestActive(){const i=APP.chapter,next=firstPending(i);let c=null;for(let j=0;j<3;j++){const [x,y,z]=ALTA_POS[j],d=Math.hypot(x-PLAYER.x,z-PLAYER.z);if(d<4.5&&(!c||d<c.dist))c={kind:'event',index:j,dist:d,title:BOOK[i].scenes[j].object,blocked:next<j};}const p=Math.hypot(PORTAL_POS[0]-PLAYER.x,PORTAL_POS[2]-PLAYER.z);if(p<5.6&&(!c||p<c.dist))c={kind:'portal',dist:p,blocked:next!==3,title:'The Meridian Gate'};return c}
function interact(){if(APP.dialog)return;if(!APP.started){enterWorld();return}if(!ENGINE){const next=firstPending(APP.chapter);if(next===3){if(APP.chapter===5){if(canConclude())openEnding();else{openMap();toast('The Seventh Silence requires all eighteen testimonies.')}}else goChapter(APP.chapter+1)}else openScene(APP.chapter,next);return}const n=APP.near||nearestActive();if(!n){if(!ENGINE){openScene(APP.chapter,Math.min(2,firstPending(APP.chapter)));return}const next=firstPending(APP.chapter);const a=ALTA_POS[Math.min(2,next)];toast(`Follow the causeway to ${next===3?'the gate':BOOK[APP.chapter].scenes[next].object}.`);return}if(n.blocked){toast('This memory is still sealed. Complete the preceding testimony.');return}if(n.kind==='event')openScene(APP.chapter,n.index);else if(n.kind==='portal'){if(APP.chapter<5)goChapter(APP.chapter+1);else if(canConclude())openEnding();else{openMap();toast('The archive is incomplete. Return to the unwitnessed realms.');}}}
function openScene(index,stageIndex){if(stageIndex>firstPending(index)&&!saved.events[index+':'+stageIndex]){toast('Recover the earlier memory before opening this one.');return;}SOUND.witnessChime();const b=BOOK[index],s=b.scenes[stageIndex];const key=index+':'+stageIndex,prior=!!saved.events[key];const plateTime=ECHO_TIMES[b.ref][stageIndex].toFixed(1);const body=s.body.map(p=>`<p>${safe(p)}</p>`).join('');let choices=!prior?`<div style="display:flex;gap:9px;flex-wrap:wrap"><button class="btn" data-choice="0">${safe(s.choices[0])}</button><button class="btn secondary" data-choice="1">${safe(s.choices[1])}</button></div>`:`<div class="witness-recall"><b>YOUR RECORDED RESPONSE</b><p>${safe(s.responses[saved.decisions[key]??0])}</p><small>${saved.decisions[key]===0?'UNBOUND MEMORY':'SEALED MEMORY'}</small></div><button class="btn" data-close>RETURN TO THE WORLD</button><button class="btn secondary" data-codex="${index}">THE FULL DOSSIER</button>`;
 showSheet(headerShell(`${b.num} / ${safe(b.name)} · ${safe(s.sub)}`,`<div class="sheet-main"><div class="sheet-copy"><div class="sheet-kicker" style="color:#9dddf3">${safe(s.object)}</div><h2>${safe(s.title)}</h2><p class="lead">${safe(s.lead)}</p>${body}<blockquote>${safe(s.line)}</blockquote>${prior?'<div style="font-size:11px;color:#8dccdb;letter-spacing:.14em;margin-bottom:17px">✓ TESTIMONY PRESERVED</div>':''}${choices}</div><div class="sheet-art" style="background-image:url('${sceneImage(index,stageIndex)}')"><div class="image-source">FILM ECHO / ${plateTime}S / ORIGINAL REFERENCE</div></div></div><div class="sheet-footer"><span class="footer-note">Memory ${stageIndex+1} of 3 · ${safe(b.domain)}</span><span class="footer-note">${safe(b.years)}</span></div>`),'scene');sheet.dataset.scene=stageIndex;sheet.dataset.chapter=index;}
function chooseScene(which){SOUND.verdict(which===0);CAMERA.kick(which===0?.16:.22);const i=+sheet.dataset.chapter,j=+sheet.dataset.scene,s=BOOK[i].scenes[j];const key=i+':'+j;if(!saved.events[key]){saved.events[key]=true;saved.decisions[key]=which;persist();if(STAGE)applyProgress(STAGE);updateUI();cinematic(which===0?'The memory opens a new possibility.':'The memory hardens into certainty.');}let complete=firstPending(i)===3;
 let html=headerShell(`${BOOK[i].num} / TESTIMONY RECORDED`,`<div class="sheet-main"><div class="sheet-copy"><div class="sheet-kicker" style="color:var(--cyan)">THE ARCHIVE REMEMBERS</div><h2>THE WITNESS<br>HAS SPOKEN.</h2><p class="lead">${safe(s.responses[which])}</p><p>The monument now carries the color of your decision: turquoise for a memory left open, amber for one sealed into certainty. You can return to this event, but its first choice remains recorded.</p><div class="balance-note">${witnessBalance().unbound} UNBOUND &nbsp; / &nbsp; ${witnessBalance().sealed} SEALED</div><blockquote>${safe(s.line)}</blockquote><button class="btn" data-close>${complete?'RETURN TO THE MERIDIAN GATE':'CONTINUE WALKING'} &nbsp; ▸</button><button class="btn secondary" data-map>VIEW ALL REALMS</button></div><div class="sheet-art" style="background-image:url('${sceneImage(i,j)}')"><div class="image-source">TESTIMONY ${j+1} / SOURCE FRAME ${ECHO_TIMES[BOOK[i].ref][j].toFixed(1)}S</div></div></div><div class="sheet-footer"><span class="footer-note">${progressTotal()} of 18 memories recovered</span><span class="footer-note">${complete?'Realm complete — the portal is active':'Follow the next memory beacon'}</span></div>`);
 sheetContent.innerHTML=html;sheetContent.querySelector('[data-close]')?.focus();if(complete){cinematic(`The ${BOOK[i].name.toLowerCase()} gate has awakened.`);if(i===5)setTimeout(()=>toast('All six testimonies can now be brought before the Seventh Silence.'),1000)} }
function openMap(){const cards=BOOK.map((b,i)=>`<button class="map-chapter" data-chapter="${i}"><img src="${chapterImage(i)}" alt="Video reference still of ${safe(b.name)}"><span class="count">${firstPending(i)} / 3</span><div class="map-chapter-content"><small>REALM ${b.num} / ${safe(b.domain)}</small><strong>${safe(b.name)}</strong><p>${safe(b.epithet)}</p></div></button>`).join('');showSheet(headerShell('ARCHIVE READING MODE / MERIDIAN ATLAS',`<div style="padding:22px 26px 4px"><h2 style="font:400 34px Georgia,serif;margin:0">The six impossible mercies</h2><p style="font-size:13px;line-height:1.7;color:var(--muted);max-width:790px">Every realm can be visited in any order. Walk to three beacons to recover the choices that made each titan. Only all eighteen testimonies can open the Seventh Silence. Each memory has its own archival frame from the original film.</p><div class="balance-note">${witnessBalance().unbound} UNBOUND &nbsp; / &nbsp; ${witnessBalance().sealed} SEALED · YOUR CHOICES WILL SHAPE THE END</div></div><div class="map-grid">${cards}</div><div class="sheet-footer"><span class="footer-note">${progressTotal()} / 18 TESTIMONIES</span><button class="btn secondary" data-close>RETURN TO EXPLORATION</button></div>`),'map')}
function openCodex(i=APP.chapter){const b=BOOK[i];showSheet(headerShell(`ARCHIVAL DOSSIER / ${b.num} / ${safe(b.years)}`,`<div class="codex-layout"><div><img class="codex-img" src="${chapterImage(i)}" alt="Source video still used to reconstruct ${safe(b.name)}"><p style="font-size:10px;color:var(--muted);line-height:1.5">REFERENCE PLATE — frame from the original film. The navigable model is a procedural 3D interpretation of this visual design, not an extracted original mesh.</p></div><div class="codex-bio"><div class="sheet-kicker">THE ${b.num} DEADLIGHT</div><h3>${safe(b.name)}</h3><div style="font:italic 17px Georgia,serif;color:var(--gold)">${safe(b.epithet)}</div><h4>Birth / Witness / Crime</h4><p>${safe(b.origin)}</p><h4>The Doctrine</h4><p>${safe(b.doctrine)}</p><h4>The Domain</h4><p>${safe(b.kingdom)}</p><h4>What the Mask Conceals</h4><p>${safe(b.secret)}</p><h4>Memory Sequence</h4><ul>${b.scenes.map((s,j)=>`<li><button style="background:none;border:none;color:${saved.events[i+':'+j]?'#8feeea':'#c8d6df'};text-decoration:underline;text-decoration-color:#456978;text-align:left;cursor:pointer;padding:4px 0" data-replay="${i}:${j}">${saved.events[i+':'+j]?'✓ ':'◇ '}${safe(s.title)}</button></li>`).join('')}</ul><p class="quote">${safe(b.quote)}</p></div></div><div class="sheet-footer"><span class="footer-note">3D reconstruction anchored to the visible source design</span><button class="btn" data-chapter="${i}">WALK THIS REALM &nbsp;▸</button></div>`),'codex')}
function openHelp(){showSheet(headerShell('ARCHIVE READING MODE / FIELD GUIDE',`<div class="sheet-copy" style="max-width:790px"><h2>How to witness</h2><p><b>Move:</b> W A S D / arrow keys, or the touch joystick. <b>Sprint:</b> Shift / Run. <b>Look around:</b> drag the 3D scene with mouse or finger. <b>Examine:</b> E, F, the Witness touch button, or click the diamond memory markers.</p><p><b>Explore:</b> M opens the Atlas. C opens the current titan's dossier. V changes camera perspective. H hides or restores the complete exploration interface. Escape closes a panel. Open the chapter drawer to travel instantly. Follow the first glowing reliquary, then the second and third; the great portal unlocks after all three have been witnessed.</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin:17px 0"><button class="btn secondary" id="reduced-motion-toggle" aria-pressed="${!APP.motion}">${APP.motion?'REDUCE MOTION':'ENABLE AMBIENT MOTION'}</button><button class="btn secondary" id="guide-to-next">RETURN TO NEXT BEACON</button><button class="btn secondary" id="toggle-graphics">${APP.quality==='high'?'USE BATTERY-SAVING GRAPHICS':'ENABLE HIGH DETAIL GRAPHICS'}</button></div><p><b>About the source:</b> The titan portraits in this document are stills from the original film. The sculpted in-world figures reproduce its observed design language: neon X-eyed smile, black armored hood, crystal crowns, elongated death mask, horned grin, circular waveform chest, city-bodied titan and blue singularity. They are original low-poly interpretations rather than pixel-accurate 3D scans.</p><p><b>Follow the wayfinder:</b> Its rotating needle and distance point to your next memory. Recovered beacons become turquoise or amber according to your decision. The final gate requires all eighteen events, even if you visit realms out of order.</p><p><b>Offline:</b> This is one HTML file. It makes no network requests. Progress is stored locally if your browser permits local storage. Audio is optional and synthesized in the browser.</p><p><b>Renderer:</b> The 3D worlds use the official Three.js r${typeof THREE==='undefined'?'?':THREE.REVISION} runtime, bundled inside this document for offline use.</p><button class="btn" data-close>RETURN</button></div>`),'help')}
function openEnding(){if(!canConclude()){openMap();toast('All eighteen memories must be recovered first.');return;}const total=progressTotal(),{unbound:soft,sealed:firm}=witnessBalance();const equilibrium=Math.abs(soft-firm)<=2;const title=equilibrium?'THE THIRD POSSIBILITY':soft>firm?'THE UNFINISHED MERCY':'THE MERIDIAN SEALED';const text=equilibrium?'No doctrine can claim victory. Instead of a verdict, you offer the gods a question. The masks split, and each titan must answer as a person rather than a principle. The Seventh Silence becomes a beginning no prophecy contains.':soft>firm?'The six restraints fracture. For the first time, none of the gods knows how to behave. The universe remains dangerous, full of grief and possibility. It also remains free.':'The seventh god closes the futures most likely to destroy existence. The world survives beneath a beautiful immovable peace. The witnesses remember that survival and freedom are not the same thing.';showSheet(headerShell('THE SEVENTH SILENCE / THE END OF AN ERA',`<div class="sheet-main"><div class="sheet-copy"><div class="sheet-kicker">${total}/18 TESTIMONIES RECOVERED</div><h2>${title}</h2><p class="lead">${safe(text)}</p><p>Malach does not smile. Seraphine feels the weight of wanting. Oryx hears an oath he did not write. Thaum-IX listens. Iona begins to remember the little girl's name. Azrath waits on the edge of a future that has never existed before.</p><blockquote>"A god who can choose may no longer need to be a god."</blockquote><button class="btn" data-map>RETURN TO THE ATLAS</button><button class="btn secondary" id="export-witness">EXPORT YOUR TESTIMONIES</button></div><div class="sheet-art" style="background-image:url('${chapterImage(5)}')"><div class="image-source">THE UNHAPPENED / FINAL MEMORY</div></div></div><div class="sheet-footer"><span class="footer-note">${soft} free-choice witnesses · ${firm} doctrine-choice witnesses</span><span class="footer-note">The story can always be visited again</span></div>`),'ending')}
function exportWitness(){const payload={title:'THE DEADLIGHT PANTHEON — WITNESS ARCHIVE',version:1,exported:new Date().toISOString(),complete:progressTotal(),records:[]};for(let i=0;i<6;i++)for(let j=0;j<3;j++)if(saved.events[i+':'+j])payload.records.push({titan:BOOK[i].name,event:BOOK[i].scenes[j].title,decision:BOOK[i].scenes[j].choices[saved.decisions[i+':'+j]]});const b=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='deadlight-witness-archive.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);}
function goChapter(i){SOUND.gatePass();CAMERA.kick(.24);hideSheet();el('intro').hidden=true;APP.started=true;loadChapter(i);if(!ENGINE&&!APP.webglUnavailable){try{ENGINE=new GLWorld(viewEl);loadChapter(i);}catch(e){console.info('WebGL renderer unavailable:',e.message);APP.webglUnavailable=true;worldEl.classList.add('no-webgl');el('static-world').hidden=false;staticFallback();}}viewEl.focus({preventScroll:true})}
function jumpToNext(){if(!ENGINE){hideSheet();interact();return}const i=firstPending(APP.chapter);if(i===3){PLAYER.x=PORTAL_POS[0];PLAYER.z=PORTAL_POS[2]+3.7}else{const a=ALTA_POS[i];PLAYER.x=a[0];PLAYER.z=a[2]+3.1;}hideSheet();toast(i===3?'The Meridian Gate is ahead.':'A memory beacon is within reach.');}
function onSheetClick(e){const target=e.target.closest('button');if(!target)return;if(target.hasAttribute('data-close')){hideSheet();return}if(target.hasAttribute('data-chapter')){goChapter(+target.dataset.chapter);return}if(target.hasAttribute('data-codex')){openCodex(+target.dataset.codex);return}if(target.hasAttribute('data-map')){openMap();return}if(target.hasAttribute('data-choice')){chooseScene(+target.dataset.choice);return}if(target.hasAttribute('data-replay')){const [a,b]=target.dataset.replay.split(':').map(Number);openScene(a,b);return}if(target.id==='reduced-motion-toggle'){setMotion(!APP.motion);openHelp();return}if(target.id==='toggle-graphics'){el('quality').click();openHelp();return}if(target.id==='guide-to-next'){jumpToNext();return}if(target.id==='export-witness'){exportWitness();return}}
sheet.addEventListener('click',e=>{if(e.target===sheet)hideSheet();else onSheetClick(e)});
el('chapters').addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b){if(!APP.started)enterWorld();goChapter(+b.dataset.chapter)}});
el('scene-nodes').addEventListener('click',e=>{const b=e.target.closest('[data-stage]');if(b)openScene(APP.chapter,+b.dataset.stage)});
el('static-next').onclick=interact;el('static-dossier').onclick=()=>openCodex();
el('enter-world').onclick=enterWorld;el('intro-map').onclick=()=>{enterWorld();openMap()};el('open-map').onclick=el('open-map-rail').onclick=openMap;el('open-codex').onclick=()=>openCodex();el('help').onclick=openHelp;el('view-mode').onclick=()=>{APP.view=APP.view==='third'?'first':'third';toast(`Camera: ${APP.view==='third'?'traveler and companion':'first-person witness'}`)};
function setHudHidden(hidden){document.documentElement.classList.toggle('hud-hidden',!!hidden);el('hud-toggle').setAttribute('aria-pressed',String(!!hidden));}
el('hud-toggle').onclick=()=>setHudHidden(true);el('hud-return').onclick=()=>setHudHidden(false);
el('quality').onclick=()=>{APP.quality=APP.quality==='high'?'low':'high';el('quality').textContent=APP.quality==='high'?'HD':'ECO';if(ENGINE)ENGINE.resize();toast(APP.quality==='high'?'High detail rendering':'Reduced resolution for battery life')};
el('mobile-menu').onclick=openMap;el('touch-interact').onclick=interact;
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(APP.dialog){if(k==='escape'){e.preventDefault();hideSheet();return;}if(k==='tab'){const focusable=focusableInSheet();if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}return;}if(k==='escape'){el('rail').classList.remove('open');return;}if(!APP.started||e.target.closest('input,textarea,select,[contenteditable]'))return;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();KEY[k]=true;if(e.repeat)return;if(k==='e'||k==='f')interact();if(k==='m')openMap();if(k==='c')openCodex();if(k==='v')el('view-mode').click();if(k==='h')setHudHidden(!document.documentElement.classList.contains('hud-hidden'));if(k==='?')openHelp();});window.addEventListener('keyup',e=>KEY[e.key.toLowerCase()]=false);window.addEventListener('blur',()=>{for(const k of Object.keys(KEY))KEY[k]=false;PLAYER.joyX=PLAYER.joyY=0});
viewEl.addEventListener('pointerdown',e=>{if(APP.dialog)return;pointerState.view=true;pointerState.id=e.pointerId;pointerState.lastX=e.clientX;pointerState.lastY=e.clientY;viewEl.setPointerCapture(e.pointerId)});
viewEl.addEventListener('pointermove',e=>{if(!pointerState.view||e.pointerId!==pointerState.id||APP.dialog)return;let dx=e.clientX-pointerState.lastX,dy=e.clientY-pointerState.lastY;pointerState.lastX=e.clientX;pointerState.lastY=e.clientY;PLAYER.camYaw=PLAYER.camYaw-dx*.004;PLAYER.camPitch=clamp(PLAYER.camPitch+dy*.003,-.6,.72)});
function pointerRelease(e){if(e.pointerId===pointerState.id){pointerState.view=false;pointerState.id=null}}viewEl.addEventListener('pointerup',pointerRelease);viewEl.addEventListener('pointercancel',pointerRelease);viewEl.addEventListener('wheel',e=>{PLAYER.camDist=clamp(PLAYER.camDist+Math.sign(e.deltaY)*.8,5.5,17)},{passive:true});
const joy=el('joy'),nub=el('joy-nub');
const updateJoy=e=>{const r=joy.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;const dx=e.clientX-cx,dy=e.clientY-cy,ratio=Math.max(1,Math.hypot(dx,dy)/36);PLAYER.joyX=clamp(dx/ratio/36,-1,1);PLAYER.joyY=clamp(-dy/ratio/36,-1,1);nub.style.transform=`translate(${PLAYER.joyX*30}px,${-PLAYER.joyY*30}px)`};
joy.addEventListener('pointerdown',e=>{e.preventDefault();pointerState.joy=true;pointerState.joyId=e.pointerId;joy.setPointerCapture(e.pointerId);updateJoy(e)});joy.addEventListener('pointermove',e=>{if(pointerState.joy&&e.pointerId===pointerState.joyId)updateJoy(e)});const joyRelease=()=>{pointerState.joy=false;PLAYER.joyX=PLAYER.joyY=0;nub.style.transform='translate(0px,0px)'};joy.addEventListener('pointerup',joyRelease);joy.addEventListener('pointercancel',joyRelease);
const runButton=el('touch-run');runButton.addEventListener('pointerdown',e=>{e.preventDefault();PLAYER.running=true;runButton.setPointerCapture(e.pointerId)});runButton.addEventListener('pointerup',()=>PLAYER.running=false);runButton.addEventListener('pointercancel',()=>PLAYER.running=false);
// Procedural dark ambient soundscape: opt-in, synthesized in-browser, strictly offline.
const SOUND={
 ctx:null,master:null,compressor:null,droneNodes:[],noiseBuffer:null,currentRealm:-1,stepAccum:0,
 init(){
  if(this.ctx)return true;
  try{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)return false;
   this.ctx=new AC();
   this.compressor=this.ctx.createDynamicsCompressor();
   this.compressor.threshold.setValueAtTime(-18,this.ctx.currentTime);
   this.compressor.knee.setValueAtTime(12,this.ctx.currentTime);
   this.compressor.ratio.setValueAtTime(8,this.ctx.currentTime);
   this.compressor.attack.setValueAtTime(.005,this.ctx.currentTime);
   this.compressor.release.setValueAtTime(.25,this.ctx.currentTime);
   this.compressor.connect(this.ctx.destination);
   this.master=this.ctx.createGain();
   this.master.gain.setValueAtTime(.04,this.ctx.currentTime);
   this.master.connect(this.compressor);
   const len=this.ctx.sampleRate;
   this.noiseBuffer=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
   const d=this.noiseBuffer.getChannelData(0);
   for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
   return true;
  }catch(e){return false;}
 },
 start(){
  if(!this.init())return;
  if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
  const now=this.ctx.currentTime;
  this.master.gain.cancelScheduledValues(now);
  this.master.gain.setValueAtTime(this.master.gain.value,now);
  this.master.gain.linearRampToValueAtTime(.04,now+.8);
  this.setRealm(APP.chapter);
 },
 stop(){
  if(!this.ctx||!this.master)return;
  const now=this.ctx.currentTime;
  this.master.gain.cancelScheduledValues(now);
  this.master.gain.setValueAtTime(this.master.gain.value,now);
  this.master.gain.linearRampToValueAtTime(.0001,now+.5);
  setTimeout(()=>{this.clearDrone();this.currentRealm=-1;},550);
 },
 clearDrone(){
  for(const n of this.droneNodes){try{if(n.node.stop)n.node.stop();n.node.disconnect()}catch(e){}}
  this.droneNodes=[];
 },
 setRealm(r){
  if(!APP.sound||!this.ctx||this.currentRealm===r)return;
  this.currentRealm=r;
  const now=this.ctx.currentTime;
  const old=[...this.droneNodes];this.droneNodes=[];
  for(const item of old){
   try{
    item.gain.gain.cancelScheduledValues(now);
    item.gain.gain.setValueAtTime(item.gain.gain.value,now);
    item.gain.gain.linearRampToValueAtTime(.0001,now+.9);
    setTimeout(()=>{try{if(item.node.stop)item.node.stop();item.node.disconnect()}catch(e){}},950);
   }catch(e){}
  }
  const osc=(f,type,vol,detune=0)=>{
   try{
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,now);if(detune)o.detune.setValueAtTime(detune,now);
    g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(vol,now+1.2);
    o.connect(g);g.connect(this.master);o.start(now);this.droneNodes.push({node:o,gain:g});
   }catch(e){}
  };
  const noise=(type,freq,vol)=>{
   if(!this.noiseBuffer)return;
   try{
    const s=this.ctx.createBufferSource();s.buffer=this.noiseBuffer;s.loop=true;
    const flt=this.ctx.createBiquadFilter();flt.type=type;flt.frequency.setValueAtTime(freq,now);
    const g=this.ctx.createGain();g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(vol,now+1.5);
    s.connect(flt);flt.connect(g);g.connect(this.master);s.start(now);this.droneNodes.push({node:s,gain:g});
   }catch(e){}
  };
  if(r===0){osc(55,'sine',.22);osc(110,'sine',.14);osc(130.81,'sine',.08);osc(220,'sine',.04,1.5);}
  else if(r===1){osc(43.65,'sine',.28);osc(65.41,'sine',.16);osc(87.31,'sine',.08);noise('bandpass',1800,.025);}
  else if(r===2){osc(36.71,'sawtooth',.08);osc(51.91,'sine',.20);osc(73.42,'sine',.16);}
  else if(r===3){osc(73.42,'sine',.18);osc(110,'sine',.14);osc(146.83,'sine',.10);osc(293.66,'sine',.05);}
  else if(r===4){osc(58.27,'sine',.24);osc(69.30,'sine',.15);noise('lowpass',450,.045);}
  else if(r===5){osc(110,'sine',.18);osc(110.6,'sine',.18);osc(440,'sine',.04);osc(880,'sine',.02);}
 },
 step(sprint){
  if(!APP.sound||!this.ctx||!this.master)return;
  try{
   const now=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
   o.type='sine';o.frequency.setValueAtTime(sprint?68:52,now);o.frequency.exponentialRampToValueAtTime(28,now+.09);
   g.gain.setValueAtTime(.026,now);g.gain.exponentialRampToValueAtTime(.0001,now+.09);
   o.connect(g);g.connect(this.master);o.start(now);o.stop(now+.095);
  }catch(e){}
 },
 witnessChime(){
  if(!APP.sound||!this.ctx||!this.master)return;
  try{
   const now=this.ctx.currentTime;
   for(const f of [440,659.25,880]){
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type='sine';o.frequency.setValueAtTime(f,now);g.gain.setValueAtTime(.045,now);g.gain.exponentialRampToValueAtTime(.0001,now+2.2);
    o.connect(g);g.connect(this.master);o.start(now);o.stop(now+2.25);
   }
  }catch(e){}
 },
 verdict(unbound){
  if(!APP.sound||!this.ctx||!this.master)return;
  try{
   const now=this.ctx.currentTime,freqs=unbound?[392,493.88,587.33]:[65.41,98,130.81];
   freqs.forEach((f,idx)=>{
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=unbound?'sine':'triangle';o.frequency.setValueAtTime(f,now+idx*.06);
    g.gain.setValueAtTime(.0001,now);g.gain.setValueAtTime(.055,now+idx*.06);
    g.gain.exponentialRampToValueAtTime(.0001,now+2.6);
    o.connect(g);g.connect(this.master);o.start(now+idx*.06);o.stop(now+2.7);
   });
  }catch(e){}
 },
 gatePass(){
  if(!APP.sound||!this.ctx||!this.master)return;
  try{
   const now=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain(),flt=this.ctx.createBiquadFilter();
   o.type='sawtooth';o.frequency.setValueAtTime(80,now);o.frequency.exponentialRampToValueAtTime(320,now+.8);
   flt.type='lowpass';flt.frequency.setValueAtTime(200,now);flt.frequency.exponentialRampToValueAtTime(1400,now+.8);
   g.gain.setValueAtTime(.045,now);g.gain.exponentialRampToValueAtTime(.0001,now+.85);
   o.connect(flt);flt.connect(g);g.connect(this.master);o.start(now);o.stop(now+.9);
  }catch(e){}
 }
};
function setAudio(on){APP.sound=on;el('sound').setAttribute('aria-pressed',String(on));el('sound').textContent=on?'♫':'♩';if(on){SOUND.start();toast('Audio enabled: procedural soundscape active.');}else{SOUND.stop();}}
el('sound').onclick=()=>setAudio(!APP.sound);
function move(dt){if(!ENGINE)return;let dx=0,dy=0;if(KEY.w||KEY.arrowup)dy++;if(KEY.s||KEY.arrowdown)dy--;if(KEY.a||KEY.arrowleft)dx--;if(KEY.d||KEY.arrowright)dx++;dx+=PLAYER.joyX;dy+=PLAYER.joyY;const m=Math.hypot(dx,dy);if(m>.01){dx/=Math.max(1,m);dy/=Math.max(1,m);const speed=(KEY.shift||PLAYER.running?9.8:5.25),a=PLAYER.camYaw;const vx=(dx*Math.cos(a)-dy*Math.sin(a))*speed,vz=(-dy*Math.cos(a)-dx*Math.sin(a))*speed;PLAYER.x=clamp(PLAYER.x+vx*dt,-6.2,6.2);PLAYER.z=clamp(PLAYER.z+vz*dt,-33.9,16);PLAYER.vx=vx;PLAYER.vz=vz;PLAYER.face=lerp(PLAYER.face,Math.atan2(vx,-vz),.13);SOUND.stepAccum+=dt*(KEY.shift||PLAYER.running?1.7:1.0);if(SOUND.stepAccum>.42){SOUND.stepAccum=0;SOUND.step(KEY.shift||PLAYER.running);}}else{PLAYER.vx=0;PLAYER.vz=0;SOUND.stepAccum=0;}}
function renderGame(now,dt){if(!STAGE||!ENGINE)return;const time=now*.001;animateStage(STAGE,time,dt);const p=STAGE.player;if(p){p.traveler.pos=[PLAYER.x,0,PLAYER.z];p.traveler.rot[1]=PLAYER.face+Math.PI;p.traveler.visible=APP.view==='third';p.dog.pos=[PLAYER.x+1.25,0,PLAYER.z+1.1];p.dog.rot[1]=PLAYER.face+Math.PI;p.dog.visible=true;const moving=Math.hypot(PLAYER.vx,PLAYER.vz)>1;if(APP.motion){p.cloak.rot[0]=moving?Math.sin(time*8)*.07:Math.sin(time*1.2)*.015;p.dog.pos[1]=moving?Math.abs(Math.sin(time*9))*.08:0;}}
 let eye,at;const yaw=PLAYER.camYaw,pitch=PLAYER.camPitch;if(APP.view==='third'){const cd=PLAYER.camDist;eye=[PLAYER.x+Math.sin(yaw)*cd,6.1+pitch*3.5,PLAYER.z+Math.cos(yaw)*cd];at=[PLAYER.x-Math.sin(yaw)*5,4.05+pitch*4.5,PLAYER.z-Math.cos(yaw)*5];}else{const moving=Math.hypot(PLAYER.vx,PLAYER.vz)>1,bob=(APP.motion&&moving)?Math.sin(time*7.5)*.042:0,bobSway=(APP.motion&&moving)?Math.cos(time*3.75)*.025:0;eye=[PLAYER.x+Math.cos(yaw)*bobSway,1.93+bob,PLAYER.z-Math.sin(yaw)*bobSway];at=[PLAYER.x-Math.sin(yaw)*10,2.1+pitch*12+bob*.5,PLAYER.z-Math.cos(yaw)*10];}
 if(CAMERA.shake>.001){eye[0]+=(Math.random()-.5)*CAMERA.shake;eye[1]+=(Math.random()-.5)*CAMERA.shake*.7;CAMERA.shake*=.88;}
 ENGINE.render(eye,at,STAGE.style.fog,time,STAGE.world);
}
function frame(now){window.__deadlightFrame=requestAnimationFrame(frame);if(!APP.started)return;const dt=Math.min(.05,Math.max(0,(now-LAST)/1000||.016));LAST=now;if(!APP.dialog){ACC=Math.min(.12,ACC+dt);let steps=0;while(ACC>=1/60&&steps<7){move(1/60);ACC-=1/60;steps++}renderGame(now,dt);}if(now-UI_TIMER>130){UI_TIMER=now;updateProximity();updateWayfinder();}}
function updateWayfinder(){if(!ENGINE||!STAGE||APP.dialog)return;const o=nextObjective(),p=o.pos,dx=p[0]-PLAYER.x,dz=p[2]-PLAYER.z,y=PLAYER.camYaw,rx=dx*Math.cos(y)-dz*Math.sin(y),fz=-dx*Math.sin(y)-dz*Math.cos(y),angle=Math.atan2(rx,fz)*180/Math.PI;el('way-arrow').style.transform=`rotate(${angle}deg)`;el('way-title').textContent=o.label;el('way-distance').textContent=Math.round(Math.hypot(dx,dz))+' m';}
function updateProximity(){if(APP.dialog)return;if(!ENGINE){el('interact-hint').style.display='none';el('dist-text').textContent='SELECT A MEMORY TO CONTINUE';return}const n=nearestActive();APP.near=n;const hint=el('interact-hint');if(n){hint.style.display='flex';const text=n.kind==='portal'?(n.blocked?'Gate sealed: recover all three memories':'Enter the next realm / complete the pilgrimage'):`${n.blocked?'Sealed: ':''}${n.title}`;el('interact-copy').textContent=text;hint.style.opacity=n.blocked?.55:1;}else{hint.style.display='none';}
 const next=firstPending(APP.chapter),target=next===3?PORTAL_POS:ALTA_POS[next],d=Math.round(Math.hypot(PLAYER.x-target[0],PLAYER.z-target[2]));el('dist-text').textContent=`${next===3?'MERIDIAN GATE':'NEXT MEMORY'} · ${d}m`;
}
function overlayOccupancy(){
 const selectors=['.topline>div:first-child','.hud-actions','#location','.meter','#interact-hint','.hud-bottom-right','#wayfinder','#touch>.joy','#touch>.touch-actions','#rail.open','#hud-return'];
 const width=innerWidth,height=innerHeight,rects=[];
 for(const selector of selectors)for(const node of document.querySelectorAll(selector)){
  const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden'||+style.opacity===0)continue;
  const r=node.getBoundingClientRect(),x1=clamp(r.left,0,width),x2=clamp(r.right,0,width),y1=clamp(r.top,0,height),y2=clamp(r.bottom,0,height);
  if(x2>x1&&y2>y1)rects.push({x1,x2,y1,y2,selector});
 }
 const xs=[...new Set(rects.flatMap(r=>[r.x1,r.x2]))].sort((a,b)=>a-b);let area=0;
 for(let i=0;i<xs.length-1;i++){const left=xs[i],right=xs[i+1],intervals=rects.filter(r=>r.x1<right&&r.x2>left).map(r=>[r.y1,r.y2]).sort((a,b)=>a[0]-b[0]);let covered=0,start=-1,end=-1;for(const [a,b] of intervals){if(a>end){if(end>start)covered+=end-start;start=a;end=b}else end=Math.max(end,b)}if(end>start)covered+=end-start;area+=(right-left)*covered;}
 return{width,height,area,percent:+(area/(width*height)*100).toFixed(2),rects};
}
window.measureOverlayOccupancy=overlayOccupancy;
window.render_game_to_text=()=>JSON.stringify({
 mode:APP.dialog?'archive-reading':APP.webglUnavailable?'visual-fallback':'exploration',
 chapter:APP.chapter,titan:BOOK[APP.chapter].name,player:{x:+PLAYER.x.toFixed(2),z:+PLAYER.z.toFixed(2),view:APP.view},
 progress:progressTotal(),next:firstPending(APP.chapter),objective:nextObjective().label,hudHidden:document.documentElement.classList.contains('hud-hidden'),
 overlays:APP.dialog?{exemptReadingMode:true}:overlayOccupancy(),renderer:ENGINE?ENGINE.stats():null
});
window.advanceTime=ms=>{let remaining=Math.max(0,Math.min(2000,Number(ms)||0))/1000;while(remaining>0){const step=Math.min(1/60,remaining);if(!APP.dialog)move(step);remaining-=step;}if(APP.started&&!APP.dialog)renderGame(performance.now(),Math.min(.05,(Number(ms)||0)/1000));updateProximity();updateWayfinder();return Promise.resolve();};
// GPU failures are recoverable: keep the story alive while the context is unavailable.
function activateFallback(message){if(ENGINE){ENGINE.releaseAfterLoss();}ENGINE=null;STAGE=null;APP.webglUnavailable=true;worldEl.classList.add('no-webgl');el('static-world').hidden=false;staticFallback();toast(message);}
viewEl.addEventListener('webglcontextlost',e=>{e.preventDefault();activateFallback('The 3D context was interrupted. Continue in the visual archive while graphics recover.');});
viewEl.addEventListener('webglcontextrestored',()=>{if(!APP.started)return;try{ENGINE=new GLWorld(viewEl);APP.webglUnavailable=false;worldEl.classList.remove('no-webgl');el('static-world').hidden=true;loadChapter(APP.chapter);toast('The 3D world has been restored.');}catch(e){activateFallback('Graphics could not be restored. The story remains available.');}});
renderInitial();
function renderInitial(){let pref=null;try{pref=localStorage.getItem('deadlight-motion')}catch(e){}if(pref==='off')setMotion(false);else document.documentElement.classList.toggle('calm',!APP.motion);el('intro').style.setProperty('--intro-image',`url("${chapterImage(0)}")`);worldEl.style.setProperty('--scene-image',`url("${chapterImage(APP.chapter)}")`);updateNavigation();updateUI();}
