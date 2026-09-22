import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {tissueTrace} from './rubbing';
import type {World} from './campaign';
export const rubbingTable={x:4.4,y:-5.05};
export const rubbingPoint=([x,y,z]:ShelfPoint):ShelfPoint=>[rubbingTable.x+x,rubbingTable.y+y,z];
export type RubbingView='all'|'mould'|'paper';
export const mouldCentre=[.36,.27] as const,inspectionCentre=[.86,.27] as const;
export function tissueRect(g:World){const onMat=!!g.flags['rubbing:inspection'],c=onMat?inspectionCentre:mouldCentre,odd=onMat&&tissueTrace(g)[4]%2,w=odd?.095:.15,h=odd?.15:.095;return{x:c[0]-w/2,y:c[1]-h/2,width:w,depth:h,z:onMat?.821:.8284};}
export const rubbingEye=(view:RubbingView='all')=>{const close=view!=='all',c=view==='paper'?inspectionCentre:mouldCentre,target=rubbingPoint([close?c[0]:.70,close?c[1]+.05:.30,.83]);return archiveLookAt(target,0,{x:target[0],y:target[1]+(close?.40:1.0),height:close?1.18:1.6,focal:close?2200:900,centerX:500,centerY:450});};
