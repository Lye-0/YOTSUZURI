import {useState,useEffect} from 'react';
import type {World,Action} from './campaign';
import {ArchiveScene} from './ArchiveScene';
import type {ArchiveDetail} from './ArchiveRoom';
import {archiveValues} from './archive';
import {repairEye,opticalEye} from './repairSpace';
import {cradleEye} from './cradleGeometry';
import {foreedgeEye,foreedgeFrame} from './foreedgeGeometry';
import {lockMatches,panelLockCode} from './evidenceLocks';
import {panelEye} from './repairNorthGeometry';
export function RepairRoom({g,act,enabled,detail,onDetail}:{g:World;act:(a:Action)=>void;enabled:boolean;detail:ArchiveDetail;onDetail:(detail:ArchiveDetail)=>void}){
 const [fanPreview,setFanPreview]=useState<number|null>(null);
 useEffect(()=>setFanPreview(null),[g.focus,g.room]);
 const optical=g.focus==='object:20',cradle=g.focus==='object:21',book=g.focus==='object:22',opticalView=detail?.kind==='optics'?detail.view:'all',bookView=detail?.kind==='foreedge'?detail.view:'all',panel=detail?.kind==='repair-panel'?detail.index:undefined,side=detail?.kind==='cradle-side',interactive=enabled&&g.focus==='room'&&!detail;
 const camera=panel!==undefined?panelEye(panel,!!g.flags[`repair:trim:${panel}`]&&!g.flags.secret):optical?opticalEye(opticalView):cradle?cradleEye(side):book?foreedgeEye(g,bookView):repairEye(g.facing),frame=panel!==undefined?{width:700,height:1000}:book?foreedgeFrame(bookView):optical||cradle?{width:1000,height:900}:undefined;
 const focus=(id:number)=>{onDetail(null);act({type:'focus',focus:`object:${id}`});};
 const actHere=(a:Action)=>{act(a);if(a.type==='repair-panel-door'&&a.index===1&&g.flags['repair:trim:1']&&(g.flags.secret||g.flags['repair:released']||lockMatches(g.flags,'repair:setting:1',panelLockCode)))onDetail(null);};
 return <ArchiveScene values={archiveValues(g)} room={8} facing={g.facing} camera={camera} frame={frame} doorOpen={!!g.flags['archive:door']} envelope={{g}} watermark={{g}} weighing={{g}} repair={{g:book&&fanPreview!==null?{...g,values:{...g.values,22:[...g.book.order,fanPreview]}}:g,onFanPreview:setFanPreview,onAct:enabled?actHere:undefined,view:opticalView,onView:view=>onDetail(view==='all'?null:{kind:'optics',view}),cradleSide:side,onCradleSide:side=>onDetail(side?{kind:'cradle-side'}:null),bookView,onBookView:view=>{setFanPreview(null);onDetail(view==='all'?null:{kind:'foreedge',view})},panelIndex:panel,onInspectPanel:interactive&&g.facing===0?index=>onDetail({kind:'repair-panel',index}):undefined,onVault:interactive?()=>act({type:'go',room:9}):undefined,onArchive:interactive?()=>act({type:'go',room:6}):undefined,onInspectOptics:interactive&&g.facing===2?()=>{act({type:'focus',focus:'object:20'});}:undefined,onInspectCradle:interactive&&g.facing===1?()=>focus(21):undefined,onInspectForeedge:interactive&&g.facing===2?()=>focus(22):undefined}}/>;
}
