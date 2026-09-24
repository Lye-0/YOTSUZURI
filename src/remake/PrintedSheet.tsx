import {useId} from 'react';
import {printScanRows,printWidths} from './evidenceLocks';
import {PhotoSprite} from './PhotoSprite';
import {PlateArtwork} from './PlateArtwork';
import type {Impression} from './printing';
export function PrintedSheet({layers,face=0}:{layers:Impression[];face?:number}){
 const uid=useId().replace(/:/g,'');
 return <svg viewBox="-35 -30 970 460" width="100%" height="100%" preserveAspectRatio="none" aria-label="試し刷りの紙" role="img"><defs><clipPath id={uid}><rect width="900" height="400"/></clipPath></defs>
 <g transform={face?'translate(900 0) scale(-1 1)':undefined}><PhotoSprite name="print-paper" x={-35} y={-30} width={970} height={460}/></g>
 <g fill="#51462f" stroke="#51462f" strokeWidth="1" opacity=".65">
 {printScanRows.map((y,i)=><g key={y}><path d={`M70 ${y}H830`} strokeDasharray="5 9"/><text x="35" y={y+5} stroke="none" fontSize="15">{['I','II','III','IV','V','VI'][i]}</text></g>)}
 <path d="M555 385h256"/>{printWidths.map((w,i)=><g key={w}><path d={`M${555+w} 380v10`}/><text x={551+w} y="403" stroke="none" fontSize="12">{i}</text></g>)}
 <text x="95" y="403" stroke="none" fontSize="16">中央の白地の幅</text></g>
 <g clipPath={`url(#${uid})`} style={{mixBlendMode:'multiply'}}><g transform={face?'translate(900 0) scale(-1 1)':undefined}>{layers.map((layer,i)=><g key={i} opacity={layer.face===face?.91:.32} transform={`translate(${(layer.offset-1)*60} 0) ${layer.face===0?'translate(900 0) scale(-1 1)':''} rotate(${layer.rotation*90} 450 200)`}><svg x="0" y="0" width="900" height="400"><PlateArtwork index={layer.plate} impression/></svg></g>)}</g></g>
 <g fill="none" stroke="#51462f" strokeWidth="4" opacity=".85" transform={face?'translate(900 0) scale(-1 1)':undefined}><path d="M-18 75h26m-13-13v26M-18 325h26m-13-13v26"/><path d="M850-12h44m-22-12v24"/></g>
 </svg>;
}
