import {useId} from 'react';
import {PhotoSprite} from './PhotoSprite';
import {windowContour} from './printing';
// Both the machined surface and its impression use this same contour.
export function PlateArtwork({index,impression=false}:{index:number;impression?:boolean}){
 const uid=useId().replace(/:/g,''),left=index<2,raised=index===0||index===3;
 const triangle=left?'80,40 820,40 80,360':'820,40 820,360 80,360';
 if(!impression)return <svg viewBox="0 0 900 400" width="100%" height="100%" aria-hidden="true"><PhotoSprite name={`plate-${index}`} x={0} y={0} width={900} height={400}/></svg>;
 return <svg viewBox="0 0 900 400" width="100%" height="100%" aria-hidden="true">
 <defs>
 <mask id={uid+'window'}><rect width="900" height="400" fill="white"/><path d={windowContour} fill="black"/></mask>
 <clipPath id={uid+'region'}><polygon points={triangle} shapeRendering="crispEdges"/></clipPath>
 <mask id={uid+'contact'}><rect width="900" height="400" fill={raised?'black':'white'}/><g clipPath={`url(#${uid}region)`} mask={`url(#${uid}window)`}><rect width="900" height="400" fill={raised?'white':'black'}/></g></mask>
 </defs>
 <rect width="900" height="400" fill="#252620" mask={`url(#${uid}contact)`}/>
 </svg>;
}
