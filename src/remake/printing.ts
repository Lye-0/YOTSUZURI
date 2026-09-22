export type Impression={plate:number;rotation:number;face:number;offset:number};
export const windowPoints=[[370,76],[530,76],[530,135],[578,135],[578,200],[536,200],[536,228],[578,228],[578,318],[322,318],[322,135],[370,135]] as const;
export const windowContour=windowPoints.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ')+' Z';
export function insideWindow(x:number,y:number){let inside=false;for(let i=0,j=windowPoints.length-1;i<windowPoints.length;j=i++){const a=windowPoints[i],b=windowPoints[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function plateContact(plate:number,x:number,y:number){
 if(x<0||x>900||y<0||y>400)return false;
 const triangle=x>=80&&x<=820&&y>=40&&y<=360&&(plate<2?y<=360-(x-80)*320/740:y>=360-(x-80)*320/740);
 const contour=triangle&&!insideWindow(x,y);
 return plate===0||plate===3?contour:!contour;
}
export function inkAt(layer:Impression,x:number,y:number){
 let u=x-(layer.offset-1)*60,v=y;
 if(layer.face===0)u=900-u;
 const dx=u-450,dy=v-200;
 switch(layer.rotation){case 1:u=450+dy;v=200-dx;break;case 2:u=450-dx;v=200-dy;break;case 3:u=450-dy;v=200+dx;break;}
 return plateContact(layer.plate,u,v);
}
export const targetImpressions:Impression[]=[0,3].map(plate=>({plate,rotation:0,face:0,offset:1}));
export function sameImpression(layers:Impression[]){
 if(layers.length!==2||layers[0].face!==layers[1].face)return false;
 const visible=layers.map(l=>({...l,face:0}));
 for(let y=5;y<400;y+=10)for(let x=5;x<900;x+=10)if(visible.some(l=>inkAt(l,x,y))!==targetImpressions.some(l=>inkAt(l,x,y)))return false;
 return true;
}
