import type {CSSProperties} from 'react';
/** A photographic cutout positioned on the scene plane; never a drawn replacement object. */
export function PhotoObject({src,rect,transform,brightness=1}:{src:string;rect:[number,number,number,number];transform?:string;brightness?:number}){return <img className="r-object-photo" src={src} alt="" draggable={false} style={{left:rect[0]+'%',top:rect[1]+'%',width:rect[2]+'%',height:rect[3]+'%',transform,filter:`brightness(calc(var(--light) * ${brightness})) drop-shadow(0 1px 1px #0006)`} as CSSProperties}/>}
