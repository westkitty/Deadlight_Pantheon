
// These additions live outside the central causeway so the witness route stays navigable.
function adornRealm(root,index,stage,seed){
 const accent=index===2?'red':index===1?'pale':index===4?'ice':'blue';
 const glyph=(parent,x,y,z,s=1,kind='x')=>ob(parent,'plane',mkmat('#e0f9ff',1,.81,makeMask(kind)),[x,y,z],[1.8*s,2.1*s,1]);
 const bell=(parent,x,y,z,r=1)=>{const b=group(parent,[x,y,z]);ob(b,'taper','bronze',[0,-1.1*r,0],[2.2*r,2.6*r,2.2*r],[Math.PI,0,0]);ob(b,'sphere','dark',[0,-2.3*r,0],[.63*r,.7*r,.63*r]);ob(b,'cyl','gold',[0,.28*r,0],[.24*r,.7*r,.24*r]);ob(b,'torus','bronze',[0,-2.35*r,0],[2.4*r,2.4*r,.3*r],[Math.PI/2,0,0]);return b;};
 const figure=(parent,x,z,y=0,mat='bone')=>{const g=group(parent,[x,y,z]);ob(g,'cyl',mat,[0,1,0],[.42,1.9,.42]);ob(g,'sphere',mat,[0,2.25,0],[.68,.82,.56]);ob(g,'spike','dark',[0,.35,-.28],[.74,1.45,.55],[1.4,0,0]);return g;};
 const overhead=(z,y,mat=accent)=>{for(const s of [-1,1]){beam(root,[s*7.9,y-1,z],[s*4.7,y+2,z],.26,mat);beam(root,[s*4.7,y+2,z],[0,y+3.3,z],.18,mat)}ob(root,'crystal',mat,[0,y+3.3,z],[.5,1.35,.5])};
 stage.realmDetails=[];
 if(index===0){ // Resurrection festival: neon faces, celebration cages, forced return.
  for(let j=0;j<7;j++){const z=12-j*7.4;const s=j%2?-1:1;const x=s*12.3;
   const plinth=group(root,[x,0,z]);ob(plinth,'cube','bronze',[0,.6,0],[4,1.1,2]);ob(plinth,'torus','blue',[0,5.8,0],[5.6,7.2,.5]);glyph(plinth,0,5.8,.65,1.2,j%3?'x':'skull');
   for(let k=0;k<4;k++)ob(plinth,'cyl','metal',[(k-1.5)*.72,2.4,.32],[.19,3.3,.2]);
  }
  for(const z of [6,-16,-32])overhead(z,16,'blue');
  for(let i=0;i<12;i++)ob(root,'crystal','softblue',[(i%2?1:-1)*(14+i%3*2),7+i%4*2,7-i*5.3],[.22,1.7,.28]);
 }
 if(index===1){ // Basilica: utter stillness and ranks of those who stopped desiring.
  for(let j=0;j<13;j++){const z=15-j*4.7;for(const s of [-1,1]){
   figure(root,s*(11.9+j%3*1.1),z,0,j%4===0?'pale':'stone');
   if(j%2===0){ob(root,'crystal','pale',[s*13.8,8,z-1],[.5,7.5,.5]);ob(root,'cube','bone',[s*10.6,5.7,z],[.13,8.5,.2]);}
  }}
  for(const z of [2,-21,-38])overhead(z,17,'pale');
  const heart=group(root,[-19,11,-24]);ob(heart,'sphere','red',[0,0,0],[2.8,3.4,2.2]);ob(heart,'torus','bone',[0,0,-.7],[6.5,6.5,.6]);stage.realmDetails.push({n:heart,phase:1,base:11,kind:'bob'});
 }
 if(index===2){ // Court: testimony tablets, scales and the burning orbit of the Black Meridian.
  for(let j=0;j<9;j++){let z=12-j*7.2;for(let s of [-1,1]){
   const t=group(root,[s*12.9,0,z]);ob(t,'cube','bronze',[0,2.6,0],[3.3,5.2,.95]);ob(t,'cube','dark',[0,2.8,.52],[2.6,3.7,.13]);
   for(let line=0;line<5;line++)ob(t,'cube','red',[0,1.6+line*.5,.64],[1.65-line*.17,.055,.1]);
   ob(t,'spike','metal',[0,6.3,0],[2.8,2.4,1.2]);
  }}
  for(const z of [5,-19,-37]){overhead(z,17,'red');for(const s of [-1,1]){ob(root,'torus','red',[s*12.8,9,z],[3.8,5.2,.25]);ob(root,'sphere','gold',[s*12.8,4.6,z+.4],[.65,.65,.5]);}}
 }
 if(index===3){ // City of Bells: hanging towers, concentric resonances, ruined organ pipes.
  for(let j=0;j<11;j++){const z=12-j*6.2;for(const s of [-1,1]){const x=s*(12+j%3*1.4),y=12+j%4*1.3;const b=bell(root,x,y,z,.8+(j%3)*.17);stage.realmDetails.push({n:b,phase:j*.4+s,base:y,kind:'sway'});ob(root,'cyl','metal',[x*.9,6,z-2],[.55,12,.65]);}}
  for(const z of [-2,-24,-39]){for(const s of [-1,1])for(let k=0;k<2;k++)ob(root,'torus','blue',[s*12.5,10+k*2,z],[3.2+k,3.2+k,.12],[0,0,k*.22]);overhead(z,18,'bronze');}
  for(let i=0;i<17;i++){const side=i%2?-1:1;ob(root,'cyl','gold',[side*(16+i%5*2),3.7,13-i*4.2],[1,8+i%3*4,1]);}
 }
 if(index===4){ // The city-goddess: tiered apartments, orphaned bridges and vertical blue rivers.
  for(let j=0;j<22;j++){let side=j%2?-1:1,z=17-j*3.5,x=side*(13+j%4*2),h=7+(j*7)%17;
   ob(root,'cube',j%5?'stone':'metal',[x,h*.5-1,z],[3.2,h,3.4]);
   for(let k=1;k<=Math.min(7,Math.floor(h/2));k++){ob(root,'cube','pale',[x-side*1.68,k*2-.6,z+.8],[.09,.56,.6]);}
   if(j%4===0){ob(root,'cube',mkmat('#7deaff',1,.4),[x+side*2,5,z+1.9],[.35,10,.12]);}
  }
  for(let j=0;j<5;j++){const z=5-j*11.5;for(let s of [-1,1]){beam(root,[s*20,0,z],[s*18,15,z],.22,'metal');beam(root,[s*18,15,z],[s*9.5,17,z],.28,'bronze');}}
 }
 if(index===5){ // The Unhappened: impossible futures, broken orbital gateways and unborn streets.
  for(let j=0;j<10;j++){let z=12-j*7.2,side=j%2?1:-1;const h=7+j%4*2;ob(root,'torus',j%3?'ice':'blue',[side*15,h,z],[7+j%3*2,8+j%2*2,.3],[.22,j*.22,j*.11]);
   const pl=ob(root,'cube','pale',[side*19,4+j%3*2,z-4],[7,.18,9],[.17,j*.22,.15]);stage.realmDetails.push({n:pl,phase:j*.43,base:pl.pos[1],kind:'bob'});
   for(let k=0;k<4;k++){ob(root,'crystal','ice',[side*(13+k*2),h+4,z+k*.8],[.37,1.6+k*.4,.4],[.3,0,k*.3]);}}
  for(const z of [-9,-32]){overhead(z,20,'ice');for(const s of [-1,1]){ob(root,'sphere','black',[s*14,12,z-1],[3.5,3.5,3.5]);ob(root,'torus','blue',[s*14,12,z],[7,7,.25]);}}
 }
}
function animateRealmIdentity(stage,t,delta){if(!APP.motion)return;for(const v of stage.realmDetails||[]){if(v.kind==='bob')v.n.pos[1]=v.base+Math.sin(t*.35+v.phase)*.4;else if(v.kind==='sway')v.n.rot[2]=Math.sin(t*.48+v.phase)*.085;}}
