import {Face,Photograph} from './ArchivePhotos';
import {archiveView,type ArchiveEye,type ShelfPoint} from './archiveSpace';
type Cut=readonly [number,number,number,number];
/** Small photographic faces avoid Chromium's incorrect clipping of a wall crossing behind the camera. */
export function TiledSurface({x,y,z,width,height,turn=0,tilt=0,id,group,eye,cuts=[]}:{x:number;y:number;z:number;width:number;height:number;turn?:number;tilt?:number;id:string;group:string;eye:ArchiveEye;cuts?:readonly Cut[]}){
 const yaw=turn*Math.PI/180,pitch=tilt*Math.PI/180;
 const point=(u:number,v:number):ShelfPoint=>[x+u*Math.cos(yaw)+v*Math.sin(yaw)*Math.sin(pitch),y-u*Math.sin(yaw)+v*Math.cos(yaw)*Math.sin(pitch),z-v*Math.cos(pitch)];
 const steps=(length:number,extra:number[])=>[...new Set([...Array.from({length:Math.ceil(length/.65)+1},(_,i)=>i*length/Math.ceil(length/.65)),...extra])].sort((a,b)=>a-b);
 const us=steps(width,cuts.flatMap(c=>[c[0],c[0]+c[2]])),vs=steps(height,cuts.flatMap(c=>[c[1],c[1]+c[3]]));
 return <>{us.slice(0,-1).flatMap((u,i)=>vs.slice(0,-1).map((v,j)=>{const w=us[i+1]-u,h=vs[j+1]-v;if(cuts.some(c=>u+w/2>c[0]&&u+w/2<c[0]+c[2]&&v+h/2>c[1]&&v+h/2<c[1]+c[3]))return null;
 const p=point(u,v);if([p,point(u+w,v),point(u,v+h),point(u+w,v+h)].some(p=>archiveView(p,eye)[2]<.05))return null;
 return <Face key={`${i}:${j}`} x={p[0]} y={p[1]} z={p[2]} width={w+.001} height={h+.001} turn={turn} tilt={tilt}><Photograph id={id} group={group} crop={[u/width,v/height,w/width,h/height]}/></Face>;
 }))}</>;
}
