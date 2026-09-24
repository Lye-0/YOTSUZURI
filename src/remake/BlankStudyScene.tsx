import {useLayoutEffect,useRef,useState} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {studyEye} from './studyGeometry';
import {VaultShell} from './VaultShell';
import {BlankStudyWorld} from './BlankStudyWorld';
import {BlankStudyInputs} from './BlankStudyInputs';
export function BlankStudyScene({g,act,index,onInspect}:{g:World;act?:(a:Action)=>void;index?:number;onInspect:(i:number)=>void}){
 const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),eye=studyEye(index),frame={width:1000,height:900};
 useLayoutEffect(()=>{const update=()=>setScale(host.current!.clientWidth/frame.width);update();const r=new ResizeObserver(update);r.observe(host.current!);return()=>r.disconnect()},[]);
 return <div className="archive-view" ref={host} role="group" aria-label="原型庫の紙標本"><WorldCamera eye={eye} frame={frame} scale={scale}><VaultShell eye={eye}/><BlankStudyWorld g={g}/></WorldCamera>{act?<BlankStudyInputs {...{g,act,eye,scale,index,onInspect}}/>:null}</div>;
}
