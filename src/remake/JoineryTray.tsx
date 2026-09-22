import {Face,Photograph} from './ArchivePhotos';
import {photoBounds} from './photoBounds';
const id='frame-tray-top',group='parts/joinery';
/** Separate the five high surfaces from the photographic floor of the rebate. */
export function JoineryTray(){const a=photoBounds[`${group}/${id}`];if(!a)return null;const [bx,by,bw,bh]=a.bounds,uv=(x:number,y:number,w:number,h:number)=>[x/a.width,y/a.height,w/a.width,h/a.height] as const;return <>
 <Face x={.60} y={.15} z={.8198} width={.36} height={.30} tilt={90} resolution={3}><Photograph id={id} group={group} crop={uv(188,246,970,684)}/></Face>
 {[[0,0,.46,.05,bx,by,bw,246-by],[0,.35,.46,.05,bx,930,bw,by+bh-930],[0,.05,.05,.30,bx,246,188-bx,684],[.41,.05,.05,.30,1158,246,bx+bw-1158,684],[.08,.08,.30,.24,255,310,835,550]].map(([x,y,w,h,px,py,pw,ph],i)=><Face key={i} x={.55+x} y={.1+y} z={.838} width={w} height={h} tilt={90} resolution={3}><Photograph id={id} group={group} crop={uv(px,py,pw,ph)}/></Face>)}
 {[[.60,.15,.36,0],[.96,.45,.36,180],[.60,.45,.30,90],[.96,.15,.30,-90],[.63,.42,.30,0],[.93,.18,.30,180],[.63,.18,.24,-90],[.93,.42,.24,90]].map(([x,y,w,turn],i)=><Face key={`side${i}`} x={x} y={y} z={.838} width={w} height={.018} turn={turn}><Photograph id={id} group={group} crop={uv(260,320,820,20)}/></Face>)}
 </>;}
