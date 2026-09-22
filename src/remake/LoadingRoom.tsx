import {MasterScene} from './MasterScene';
import {BookWorkbench} from './BookWorkbench';
import {bookWorkPoint} from './bookWorkspaceGeometry';
import {masterPoint} from './masterGeometry';
import {ExitInputs} from './ExitInputs';
import {exitEye} from './exitGeometry';
import type {ArchiveDetail} from './ArchiveRoom';
import {separateTarget} from './screenTargets';
import {ReceptionBackdrop} from './ReceptionBackdrop';
import {useRef,useState,useLayoutEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {archiveEye,archiveProjectEye,type ArchiveEye,type ShelfPoint} from './archiveSpace';
import {LoadingWorld} from './LoadingWorld';
import {WorldCamera} from './WorldCamera';
import {Face,Photograph} from './ArchivePhotos';
import {loadingEye,loadingEntry as entry,loadingWindow as win,entryHandle} from './loadingSpace';
const FRAME={width:1672,height:941};
function useScale(frameWidth=1672){const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1);useLayoutEffect(()=>{const fit=()=>setScale(host.current!.clientWidth/frameWidth);fit();const r=new ResizeObserver(fit);r.observe(host.current!);return()=>r.disconnect()},[frameWidth]);return{host,scale};}
function receptionClips(g:World,eye:ArchiveEye){const rects=[[win.start,win.end,win.bottom,win.top],...(g.flags['loading:entry']?[[entry.start,entry.end,0,entry.height]]:[])];return rects.flatMap(([a,b,lo,hi])=>{const p=[[0,a,hi],[0,b,hi],[0,b,lo],[0,a,lo]].map(p=>archiveProjectEye([p[0],p[1],p[2]],eye));return p.every(p=>p[2]>.05)?[`polygon(${p.map(p=>`${p[0]/1672*100}% ${p[1]/941*100}%`).join(',')})`]:[];});}
function LoadingNavigation({g,act,enabled,detail,onDetail}:{g:World;act:(a:Action)=>void;enabled:boolean;detail:ArchiveDetail;onDetail:(d:ArchiveDetail)=>void}){const close=detail?.kind==='exit-lock',frame=close?{width:700,height:850}:FRAME,{host,scale}=useScale(frame.width),eye=close?exitEye():loadingEye(g.facing),open=!!g.flags['loading:entry'],handle=archiveProjectEye(entryHandle(open),eye);
 const poly=(points:readonly ShelfPoint[]):CSSProperties=>{const ps=points.map(p=>archiveProjectEye(p,eye)),x=Math.min(...ps.map(p=>p[0])),y=Math.min(...ps.map(p=>p[1])),w=Math.max(...ps.map(p=>p[0]))-x,h=Math.max(...ps.map(p=>p[1]))-y;return{left:x*scale,top:y*scale,width:w*scale,height:h*scale,clipPath:`polygon(${ps.map(p=>`${(p[0]-x)/w*100}% ${(p[1]-y)/h*100}%`).join(',')})`};};
 const worktopHit=poly([[0,0,0],[.67,0,0],[.67,1,0],[0,1,0]].map(p=>bookWorkPoint([p[0],p[1],p[2]])));
 return <div className="archive-view" ref={host} role="group" aria-label="搬出間">{receptionClips(g,eye).map((clip,i)=><WorldCamera key={i} eye={eye} frame={frame} scale={scale} clip={clip}><ReceptionBackdrop g={g} eye={eye}/></WorldCamera>)}<WorldCamera eye={eye} frame={frame} scale={scale}><LoadingWorld g={g} eye={eye} pixelScale={scale}/></WorldCamera>
 {enabled&&g.facing===0?<button className="env-screen-hit" aria-label="二つの原型を調べる" style={poly([[.08,.02,.84],[1.57,.02,.84],[1.57,.60,.84],[.08,.60,.84]].map(p=>masterPoint([p[0],p[1],p[2]])))} onClick={()=>{onDetail(null);act({type:'focus',focus:'object:29'})}}/>:null}
 {enabled&&g.facing===3&&!close?<button className="env-screen-hit worktop-hit" aria-label="製本の作業台を調べる" style={worktopHit} onClick={()=>{onDetail(null);act({type:'focus',focus:'object:30'})}}><svg className="worktop-hit-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points={String(worktopHit.clipPath).slice(8,-1).replaceAll('%','')}/></svg></button>:null}
 {enabled?<ExitInputs g={g} act={act} eye={eye} scale={scale} close={close} onInspect={()=>onDetail({kind:'exit-lock'})} onClose={()=>onDetail(null)}/>:null}
 {enabled&&g.facing===1?<>{open?<button className="env-screen-hit" aria-label="受渡口へ戻る" style={poly([[0,entry.start,2.1],[0,entry.end,2.1],[0,entry.end,0],[0,entry.start,0]])} onClick={()=>act({type:'go',room:0})}/>:null}{handle[2]>.05?<button className="env-screen-hit" aria-label={open?'受渡口への戸を閉じる':'受渡口への戸を開く'} style={{left:handle[0]*scale-22,top:handle[1]*scale-22,width:44,height:44,zIndex:2}} onClick={()=>act({type:'loading-entry'})}/>:null}</>:null}
 </div>;}
export function LoadingFromReception({g,door=false,close=false,act,enabled=true}:{g:World;door?:boolean;close?:boolean;act?:(a:Action)=>void;enabled?:boolean}){const {host,scale}=useScale(),eye=archiveEye(3,door?{x:2.77,y:3.345,height:1.6,pitch:0,focal:800,centerX:474,centerY:320}:close?{x:3.7,y:1.25,height:1.35,pitch:0,focal:2140,centerX:812,centerY:539}:{x:3.7,y:1.25,height:1.35,pitch:0,focal:810,centerX:1137,centerY:409}),points=door?[[320,176],[627,176],[627,782],[320,782],[365,731],[365,214]]:close?[[235,105],[1390,105],[1390,713],[235,713]]:[[918,245],[1357,245],[1357,482],[918,482]],clip=`polygon(${points.map(([x,y])=>`${x/1672*100}% ${y/941*100}%`).join(',')})`;return <div ref={host} style={{position:'absolute',inset:0,pointerEvents:'none'}}><WorldCamera eye={eye} frame={FRAME} scale={scale} clip={clip}><LoadingWorld g={g} eye={eye} hideEntry={door} pixelScale={scale}/></WorldCamera>{door&&act&&enabled?<button className="env-screen-hit" aria-label="搬出間への戸を閉じる" style={{left:372*scale-22,top:477*scale-22,width:44,height:44,zIndex:3,pointerEvents:"auto",clipPath:separateTarget([372*scale,477*scale],[[1672*.275*scale,941*.505*scale]])}} onClick={()=>act({type:"loading-entry"})}/>:null}</div>}

export function LoadingRoom(p:Parameters<typeof LoadingNavigation>[0]){if(p.g.focus==='object:30')return <BookWorkbench g={p.g} act={p.enabled?p.act:undefined} view={p.detail?.kind==='book-work'?p.detail.view:'all'} onView={view=>p.onDetail(view==='all'?null:{kind:'book-work',view})}/>;if(p.g.focus==='object:29')return <MasterScene g={p.g} act={p.enabled?p.act:undefined} index={p.detail?.kind==='master'?p.detail.index:undefined} onInspect={index=>p.onDetail({kind:'master',index})}/>;return <LoadingNavigation {...p}/>;}
