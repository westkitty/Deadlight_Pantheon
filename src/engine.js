
const V=(x=0,y=0,z=0)=>[x,y,z];
const add3=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul3=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len3=a=>Math.hypot(a[0],a[1],a[2]);
const norm3=a=>mul3(a,1/Math.max(1e-6,len3(a)));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const id4=()=>new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
function mm(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
function t4(p){const m=id4();m[12]=p[0];m[13]=p[1];m[14]=p[2];return m}
function s4(s){const m=id4();m[0]=s[0];m[5]=s[1];m[10]=s[2];return m}
function rx(a){const m=id4(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m}
function ry(a){const m=id4(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m}
function rz(a){const m=id4(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m}
function localMatrix(n){return mm(mm(mm(mm(t4(n.pos),ry(n.rot[1])),rx(n.rot[0])),rz(n.rot[2])),s4(n.scale))}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)/(near-far);o[11]=-1;o[14]=2*far*near/(near-far);return o}
function lookAt(e,t){const z=norm3(sub3(e,t));let x=norm3(cross3([0,1,0],z));if(len3(x)<.01)x=[1,0,0];const y=cross3(z,x);const m=id4();m[0]=x[0];m[4]=x[1];m[8]=x[2];m[1]=y[0];m[5]=y[1];m[9]=y[2];m[2]=z[0];m[6]=z[1];m[10]=z[2];m[12]=-dot3(x,e);m[13]=-dot3(y,e);m[14]=-dot3(z,e);return m}
class Node{constructor(geo=null,material=null){this.geo=geo;this.mat=material;this.pos=[0,0,0];this.rot=[0,0,0];this.scale=[1,1,1];this.children=[];this.visible=true;this.user=null;this.animate=null;} add(n){this.children.push(n);return n;} at(x,y,z){this.pos=[x,y,z];return this} size(x,y,z){this.scale=[x,y,z];return this} turn(x,y,z){this.rot=[x,y,z];return this}}
const GEO={};
function meshData(verts,inds){return{verts:new Float32Array(verts),inds:new Uint16Array(inds),gpu:null}}
function cube(){let v=[],i=[];const faces=[[[0,0,1],[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]]],[[0,0,-1],[[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]]],[[1,0,0],[[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]]],[[-1,0,0],[[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]]],[[0,1,0],[[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]]],[[0,-1,0],[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]]]];
 faces.forEach(([n,p],f)=>{p.forEach((a,j)=>v.push(...a,...n, j===1||j===2?1:0,j>=2?1:0));i.push(f*4,f*4+1,f*4+2,f*4,f*4+2,f*4+3)});return meshData(v,i)}
function plane(){return meshData([-.5,-.5,0,0,0,1,0,0,.5,-.5,0,0,0,1,1,0,.5,.5,0,0,0,1,1,1,-.5,.5,0,0,0,1,0,1],[0,1,2,0,2,3])}
function sphere(segments=14,rings=10){const v=[],i=[];for(let j=0;j<=rings;j++){let ph=j*Math.PI/rings;for(let k=0;k<=segments;k++){const th=k*2*Math.PI/segments;const x=Math.sin(ph)*Math.sin(th),y=Math.cos(ph),z=Math.sin(ph)*Math.cos(th);v.push(x*.5,y*.5,z*.5,x,y,z,k/segments,1-j/rings)}}for(let j=0;j<rings;j++)for(let k=0;k<segments;k++){const a=j*(segments+1)+k,b=a+segments+1;i.push(a,b,a+1,b,b+1,a+1)}return meshData(v,i)}
function cylinder(type='cyl',segments=12){const v=[],i=[];let top=type==='taper'?.65:type==='spike'?0:1;let bot=type==='spike'?.65:1;for(let j=0;j<=1;j++){let r=j===0?bot:top,y=j-.5;for(let k=0;k<=segments;k++){let th=k*Math.PI*2/segments,x=Math.cos(th),z=Math.sin(th);let nx=x,ny=type==='taper'?.28:0;v.push(x*r*.5,y,z*r*.5,nx,ny,z,k/segments,j)}}for(let k=0;k<segments;k++){const a=k,b=k+segments+1;i.push(a,a+1,b,b,a+1,b+1)}let centerTop=v.length/8;v.push(0,.5,0,0,1,0,.5,.5);let centerBot=v.length/8;v.push(0,-.5,0,0,-1,0,.5,.5);for(let k=0;k<segments;k++){const b=segments+1+k;i.push(centerTop,b,b+1);i.push(centerBot,k+1,k)}return meshData(v,i)}
function octa(){const p=[[0,.65,0],[.45,0,0],[0,0,.45],[-.45,0,0],[0,0,-.45],[0,-.65,0]],f=[[0,2,1],[0,3,2],[0,4,3],[0,1,4],[5,1,2],[5,2,3],[5,3,4],[5,4,1]],v=[],i=[];f.forEach((tr,j)=>{const a=p[tr[0]],b=p[tr[1]],c=p[tr[2]],n=norm3(cross3(sub3(b,a),sub3(c,a)));[a,b,c].forEach((q,k)=>v.push(...q,...n,k/2,k/2));i.push(j*3,j*3+1,j*3+2)});return meshData(v,i)}
function torus(R=.48,r=.07,T=24,S=7){const v=[],i=[];for(let k=0;k<=T;k++){const a=k*2*Math.PI/T,c=Math.cos(a),s=Math.sin(a);for(let j=0;j<=S;j++){const b=j*2*Math.PI/S,cb=Math.cos(b),sb=Math.sin(b);v.push((R+r*cb)*c,(R+r*cb)*s,r*sb,cb*c,cb*s,sb,k/T,j/S)}}for(let k=0;k<T;k++)for(let j=0;j<S;j++){const a=k*(S+1)+j,b=a+S+1;i.push(a,b,a+1,b,b+1,a+1)}return meshData(v,i)}
function archPoint(){// gothic arch rib with two halves, as narrow cuboids assembled in world
return cube()}
Object.assign(GEO,{cube:cube(),plane:plane(),sphere:sphere(),cyl:cylinder(),taper:cylinder('taper'),spike:cylinder('spike'),crystal:octa(),torus:torus()});
function hexRGB(hex){const n=parseInt(hex.replace('#',''),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
const MAT={stone:{c:'#323f4e',g:0,r:.86,m:.08},metal:{c:'#3c4b5c',g:.04,r:.38,m:.76},dark:{c:'#141924',g:0,r:.24,m:.38},obsidian:{c:'#0f1724',g:0,r:.16,m:.45},black:{c:'#030508',g:0,r:.42,m:.2},bone:{c:'#d8e6e8',g:.16,r:.82,m:.05},bronze:{c:'#96583a',g:.04,r:.32,m:.84},gold:{c:'#d6985c',g:.08,r:.26,m:.90},blue:{c:'#3fe2ff',g:1.65,r:.22,m:.15},ice:{c:'#aef8ff',g:1.85,r:.18,m:.15},pale:{c:'#cceaf0',g:.65,r:.50,m:.24},red:{c:'#ff4d64',g:1.55,r:.24,m:.28},flame:{c:'#ff882e',g:1.85,r:.24,m:.12},smoke:{c:'#5d6676',g:0,r:.92,m:0},softblue:{c:'#2b75a3',g:.6,r:.38,m:.32},shadow:{c:'#04070e',g:0,r:.58,m:.12}};
function mkmat(c,g=0,a=1,texture=null){return{c,g,a,texture}}
function material(spec){if(typeof spec==='string')return MAT[spec]||{c:spec,g:0,a:1};return spec}
function ob(parent,type,mat,p,s,r){const n=new Node(GEO[type],material(mat));if(p)n.pos=p;if(s)n.scale=s;if(r)n.rot=r;parent.add(n);return n}
function group(parent,p=[0,0,0],s=[1,1,1],r=[0,0,0]){const n=new Node();n.pos=p;n.scale=s;n.rot=r;parent.add(n);return n}
function beam(parent,a,b,width,mat,width2=width){const mid=mul3(add3(a,b),.5),d=sub3(b,a),length=len3(d);const n=ob(parent,'cyl',mat,mid,[width,length,width2]);n.rot[2]=-Math.atan2(d[0],d[1]);n.rot[0]=Math.atan2(d[2],Math.hypot(d[0],d[1]));return n}
function spire(parent,x,y,z,h,mat='dark'){ob(parent,'cube',mat,[x,y+h*.28,z],[1.25,h*.57,1.2]);ob(parent,'spike',mat,[x,y+h*.76,z],[1.4,h*.49,1.3]);ob(parent,'cube','blue',[x,y+h*.46,z+.67],[.08,.1,.09]);}
function crystals(parent,count,radius,y,seed=1,huge=false){for(let i=0;i<count;i++){const a=Math.PI*2*(i/count)+seed*.11,rr=radius*(.85+.18*Math.sin(i*37+seed));const x=Math.sin(a)*rr,z=Math.cos(a)*rr;const len=(huge?7:3)*(1+.47*Math.sin(i*43+seed));let n=ob(parent,'crystal',i%3===0?'ice':'blue',[x,y+Math.sin(i*12)*.4,z],[huge?.5:.32,len,huge?.6:.34],[.1+Math.cos(a)*.5,0,-Math.sin(a)*.75]);n.user={spark:i};}}
function makeMask(kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.clearRect(0,0,256,256);
 const base=()=>{x.fillStyle='rgba(2,8,16,.97)';x.beginPath();x.ellipse(128,127,100,115,0,0,Math.PI*2);x.fill();x.strokeStyle='rgba(80,154,176,.55)';x.lineWidth=3;x.stroke();};
 const dot=(x0,y0,col='#76efff',sz=5)=>{x.fillStyle=col;x.fillRect(x0-sz/2,y0-sz/2,sz,sz)};
 const stroke=(a,b,sz=7,col='#77eaff')=>{const n=Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/9);for(let j=0;j<=n;j++){const t=j/n;dot(lerp(a[0],b[0],t),lerp(a[1],b[1],t),col,sz)}};
 const glow=()=>{x.shadowColor='#33d8ff';x.shadowBlur=19};base();
 if(kind==='x'){for(let i=0;i<15;i++)for(let j=0;j<15;j++){if((i+j)%3===0)dot(55+i*10,41+j*11,'rgba(24,102,141,.27)',2)}glow();[[[68,84],[104,119]],[[105,84],[68,119]],[[151,84],[187,119]],[[188,84],[151,119]]].forEach(p=>stroke(...p));for(let i=0;i<34;i++){let t=i/33,x0=57+142*t,y0=161+39*Math.sin(Math.PI*t);dot(x0,y0,'#8af7ff',6)}x.shadowBlur=0;}
 if(kind==='skull'||kind==='iona'){x.fillStyle=kind==='iona'?'#c0d6e1':'#f0f3fa';x.beginPath();x.moveTo(127,28);x.bezierCurveTo(70,24,56,57,64,116);x.lineTo(73,164);x.quadraticCurveTo(128,239,179,167);x.lineTo(192,119);x.bezierCurveTo(203,58,174,26,127,28);x.closePath();x.fill();x.fillStyle='#0c1523';for(const e of [87,169]){x.beginPath();x.ellipse(e,112,19,15,e===87?.3:-.3,0,6.283);x.fill()}x.beginPath();x.moveTo(128,122);x.lineTo(113,152);x.lineTo(140,152);x.closePath();x.fill();x.fillStyle='#07101a';x.beginPath();x.ellipse(128,191,24,47,0,0,6.283);x.fill();x.strokeStyle='#9befff';x.lineWidth=2;x.beginPath();x.moveTo(95,57);x.lineTo(112,85);x.moveTo(171,63);x.lineTo(152,86);x.stroke();if(kind==='iona'){glow();for(let i=0;i<14;i++)stroke([100+i*4,164+i%4*3],[94+i*4,247],4,'#79e6ff');x.shadowBlur=0}}
 if(kind==='crescent'){glow();x.strokeStyle='#a5f5ff';x.lineWidth=12;x.beginPath();x.arc(117,107,45,-.55,2.1,false);x.stroke();dot(173,104,'#e2ffff',12);x.shadowBlur=0;x.strokeStyle='#88e6f4';x.lineWidth=3;x.beginPath();x.arc(128,172,49,.15,3.1);x.stroke()}
 if(kind==='horn'){glow();x.fillStyle='#97f9ff';x.beginPath();x.ellipse(91,101,24,10,-.22,0,6.28);x.ellipse(168,101,24,10,.22,0,6.28);x.fill();for(let i=0;i<17;i++){const t=i/16;dot(61+t*134,151+12*Math.sin(Math.PI*t),'#c5ffff',7);dot(63+t*130,173-4*Math.sin(Math.PI*t),'#8ef2ff',6)}x.shadowBlur=0}
 if(kind==='thaum'){glow();x.strokeStyle='#89f8ff';x.lineWidth=3;x.beginPath();x.arc(128,126,85,0,6.28);x.stroke();for(let i=0;i<60;i++){const a=i/60*6.283,r=70+Math.sin(i*3)*15;const p=[128+Math.cos(a)*r,128+Math.sin(a)*r];dot(...p,'#a4f5ff',2)}for(let i=0;i<58;i++){let t=i/57,amp=(.1+Math.pow(Math.abs(Math.sin(i*2.7)),6)*.6)*78;stroke([25+i*3.6,128-amp/2],[25+i*3.6,128+amp/2],3,'#64e8ff')}x.shadowBlur=0}
 if(kind==='void'){glow();x.strokeStyle='#8feefa';x.lineWidth=3;for(let k=0;k<5;k++){x.beginPath();x.arc(128,128,25+k*18,0,6.283);x.stroke()}x.beginPath();x.moveTo(20,128);x.lineTo(236,128);x.moveTo(128,20);x.lineTo(128,236);x.stroke();x.shadowBlur=0}
 return c}
class LegacyGLWorld{
 constructor(canvas){this.canvas=canvas;this.gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'default'})||canvas.getContext('webgl',{alpha:true,antialias:true});if(!this.gl)throw Error('WebGL not supported.');this.root=new Node();this.program=this.compile();this.u={};const gl=this.gl;for(const n of ['uPV','uModel','uColor','uGlow','uAlpha','uUseTex','uSampler','uEye','uFog','uTime'])this.u[n]=gl.getUniformLocation(this.program,n);this.a={pos:gl.getAttribLocation(this.program,'aPos'),normal:gl.getAttribLocation(this.program,'aNormal'),uv:gl.getAttribLocation(this.program,'aUV')};this.texCache=new Map();this.worldTime=0;this.cameraEye=[0,5,20];this.cameraAt=[0,3,0];this.objects=[];gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);this._onResize=()=>this.resize();this.resize();window.addEventListener('resize',this._onResize);}
 compile(){const gl=this.gl;const vs=`attribute vec3 aPos;attribute vec3 aNormal;attribute vec2 aUV;uniform mat4 uPV;uniform mat4 uModel;uniform vec3 uEye;varying vec3 vNormal;varying vec2 vUV;varying float vDist;varying vec3 vWorld;void main(){vec4 w=uModel*vec4(aPos,1.);vWorld=w.xyz;vNormal=normalize(mat3(uModel)*aNormal);vUV=aUV;vDist=distance(w.xyz,uEye);gl_Position=uPV*w;}`;
 const fs=`precision mediump float;uniform vec3 uColor;uniform float uGlow;uniform float uAlpha;uniform float uUseTex;uniform sampler2D uSampler;uniform vec3 uFog;uniform float uTime;varying vec3 vNormal;varying vec2 vUV;varying float vDist;varying vec3 vWorld;void main(){vec3 n=normalize(vNormal);float light=.30+.65*max(dot(n,normalize(vec3(.42,.8,.55))),0.);float edge=.22*pow(1.-abs(dot(n,vec3(0.,0.,1.))),2.);vec3 base=uColor;float a=uAlpha;if(uUseTex>.5){vec4 tex=texture2D(uSampler,vUV);base=mix(base,tex.rgb,tex.a);a*=tex.a;}vec3 col=base*(light+edge+uGlow*1.25);float fog=smoothstep(42.,124.,vDist);col=mix(col,uFog,fog*(uGlow>.5?.49:.91));gl_FragColor=vec4(col,a);}`;
 const sh=(type,str)=>{const s=gl.createShader(type);gl.shaderSource(s,str);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p}
 resize(){const dpr=APP.quality==='high'?Math.min(1.5,window.devicePixelRatio||1):Math.min(.9,window.devicePixelRatio||1),w=Math.max(1,Math.round(this.canvas.clientWidth*dpr)),h=Math.max(1,Math.round(this.canvas.clientHeight*dpr));if(w===this.canvas.width&&h===this.canvas.height)return;this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h)}
 buffer(geo){if(geo.gpu)return geo.gpu;const gl=this.gl;let vb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,geo.verts,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geo.inds,gl.STATIC_DRAW);return geo.gpu={vb,ib,count:geo.inds.length}}
 texture(canvas){if(this.texCache.has(canvas))return this.texCache.get(canvas);const gl=this.gl,texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);this.texCache.set(canvas,texture);return texture}
 render(eye,at,ambient,time){this.resize();const gl=this.gl;gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);let pv=mm(perspective(1.12,this.canvas.width/this.canvas.height,.1,220),lookAt(eye,at));gl.uniformMatrix4fv(this.u.uPV,false,pv);gl.uniform3fv(this.u.uEye,eye);gl.uniform3fv(this.u.uFog,ambient);gl.uniform1f(this.u.uTime,time);this.objects.length=0;const walk=(n,p)=>{if(!n.visible)return;const m=mm(p,localMatrix(n));if(n.geo&&n.mat)this.objects.push({n,m,dist:len3(sub3([m[12],m[13],m[14]],eye))});for(const c of n.children)walk(c,m)};walk(this.root,id4());const opaque=[],trans=[];for(const o of this.objects){let a=o.n.mat.a===undefined?1:o.n.mat.a;(a<1?trans:opaque).push(o)}trans.sort((a,b)=>b.dist-a.dist);gl.depthMask(true);for(const o of opaque)this.draw(o);gl.depthMask(false);for(const o of trans)this.draw(o);gl.depthMask(true)}
 draw({n,m}){const gl=this.gl,b=this.buffer(n.geo),mat=n.mat;gl.bindBuffer(gl.ARRAY_BUFFER,b.vb);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b.ib);gl.enableVertexAttribArray(this.a.pos);gl.enableVertexAttribArray(this.a.normal);gl.enableVertexAttribArray(this.a.uv);gl.vertexAttribPointer(this.a.pos,3,gl.FLOAT,false,32,0);gl.vertexAttribPointer(this.a.normal,3,gl.FLOAT,false,32,12);gl.vertexAttribPointer(this.a.uv,2,gl.FLOAT,false,32,24);gl.uniformMatrix4fv(this.u.uModel,false,m);gl.uniform3fv(this.u.uColor,hexRGB(mat.c));gl.uniform1f(this.u.uGlow,mat.g||0);gl.uniform1f(this.u.uAlpha,mat.a===undefined?1:mat.a);gl.uniform1f(this.u.uUseTex,mat.texture?1:0);if(mat.texture){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture(mat.texture));gl.uniform1i(this.u.uSampler,0)}gl.drawElements(gl.TRIANGLES,b.count,gl.UNSIGNED_SHORT,0)}
 releaseAfterLoss(){window.removeEventListener('resize',this._onResize);for(const g of Object.values(GEO))g.gpu=null;this.texCache.clear();}
 dispose(){window.removeEventListener('resize',this._onResize);const gl=this.gl;for(const g of Object.values(GEO)){if(g.gpu){gl.deleteBuffer(g.gpu.vb);gl.deleteBuffer(g.gpu.ib);g.gpu=null}}for(const t of this.texCache.values())gl.deleteTexture(t);this.texCache.clear();if(this.program)gl.deleteProgram(this.program)}
}

// The authored Node graph above remains renderer-agnostic. This adapter is the
// sole live renderer and maps that graph into the locally bundled Three.js runtime.
class GLWorld {
 constructor(canvas){
  if(typeof THREE==='undefined'||!THREE.WebGLRenderer)throw Error('Bundled Three.js runtime is unavailable.');
  this.canvas=canvas;
  this.root=new Node();
  this.texCache=new Map();
  this.textureSet=new Set();
  this.materialSet=new Set();
  this.materialCache=new Map();
  this.textureIds=new WeakMap();
  this.nextTextureId=1;
  this.geometryMap=new Map();
  this.objectMap=new WeakMap();
  this.scene=new THREE.Scene();
  this.camera=new THREE.PerspectiveCamera(64,1,.1,220);
  this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'default'});
  this.gl=this.renderer.getContext();
  this.renderer.setClearColor(0x000000,0);
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
  this.renderer.toneMappingExposure=1.18;
  this.ambient=new THREE.HemisphereLight(0xbcecff,0x1a0c12,1.55);
  this.key=new THREE.DirectionalLight(0xffd6b8,2.8);
  this.key.position.set(-12,24,20);
  this.rim=new THREE.DirectionalLight(0x55dcff,3.4);
  this.rim.position.set(14,20,-32);
  this.fill=new THREE.DirectionalLight(0x7a65ff,1.25);
  this.fill.position.set(-18,10,-18);
  this.scene.add(this.ambient,this.key,this.rim,this.fill);
  this.visualRoot=null;
  this._mappedRoot=null;
  this._onResize=()=>this.resize();
  window.addEventListener('resize',this._onResize);
  this.resize();
 }
 reset(root){
  this.disposeVisuals();
  this.root=root;
  this._mappedRoot=null;
 }
 makeGeometry(source){
  if(this.geometryMap.has(source))return this.geometryMap.get(source);
  const geometry=new THREE.BufferGeometry();
  const interleaved=new THREE.InterleavedBuffer(source.verts,8);
  geometry.setAttribute('position',new THREE.InterleavedBufferAttribute(interleaved,3,0));
  geometry.setAttribute('normal',new THREE.InterleavedBufferAttribute(interleaved,3,3));
  geometry.setAttribute('uv',new THREE.InterleavedBufferAttribute(interleaved,2,6));
  geometry.setIndex(new THREE.BufferAttribute(source.inds,1));
  geometry.computeBoundingSphere();
  this.geometryMap.set(source,geometry);
  return geometry;
 }
 makeTexture(source){
  if(this.texCache.has(source))return this.texCache.get(source);
  const texture=new THREE.CanvasTexture(source);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;
  texture.minFilter=THREE.LinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.needsUpdate=true;
  this.texCache.set(source,texture);
  this.textureSet.add(texture);
  return texture;
 }
 materialKey(spec,plane=false){
  const s=material(spec);let textureId=0;
  if(s.texture){if(!this.textureIds.has(s.texture))this.textureIds.set(s.texture,this.nextTextureId++);textureId=this.textureIds.get(s.texture);}
  return `${s.c}|${s.g||0}|${s.r||0}|${s.m||0}|${s.a===undefined?1:s.a}|${textureId}|${plane?1:0}`;
 }
 makeMaterial(spec,plane=false){
  const s=material(spec),alpha=s.a===undefined?1:s.a;
  const key=this.materialKey(s,plane);
  if(this.materialCache.has(key))return this.materialCache.get(key);
  const roughness=s.r!==undefined?s.r:((s.g||0)>.8?.24:.72);
  const metalness=s.m!==undefined?s.m:((s.g||0)>.8?.16:.42);
  const options={
   color:new THREE.Color(s.c),
   emissive:new THREE.Color(s.c),
   emissiveIntensity:Math.max(0,s.g||0)*.58,
   roughness,
   metalness,
   transparent:alpha<.999||!!s.texture,
   opacity:alpha,
   depthWrite:alpha>=.82,
   side:plane?THREE.DoubleSide:THREE.FrontSide
  };
  if(s.texture){options.map=this.makeTexture(s.texture);options.emissiveMap=options.map;options.alphaTest=.015;}
  const result=new THREE.MeshStandardMaterial(options);
  this.materialCache.set(key,result);
  this.materialSet.add(result);
  return result;
 }
 mapNode(node){
  const object=node.geo?new THREE.Mesh(this.makeGeometry(node.geo),this.makeMaterial(node.mat,node.geo===GEO.plane)):new THREE.Group();
  object.matrixAutoUpdate=true;
  object.frustumCulled=!!node.geo;
  if(node.geo){const s=material(node.mat);object.userData.deadlightSpec=s;object.userData.deadlightAlpha=s.a===undefined?1:s.a;object.userData.deadlightShared=true;object.userData.deadlightKey=this.materialKey(s,node.geo===GEO.plane);}
  this.objectMap.set(node,object);
  for(const child of node.children)object.add(this.mapNode(child));
  return object;
 }
 ensureMapped(){
  if(this._mappedRoot===this.root&&this.visualRoot)return;
  this.disposeVisuals();
  this.visualRoot=this.mapNode(this.root);
  this.scene.add(this.visualRoot);
  this._mappedRoot=this.root;
 }
 syncMaterial(node,mesh){
  const s=material(node.mat),alpha=s.a===undefined?1:s.a,key=this.materialKey(s,node.geo===GEO.plane),data=mesh.userData;
  if(data.deadlightSpec!==s||data.deadlightKey!==key&&Math.abs(data.deadlightAlpha-alpha)<.002){
   mesh.material=this.makeMaterial(s,node.geo===GEO.plane);
   data.deadlightSpec=s;data.deadlightAlpha=alpha;data.deadlightShared=true;data.deadlightKey=key;
   return;
  }
  if(Math.abs(data.deadlightAlpha-alpha)>.002){
   if(data.deadlightShared){mesh.material=mesh.material.clone();this.materialSet.add(mesh.material);data.deadlightShared=false;}
   const m=mesh.material;m.opacity=alpha;m.transparent=alpha<.999||!!s.texture;m.depthWrite=alpha>=.82;m.needsUpdate=true;data.deadlightAlpha=alpha;data.deadlightKey=key;
  }
 }
 syncNode(node){
  const object=this.objectMap.get(node);
  if(!object)return;
  object.position.set(node.pos[0],node.pos[1],node.pos[2]);
  object.rotation.set(node.rot[0],node.rot[1],node.rot[2],'XYZ');
  object.scale.set(node.scale[0],node.scale[1],node.scale[2]);
  object.visible=node.visible;
  if(node.geo)this.syncMaterial(node,object);
  for(const child of node.children)this.syncNode(child);
 }
 resize(){
  const dpr=APP.quality==='high'?Math.min(1.5,window.devicePixelRatio||1):Math.min(.9,window.devicePixelRatio||1);
  const width=Math.max(1,this.canvas.clientWidth),height=Math.max(1,this.canvas.clientHeight);
  if(this._width===width&&this._height===height&&this._dpr===dpr)return;
  this._width=width;this._height=height;this._dpr=dpr;
  this.renderer.setPixelRatio(dpr);
  this.renderer.setSize(width,height,false);
  this.camera.aspect=width/height;
  this.camera.updateProjectionMatrix();
 }
 render(eye,at,ambient,time=0,world='cathedral'){
  this.ensureMapped();
  this.resize();
  this.syncNode(this.root);
  this.camera.position.set(eye[0],eye[1],eye[2]);
  this.camera.lookAt(at[0],at[1],at[2]);
  const fogColor=new THREE.Color(ambient[0],ambient[1],ambient[2]);
  const fogNear=world==='basilica'?36:world==='eclipse'?38:world==='city'?46:42;
  const fogFar=world==='basilica'?114:world==='eclipse'?116:world==='city'?138:124;
  if(!this.scene.fog)this.scene.fog=new THREE.Fog(fogColor,fogNear,fogFar);
  else{this.scene.fog.color.copy(fogColor);this.scene.fog.near=fogNear;this.scene.fog.far=fogFar;}
  if(world==='eclipse'){
   this.rim.color.setHex(0xff3f56);this.key.color.setHex(0xff9e76);this.fill.color.setHex(0x5a1828);
   this.ambient.color.setHex(0x351222);this.ambient.groundColor.setHex(0x18070e);
  }else if(world==='basilica'){
   this.rim.color.setHex(0xd0f4ff);this.key.color.setHex(0xe8f0f8);this.fill.color.setHex(0x655885);
   this.ambient.color.setHex(0x28324a);this.ambient.groundColor.setHex(0x0e111a);
  }else if(world==='bells'){
   this.rim.color.setHex(0x5ae8ff);this.key.color.setHex(0xfad5a8);this.fill.color.setHex(0x384a6b);
   this.ambient.color.setHex(0x1c3042);this.ambient.groundColor.setHex(0x0f151c);
  }else if(world==='city'){
   this.rim.color.setHex(0x68ecff);this.key.color.setHex(0xd5f3ff);this.fill.color.setHex(0x426285);
   this.ambient.color.setHex(0x1c3c52);this.ambient.groundColor.setHex(0x0d1822);
  }else if(world==='void'){
   this.rim.color.setHex(0x8ef8ff);this.key.color.setHex(0xdaf8ff);this.fill.color.setHex(0x683d95);
   this.ambient.color.setHex(0x142038);this.ambient.groundColor.setHex(0x080c18);
  }else{
   this.rim.color.setHex(0x4de0ff);this.key.color.setHex(0xffcb9a);this.fill.color.setHex(0x6855b8);
   this.ambient.color.setHex(0x1b3447);this.ambient.groundColor.setHex(0x0b141d);
  }
  this.renderer.render(this.scene,this.camera);
 }
 stats(){return{renderer:`Three.js r${THREE.REVISION}`,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures};}
 disposeVisuals(){
  if(this.visualRoot){this.scene.remove(this.visualRoot);this.visualRoot=null;}
  for(const value of this.materialSet)value.dispose();
  for(const value of this.textureSet)value.dispose();
  this.materialSet.clear();this.materialCache.clear();this.textureSet.clear();this.texCache.clear();this.textureIds=new WeakMap();this.nextTextureId=1;this.objectMap=new WeakMap();
 }
 releaseAfterLoss(){window.removeEventListener('resize',this._onResize);this.disposeVisuals();this.renderer.dispose();}
 dispose(){
  window.removeEventListener('resize',this._onResize);
  this.disposeVisuals();
  for(const value of this.geometryMap.values())value.dispose();
  this.geometryMap.clear();
  this.renderer.dispose();
 }
}
