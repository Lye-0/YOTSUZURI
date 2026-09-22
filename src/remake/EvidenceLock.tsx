import {useId} from 'react';
import {PhotoSprite} from './PhotoSprite';
/** Six independent physical stops, with no per-stop correctness feedback. */
export function EvidenceLock({values,onTurn,label='六段の留め',ink=false}:{values:readonly number[];onTurn?:(i:number)=>void;label?:string;ink?:boolean}){const id=useId().replace(/:/g,'');return <svg viewBox="0 0 300 440" width="100%" height="100%" role={onTurn?'group':'img'} aria-label={label}>
 <defs><linearGradient id={id} x2="1" y2="1"><stop stopColor="#bd9d5f"/><stop offset=".45" stopColor="#66512d"/><stop offset="1" stopColor="#bc9b60"/></linearGradient></defs>
 {!ink?<><rect x="4" y="4" width="292" height="432" rx="8" fill={`url(#${id})`} stroke="#302a1d" strokeWidth="6"/><svg x="8" y="8" width="284" height="424" viewBox="1200 470 400 200" preserveAspectRatio="none" opacity=".55"><image href={import.meta.env.BASE_URL+'remake/parts/plate-0.webp'} width="2100" height="749"/></svg></>:null}
 {values.map((value,i)=><g key={i} transform={`translate(0 ${30+i*65})`}>
 <text x="18" y="24" fontSize="18" fill={ink?'currentColor':'#28231b'}>{['I','II','III','IV','V','VI'][i]}</text>
 <path d="M65 20H265" stroke={ink?'currentColor':'#211e16'} strokeWidth={ink?2:14} strokeLinecap="round"/>
 {[0,1,2,3].map(n=><path key={n} d={`M${75+n*60} 6v28`} stroke={ink?'currentColor':'#d2bb83'} strokeWidth="2"/>)}
 {ink?<circle cx={75+value*60} cy="20" r="10" fill="currentColor"/>:<PhotoSprite name="keeper-pin-front" x={57+value*60} y={0} width={36} height={38}/>}
 {onTurn?<g role="button" tabIndex={0} aria-label={`${i+1}段目の留め位置を動かす`} onClick={()=>onTurn(i)} onKeyDown={e=>{if(['Enter',' ','ArrowRight'].includes(e.key)){e.preventDefault();onTurn(i)}}}><rect className="r-paper-hit" x="53" y="-9" width="220" height="58"/></g>:null}
 </g>)}
 {[0,1,2,3].map(n=><text key={n} x={75+n*60} y="427" textAnchor="middle" fill={ink?'currentColor':'#28231b'} fontSize="15">{n}</text>)}</svg>}
