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
function sourceNave(root,index,stage,seed){
 const accent=index===2?'red':index===1?'pale':'blue';
 // The film's strongest world signature: an open cathedral aisle, warm fire at
 // human scale, cyan glass above it, and an unobstructed view of the god.
 for(let i=0;i<12;i++){
  const z=17-i*5.25;
  for(const side of [-1,1]){
   const x=side*(11.4+(i%2)*.45);
   ob(root,'cube','dark',[x,5.5,z],[1.05,11,1.15]);
   ob(root,'spike','metal',[x,12.1,z],[1.25,4.6,1.2]);
   beam(root,[x,9.8,z],[side*5.2,17.2,z],.34,'metal');
   beam(root,[side*5.2,17.2,z],[side*.65,19.1,z],.26,accent);
   if(i%2===0){
    ob(root,'cube','bronze',[side*7.55,.62,z],[.58,1.22,.58]);
    const fl=ob(root,'sphere','flame',[side*7.55,1.58,z],[.42,.72,.42]);
    stage.flames.push({n:fl,baseS:[.42,.72,.42],phase:i+side});
    ob(root,'crystal',i%4===0?'ice':'blue',[side*13.2,10.4,z-.5],[.48,3.1,.5],[.2,0,side*.15]);
   }
  }
 }
 for(let i=0;i<18;i++){
  const side=i%2?-1:1,z=14-Math.floor(i/2)*6.05,x=side*(8.1+(i%3)*.32);
  ob(root,'cube','bronze',[x,.3,z],[.34,.58,.34]);
  const fl=ob(root,'sphere','flame',[x,.83,z],[.24,.46,.24]);
  stage.flames.push({n:fl,baseS:[.24,.46,.24],phase:i*1.3});
 }
 // Far rose-window tracery frames the titan without crossing the walkable view.
 ob(root,'torus',index===2?'red':'blue',[0,19.2,-61],[13.5,13.5,.32]);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;beam(root,[0,19.2,-60.7],[Math.sin(a)*7.8,19.2+Math.cos(a)*7.8,-60.7],.09,index===2?'red':'blue');}
}
function buildWorld(renderer,index){const book=BOOK[index],style=WORLD_STYLES[book.world],root=new Node();if(renderer.reset)renderer.reset(root);else{renderer.root=root;renderer.texCache.forEach(t=>renderer.gl.deleteTexture(t));renderer.texCache.clear();}const stage={root,book,style,altars:[],embers:[],floaters:[],flames:[],titan:null,mask:null,face:null,ring:null,player:null,companion:null,portal:null,monoliths:[],banners:[],lights:[],sky:[],realmDetails:[],world:book.world};
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
  if(i%2===0 && book.world!=='void' && book.world!=='city'){const pz=z-.1;for(const side of [-1,1]){beam(root,[side*9.1,7.2,pz],[side*4.4,14.8,pz],.28,'metal');beam(root,[side*4.4,14.8,pz],[side*.7,17.1,pz],.2,i%4===0?'blue':'dark');}ob(root,'crystal',i%4===0?'ice':'metal',[0,17.5,pz],[.38,1.35,.4]);}
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
 sourceNave(root,index,stage,seed);
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
function createTitan(root,book,index,stage){
 const position=index===4?[0,-4,-66]:index===5?[0,-1,-58]:[0,-2,-55];
 const scale=index===4?[1.22,1.22,1.22]:index===5?[1.12,1.12,1.12]:[1.38,1.38,1.38];
 const titan=group(root,position,scale);stage.titan=titan;
 if(index===5){ // The film resolves Azrath as a suspended electric birth-event.
  const outer=ob(titan,'sphere',mkmat('#287aa4',1.45,.22),[0,18,0],[10.5,10.5,10.5]);
  const core=ob(titan,'sphere',mkmat('#d9ffff',2.4,.94),[0,18,2.8],[5.4,5.4,5.4]);stage.mask=core;
  const halo=ob(titan,'torus',mkmat('#7cecff',2,.92),[0,18,1],[18.5,18.5,.75]);
  ob(titan,'torus',mkmat('#baf8ff',1.7,.58),[0,18,-.5],[23,23,.32],[.35,.2,.15]);
  for(let i=0;i<20;i++){const angle=i*Math.PI*2/20,r=12+(i%4)*1.2,n=ob(titan,'crystal',i%3?'blue':'ice',[Math.cos(angle)*r,18+Math.sin(angle)*r,1],[.38,2.2+(i%5)*.55,.4],[.25,0,-angle]);stage.floaters.push({n,base:n.pos[1],phase:i*.6});}
  for(let i=0;i<14;i++){const a=i*.91,b=i*1.77,n=beam(titan,[Math.sin(a)*5,18+Math.cos(a)*5,3],[Math.sin(b)*20,18+Math.cos(b)*14,3],.12,mkmat('#a9f8ff',2,.8));stage.lights.push({n,phase:i*.43});}
  for(let i=0;i<11;i++)spire(titan,(i-5)*3.1,-8,-2-(i%3)*2,5+Math.abs(i-5)*1.4,i%3?'dark':'softblue');
  stage.ring=halo;return titan;
 }
 if(index===4){ // Iona: the skull-faced city body and its luminous waterfalls.
  ob(titan,'sphere','black',[0,14,0],[18,24,11]);ob(titan,'taper','stone',[0,7,0],[16,20,12]);
  for(let i=0;i<31;i++){const a=i*.81,x=Math.sin(a)*9,y=4+(i%8)*2.5,z=-1+Math.cos(a)*4;spire(titan,x,y,z,5+(i%5)*2.4,i%4===0?'bronze':'dark')}
  ob(titan,'sphere','bone',[0,29,2.2],[8.1,11.6,6.1]);const face=ob(titan,'plane',mkmat('#e9f6f7',1.25,1,makeMask('iona')),[0,29,8.05],[8.6,11.2,1]);stage.mask=face;stage.face=face;
  crystals(titan,28,11.2,28,7,true);
  for(let i=0;i<16;i++){const x=(i-7.5)*.78,n=ob(titan,'cube',mkmat('#65e7ff',1.6,.62),[x,14-(i%4),7.1],[.21,23+(i%5)*4,.1]);stage.lights.push({n,phase:i*.31})}
  for(let i=0;i<9;i++)spire(titan,(i-4)*3.2,-3,8,8+Math.abs(i-4)*1.7,i%3?'dark':'metal');
  const arm=group(titan);beam(arm,[8.5,18,2.5],[15,10,8],4,'metal');beam(arm,[15,10,8],[18,4,12],3,'dark');ob(arm,'sphere','metal',[18,4,12],[6.4,3.1,4.2]);for(let i=0;i<5;i++){const x=14+(i-2)*2.25;beam(arm,[x,4,12],[x+1,0+Math.abs(i-2),16],.68,'dark');ob(arm,'spike','blue',[x+1.2,-1+Math.abs(i-2),16.5],[.95,4.2,.85],[.35,0,(i-2)*.13]);}
  stage.ring=ob(titan,'torus',mkmat('#65e5ff',1.4,.5),[0,29,-4],[19,23,.8]);stage.arm=arm;return titan;
 }
 // Shared film silhouette: colossal black armor, luminous ribs, mask, claws and crystal corona.
 const accent=index===2?'red':'blue',haloColor=index===2?'#ff5d72':'#70e8ff';
 ob(titan,'taper','black',[0,3.1,0],[8.8,10.5,5.7]);
 ob(titan,'sphere','black',[0,9.2,0],[12.2,13.4,6.7]);
 ob(titan,'sphere','metal',[0,9.4,.75],[10.2,11.7,6.1]);
 ob(titan,'taper','dark',[0,5.2,1.2],[8.9,8.8,5.8]);
 for(let i=0;i<10;i++){const y=13-i*.93,len=5.25-Math.abs(i-4.5)*.34;for(const side of [-1,1])beam(titan,[side*.3,y,4.1],[side*len,y-.42,4.75],.25,index===2&&i%2?'red':'ice');}
 beam(titan,[0,13.4,4.15],[0,3.7,5],.39,'ice');
 for(const side of [-1,1]){
  ob(titan,'sphere','metal',[side*8.2,13.2,.6],[5.1,3.5,4.2]);
  for(let j=0;j<5;j++)ob(titan,'spike',j%2?'dark':'metal',[side*(8.5+j*1.15),14.2+j*.35,-.2],[1.35,3.7+j*.7,1.25],[.1,0,-side*(.55+j*.08)]);
 }
 ob(titan,'sphere','black',[0,19.2,1],[7.4,8.3,6.1]);ob(titan,'taper','dark',[0,18.1,1.5],[7.3,8.5,5.7],[Math.PI,0,0]);
 const maskName=index===0?'x':index===2?'horn':'skull';
 const mask=ob(titan,'plane',mkmat('#efffff',1.35,1,makeMask(maskName)),[0,19.4,6.25],[6.35,index===1?7.1:6.25,1]);stage.mask=mask;stage.face=mask;
 const halo=ob(titan,'torus',mkmat(haloColor,1.65,.72),[0,19,-3.5],[20.5,20.5,.75]);stage.ring=halo;
 for(let i=0;i<24;i++){const angle=Math.PI*2*i/24,r=11.6+(i%3)*.45,x=Math.sin(angle)*r,y=19+Math.cos(angle)*r;const n=ob(titan,'crystal',i%4===0?'ice':'blue',[x,y,-2.6],[.72,6.2+(i%6)*1.05,.65],[.05,0,-angle]);stage.floaters.push({n,base:y,phase:i*.45});}
 const arms=[];for(const side of [-1,1]){
  const arm=group(titan);beam(arm,[side*7.4,13,.8],[side*12.2,8.5,3.1],3.35,'dark');ob(arm,'sphere','metal',[side*12.1,8.4,3.1],[3.5,3.1,3.25]);beam(arm,[side*12.1,8.2,3.1],[side*14.3,3.3,6.2],2.55,'metal');ob(arm,'sphere','dark',[side*14.5,2.9,6.4],[3.6,2.4,2.7]);
  for(let i=0;i<5;i++){const x=side*(11.7+i*1.32),tipX=x+side*.7;beam(arm,[x,2.5,6.3],[tipX,-.4+Math.abs(i-2)*.48,9.5],.55,'metal');ob(arm,'spike',i%2?'ice':'blue',[tipX,-1.65+Math.abs(i-2)*.48,10],[.68,3.05,.7],[.36,0,side*.16]);}arms.push(arm);
 }stage.arms=arms;
 const chest=ob(titan,'plane',mkmat('#a9f8ff',1.65,1,makeMask('thaum')),[0,8.7,5.55],[index===3?8.2:5.8,index===3?8.2:5.8,1]);stage.chest=chest;
 ob(titan,'torus',mkmat('#6de7ff',1.45,.8),[0,8.7,5.45],[index===3?9.2:6.7,index===3?9.2:6.7,.6]);
 if(index===0){for(let i=0;i<14;i++){const side=i%2?-1:1,x=side*(3.4+(i%5)*.46);beam(titan,[x,21.7,2],[x+side*.7,8-(i%3)*1.5,1.1],.1,'bronze');}}
 if(index===1){for(let i=0;i<11;i++){const x=(i-5)*.78;ob(titan,'crystal',i%3?'pale':'ice',[x,14.5,-2.1],[.52,4+(i%4)*.9,.55],[0,0,(i-5)*.095]);}}
 if(index===2){beam(titan,[-2.4,22,2.1],[-5.4,28.5,1.7],1.05,'metal');ob(titan,'spike','dark',[-6.2,30,1.6],[1.55,4.8,1.5],[0,0,-.32]);beam(titan,[2.4,22,2.1],[5.4,28.5,1.7],1.05,'metal');ob(titan,'spike','dark',[6.2,30,1.6],[1.55,4.8,1.5],[0,0,.32]);ob(titan,'crystal','ice',[0,24,2.5],[.9,2.3,.85]);}
 if(index===3){for(let i=0;i<7;i++){const a=(i-3)*.3,n=ob(titan,'torus',mkmat('#64d9ff',1,.27),[0,8.7,3],[7.3+i*.42,7.3+i*.42,.35],[.04,0,a]);stage.floaters.push({n,base:8.7,phase:i*.25});}}
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
function animateStage(stage,t,delta){const move=APP.motion?1:0;const pending=firstPending(BOOK.indexOf(stage.book));stage.altars.forEach(({orb,sigil,i})=>{const active=(pending===i);orb.pos[1]=3.2+move*Math.sin(t*1.7+i*1.8)*.25;orb.rot[1]+=delta*(active?.85:.27)*move;if(active){const pulse=1+move*Math.sin(t*3.4)*.1;sigil.scale[0]=3*pulse;sigil.scale[1]=3*pulse;sigil.rot[2]+=delta*.65*move;}});for(const f of stage.floaters){f.n.pos[1]=f.base+move*Math.sin(t*.6+f.phase)*.45;f.n.rot[1]+=delta*.21*move}for(const e of stage.embers){const n=e.n,origin=e.origin;let speed=move?1:0;n.pos[0]=origin[0]+speed*.65*Math.sin(t*.55+e.phase);n.pos[1]=origin[1]+speed*Math.sin(t*.9+e.phase)*2.1;n.pos[2]=origin[2]+speed*.75*Math.cos(t*.42+e.phase);n.rot[0]+=delta*.22*speed;n.rot[1]+=delta*.32*speed;}for(const f of stage.flames||[]){const flick=1+move*(Math.sin(t*8.5+f.phase)*.09+Math.sin(t*14.1+f.phase)*.05);f.n.scale[0]=f.baseS[0]*flick;f.n.scale[1]=f.baseS[1]*flick*1.12;f.n.scale[2]=f.baseS[2]*flick;}if(stage.titan){stage.titan.pos[1]=(stage.world==='city'?-1:0)+move*Math.sin(t*.42)*.45;if(stage.arms)stage.arms.forEach((a,i)=>a.rot[2]=move*Math.sin(t*.52+i*2)*.05);if(stage.arm)stage.arm.rot[0]=move*Math.sin(t*.38)*.045;if(stage.ring)stage.ring.rot[2]+=(stage.world==='void'?.05:.009)*delta*move;if(stage.face){const fp=1+move*Math.sin(t*2.2)*.035,bw=stage.world==='city'?8.6:6.35,bh=stage.world==='city'?11.2:stage.world==='basilica'?7.1:6.25;stage.face.scale[0]=bw*fp;stage.face.scale[1]=bh*fp;}if(stage.chest){const cp=1+move*Math.sin(t*3.8)*.045,baseSz=stage.world==='bells'?8.2:5.8;stage.chest.scale[0]=baseSz*cp;stage.chest.scale[1]=baseSz*cp;}if(stage.world==='void'&&stage.mask){const qp=1+move*(Math.sin(t*7.5)*.035+Math.sin(t*15)*.02);stage.mask.scale[0]=stage.mask.scale[1]=stage.mask.scale[2]=5.4*qp;}}if(stage.heart){const beat=Math.pow(Math.sin(t*2.4),8)*.26+Math.pow(Math.sin(t*2.4-.32),12)*.14;stage.heart.scale[0]=stage.heart.scale[1]=stage.heart.scale[2]=1+move*beat;}if(stage.lights.length){for(let l of stage.lights){if(l.n.mat.a!==undefined)l.n.mat.a=.34+move*.25*(.5+.5*Math.sin(t*1.5+l.phase));}}if(stage.portal&&stage.portal.user){stage.portal.user.rot[1]=move*Math.sin(t*.45)*.2;}animateRealmIdentity(stage,t,delta);}
