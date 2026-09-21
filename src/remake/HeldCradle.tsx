import {useLayoutEffect,useRef,useState} from 'react';
import type {World} from './campaign';
import {validCradle} from './cradle';
import {archiveLookAt} from './archiveSpace';
import {WorldCamera} from './WorldCamera';
import {CradleBody} from './CradleBody';
import {Icon} from './Icons';
export const heldCradleWorld=(g:World):World=>({...g,values:{...g.values,21:validCradle(g.itemValues.cradle)?g.itemValues.cradle:[0,0,2,0]},placed:{...g.placed,21:['corner','wedge']}});
const sideEye=archiveLookAt([.16,.13,.045],0,{x:-.28,y:.62,height:.17,focal:640,centerX:300,centerY:200}),topEye=archiveLookAt([.16,.13,.045],0,{x:.52,y:.68,height:.38,focal:640,centerX:300,centerY:200});
export function HeldCradle({g,detail=false}:{g:World;detail?:boolean}){const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[side,setSide]=useState(false);useLayoutEffect(()=>{const fit=()=>setScale(Math.min(host.current!.clientWidth/600,host.current!.clientHeight/400));fit();const observer=new ResizeObserver(fit);observer.observe(host.current!);return()=>observer.disconnect();},[]);
 return <div ref={host} className={'r-held-cradle'+(detail?' inspection':'')}><div style={{position:'absolute',left:'50%',top:'50%',width:600*scale,height:400*scale,transform:'translate(-50%,-50%)'}}><WorldCamera eye={side?sideEye:topEye} frame={{width:600,height:400}} scale={scale}><CradleBody g={heldCradleWorld(g)}/></WorldCamera></div>{detail?<button className="watermark-command" style={{right:8,bottom:8}} aria-label={side?'支持具を上から見る':'支持具の横を見る'} onClick={()=>setSide(n=>!n)}><Icon name="eye"/></button>:null}</div>;
}
