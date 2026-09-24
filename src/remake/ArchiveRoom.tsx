import {watermarkEye,WATERMARK_FRAME} from './watermarkGeometry';
import {weighingEye,WEIGHING_FRAME,type WeighingDetail} from './weighingGeometry';
import {useEffect,useRef,useState} from 'react';
import type {Action,World} from './campaign';
import {archiveValues} from './archive';
import {ArchiveScene} from './ArchiveScene';
import {archiveLookAt,canMoveShelf,shelfFootPoint} from './archiveSpace';
import {archiveTraceEye} from './archivePlan';
import {envelopeValues} from './envelope';
import {envelopeEye,ENVELOPE_FRAME} from './envelopeGeometry';
export type ArchiveDetail={kind:'book-work';view:'book'|'compare'|'cams'}|{kind:'master';index:number}|{kind:'clamp-cams'}|{kind:'exit-lock'}|{kind:'rubbing';view:'mould'|'paper'}|{kind:'joinery-piece';index:number}|{kind:'study-leaf';index:number}|{kind:'foot';index:number;end:number}|{kind:'trace';index:number}|{kind:'envelope'}|{kind:'watermark'}|WeighingDetail|{kind:'optics';view:'light'|'catch'}|{kind:'cradle-side'}|{kind:'foreedge';view:'edge'|'painting'}|{kind:'repair-panel';index:number}|null;
export function ArchiveRoom({g,act,enabled,detail,onDetail}:{g:World;act:(a:Action)=>void;enabled:boolean;detail:ArchiveDetail;onDetail:(d:ArchiveDetail)=>void}){
 const [selected,setSelected]=useState(-1),[keyboard,setKeyboard]=useState(false),[busy,setBusy]=useState(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null),values=archiveValues(g);
 useEffect(()=>{setSelected(-1);},[g.room,g.facing,g.focus]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const move=(index:number,position:number)=>{if(busy||!enabled)return;const allowed=canMoveShelf(values,index,position);act({type:'p-slide',index,position});if(allowed&&!g.reducedMotion){setBusy(true);timer.current=setTimeout(()=>setBusy(false),240);}};
 const weighing=g.focus==='object:19',weighingDetail=detail?.kind==='weighing-scale'||detail?.kind==='weighing-tray'||detail?.kind==='weighing-book'?detail:undefined,marking=g.focus==='object:17',paper=g.focus==='object:18',camera=weighing?weighingEye(g,weighingDetail):marking?watermarkEye(detail?.kind==='watermark'):paper?envelopeEye(values,envelopeValues(g)[3]*.1,detail?.kind==='envelope'):detail?.kind==='foot'?archiveLookAt(shelfFootPoint(values,detail.index,detail.end),g.facing):detail?.kind==='trace'?archiveTraceEye(detail.index,g.facing):undefined,interactive=enabled&&!detail&&g.focus==='room';
 return <ArchiveScene values={values} facing={g.facing} room={g.room as 6|7} doorOpen={!!g.flags['archive:door']} camera={camera} frame={weighing?WEIGHING_FRAME:paper?ENVELOPE_FRAME:marking?WATERMARK_FRAME:undefined} selected={detail?-1:selected} busy={busy||!enabled} keyboard={keyboard}
 weighing={{g,detail:weighingDetail,onDetail:enabled?onDetail:undefined,onAct:enabled&&weighing?act:undefined,onInspect:interactive&&g.room===7&&g.facing===3?()=>{onDetail(null);act({type:'focus',focus:'object:19'});}:undefined}}
 repair={{g}}
 watermark={{g,onAct:enabled&&marking?act:undefined,onInspect:interactive&&g.room===7&&g.facing===0?()=>{onDetail(null);act({type:'focus',focus:'object:17'});}:undefined,onZoom:enabled&&marking?()=>onDetail({kind:'watermark'}):undefined,onTable:()=>onDetail(null),detail:detail?.kind==='watermark'}}
 envelope={{g,onAct:enabled&&paper?act:undefined,onInspect:interactive&&g.room===6?()=>{setSelected(-1);onDetail(null);act({type:'focus',focus:'object:18'});}:undefined,onInspectContents:enabled&&paper?()=>onDetail({kind:'envelope'}):undefined,contents:detail?.kind==='envelope'}}
 onSelect={interactive&&g.room===6?(i,k)=>{setSelected(i);setKeyboard(k);}:undefined} onMove={interactive&&g.room===6?move:undefined}
 onInspect={interactive?(index,end)=>{setSelected(-1);onDetail({kind:'foot',index,end});}:undefined}
 onTrace={interactive?index=>{setSelected(-1);onDetail({kind:'trace',index});}:undefined}
 onDoor={interactive&&g.room===6?()=>{setSelected(-1);act({type:'archive-door'});}:undefined}
 onPortal={interactive?room=>{setSelected(-1);act({type:'go',room});}:undefined}/>;
}
export function ArchiveEntrance({g}:{g:World}){return <div style={{position:'absolute',inset:0,clipPath:'polygon(40.97% 16.15%,58.6% 16.15%,58.6% 76.55%,40.97% 76.55%)',pointerEvents:'none'}}><ArchiveScene values={archiveValues(g)} facing={0} doorOpen={!!g.flags['archive:door']} envelope={{g}} watermark={{g}} weighing={{g}} repair={{g}} camera={{x:1.925,y:7.2,height:1.6,pitch:0,focal:548,centerY:282}}/></div>;}
