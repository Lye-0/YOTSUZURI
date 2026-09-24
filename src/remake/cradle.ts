import type {World} from './campaign';
import type {CampaignItem} from './catalog';
type P=readonly [number,number];
type V=readonly [number,number,number];
type Rect=readonly [number,number,number,number];
export const CRADLE_W=.32,CRADLE_D=.28,CRADLE_THICKNESS=.012;
export const cornerCentre:P=[.16,.085],wedgeSlots=[.115,.125,.135] as const;
export const cradleSlope=Math.atan2(.035,.13)*180/Math.PI;
export const initialCradle=()=>[1,1,0,1];
export const cradleValues=(g:World)=>g.values[21]??initialCradle();
export const validCradle=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===4&&v.every(Number.isInteger)&&[0,1].includes(v[0])&&v[1]>=0&&v[1]<4&&v[2]>=0&&v[2]<4&&v[3]>=0&&v[3]<3;
const rotate=([x,y]:P,n:number):P=>n===0?[x,y]:n===1?[-y,x]:n===2?[-x,-y]:[y,-x];
const cornerPoint=(p:P,n:number):P=>{const q=rotate([p[0]-cornerCentre[0],p[1]-cornerCentre[1]],n);return[q[0]+cornerCentre[0],q[1]+cornerCentre[1]];};
export const cradlePins:readonly P[]=[[.1015,.0285],[.2185,.1415]];
export const cornerHoles=(rotation:number)=>cradlePins.map(p=>cornerPoint(p,rotation));
export const cornerSeated=(rotation:number)=>cornerHoles(rotation).every(h=>cradlePins.some(p=>Math.hypot(h[0]-p[0],h[1]-p[1])<.003));
export function cornerArms(rotation:number):Rect[]{return ([[.09,.015,.025,.14],[.09,.13,.14,.025]] as const).map(([x,y,w,d])=>{const p=[[x,y],[x+w,y],[x+w,y+d],[x,y+d]].map(p=>cornerPoint([p[0],p[1]],rotation)),xs=p.map(p=>p[0]),ys=p.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)];});}
export function cradleWedgeVertices(v:readonly number[]):V[]{const x=wedgeSlots[v[3]]+.035;return ([[-.035,-.065,.035],[.035,-.065,.035],[.035,.065,0],[-.035,.065,0]] as const).map(([u,w,z])=>{const p=rotate([u,w],v[2]);return[x+p[0],.065+p[1],z];});}
function footprint(v:readonly number[]):Rect{const p=cradleWedgeVertices(v),xs=p.map(p=>p[0]),ys=p.map(p=>p[1]);return[Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)];}
const overlaps=(a:Rect,b:Rect)=>a[0]<b[0]+b[2]-1e-7&&a[0]+a[2]>b[0]+1e-7&&a[1]<b[1]+b[3]-1e-7&&a[1]+a[3]>b[1]+1e-7;
export const cradleTaken=(g:World)=>g.inventory.includes('cradle')||Object.values(g.placed).some(a=>a.includes('cradle'));
export const cradleCornerHeight=(g:World)=>g.placed[21]?.includes('corner')?(cornerSeated(cradleValues(g)[1])?.003:.007):0;
export const cradleWedgeLift=(g:World)=>g.placed[21]?.includes('corner')&&cornerArms(cradleValues(g)[1]).some(r=>overlaps(footprint(cradleValues(g)),r))?cradleCornerHeight(g):0;
function supportAngle(points:readonly V[]){return Math.max(0,...points.map(([_,y,z])=>z<1e-7?0:y<=1e-7?90:Math.atan2(z,y)*180/Math.PI));}
export function cradleBoardAngle(g:World){const v=cradleValues(g);if(v[0])return 70;const points:V[]=[];if(g.placed[21]?.includes('wedge'))points.push(...cradleWedgeVertices(v).map(([x,y,z])=>[x,y,z+cradleWedgeLift(g)] as V));if(g.placed[21]?.includes('corner'))for(const [x,y,w,d] of cornerArms(v[1]))points.push([x,y,cradleCornerHeight(g)],[x+w,y,cradleCornerHeight(g)],[x,y+d,cradleCornerHeight(g)],[x+w,y+d,cradleCornerHeight(g)]);return Math.min(70,supportAngle(points));}
export function cradleReady(g:World){
 const v=cradleValues(g),parts=g.placed[21]??[];if(!parts.includes('corner')||!parts.includes('wedge')||!cornerSeated(v[1]))return false;
 const arms=cornerArms(v[1]),foot=footprint(v);if(arms.some(r=>overlaps(foot,r)))return false;
 const blocked=(dx:number,dy:number)=>arms.some(r=>overlaps([foot[0]+dx,foot[1]+dy,foot[2],foot[3]],r));
 const slope=Math.tan(cradleSlope*Math.PI/180),fullContact=cradleWedgeVertices(v).every(([_,y,z])=>Math.abs(z-y*slope)<.0004);
 return fullContact&&blocked(0,.001)&&(blocked(-.001,0)||blocked(.001,0));
}
export type CradleAction={type:'p-cradle-board';id:21}|{type:'p-cradle-turn';id:21;item:'corner'|'wedge'}|{type:'p-cradle-slide';id:21;position:number}|{type:'p-cradle-take';id:21}|{type:'p-cradle-return';id:21};
export function applyCradle(s:World,a:CradleAction|{type:'p-place';id:number;target?:CampaignItem}|{type:'p-retrieve';id:number;item:CampaignItem}):{world:World;message?:string}{
 if(s.room!==8||s.facing!==1||s.focus!=='object:21')return{world:s};const g=structuredClone(s),v=[...cradleValues(g)],taken=cradleTaken(g),parts=g.placed[21]??[];
 if(a.type==='p-cradle-return'){
  if(g.selected!=='cradle'||!g.inventory.includes('cradle'))return{world:s};g.inventory=g.inventory.filter(n=>n!=='cradle');g.collected=g.collected.filter(n=>n!=='cradle');g.selected=null;g.placed[21]=['corner','wedge'];g.values[21]=validCradle(g.itemValues.cradle)?[...g.itemValues.cradle]:[0,0,2,0];return{world:g};
 }
 if(taken)return{world:s};
 if(a.type==='p-cradle-take'){
  if(v[0])return{world:s,message:'板が開いている。'};if(!cradleReady(g))return{world:s,message:'支えがずれる。'};g.inventory.push('cradle');if(!g.collected.includes('cradle'))g.collected.push('cradle');g.itemValues.cradle=[...v];g.placed[21]=[];g.selected=null;if(!g.solved.includes(21))g.solved.push(21);
 }else if(a.type==='p-cradle-board')v[0]=1-v[0];
 else{
  if(cradleBoardAngle(g)<45)return{world:s,message:'板を起こすと、下に手が届く。'};
  if(a.type==='p-place'){const item=g.selected;if(!item||a.target&&a.target!==item||!['corner','wedge'].includes(item)||!g.inventory.includes(item)||parts.includes(item))return{world:s};g.placed[21]=[...parts,item];g.inventory=g.inventory.filter(n=>n!==item);g.selected=null;}
  else if(a.type==='p-retrieve'){if(!['corner','wedge'].includes(a.item)||!parts.includes(a.item))return{world:s};g.placed[21]=parts.filter(n=>n!==a.item);g.inventory.push(a.item);g.selected=null;}
  else if(a.type==='p-cradle-turn'){if(!parts.includes(a.item))return{world:s};const i=a.item==='corner'?1:2;v[i]=(v[i]+1)%4;}
  else{if(!parts.includes('wedge')||!Number.isInteger(a.position)||a.position<0||a.position>2)return{world:s};v[3]=a.position;}
 }
 g.values[21]=v;return{world:g};
}
