import {rubbingMatchesTarget} from './rubbingShape';
import type {World} from './campaign';
import {tissueTrace} from './rubbing';
/** Physical location for a reference sheet on the door, not a numbered puzzle. */
export const EXIT_PAPER=31;
export const paperOnExit=(g:World)=>!!g.placed[EXIT_PAPER]?.includes('tissue');
export const paperMatchesExit=(g:World)=>rubbingMatchesTarget(tissueTrace(g));
export const paperAlignmentMessage=(g:World)=>tissueTrace(g)[2]!==63?'写しの縁や穴に途切れた部分がある。原型で残りを写せる。':paperMatchesExit(g)?'外周・欠けた角・二つの穴が重なった。':'欠けた角と二つの穴がまだ重なっていない。紙を回すか裏返して合わせる。';
export type ExitReferenceAction={type:'exit-paper-place'}|{type:'exit-paper-take'};
export function applyExitReference(s:World,a:ExitReferenceAction):{world:World;message?:string}{
 if(s.room!==10||s.facing!==3||s.focus!=='room')return{world:s};const g=structuredClone(s);
 if(a.type==='exit-paper-place'){
  if(g.selected!=='tissue'||!g.inventory.includes('tissue')||paperOnExit(g))return{world:s};if(g.flags.exitKey)return{world:s,message:'鍵が差さっている。'};
  g.inventory=g.inventory.filter(n=>n!=='tissue');g.placed[EXIT_PAPER]=['tissue'];g.selected=null;
  if(paperMatchesExit(g)&&!g.solved.includes(25))g.solved.push(25);
 }else{if(!paperOnExit(g))return{world:s};g.placed[EXIT_PAPER]=[];g.inventory.push('tissue');g.selected=null;}
 return{world:g,message:a.type==='exit-paper-place'?paperAlignmentMessage(g):undefined};
}
