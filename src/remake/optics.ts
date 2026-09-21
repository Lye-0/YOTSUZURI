import type {World} from './campaign';
export type LightPoint=readonly [number,number];
export const mirrorStops=[.20,.38,.56,.74] as const;
export const mirrorRows=[.82,.18] as const;
export const lightSource:LightPoint=[.025,.82];
export const lightReceiver:LightPoint=[.975,.18];
export const lightBaffles=[[.12,.48,.15,.10],[.30,.30,.16,.12],[.48,.57,.16,.12]] as const;
// Two rail positions, then two diagonal orientations. 0: /, 1: \.
export const initialOptics=()=>[0,1,1,0];
export const opticsValues=(g:World)=>g.values[20]??initialOptics();
export const validOptics=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===4&&v.every(Number.isInteger)&&v.slice(0,2).every(n=>n>=0&&n<4)&&v.slice(2).every(n=>n===0||n===1);
const cross=(a:LightPoint,b:LightPoint)=>a[0]*b[1]-a[1]*b[0];
function hitSegment(p:LightPoint,d:LightPoint,a:LightPoint,b:LightPoint){const edge:LightPoint=[b[0]-a[0],b[1]-a[1]],q:LightPoint=[a[0]-p[0],a[1]-p[1]],den=cross(d,edge);if(Math.abs(den)<1e-9)return null;const t=cross(q,edge)/den,u=cross(q,d)/den;return t>1e-6&&u>=0&&u<=1?t:null;}
export function traceLight(v:readonly number[]){
 const segments:{a:LightPoint;b:LightPoint;mirror:number}[]=[];
 const edge=(a:LightPoint,b:LightPoint,mirror=-1)=>segments.push({a,b,mirror});
 const rect=(x:number,y:number,w:number,h:number)=>{edge([x,y],[x+w,y]);edge([x+w,y],[x+w,y+h]);edge([x+w,y+h],[x,y+h]);edge([x,y+h],[x,y]);};
 rect(0,0,1,1);for(const r of lightBaffles)rect(r[0],r[1],r[2],r[3]);
 for(let i=0;i<2;i++){const x=mirrorStops[v[i]],y=mirrorRows[i],s=v[i+2]===0?-1:1;edge([x-.045,y-.045*s],[x+.045,y+.045*s],i);}
 const points:LightPoint[]=[lightSource],mirrors:number[]=[];let p:LightPoint=lightSource,d:LightPoint=[1,0];
 for(let bounce=0;bounce<10;bounce++){
  let nearest=Infinity,hit:typeof segments[number]|undefined;
  for(const s of segments){const distance=hitSegment(p,d,s.a,s.b);if(distance!==null&&distance<nearest){nearest=distance;hit=s;}}
  if(!hit)break;
  // Receiver is a small face before the edge of the board, at the height of the upper rail.
  const receiverDistance=d[0]>0?(lightReceiver[0]-p[0])/d[0]:Infinity;
  if(receiverDistance>1e-6&&receiverDistance<nearest&&Math.abs(p[1]+receiverDistance*d[1]-lightReceiver[1])<.018){points.push(lightReceiver);return {points,mirrors,lit:true};}
  const q:LightPoint=[p[0]+nearest*d[0],p[1]+nearest*d[1]];points.push(q);
  if(hit.mirror<0)break;
  mirrors.push(hit.mirror);const e:LightPoint=[hit.b[0]-hit.a[0],hit.b[1]-hit.a[1]],len=Math.hypot(...e),n:LightPoint=[-e[1]/len,e[0]/len],dot=d[0]*n[0]+d[1]*n[1];d=[d[0]-2*dot*n[0],d[1]-2*dot*n[1]];p=q;
 }
 return {points,mirrors,lit:false};
}
export type OpticsAction={type:'p-mirror-slide';id:20;index:number;position:number}|{type:'p-mirror-turn';id:20;index:number}|{type:'p-optical-guard';id:20};
export function applyOptics(s:World,a:OpticsAction):{world:World;message?:string}{
 if(s.room!==8||s.facing!==2||s.focus!=='object:20')return {world:s};const g=structuredClone(s),v=[...opticsValues(g)];
 if(a.type==='p-optical-guard'){
  if(g.flags['optics:guard']){if(g.placed[22]?.length)return {world:s,message:'台の上を片付ければ閉じられる。'};g.flags['optics:guard']=false;}
  else{if(!traceLight(v).lit)return {world:s,message:'留めが掛かっている。'};g.flags['optics:guard']=true;if(!g.solved.includes(20))g.solved.push(20);}
 }else{
  if(!Number.isInteger(a.index)||a.index<0||a.index>1)return {world:s};
  if(a.type==='p-mirror-slide'){if(!Number.isInteger(a.position)||a.position<0||a.position>3||v[a.index]===a.position)return {world:s};v[a.index]=a.position;}
  else v[a.index+2]=1-v[a.index+2];
 }
 g.values[20]=v;return {world:g};
}
