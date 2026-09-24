export const folioMarks=[2,1,0,2,3,0,1,3];
/** The four printed faces stay attached to the same physical sheet. */
export const folioFaces=[[[8,1],[2,7]],[[6,3],[4,5]]] as const;
/** Mountain fold: visible right half is the front, visible left half is the back. */
export function foldedPages(sheet:number,face:number,back=0){const outside=folioFaces[sheet][face],inside=folioFaces[sheet][1-face];const pages=[outside[1],inside[0],inside[1],outside[0]];return back?[...pages].reverse():pages;}
export function foldPages(outerA:number,flipA:number,flipB:number,backA=0,backB=0){const a=foldedPages(0,flipA,backA),b=foldedPages(1,flipB,backB),outer=outerA?a:b,inner=outerA?b:a;return[...outer.slice(0,2),...inner,...outer.slice(2)];}
