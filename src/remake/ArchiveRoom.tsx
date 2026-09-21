import {useEffect,useRef,useState} from 'react';
import type {Action,World} from './campaign';
import {archiveValues} from './archive';
import {ArchiveScene} from './ArchiveScene';
import {archiveLookAt,canMoveShelf,shelfFootPoint} from './archiveSpace';
import {archiveTraceEye} from './archivePlan';
export type ArchiveDetail={kind:'foot';index:number;end:number}|{kind:'trace';index:number}|null;
export function ArchiveRoom({g,act,enabled,detail,onDetail,onBoundary}:{g:World;act:(a:Action)=>void;enabled:boolean;detail:ArchiveDetail;onDetail:(d:ArchiveDetail)=>void;onBoundary:()=>void}){
 const [selected,setSelected]=useState(-1),[keyboard,setKeyboard]=useState(false),[busy,setBusy]=useState(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null),values=archiveValues(g);
 useEffect(()=>{setSelected(-1);},[g.room,g.facing]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const move=(index:number,position:number)=>{if(busy||!enabled)return;const allowed=canMoveShelf(values,index,position);act({type:'p-slide',index,position});if(allowed&&!g.reducedMotion){setBusy(true);timer.current=setTimeout(()=>setBusy(false),240);}};
 const camera=detail?.kind==='foot'?archiveLookAt(shelfFootPoint(values,detail.index,detail.end),g.facing):detail?.kind==='trace'?archiveTraceEye(detail.index,g.facing):undefined,interactive=enabled&&!detail;
 return <ArchiveScene values={values} facing={g.facing} room={g.room as 6|7} doorOpen={!!g.flags['archive:door']} camera={camera} selected={detail?-1:selected} busy={busy||!enabled} keyboard={keyboard}
 onSelect={interactive&&g.room===6?(i,k)=>{setSelected(i);setKeyboard(k);}:undefined} onMove={interactive&&g.room===6?move:undefined}
 onInspect={interactive?(index,end)=>{setSelected(-1);onDetail({kind:'foot',index,end});}:undefined}
 onTrace={interactive?index=>{setSelected(-1);onDetail({kind:'trace',index});}:undefined}
 onDoor={interactive&&g.room===6?()=>{setSelected(-1);act({type:'archive-door'});}:undefined}
 onPortal={interactive?room=>{setSelected(-1);if(room===8)onBoundary();else act({type:'go',room});}:undefined}/>;
}
export function ArchiveEntrance({g}:{g:World}){return <div style={{position:'absolute',inset:0,clipPath:'polygon(40.97% 16.15%,58.6% 16.15%,58.6% 76.55%,40.97% 76.55%)',pointerEvents:'none'}}><ArchiveScene values={archiveValues(g)} facing={0} doorOpen={!!g.flags['archive:door']} camera={{x:1.925,y:7.2,height:1.6,pitch:0,focal:548,centerY:282}}/></div>;}
