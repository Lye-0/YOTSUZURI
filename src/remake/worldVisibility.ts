import {archiveView,type ArchiveEye,type ShelfPoint} from './archiveSpace';
/** SVG/3D layers entirely behind the eye must not enter the browser compositor. */
export function boxInFront(eye:ArchiveEye,low:ShelfPoint,high:ShelfPoint){return [low[0],high[0]].some(x=>[low[1],high[1]].some(y=>[low[2],high[2]].some(z=>archiveView([x,y,z],eye)[2]>.04)));}
