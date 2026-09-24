import {type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {envelopeValues,initialEnvelope} from './envelope';
import {envelopePhoto,envelopeUrl} from './envelopeAssets';
import {photoBounds} from './photoBounds';
const M=500,W=.43,H=.28;
type Rect=readonly [number,number,number,number];
// Body bounds are calibrated independently of expanded canvases and transparent margins.
const bodies:Record<string,Rect>={
 'back-closed':[219,277,967,563],
 'front-closed':[218,275,968,565],
 'right-open':[132,180,974,644],
 'lower-open':[134,101,977,554],
 'all-open':[74,394,869,484],
};
const position=([x,y,w,h]:Rect):CSSProperties=>({position:'absolute',left:x*M,top:y*M,width:w*M,height:h*M});
function Cutout({id,group='parts/envelope',rect}:{id:string;group?:string;rect:Rect}){const p=photoBounds[`${group}/${id}`];if(!p)return null;const [x,y,w,h]=p.bounds;return <div style={{...position(rect),overflow:'hidden',pointerEvents:'none'}}><img src={envelopeUrl(id,group)} alt="" draggable={false} style={{position:'absolute',width:p.width/w*100+'%',height:p.height/h*100+'%',left:-x/w*100+'%',top:-y/h*100+'%'}}/></div>;}
export type EnvelopeArtProps={g?:World;onAct?:(a:Action)=>void;onInspect?:()=>void;onInspectContents?:()=>void;contents?:boolean};
export function EnvelopeArt({g}:Pick<EnvelopeArtProps,'g'>){
 const v=g?envelopeValues(g):initialEnvelope(),id=envelopePhoto(g),p=photoBounds[`parts/envelope/${id}`],body=bodies[id];if(!p||!body)return null;
 const [bx,by,bw,bh]=body,[ax,ay,aw,ah]=p.bounds,extension=v[3]*.1;
 const sx=[Math.min(ax,bx),bx,bx+bw,Math.max(ax+aw,bx+bw)],sy=[Math.min(ay,by),by,by+bh,Math.max(ay+ah,by+bh)];
 const right=v[2]&1?.13:Math.max(0,sx[3]-sx[2])/bw*W,top=v[2]&4?.28:Math.max(0,sy[1]-sy[0])/bh*H,bottom=v[2]&2?.14:Math.max(0,sy[3]-sy[2])/bh*H,left=Math.max(0,sx[1]-sx[0])/bw*W;
 const dx=[-left,0,W,W+right],dy=[-top,0,H,H+bottom];
 const items=[{id:'tissue' as const,rect:[-extension+.025,.016,.15,.095] as Rect},{id:'blanks' as const,rect:[-extension+.035,.13,.13,.135] as Rect}];
 return <div className="envelope-sheet" style={{position:'relative',width:W*M,height:H*M}}>
 {v[2]===7?<><Cutout id="inner-tray" rect={[-extension-.008,0,.208,H]}/>{items.filter(item=>!g?.collected.includes(item.id)).map(item=><Cutout key={item.id} id={item.id} group="items" rect={item.rect}/>)}</>:null}
 {dx.slice(0,-1).flatMap((x,i)=>dy.slice(0,-1).map((y,j)=>sx[i+1]>sx[i]&&sy[j+1]>sy[j]&&dx[i+1]>x&&dy[j+1]>y?<div key={`${i}:${j}`} style={{...position([x,y,dx[i+1]-x,dy[j+1]-y]),overflow:'hidden',pointerEvents:'none'}}><img src={envelopeUrl(id)} alt="" draggable={false} style={{position:'absolute',width:p.width/(sx[i+1]-sx[i])*100+'%',height:p.height/(sy[j+1]-sy[j])*100+'%',left:-sx[i]/(sx[i+1]-sx[i])*100+'%',top:-sy[j]/(sy[j+1]-sy[j])*100+'%'}}/></div>:null))}

 </div>;
}
