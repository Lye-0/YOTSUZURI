import {archiveLookAt,archiveProjectEye,shelfRect,type ArchiveEye,type ShelfState,type ShelfPoint} from './archiveSpace';
export const ENVELOPE_FRAME={width:1000,height:900};
export const envelopeOrigin=(values:ShelfState):ShelfPoint=>{const c=shelfRect(values,2);return [c.x+.225,c.y+.515,c.height+.008];};
export function envelopeScreenCentre(values:ShelfState,eye:ArchiveEye){const [x,y,z]=envelopeOrigin(values),p=[[0,0],[.43,0],[.43,.28],[0,.28]].map(([dx,dy])=>archiveProjectEye([x+dx,y+dy,z],eye));return [(Math.min(...p.map(v=>v[0]))+Math.max(...p.map(v=>v[0])))/2,(Math.min(...p.map(v=>v[1]))+Math.max(...p.map(v=>v[1])))/2] as const;}
export function envelopeEye(values:ShelfState,extension=0,contents=false){
 const [x,y,z]=envelopeOrigin(values),c=shelfRect(values,2),target:ShelfPoint=contents?[x-extension+.1,y+.14,z]:[x+.18,y+.07,z];
 return archiveLookAt(target,0,{x:Math.min(x+.18,3.25),y:c.y+c.depth+.10,height:2.2,focal:contents?3400:1200,centerX:500,centerY:450});
}
