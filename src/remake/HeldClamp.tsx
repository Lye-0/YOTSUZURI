import {archiveLookAt} from './archiveSpace';
import {clampPlatenHeight} from './clamp';
import {useRef,useState,useLayoutEffect} from 'react';
import type {World} from './campaign';
import {WorldCamera} from './WorldCamera';
import {ClampBody} from './ClampBody';
import {clampEye} from './clampGeometry';
import {Icon} from './Icons';
export function HeldClamp({g,detail=false}:{g:World;detail?:boolean}){const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[cams,setCams]=useState(false),frame={width:cams?1000:800,height:cams?900:1050},mid=Math.max(.36,clampPlatenHeight(g)+.4)/2,eye=cams?clampEye(g,true):archiveLookAt([.22,.19,mid],0,{x:.22,y:1.0,height:mid+.24,focal:1250,centerX:400,centerY:525});useLayoutEffect(()=>{const fit=()=>setScale(Math.min(host.current!.clientWidth/frame.width,host.current!.clientHeight/frame.height));fit();const r=new ResizeObserver(fit);r.observe(host.current!);return()=>r.disconnect()},[cams]);return <div ref={host} className={'r-held-cradle'+(detail?' inspection':'')}><div style={{position:'absolute',left:'50%',top:'50%',width:frame.width*scale,height:frame.height*scale,transform:'translate(-50%,-50%)'}}><WorldCamera eye={eye} frame={frame} scale={scale}><ClampBody g={g}/></WorldCamera></div>{detail?<button className="watermark-command" aria-label={cams?'締め具を正面から見る':'締め具を上から見る'} style={{right:8,bottom:8}} onClick={()=>setCams(n=>!n)}><Icon name="eye"/></button>:null}</div>}
