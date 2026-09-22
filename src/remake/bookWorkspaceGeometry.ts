import type {World} from './campaign';
import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {bookAtPress} from './binding';
import {finalRenderedHeight} from './FinalBookBody';
import {KEY_CENTRES,KEY_PHOTO_SCALE,KEY_HEIGHT} from './keyGeometry';
export const bookWorktop={x:-4.08,y:.82,z:.875,width:.67,depth:1.0};
export const bookWorkPoint=([u,v,z]:ShelfPoint):ShelfPoint=>[bookWorktop.x+v,bookWorktop.y-u,bookWorktop.z+z];
export const finalClampHome={x:.08,y:.08,z:0};
export const finalPaperPose=(g:World)=>bookAtPress(g)?{x:.20,y:.195,z:.02}:{x:.035,y:.52,z:0};
export const finalKeyPose={x:0,y:1.022,z:.04+KEY_HEIGHT/2};
export const finalKeyPoint=(index:number,value:number):ShelfPoint=>[KEY_CENTRES[index]*KEY_PHOTO_SCALE,finalKeyPose.y,finalKeyPose.z-(590+(value-1)*20)*KEY_PHOTO_SCALE];
export type BookWorkView='all'|'book'|'compare'|'cams';
export const bookWorkFrame=(view:BookWorkView)=>view==='compare'?{width:1000,height:900}:view==='book'?{width:1000,height:900}:view==='cams'?{width:1000,height:900}:{width:1000,height:1100};
export function bookWorkEye(g:World,view:BookWorkView){const p=finalPaperPose(g),h=finalRenderedHeight(g),from:Record<BookWorkView,ShelfPoint>={all:[-.35,1.50,.75],book:[p.x+.10,p.y+.72,p.z+h/2+.15],compare:[.16,1.7,.42],cams:[.30,.271,.90]},at:Record<BookWorkView,ShelfPoint>={all:[.29,.58,.20],book:[p.x+.10,p.y+.15,p.z+h/2],compare:[.16,.75,.06],cams:[.30,.27,.16]},e=bookWorkPoint(from[view]),target=bookWorkPoint(at[view]),f=bookWorkFrame(view);return archiveLookAt(target,3,{x:e[0],y:e[1],height:e[2],focal:view==='all'?1050:view==='book'?1450:view==='compare'?1450:1250,centerX:f.width/2,centerY:view==='all'?500:f.height/2});}
