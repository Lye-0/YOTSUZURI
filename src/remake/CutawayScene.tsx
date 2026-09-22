import {useLayoutEffect,useRef,useState} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {VaultShell} from './VaultShell';
import {CutawayWorld} from './CutawayWorld';
import {modelEye,modelPixel} from './cutawayGeometry';
import {modelPinCentres} from './CutawayArt';
import {archiveProjectEye} from './archiveSpace';
import {cutawayAligned,cutawayOpen} from './cutaway';
import {separateTarget} from './screenTargets';
export function CutawayScene({g,act}:{g:World;act?:(a:Action)=>void}){const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[kick,setKick]=useState(0),eye=modelEye(),frame={width:1000,height:900};useLayoutEffect(()=>{const update=()=>setScale(host.current!.clientWidth/1000);update();const r=new ResizeObserver(update);r.observe(host.current!);return()=>r.disconnect()},[]);const points=modelPinCentres.map(x=>{const p=archiveProjectEye(modelPixel(x,746),eye);return[p[0]*scale,p[1]*scale] as const;}),h=archiveProjectEye(modelPixel(cutawayOpen(g)?1370:1290,375),eye);return <div ref={host} className="archive-view" role="group" aria-label="断面の見える錠の模型"><WorldCamera {...{eye,frame,scale}}><VaultShell eye={eye}/><CutawayWorld g={g} eye={eye} pixelScale={scale} kick={kick}/></WorldCamera>{act?<>
 {points.map((p,i)=><button key={i} className="env-screen-hit" disabled={cutawayOpen(g)} aria-label={`${i+1}本目を持ち上げる`} style={{left:p[0]-22,top:p[1]-22,width:44,height:44,clipPath:separateTarget(p,points.filter((_,j)=>j!==i))}} onClick={()=>act({type:'p-cutaway-screw',id:27,index:i})}/>)}
 <button className="env-screen-hit" aria-label={cutawayOpen(g)?'錠の取っ手を戻す':'錠の取っ手を引く'} style={{left:h[0]*scale-30,top:h[1]*scale-25,width:60,height:50}} onClick={()=>{if(!cutawayOpen(g)&&!cutawayAligned(g))setKick(n=>n+1);act({type:'p-cutaway-bolt',id:27})}}/>
 </>:null}</div>}
