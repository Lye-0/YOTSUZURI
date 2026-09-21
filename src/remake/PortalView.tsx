import {useId,type ReactNode} from 'react';
import type {Quad} from './projective';
/** A doorway looks at the destination's actual photograph and current object layers. */
export function PortalView({src,opening,frame,children}:{src:string;opening:Quad;frame:[number,number,number,number];children?:ReactNode}){
 const id=useId().replace(/:/g,'');
 return <svg className="r-portal-view" viewBox="0 0 1672 941" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id={id}><polygon points={opening.map(p=>p.join(',')).join(' ')}/></clipPath></defs><g clipPath={`url(#${id})`}><svg x={frame[0]} y={frame[1]} width={frame[2]} height={frame[3]} viewBox="0 0 1672 941" preserveAspectRatio="none"><image href={src} width="1672" height="941"/>{children?<foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}>{children}</div></foreignObject>:null}</svg></g></svg>;
}
