import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {loadingExit} from './loadingSpace';
export const exitPlate={x:-.88,y:.03,top:.98,width:.12,height:.08};
export const exitLocalPoint=([x,y,z]:ShelfPoint,open=false):ShelfPoint=>{const a=(open?0:90)*Math.PI/180;return[-4.195+x*Math.cos(a)+y*Math.sin(a),loadingExit.start-x*Math.sin(a)+y*Math.cos(a),z]};
export const exitKeyhole=(open=false)=>exitLocalPoint([-.82,.034,.94],open);
export const exitPull=(open=false)=>exitLocalPoint([-.89,.04,1.05],open);
export const exitEye=()=>archiveLookAt(exitKeyhole(),3,{x:-3.62,y:1.49,height:1.05,focal:1600,centerX:350,centerY:425});
