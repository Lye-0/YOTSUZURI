import type {CSSProperties} from 'react';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {Face,Photograph} from './ArchivePhotos';
import {photoBounds} from './photoBounds';
import {frameRails} from './joinery';
import {railCentres} from './joineryGeometry';
export const joinerySpace:CSSProperties={position:'absolute',width:0,height:0,transformStyle:'preserve-3d'};
const group='parts/joinery';
function texture(id:string,start:number,end:number):PhotoTexture{const a=photoBounds[`${group}/${id}`];if(!a)return{id,group};const [bx,by,bw,bh]=a.bounds,x=bx+6,y=by+6,w=bw-12,h=bh-12;return{id,group,crop:[(x+start*w)/a.width,y/a.height,(end-start)*w/a.width,h/a.height]};}
export function WoodRail({piece,flip=0}:{piece:number;flip?:number}){
 const r=frameRails[piece],l=r.length,segments=[[0,.03,r.ends[0]^flip],[.03,l-.03,2],[l-.03,l,r.ends[1]^flip]];
 return <>{segments.map(([from,to,cut],i)=>{const height=cut===2?.018:.009,z=cut===0?.009:0,top=texture('frame-rail-face',from/l,to/l),front=texture('frame-rail-side',from/l,to/l);return <div key={i} style={{display:'contents'}}><PhotoCuboid x={from-l/2} y={-.015} z={z} width={to-from} depth={.03} height={height} texture={front} top={top}/><Face x={from-l/2} y={.015} z={z} width={to-from} height={.03} tilt={-90}><Photograph {...top}/></Face></div>})}</>;
}
export function FrameBody({values}:{values:readonly number[]}){return <>{frameRails.map((_,i)=>{const slot=values[i];if(slot<0)return null;const [x,y]=railCentres[slot];return <div key={i} style={{...joinerySpace,transform:`translate3d(${x*500}px,0,${y*500}px) rotateY(${-values[i+4]*90}deg)`}}><WoodRail piece={i} flip={values[i+8]}/></div>})}</>;}
