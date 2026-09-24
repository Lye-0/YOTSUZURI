import type {EnvelopeArtProps} from './EnvelopeArt';
import {envelopeOrigin} from './envelopeGeometry';
import {envelopeValues} from './envelope';
import {archiveProjectEye,type ArchiveEye,type ShelfState} from './archiveSpace';
import {Icon} from './Icons';
export function EnvelopeControls({g,onAct,contents,eye,scale,values}:{eye:ArchiveEye;scale:number;values:ShelfState}&EnvelopeArtProps){
 if(!g||!onAct||contents)return null;const v=envelopeValues(g),[x,y,z]=envelopeOrigin(values),at=(dx:number)=>{const p=archiveProjectEye([x+dx,y+.49,z],eye),width=eye.centerX*2*scale,height=eye.centerY*2*scale,cy=Math.max(24,Math.min(height-28,p[1]*scale));let cx=Math.max(24,Math.min(width-24,p[0]*scale));if(Math.abs(cx-width/2)<58&&cy>height-80)cx=width/2+(dx<.2?-70:70);return {left:cx-22,top:cy-22};};
 return <div className="envelope-controls">
 {v[2]===0?<button style={at(.37)} aria-label="封筒を裏返す" onClick={()=>onAct({type:'p-envelope-turn',id:18})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 11h18v14H7zM6 8A11 11 0 0 1 26 8m-5-1l5 1 1-5M25 28A11 11 0 0 1 5 28m6 1l-6-1-1 5"/></svg></button>:null}
 {v[2]===7?([-1,1] as const).map(direction=><button key={direction} style={at(direction===-1?.06:.34)} aria-label={direction===-1?'重なった紙を左へ動かす':'重なった紙を右へ動かす'} onClick={()=>onAct({type:'p-envelope-slide',id:18,direction})}><Icon name={direction===-1?'left':'right'}/></button>):null}
 </div>;
}
