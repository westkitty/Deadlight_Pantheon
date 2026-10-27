// A source-inspired procedural reconstruction: black armored bodies, cyan LED expressions,
// crystal coronae, waveform hearts, burning cathedrals, horned eclipse armor and city-giant.
const ALTA_POS=[[-3.7,0,7.5],[3.8,0,-7.7],[-3.2,0,-22.4]],PORTAL_POS=[0,0,-33.4];
const WORLD_STYLES={
 cathedral:{fog:[.032,.065,.09],accent:'blue',sky:'#081622'},
 basilica:{fog:[.06,.072,.1],accent:'pale',sky:'#101626'},
 eclipse:{fog:[.15,.055,.08],accent:'red',sky:'#210e21'},
 bells:{fog:[.055,.07,.1],accent:'blue',sky:'#0e1a23'},
 city:{fog:[.064,.1,.14],accent:'ice',sky:'#14273b'},
 void:{fog:[.018,.064,.104],accent:'ice',sky:'#0a182f'}
};
function buildWorld(renderer,index){const book=BOOK[index],style=WORLD_STYLES[book.world],root=new Node();if(renderer.reset)renderer.reset(root);else{renderer.root=root;renderer.texCache.forEach(t=>renderer.gl.deleteTexture(t));renderer.texCache.clear();}const stage={root,book,style,altars:[],embers:[],floaters:[],titan:null,mask:null,ring:null,player:null,companion:null,portal:null,monoliths:[],banners:[],lights:[],sky:[],realmDetails:[],world:book.world};
 const seed=i=>{let x=Math.sin(i*92.23+index*91.7)*47123.727;return x-Math.floor(x)};
 const floorMat=book.world==='void'?'obsidian':book.world==='eclipse'?'bronze':'stone';
 // Skyward boundaries and distant terrain, no fixed browser background textures are requested at runtime.
 ob(root,'cube',floorMat,[0,-.45,-6],[15.8,.8,90]);ob(root,'cube','dark',[0,-.61,-6],[19,.5,93]);
 for(let i=0;i<26;i++){const z=17-i*2.05;ob(root,'cube',i%4===0?'metal':'stone',[0,.012,z],[14.8,.08,1.92]);if(i%3===0){for(const side of [-1,1])ob(root,'cube','softblue',[side*6.5,.062,z],[.08,.05,1.55])}}
 for(let i=0;i<14;i++){let z=15-i*3.95;for(const side of [-1,1]){
    const x=side*9.3;
    ob(root,'cube',book.world==='eclipse'?'bronze':'stone',[x,2.5,z],[1.45,5,1.6]);ob(root,'cube','metal',[x,5.0,z],[2.1,.45,2.2]);ob(root,'taper','dark',[x,6.7,z],[1.9,3.2,1.9]);ob(root,'spike',i%5===0?'pale':'metal',[x,9.1,z],[1.35,3.1,1.35]);
    if(i%2===0){ob(root,'cube',book.world==='eclipse'?'red':'blue',[side*8.47,3.3,z+1.01],[.055,1.25,.09]);ob(root,'sphere',book.world==='eclipse'?mkmat('#ff724d',1,.38):mkmat('#83d5f2',1,.27),[side*8.42,4.25,z+1.0],[.5,.65,.2]);}
    if(i%3===0){const c=ob(root,'crystal',i%2?'blue':'ice',[side*11,8.5,z],[.42,2.1,.52],[.18,seed(i*4),side*.3]);stage.floaters.push({n:c,base:8.5,phase:i+side});}
    if(i%4===1){ob(root,'cube','bronze',[side*7.6,.8,z],[.6,1.4,.65]);ob(root,'sphere','flame',[side*7.6,1.95,z],[.7,1,.7]);}
  }
  if(i%2===0 && book.world!=='void' && book.world!=='city'){const pz=z-.1;ob(root,'cube','metal',[0,10.1,pz],[17,.28,1]);for(const side of [-1,1]){const n=ob(root,'cube','dark',[side*3.45,12,pz],[.45,7.8,.7],[0,0,side*.75]);n.pos[0]=side*3.6;}ob(root,'spike','metal',[0,15.7,pz],[2,4.2,1.1]);}
 }
 // Landmark silhouettes beyond the walkable causeway.
 for(let i=0;i<16;i++){const side=i%2?-1:1,xx=side*(18+seed(i+50)*27),zz=22-seed(i+100)*95,h=9+seed(i+400)*22;spire(root,xx,-2,zz,h,i%3===0?'metal':'dark');if(i%4===0){ob(root,'crystal','softblue',[xx,4+seed(i)*17,zz+4],[1.2,5,1.1],[.3,.4,0])}}
 if(book.world==='city'){
  for(let i=0;i<18;i++){const z=-36-seed(i+65)*57,x=(i%2?-1:1)*(12+seed(i+11)*30),h=7+seed(i+8)*13;spire(root,x,-6,z,h,'metal');if(i%3===0)ob(root,'cube',mkmat('#64d7f5',1,.55),[x+1,h/2-5,z+1],[.38,h*.9,.09]);}
  for(let i=0;i<5;i++)beam(root,[-20,-1,-31-i*8],[20,-1,-31-i*8],.3,'bronze');
 }
 if(book.world==='eclipse'){
  ob(root,'sphere',mkmat('#080713',0,1),[20,34,-110],[26,26,5]);ob(root,'torus',mkmat('#f56572',1.6,.85),[20,34,-109],[28,28,1]);ob(root,'torus',mkmat('#ab3d49',1,.48),[20,34,-111],[33,33,1]);
  for(let i=0;i<6;i++)ob(root,'cube','bronze',[(i-2.5)*4,-.1,-28],[.25,.2,11]);
 }
 if(book.world==='void'){
  for(let i=0;i<38;i++){const x=(seed(i+210)-.5)*50,z=(seed(i+240)-.6)*108,y=(seed(i+270)-.5)*14+3;const n=ob(root,'cube',i%5===0?'softblue':'stone',[x,y,z],[1+seed(i)*3,.2+seed(i+6)*.3,1+seed(i+18)*4],[seed(i)*.3,seed(i+30)*2,seed(i+20)*.4]);stage.floaters.push({n,base:y,phase:i*.47});}
 }
 // Each realm gains its own architectural language beyond the shared pilgrimage route.
 adornRealm(root,index,stage,seed);
 // Thin floor inscriptions lead the viewer through the acts.
 for(let i=0;i<13;i++){let z=15-i*3.65;ob(root,'cube',i%4===0?'blue':'bronze',[0,.095,z],[.09,.03,.75]);if(i%3===0){ob(root,'cube','gold',[-1.1,.095,z],[.6,.03,.04]);ob(root,'cube','gold',[1.1,.095,z],[.6,.03,.04]);}}
 // Three walk-up memory reliquaries; the scenes are physically encountered in order.
 ALTA_POS.forEach(([x,y,z],i)=>{const a=group(root,[x,0,z]);ob(a,'cube','metal',[0,.34,0],[2.1,.68,2.1]);ob(a,'cube','bronze',[0,1,0],[1.45,1.15,1.4]);ob(a,'taper','dark',[0,2.1,0],[1.65,1.3,1.5]);const orb=ob(a,'crystal',{c:'#8ef2ff',g:1.5,a:.88},[0,3.2,0],[.83,1.75,.84],[0,i*.4,.2]);const sigil=ob(a,'torus',mkmat('#6fe3ff',1,.68),[0,2.65,0],[3,3,1],[Math.PI/2,0,0]);const witness=ob(a,'crystal',mkmat('#90ffc8',1.2,.76),[0,5.55,0],[.55,2.3,.55]);witness.visible=false;for(let j=0;j<4;j++){const ang=j*Math.PI/2;ob(a,'spike','bronze',[Math.cos(ang)*1.2,2.4,Math.sin(ang)*1.2],[.26,1.6,.26]);}stage.altars.push({a,orb,sigil,witness,i});createVignette(root,index,i,x<0?-7.45:7.45,z,stage);});
 // Portal after the third memory.
 const portal=group(root,PORTAL_POS);ob(portal,'cube','stone',[0,1.0,0],[4.6,2,3]);for(let side of [-1,1]){ob(portal,'cube','metal',[side*2.4,5,0],[1.1,8,1.3]);ob(portal,'spike','dark',[side*2.4,10,0],[1.25,3,1.35]);}ob(portal,'cube','metal',[0,8.5,0],[4,.8,1.2]);portal.user=ob(portal,'torus',mkmat('#6fd9ff',1.6,.55),[0,5,0],[7.7,7.7,1]);stage.portal=portal;
 // Floating embers and blue shards; seeded once, updated only by one animation owner.
 for(let i=0;i<28;i++){const x=(seed(i+600)-.5)*34,y=1+seed(i+650)*18,z=22-seed(i+700)*80;const n=ob(root,'crystal',mkmat(i%4===0?'#f28e5b':'#5ed9f7',i%4===0?1.2:.8,.72),[x,y,z],[.10+seed(i)*.13,.24+seed(i+20)*.36,.1],[seed(i+31)*2,seed(i+43)*5,0]);stage.embers.push({n,origin:[x,y,z],phase:seed(i+35)*10});}
 stage.titan=createTitan(root,book,index,stage);
 stage.player=createPlayer(root,stage);
 applyProgress(stage);
 return stage;
}
function createPlayer(root,stage){const traveler=group(root,[0,0,12]);const cloak=ob(traveler,'taper','black',[0,1.12,0],[1.18,1.95,.83],[0,0,0]);const upper=ob(traveler,'sphere','dark',[0,1.92,.04],[.87,.9,.74]);ob(traveler,'sphere','black',[0,2.35,.19],[.71,.76,.72]);ob(traveler,'sphere',mkmat('#0b111a',0,1),[0,2.28,.47],[.55,.55,.17]);ob(traveler,'spike','metal',[0,1.1,-.43],[1,1.55,.62],[2.7,0,0]);for(let side of [-1,1]){ob(traveler,'cyl','metal',[side*.48,.53,0],[.17,1.2,.21],[0,0,side*.1]);ob(traveler,'cyl','dark',[side*.65,1.64,.05],[.22,1.02,.26],[0,0,side*.24]);}const bag=ob(traveler,'cube','bronze',[-.49,1.53,-.41],[.45,.6,.34]);
 const dog=group(root,[1.35,0,12.7]);ob(dog,'sphere','bronze',[0,.62,0],[.6,.62,1.13]);ob(dog,'sphere','metal',[0,.71,.55],[.68,.73,.56]);ob(dog,'sphere','dark',[0,.67,.86],[.44,.4,.42]);ob(dog,'sphere','bone',[0,.45,1.06],[.24,.19,.23]);for(let side of [-1,1]){ob(dog,'spike','metal',[side*.37,1.15,.51],[.29,.65,.32],[0,0,side*.22]);for(let z of [-.34,.42])ob(dog,'cyl','bronze',[side*.29,.24,z],[.18,.48,.22])}ob(dog,'spike','dark',[0,.72,-.85],[.18,1,.18],[1.15,0,0]);
 const aura=ob(traveler,'torus',mkmat('#6fd5ec',.6,.13),[0,.055,0],[2.6,2.6,1],[Math.PI/2,0,0]);return{traveler,dog,cloak,upper,bag,aura}}
function createTitan(root,book,index,stage){const titan=group(root,index===4?[0,-1,-76]:index===5?[0,0,-69]:[0,0,-52]);stage.titan=titan;
 if(index===5){
  const orb=ob(titan,'sphere','black',[0,18,0],[14,14,14]);stage.mask=orb;
  const halo=ob(titan,'torus',mkmat('#72edff',1.5,.95),[0,18,1],[31,31,1]);const inner=ob(titan,'sphere',mkmat('#7bedff',1.8,.8),[0,18,8],[3.8,3.8,3.8]);const inner2=ob(titan,'sphere',mkmat('#bbffff',2,.9),[0,18,10],[1.5,1.5,1.5]);
  for(let i=0;i<13;i++){let angle=i*Math.PI*2/13;const r=16+Math.sin(i*12)*3,n=ob(titan,'crystal',i%2?'blue':'ice',[Math.cos(angle)*r,18+Math.sin(angle)*r,0],[.65,3+Math.sin(i*30)*1.8,.65],[.3,0,-angle]);stage.floaters.push({n,base:n.pos[1],phase:i*2});}
  for(let i=0;i<17;i++){let phi=i*.67,a=[Math.sin(i*43)*4,18+Math.cos(i*17)*7,4],b=[Math.sin(i*43+1)*14,18+Math.cos(i*17+1)*13,4];const n=beam(titan,a,b,.095,mkmat('#89eeff',1.8,.75));stage.lights.push({n,phase:i*.5});}
  stage.ring=halo;return titan;
 }
 if(index===4){ // Iona: city shoulders, stone cliff-body, waterfalls and reaching massive claw.
  ob(titan,'sphere','metal',[1,13,0],[19,24,12]);ob(titan,'taper','stone',[0,8,0],[16,18,13]);for(let i=0;i<27;i++){let a=i*.83,x=Math.sin(a)*8.4,y=6+(i%7)*2,z=-1+Math.cos(a)*4.3;spire(titan,x,y,z,6+(i%5)*2.1,i%4===0?'bronze':'dark')}
  ob(titan,'sphere','bone',[0,27,2],[7.7,11.3,6]);const f=ob(titan,'plane',mkmat('#e1f2fa',1,1,makeMask('iona')),[0,27,7.05],[8.25,10.6,1]);stage.mask=f;
  crystals(titan,24,10,25,6,false);
  for(let i=0;i<18;i++){const xx=(i-9)*.66;const n=ob(titan,'cube',mkmat('#5ad9fd',1,.47),[xx,12-(i%4),7],[.18,20+(i%5)*4,.08]);stage.lights.push({n,phase:i*.31})}
  for(let i=0;i<7;i++){const xx=(i-3)*3.2;ob(titan,'cube',mkmat('#60d8ff',1,.32),[xx,2,9.5],[.4,9+Math.abs(i-3)*2,.08]);}
  const arm=group(titan,[9,17,3]);beam(arm,[0,0,0],[7,-8,6],4,'metal');beam(arm,[7,-8,6],[8.5,-13,8],3,'dark');ob(arm,'sphere','metal',[8,-13,8],[6,2.5,4]);for(let i=0;i<5;i++){const xx=5+(i-2)*2;beam(arm,[xx,-13,8],[xx+1,-19+Math.abs(i-2),11],.62,'dark');ob(arm,'spike','blue',[xx+1.1,-20+Math.abs(i-2),11],[.9,3.7,.78],[.3,0,(i-2)*.12]);}
  stage.ring=ob(titan,'torus',mkmat('#66d9ff',.9,.34),[0,27,-4],[19,23,1]);stage.arm=arm;return titan;
 }
 // Repeating visual DNA from the source: armored torso / crystal halo / black hood / luminous chest.
 ob(titan,'sphere','black',[0,7.7,0],[10,12,6]);ob(titan,'sphere','metal',[0,7.1,.5],[8.6,9.8,5.6]);ob(titan,'taper','dark',[0,3.6,0],[7,8,5]);
 for(let i=0;i<9;i++){const y=11.35-i*.95,len=3.85-Math.abs(i-4)*.3;for(let side of [-1,1]){let a=[side*.15,y,2.75],b=[side*len,y-.4-Math.sin(i*.6)*.2,3.12];beam(titan,a,b,.2,index===2?'red':'blue');}}
 beam(titan,[0,11.4,3],[0,4.4,3.55],.32,'ice');
 ob(titan,'sphere','black',[0,15.4,1.1],[7,8,6.2]);ob(titan,'sphere','dark',[0,16,1.8],[5.3,6.6,4.6]);
 const maskName=index===0?'x':index===1?'skull':index===2?'horn':'skull';
 const mask=ob(titan,'plane',mkmat('#dcf7ff',1,1,makeMask(maskName)),[0,16.4,4.21],[5.2,index===1?5.7:5.0,1]);stage.mask=mask;
 const halo=ob(titan,'torus',mkmat(index===2?'#ed6074':'#7deaff',1.25,.66),[0,16.1,-3],[21,21,1]);stage.ring=halo;
 for(let i=0;i<18;i++){let angle=Math.PI*2*i/18,xx=Math.sin(angle)*9,yy=16.1+Math.cos(angle)*9.2;const n=ob(titan,'crystal',i%4===0?'ice':'blue',[xx,yy,-2.3],[.6,5.8+(i%5),.5],[0,0,-angle]);stage.floaters.push({n,base:yy,phase:i*.5});}
 for(let i=0;i<7;i++){const side=i%2?-1:1,x=side*(5+(i%4)*1.4);ob(titan,'spike','metal',[x,10+(i%3)*2,0],[1.6,3.6+(i%4),1.5],[0,0,-side*.5]);}
 const arms=[];for(let side of [-1,1]){
  const arm=group(titan,[side*4.7,11.1,0]);ob(arm,'sphere','metal',[side*.7,-.2,.5],[3.6,3.1,3]);beam(arm,[side*.7,-.3,.5],[side*3.3,-3.9,1.8],2.8,'dark');ob(arm,'sphere','metal',[side*3.1,-3.7,1.8],[2.9,2.6,2.6]);beam(arm,[side*3.1,-3.7,1.8],[side*4.3,-7.7,3.3],2.1,'metal');ob(arm,'sphere','dark',[side*4.4,-8.1,3.3],[2.65,2.15,2.1]);for(let i=0;i<4;i++){const x=side*(2.9+i*1);beam(arm,[x,-8.5,3],[x+side*.5,-10.6+(i%2)*.35,4.8],.47,'metal');ob(arm,'spike',i%2===0?'blue':'metal',[x+side*.55,-11.9+(i%2)*.35,5],[.63,2.6,.65],[.38,0,side*.18]);}arms.push(arm)}stage.arms=arms;
 const chestTex=makeMask('thaum');const chest=ob(titan,'plane',mkmat('#95f4ff',1.3,1,chestTex),[0,8.1,3.75],[5.7,5.7,1]);stage.chest=chest;
 ob(titan,'torus',mkmat('#73d8f7',1,.73),[0,8.2,3.72],[6.5,6.5,.6]);
 for(let i=0;i<9;i++){const a=i*.6-.9;ob(titan,'cube','metal',[Math.sin(i*1.43)*2.6,7.8-(i%3)*1.15,-2.1],[.32,3,.5],[0,0,a]);}
 if(index===0){ // Torn layered hood and lateral filaments surrounding the precise LED smile.
  for(let i=0;i<12;i++){let side=i%2?-1:1,xx=side*(3+(i%5)*.4);beam(titan,[xx,18,2],[xx+side*.4,7-(i%3)*1.6,1.5],.09,'bronze');}
 }
 if(index===1){ // Bone-white scream; severe cathedral spikes.
  for(let i=0;i<9;i++){let xx=(i-4)*.71;ob(titan,'crystal','pale',[xx,12.1,-2.4],[.45,3.5+(i%3)*1,.5],[0,0,(i-4)*.11]);}
 }
 if(index===2){ // Two iron horns and a brutal azure grin, exactly the red-eclipse visual form.
  beam(titan,[-2.25,19.1,1.8],[-4.0,24.7,1.9],.88,'metal');ob(titan,'spike','dark',[-4.5,26.0,2.0],[1.3,4,1.4],[0,0,-.2]);beam(titan,[2.25,19.1,1.8],[4.0,24.7,1.9],.88,'metal');ob(titan,'spike','dark',[4.5,26.0,2.0],[1.3,4,1.4],[0,0,.2]);ob(titan,'crystal','blue',[0,21.25,2.3],[.75,1.8,.7]);
  for(let i=0;i<6;i++)beam(titan,[Math.sin(i)*7,13,2],[Math.sin(i+2)*8,5,2],.1,'bronze');
 }
 if(index===3){ // The god who eats architectural sound: expanded waveform mouth at its chest.
  chest.scale=[9,9,1];chest.pos=[0,8.5,4];ob(titan,'torus',mkmat('#83ddef',1.6,.8),[0,8.5,3.9],[10,10,.5]);for(let i=0;i<9;i++){let a=(i-4)*.38;const n=ob(titan,'torus',mkmat('#539ac4',.9,.3),[0,8.5,2],[7.2+i*.23,7.2+i*.23,.4],[.04,0,a]);stage.floaters.push({n,base:8.5,phase:i*.22});}
 }
 return titan;
}
function createVignette(root,chapter,act,x,z,stage){
 const v=group(root,[x,0,z-1.5]);const base=chapter===2?'bronze':chapter===4?'stone':'metal';
 ob(v,'cube',base,[0,.18,0],[4,.36,4]);
 if(chapter===0){
  if(act===0){for(let i=0;i<6;i++){const p=-1.4+i*.55;ob(v,'cyl','metal',[p,1.45,.2],[.31,2.5,.31]);ob(v,'sphere',mkmat('#65d8f7',1,.75),[p,2.67,.2],[.26,.35,.26]);}ob(v,'torus','blue',[0,1.6,-.35],[3.3,3.3,.25]);}
  if(act===1){ob(v,'torus','gold',[0,2.5,0],[6.1,6.1,.3]);ob(v,'torus','blue',[0,2.5,.2],[4.8,4.8,.2]);for(let i=0;i<12;i++){const a=i*Math.PI/6;beam(v,[0,2.5,.4],[Math.sin(a)*2.1,2.5+Math.cos(a)*2.1,.4],.065,'blue');}}
  if(act===2){ob(v,'plane',mkmat('#b6f6ff',1,.92,makeMask('x')),[0,3.5,-.3],[4.6,5.4,1]);ob(v,'spike','black',[0,1.13,1],[.8,1.9,.5]);ob(v,'sphere','bone',[0,2,1],[.44,.44,.44]);}
 }
 if(chapter===1){
  if(act===0){ob(v,'cube','bronze',[0,1.0,0],[2.3,1,.8]);ob(v,'cube','metal',[0,2.4,-.38],[2.3,2.2,.25]);for(let i=0;i<4;i++)beam(v,[-1.5+i,4,-.4],[-.6+i*.4,2.6,.4],.12,'pale');ob(v,'sphere','bone',[0,3.1,.1],[.5,.54,.4]);}
  if(act===1){for(let i=0;i<6;i++){let a=i*Math.PI/3,x0=Math.cos(a)*1.5,z0=Math.sin(a)*1.5;ob(v,'cyl','bone',[x0,.95,z0],[.45,1.6,.44]);ob(v,'sphere','bone',[x0,2,z0],[.5,.55,.48]);}}
  if(act===2){ob(v,'torus','pale',[0,2.4,0],[5.4,5.4,.7]);ob(v,'sphere','red',[0,2.5,.6],[1.35,1.65,.9]);const n=ob(v,'sphere',mkmat('#fb6d79',1.7,.4),[0,2.5,.6],[1.7,1.95,1.4]);stage.lights.push({n,phase:3});}
 }
 if(chapter===2){
  if(act===0){ob(v,'cube','metal',[0,1.4,0],[2.9,2.6,.7]);ob(v,'cube','blue',[0,1.5,.4],[1.7,.06,.07]);for(let j=0;j<5;j++)ob(v,'cube','gold',[-.7,2.1-j*.24,.5],[1.4,.04,.03]);}
  if(act===1){for(let i=0;i<3;i++){const x0=(i-1)*1.4;ob(v,'cube','stone',[x0,1.5,0],[1.1,2,.85]);ob(v,'spike','bronze',[x0,3.15,0],[1.1,1.45,.8]);}ob(v,'torus','red',[0,3,-.2],[5.8,5.8,.3]);}
  if(act===2){for(let i=0;i<4;i++){let yy=.8+i*.7;beam(v,[-1.7,yy,0],[1.7,yy+.2,0],.14,'bronze');}ob(v,'torus','red',[0,2.3,.8],[3.7,3.7,.3]);ob(v,'spike','metal',[0,4,.2],[1,2.5,.8]);}
 }
 if(chapter===3){
  if(act===0){for(let i=0;i<3;i++){const x0=(i-1)*1.2;ob(v,'cyl','bronze',[x0,1.75,0],[.9,2.7,.9]);ob(v,'sphere','gold',[x0,2.7,0],[.92,.55,.94]);ob(v,'torus','blue',[x0,1.1,.2],[1.5,1.5,.2]);}}
  if(act===1){for(let side of [-1,1]){ob(v,'cube','stone',[side*1.25,1.8,0],[.85,3.2,1.0]);ob(v,'spike','dark',[side*1.25,4.25,0],[1.2,2,.8]);}beam(v,[-1.25,3.45,0],[1.25,3.45,0],.3,'bronze');ob(v,'cube','blue',[0,1.5,.6],[.09,2,.05]);}
  if(act===2){ob(v,'plane',mkmat('#caffff',1,.96,makeMask('thaum')),[0,2.4,.35],[4.1,4.1,1]);ob(v,'torus','blue',[0,2.4,0],[5.7,5.7,.2]);}
 }
 if(chapter===4){
  if(act===0){for(let i=0;i<6;i++){const x0=(i-2.5)*.65;spire(v,x0,0,i%2?.1:-.5,2.8+(i%3),i%3?'dark':'metal');}}
  if(act===1){ob(v,'cube','bronze',[0,.96,0],[2.4,.28,1.5]);for(let x0 of [-.8,.8]){ob(v,'cube','metal',[x0,.48,-1],[.45,.6,.5]);ob(v,'cube','metal',[x0,.48,1],[.45,.6,.5]);}ob(v,'sphere','flame',[0,1.32,0],[.32,.4,.3]);}
  if(act===2){for(const side of [-1,1])ob(v,'cube','stone',[side*1.25,1.8,0],[.5,3.3,.8]);ob(v,'cube','metal',[0,3.55,0],[3,.5,.85]);ob(v,'cube','pale',[0,3.0,.5],[1.2,.08,.04]);}
 }
 if(chapter===5){
  if(act===0){ob(v,'sphere','black',[0,2.25,0],[2.5,2.5,2.5]);ob(v,'torus','ice',[0,2.25,0],[5.3,5.3,.5]);ob(v,'torus','blue',[0,2.25,0],[5.3,5.3,.5],[1.0,1.2,0]);}
  if(act===1){for(let i=0;i<5;i++){const x0=(i-2)*.66;spire(v,x0,0,-.3+i%2*.4,2+(i%4),i%2?'pale':'softblue');}}
  if(act===2){ob(v,'torus','ice',[0,2.4,0],[5.5,5.5,.5]);for(let i=0;i<6;i++){let a=i/6*Math.PI*2;ob(v,'plane',mkmat('#b9fdff',1,.8,makeMask(i%2===0?'skull':'x')),[Math.cos(a)*2,2.4+Math.sin(a)*2,.8],[.7,1.05,1]);}}
 }
}
function applyProgress(stage){const idx=BOOK.indexOf(stage.book),accent=stage.world==='eclipse'?'red':stage.world==='basilica'?'pale':'blue';stage.altars.forEach((a,i)=>{const key=idx+':'+i,complete=!!saved.events[key],next=i===firstPending(idx);const free=saved.decisions[key]===0;a.orb.mat=complete?mkmat(free?'#80f7d5':'#f6ac8d',1.4,.89):next?mkmat('#9cf2ff',1.8,.92):mkmat('#304957',.23,.55);a.sigil.mat=complete?mkmat(free?'#8af9e8':'#ed957e',1.3,.88):next?mkmat('#71d6ec',1,.7):mkmat('#345563',.24,.28);a.witness.visible=complete;a.witness.mat=mkmat(free?'#70eacf':'#ff9e81',1.4,.7);});if(stage.portal&&stage.portal.user){stage.portal.user.mat=firstPending(idx)===3?mkmat('#9cf9ff',1.9,.85):mkmat('#3e6975',.3,.25);}if(stage.mask&&idx===0&&firstPending(0)===3)stage.mask.mat.a=.09;}
function firstPending(index){for(let i=0;i<3;i++)if(!saved.events[index+':'+i])return i;return 3}
function animateStage(stage,t,delta){const move=APP.motion?1:0;stage.altars.forEach(({orb,i})=>{orb.pos[1]=3.2+move*Math.sin(t*1.7+i*1.8)*.25;orb.rot[1]+=delta*.27*move});for(const f of stage.floaters){f.n.pos[1]=f.base+move*Math.sin(t*.6+f.phase)*.45;f.n.rot[1]+=delta*.21*move}for(const e of stage.embers){const n=e.n,origin=e.origin;let speed=move?1:0;n.pos[1]=origin[1]+speed*Math.sin(t*.9+e.phase)*1.9;n.pos[0]=origin[0]+speed*.45*Math.sin(t*.33+e.phase);n.rot[0]+=delta*.16*speed;}if(stage.titan){stage.titan.pos[1]=(stage.world==='city'?-1:0)+move*Math.sin(t*.42)*.45;if(stage.arms)stage.arms.forEach((a,i)=>a.rot[2]=move*Math.sin(t*.52+i*2)*.05);if(stage.arm)stage.arm.rot[0]=move*Math.sin(t*.38)*.045;if(stage.ring)stage.ring.rot[2]+=(stage.world==='void'?.05:.009)*delta*move;}if(stage.lights.length){for(let l of stage.lights){if(l.n.mat.a!==undefined)l.n.mat.a=.34+move*.25*(.5+.5*Math.sin(t*1.5+l.phase));}}if(stage.portal&&stage.portal.user){stage.portal.user.rot[1]=move*Math.sin(t*.45)*.2;}animateRealmIdentity(stage,t,delta);}
