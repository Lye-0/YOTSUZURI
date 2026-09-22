import {archiveEye,type ShelfPoint} from './archiveSpace';
export const loadingRoom={west:-4.2,east:0,north:0,south:4.2,height:2.8};
export const loadingEntry={x:0,start:2.81,end:3.88,height:2.1};
export const loadingWindow={start:.25,end:2.25,bottom:1.05,top:2.1};
export const loadingExit={x:-4.2,start:.95,end:1.90,height:2.1};
export const loadingEye=(facing:number)=>archiveEye(facing,{x:-2.1,y:2.40,height:1.6,pitch:14,focal:650,heading:facing*90+(facing===3?15:0)});
export const entryHandle=(open:boolean):ShelfPoint=>open?[-1.01,loadingEntry.end-.025,1.0]:[-.045,loadingEntry.start+.06,1.0];
