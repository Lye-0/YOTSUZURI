import {TrimInk} from './TrimInk';
import {useState} from 'react';
import {PhotoSprite} from './PhotoSprite';
import {trimValues} from './trimming';
import type {Action,World} from './campaign';
/** A straight cut is a crop of one physical paper plane, including its printing. */
export function TrimPaper({part,back=false,rotation=0}:{part:number|'body';back?:boolean;rotation?:number}){
 const width=part==='body'?460:140;
 return <svg viewBox={`0 0 ${width} 500`} width="100%" height="100%" preserveAspectRatio="none" style={{overflow:'hidden'}} aria-hidden="true"><g transform={`rotate(${rotation*180} ${width/2} 250)`}><g transform={back?`translate(${width} 0) scale(-1 1)`:undefined}><g transform={part==='body'?undefined:'translate(-460 0)'}><PhotoSprite name="trimming-paper" x={0} y={0} width={600} height={500}/><TrimInk edition={part} back={back}/></g></g></g></svg>;
}
export function TrimAssembly({values,flip=false}:{values:number[];flip?:boolean}){
 const back=Boolean(values[4])!==flip,id=values[0];
 return <svg viewBox="0 0 600 500" width="100%" height="100%" role="img" aria-label="断裁片を添えた図面"><svg x={back?140:0} y="0" width="460" height="500"><TrimPaper part="body" back={back}/></svg>{id>=0?<svg x={back?0:460} y="0" width="140" height="500"><TrimPaper part={id} back={Boolean(values[id+5])!==flip} rotation={values[id+1]}/></svg>:null}</svg>;
}
export function PaperTurnIcon(){return <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 10A11 11 0 0 1 26 14M25 6l1 8-8-1M25 22A11 11 0 0 1 6 18M7 26l-1-8 8 1"/></svg>}
export function HeldOldPlan({values,onFlip}:{values:number[];onFlip?:()=>void}){const [flip,setFlip]=useState(false);return <div className="r-map-held"><TrimAssembly values={values} flip={flip}/><button className="r-thread-flip" aria-label="図面全体を裏返す" aria-pressed={Boolean(values[4])!==flip} onClick={()=>onFlip?onFlip():setFlip(v=>!v)}><PaperTurnIcon/></button></div>}
export function TrimInspection({part,g,act}:{part:number;g:World;act:(a:Action)=>void}){const v=trimValues(g),body=part===-1;return <div className="r-trim-inspection-panel"><div className={'r-trim-inspection '+(body?'body':'strip')}><TrimPaper part={body?'body':part} back={!!v[body?4:part+5]} rotation={body?0:v[part+1]}/></div><div className="r-trim-inspection-actions"><button aria-label="この紙を裏返す" onClick={()=>act({type:'p-trim-flip',id:14,index:part})}><PaperTurnIcon/><span>裏返す</span></button>{!body?<button aria-label="紙片の上下を返す" onClick={()=>act({type:'p-trim-rotate',id:14,index:part})}><svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 7H7v18h14V7H11 M21 3a12 12 0 0 1 6 20m0 -7v7h-7"/></svg><span>上下を反転</span></button>:null}</div></div>}
