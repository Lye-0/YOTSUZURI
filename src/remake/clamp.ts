import type {World} from './campaign';
import type {CampaignItem} from './catalog';
export const clampBase={width:.44,depth:.38,height:.02};
export const clampFrame={x:.04,y:.04,width:.36,depth:.30};
export const platenSize={width:.296,depth:.236,height:.020};
export const camRadius=.025,camEccentricity=.0075;
export const camAxes=[[.0545,.082],[.0395,.298],[.220,.047]] as const;
export const initialClamp=()=>[0,0,1,1];
export const clampValues=(g:World)=>g.values[28]??initialClamp();
export const validClamp=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===4&&v.every(Number.isInteger)&&v.slice(0,3).every(n=>n>=0&&n<4)&&[0,1].includes(v[3]);
export const clampTaken=(g:World)=>g.inventory.includes('clamp')||Object.values(g.placed).some(a=>a.includes('clamp'));
export const camCentre=(v:readonly number[],i:number)=>{const a=v[i]*Math.PI/2,p=camAxes[i];return[p[0]+camEccentricity*Math.cos(a),p[1]+camEccentricity*Math.sin(a)] as const;};
/** Two equal circles define the left tangent; the third defines the back tangent. */
export function platenPose(v:readonly number[]){const a=camCentre(v,0),b=camCentre(v,1),c=camCentre(v,2),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),n=[dy/l,-dx/l] as const,t=[dx/l,dy/l] as const,nk=n[0]*a[0]+n[1]*a[1]+camRadius,tk=t[0]*c[0]+t[1]*c[1]+camRadius;return{x:n[0]*nk+t[0]*tk,y:n[1]*nk+t[1]*tk,angle:Math.atan2(n[1],n[0])*180/Math.PI,n,t};}
export function platenCorners(v:readonly number[]){const p=platenPose(v);return [[0,0],[platenSize.width,0],[platenSize.width,platenSize.depth],[0,platenSize.depth]].map(([u,w])=>[p.x+u*p.n[0]+w*p.t[0],p.y+u*p.n[1]+w*p.t[1]] as const);}
export const clampFits=(v:readonly number[])=>platenCorners(v).every(([x,y])=>x>=.070-1e-7&&x<=.370+1e-7&&y>=.070-1e-7&&y<=.310+1e-7);
export function clampPlatenHeight(g:World){const v=clampValues(g);return v[3]?.19:g.placed[28]?.includes('frame')&&!clampFits(v)?.038:.0205;}
export type ClampAction={type:'p-clamp-turn';id:28;index:number}|{type:'p-clamp-height';id:28}|{type:'p-clamp-take';id:28}|{type:'p-clamp-return';id:28};
export function applyClamp(s:World,a:ClampAction|{type:'p-place';id:number;target?:CampaignItem}|{type:'p-retrieve';id:number;item:CampaignItem}|{type:'p-take';id:number;item:CampaignItem}):{world:World;message?:string}{
 const home=s.room===5&&s.facing===1&&s.focus==='object:28',final=s.room===10&&s.facing===3&&s.focus==='object:30'&&s.placed[30]?.includes('clamp');if(!home&&!(final&&a.type==='p-clamp-turn'))return{world:s};const g=structuredClone(s),v=[...clampValues(g)];
 if(a.type==='p-clamp-return'){
  if(g.selected!=='clamp'||!g.inventory.includes('clamp'))return{world:s};g.inventory=g.inventory.filter(n=>n!=='clamp');g.collected=g.collected.filter(n=>n!=='clamp');g.selected=null;return{world:g};
 }
 if(home&&clampTaken(g))return{world:s};
 if(a.type==='p-clamp-turn'){
  if(!v[3])return{world:s,message:'押さえ板を上げると回せる。'};if(!Number.isInteger(a.index)||a.index<0||a.index>2)return{world:s};v[a.index]=(v[a.index]+1)%4;
 }else if(a.type==='p-clamp-height'){
  v[3]=1-v[3];if(!v[3]&&clampFits(v)&&!g.solved.includes(28))g.solved.push(28);
 }else if(a.type==='p-place'){
  if(!v[3])return{world:s,message:'押さえ板を上げると枠が入る。'};if(g.selected!=='frame'||a.target&&a.target!=='frame'||!g.inventory.includes('frame')||g.placed[28]?.includes('frame'))return{world:s};g.inventory=g.inventory.filter(n=>n!=='frame');g.placed[28]=['frame'];g.selected=null;
 }else if(a.type==='p-retrieve'){
  if(a.item!=='frame'||!g.placed[28]?.includes('frame'))return{world:s};if(!v[3])return{world:s,message:'押さえ板が下りている。'};g.placed[28]=[];g.inventory.push('frame');g.selected=null;
 }else{
  if(a.type==='p-take'&&a.item!=='clamp')return{world:s};if(g.placed[28]?.includes('frame'))return{world:s,message:'枠を先に取り出せる。'};g.inventory.push('clamp');if(!g.collected.includes('clamp'))g.collected.push('clamp');g.selected=null;
 }
 g.values[28]=v;return{world:g};
}
