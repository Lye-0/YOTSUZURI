import type {ReactNode} from 'react';
import {photoBounds} from './photoBounds';
import {archivePhotoUrl as url} from './archiveAssets';
const M=500;
export type UV=readonly [number,number,number,number];
export function Photograph({id,group='parts/archive',crop,mirror=false,clip}:{id:string;group?:string;crop?:UV;mirror?:boolean;clip?:string}){
 const info=photoBounds[`${group}/${id}`],v:UV=crop??(info?[info.bounds[0]/info.width,info.bounds[1]/info.height,info.bounds[2]/info.width,info.bounds[3]/info.height]:[0,0,1,1]);
 return <div className="archive-photo-window" style={{transform:mirror?'scaleX(-1)':undefined,clipPath:clip}}><img src={url(id,group)} alt="" draggable={false} style={{width:`${100/v[2]}%`,height:`${100/v[3]}%`,left:`${-v[0]/v[2]*100}%`,top:`${-v[1]/v[3]*100}%`}}/></div>;
}
export function Face({x,y,z,width,height,turn=0,tilt=0,floor=false,resolution=1,children}:{x:number;y:number;z:number;width:number;height:number;turn?:number;tilt?:number;floor?:boolean;resolution?:number;children:ReactNode}){return <div className="archive-face" data-archive-floor={floor||undefined} style={{width:width*M*resolution,height:height*M*resolution,transform:`translate3d(${x*M}px,${-z*M}px,${y*M}px) rotateY(${turn}deg) rotateX(${tilt}deg)${resolution===1?'':` scale(${1/resolution})`}`}}>{children}</div>;}
