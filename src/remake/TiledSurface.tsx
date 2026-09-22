import {useContext} from 'react';
import {RasterDensity} from './ArchivePhotos';
import {Face,Photograph,type UV} from './ArchivePhotos';
import {archiveView,archiveProjectEye,type ArchiveEye,type ShelfPoint} from './archiveSpace';
type Cut=readonly [number,number,number,number];
/** Small photographic faces avoid Chromium's incorrect clipping of a wall crossing behind the camera. */
export function TiledSurface({x,y,z,width,height,turn=0,tilt=0,id,group,eye,cuts=[],crop=[0,0,1,1],overlap=.008,mirror=false,pixelScale}:{x:number;y:number;z:number;width:number;height:number;turn?:number;tilt?:number;id:string;group:string;eye:ArchiveEye;cuts?:readonly Cut[];crop?:UV;overlap?:number;mirror?:boolean;pixelScale?:number}){
 const density=useContext(RasterDensity),scale=pixelScale??density;
 const yaw=turn*Math.PI/180,pitch=tilt*Math.PI/180;
 const point=(u:number,v:number):ShelfPoint=>[x+u*Math.cos(yaw)+v*Math.sin(yaw)*Math.sin(pitch),y-u*Math.sin(yaw)+v*Math.cos(yaw)*Math.sin(pitch),z-v*Math.cos(pitch)];
 const steps=(length:number,extra:number[])=>[...new Set([...Array.from({length:Math.ceil(length/.65)+1},(_,i)=>i*length/Math.ceil(length/.65)),...extra])].sort((a,b)=>a-b);
 const us=steps(width,cuts.flatMap(c=>[c[0],c[0]+c[2]])),vs=steps(height,cuts.flatMap(c=>[c[1],c[1]+c[3]]));
 return <>{us.slice(0,-1).flatMap((u,i)=>vs.slice(0,-1).map((v,j)=>{const w=us[i+1]-u,h=vs[j+1]-v;if(cuts.some(c=>u+w/2>c[0]&&u+w/2<c[0]+c[2]&&v+h/2>c[1]&&v+h/2<c[1]+c[3]))return null;
 const p=point(u,v);if([p,point(u+w,v),point(u,v+h),point(u+w,v+h)].some(p=>archiveView(p,eye)[2]<.05))return null;
 const projected=[p,point(u+w,v),point(u,v+h)].map(p=>archiveProjectEye(p,eye)),pw=Math.hypot(projected[1][0]-projected[0][0],projected[1][1]-projected[0][1]),ph=Math.hypot(projected[2][0]-projected[0][0],projected[2][1]-projected[0][1]),resolution=Math.max(.125,Math.min(4,Math.max(pw/(w*500),ph/(h*500))*scale*1.2));
 return <Face key={`${i}:${j}`} resolution={resolution} x={p[0]} y={p[1]} z={p[2]} width={w+overlap} height={h+overlap} turn={turn} tilt={tilt}><Photograph id={id} group={group} mirror={mirror} crop={[crop[0]+(mirror?1-(u+w)/width:u/width)*crop[2],crop[1]+v/height*crop[3],w/width*crop[2],h/height*crop[3]]}/></Face>;
 }))}</>;
}
