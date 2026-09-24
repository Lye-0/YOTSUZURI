import {useRef,useState,useLayoutEffect} from 'react';
import type {World} from './campaign';
import {validJoinery} from './joinery';
import {FrameBody} from './FrameBody';
import {WorldCamera} from './WorldCamera';
import {archiveLookAt} from './archiveSpace';
const eye=archiveLookAt([.18,.15,.009],0,{x:.40,y:.70,height:.58,focal:680,centerX:300,centerY:200});
export function HeldFrame({g,detail=false}:{g:World;detail?:boolean}){const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1);useLayoutEffect(()=>{const fit=()=>setScale(Math.min(host.current!.clientWidth/600,host.current!.clientHeight/400));fit();const r=new ResizeObserver(fit);r.observe(host.current!);return()=>r.disconnect()},[]);return <div ref={host} className={'r-held-cradle'+(detail?' inspection':'')}><div style={{position:'absolute',left:'50%',top:'50%',width:600*scale,height:400*scale,transform:'translate(-50%,-50%)'}}><WorldCamera eye={eye} frame={{width:600,height:400}} scale={scale}><FrameBody values={validJoinery(g.itemValues.frame)?g.itemValues.frame:[0,1,2,3,0,1,2,3,0,0,0,0]}/></WorldCamera></div></div>}
