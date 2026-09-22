import {useRef,useState,useLayoutEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid} from './PhotoCuboid';
import {TiledSurface} from './TiledSurface';
import {ClampBody} from './ClampBody';
import {clampEye,clampWideEye} from './clampGeometry';
import {clampTaken,clampPlatenHeight,clampValues,camCentre} from './clamp';
import {archiveProjectEye,type ShelfPoint} from './archiveSpace';
import {Icon} from './Icons';
import {separateTarget} from './screenTargets';
export function ClampWorkbench({g,act,enabled=true,wide=false,cams=false,onCams}:{g:World;act:(a:Action)=>void;enabled?:boolean;wide?:boolean;cams?:boolean;onCams?:(v:boolean)=>void}){
 const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),frame=wide?{width:1672,height:941}:cams?{width:1000,height:900}:{width:1000,height:1000},eye=wide?clampWideEye():clampEye(g,cams),taken=clampTaken(g),hasFrame=g.placed[28]?.includes('frame'),v=clampValues(g),z=clampPlatenHeight(g),width=frame.width*scale,height=frame.height*scale;
 useLayoutEffect(()=>{const fit=()=>setScale(host.current!.clientWidth/frame.width);fit();const r=new ResizeObserver(fit);r.observe(host.current!);return()=>r.disconnect()},[frame.width]);
 const point=(p:ShelfPoint)=>{const q=archiveProjectEye(p,eye);return[q[0]*scale,q[1]*scale] as const;};
 const rect=(points:readonly ShelfPoint[]):CSSProperties=>{const ps=points.map(point),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]),left=Math.min(...xs),top=Math.min(...ys),w=Math.max(...xs)-left,h=Math.max(...ys)-top;return{left,top,width:w,height:h,clipPath:`polygon(${ps.map(p=>`${(p[0]-left)/w*100}% ${(p[1]-top)/h*100}%`).join(',')})`};};
 const camPoints=[0,1,2].map(i=>{const c=camCentre(v,i);return point([c[0],c[1],z+.034])}),handle=point([.22,.19,z+.383]);
 return <div ref={host} className={wide?'r-clamp-wide':'archive-view'} role={wide?undefined:'group'} aria-label={wide?undefined:'束の締め具'}><WorldCamera eye={eye} frame={frame} scale={scale}>
 {!wide?<><TiledSurface x={.92} y={-.22} z={1.4} width={3.2} height={1.3} turn={-90} id="east-clamp-empty" group="scenes/binding" eye={eye} crop={[.61,.12,.30,.33]}/><TiledSurface x={.92} y={-.22} z={.1} width={3.2} height={1.0} turn={-90} id="east-clamp-empty" group="scenes/binding" eye={eye} crop={[.61,.53,.30,.20]}/><TiledSurface x={-2} y={-.22} z={-.85} width={2.92} height={3.2} tilt={90} id="east-clamp-empty" group="scenes/binding" eye={eye} crop={[.02,.84,.9,.13]}/>{[-.55,.80].flatMap(x=>[-.10,.41].map(y=><PhotoCuboid key={x+':'+y} x={x} y={y} z={-.85} width={.07} depth={.07} height={.78} texture={{id:'worktop',group:'parts/clamp',crop:[.2,.80,.5,.04]}}/>))}<TiledSurface x={-1.0} y={-.22} z={1.4} width={2.4} height={1.3} id="east-clamp-empty" group="scenes/binding" eye={eye} crop={[.61,.12,.30,.33]}/><TiledSurface x={-1.0} y={-.22} z={.1} width={2.4} height={1.0} id="east-clamp-empty" group="scenes/binding" eye={eye} crop={[.61,.53,.30,.20]}/><PhotoCuboid x={-.60} y={-.15} z={-.075} width={1.5} depth={.65} height={.07} texture={{id:'worktop',group:'parts/clamp',crop:[.2,.80,.5,.04]}} top={{id:'worktop',group:'parts/clamp'}}/></>:null}
 {!taken?<ClampBody g={g} frame={hasFrame}/>:null}
 </WorldCamera>{enabled&&!wide?<div className="envelope-hit-layer">
 {taken?<button className="env-screen-hit" aria-label="締め具を作業台へ戻す" style={rect([[0,0,0],[.44,0,0],[.44,.38,0],[0,.38,0]])} onClick={()=>act({type:'p-clamp-return',id:28})}/>:<>
 {cams?camPoints.map((p,i)=><button key={i} className="env-screen-hit" aria-label={`${i+1}個目の偏心カムを回す`} style={{left:p[0]-22,top:p[1]-22,width:44,height:44,clipPath:separateTarget(p,camPoints.filter((_,j)=>j!==i))}} onClick={()=>act({type:'p-clamp-turn',id:28,index:i})}/>):<button className="watermark-command" aria-label="押さえ板を上から見る" style={{left:width/2-22,top:height-125}} onClick={()=>onCams?.(true)}><Icon name="eye"/></button>}
 {!cams?<button className="env-screen-hit" aria-label={v[3]?'押さえ板を下ろす':'押さえ板を上げる'} style={{left:handle[0]-35,top:handle[1]-25,width:70,height:50}} onClick={()=>act({type:'p-clamp-height',id:28})}/>:<button className="watermark-command" aria-label={v[3]?'押さえ板を下ろす':'押さえ板を上げる'} style={{left:width/2-22,top:height-125}} onClick={()=>act({type:'p-clamp-height',id:28})}><Icon name={v[3]?'back':'eye'}/></button>}
 {v[3]&&!hasFrame&&g.selected==='frame'?<button className="env-screen-hit" aria-label="締め具の台に綴じ枠を置く" style={rect([[0,0,.02],[.44,0,.02],[.44,.38,.02],[0,.38,.02]])} onClick={()=>act({type:'p-place',id:28,target:'frame'})}/>:null}
 {hasFrame?<button className="watermark-command" aria-label="綴じ枠を取り出す" style={{left:width/2+36,top:height-125}} onClick={()=>act({type:'p-retrieve',id:28,item:'frame'})}><Icon name="bag"/></button>:<button className="watermark-command" aria-label="締め具を持ち上げる" style={{left:width/2+36,top:height-125}} onClick={()=>act({type:'p-clamp-take',id:28})}><Icon name="bag"/></button>}
 </>}
 </div>:null}</div>;
}
