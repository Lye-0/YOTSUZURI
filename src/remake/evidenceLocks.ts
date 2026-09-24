/** Shared physical settings: revealed by the printed outline / assembled edge painting. */
import {windowPoints} from './printing';
export const printScanRows=[90,150,210,245,290,335];
export const printWidths=[0,160,214,256];
const widthAt=(y:number)=>{const xs:number[]=[];windowPoints.forEach((p,i)=>{const q=windowPoints[(i+1)%windowPoints.length];if((p[1]>y)!==(q[1]>y))xs.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));});return xs.length?Math.max(...xs)-Math.min(...xs):0;};
export const printLockCode=printScanRows.map(y=>printWidths.indexOf(widthAt(y)));
export const panelLockCode=[2,0,3,1,2,1];
export const lockValues=(flags:Record<string,boolean>,prefix:string)=>Array.from({length:6},(_,i)=>[0,1,2,3].find(n=>flags[`${prefix}:${i}:${n}`])??0);
export const lockMatches=(flags:Record<string,boolean>,prefix:string,code:readonly number[])=>lockValues(flags,prefix).every((n,i)=>n===code[i]);
export function turnLock(flags:Record<string,boolean>,prefix:string,index:number){const v=lockValues(flags,prefix),next=(v[index]+1)%4;for(let n=0;n<4;n++)delete flags[`${prefix}:${index}:${n}`];flags[`${prefix}:${index}:${next}`]=true;}
