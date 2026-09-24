/** Outer edge and mounting holes shared by the rubbing and its alignment test. */
export const rubbingOutline=[[0,20.8],[19.4,0],[120,0],[120,80],[0,80]] as const;
export const rubbingHoles=[[117.2,17.8],[117.2,61.6]] as const;
export const rubbingOutlinePath=rubbingOutline.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join('')+'Z';
export const rubbingHolePath=rubbingHoles.map(([x,y])=>`M${x+1.7} ${y}a1.7 1.7 0 1 0-3.4 0a1.7 1.7 0 1 0 3.4 0`).join(' ');
const rotate=([x,y]:readonly number[],turn:number)=>{const u=x-75,v=y-47.5;switch(turn%4){case 1:return[75-v,47.5+u];case 2:return[75-u,47.5-v];case 3:return[75+v,47.5-u];default:return[x,y];}};
export function rubbingLandmarks(trace:readonly number[]){const transform=([x,y]:readonly number[])=>{let p=rotate([15+(trace[0]===0?120-x:x),7.5+y],trace[1]);if(trace[3])p=[150-p[0],p[1]];return rotate(p,trace[4]);};return {outline:rubbingOutline.map(transform),holes:rubbingHoles.map(transform)};}
const target=rubbingLandmarks([1,0,63,1,2]);
export function rubbingMatchesTarget(trace:readonly number[]){if(trace[2]!==63)return false;const actual=rubbingLandmarks(trace);return (['outline','holes'] as const).every(key=>actual[key].every(p=>target[key].some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<.01)));}
