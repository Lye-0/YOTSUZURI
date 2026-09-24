import {archiveLookAt,type ShelfPoint} from './archiveSpace';
export const cutawayModel={x:7.05,y:-4.84,z:.82,width:.94,height:.94*1029/1470};
export const modelPixel=(x:number,y:number):ShelfPoint=>[cutawayModel.x+(x-21)/1470*cutawayModel.width,cutawayModel.y,cutawayModel.z+(1055-y)/1029*cutawayModel.height];
export const modelEye=()=>archiveLookAt(modelPixel(730,535),0,{x:modelPixel(730,535)[0],y:-3.40,height:modelPixel(730,535)[2],focal:1250,centerX:500,centerY:450});
