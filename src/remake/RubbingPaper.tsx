import {useId} from 'react';
import type {World,Action} from './campaign';
import {PhotoSprite} from './PhotoSprite';
import {tissueTrace} from './rubbing';
import {Icon} from './Icons';
export function RubbingPaper({g}:{g:World}){const t=tissueTrace(g),id=useId(),odd=t[4]%2;return <svg viewBox={odd?'27.5 -27.5 95 150':'0 0 150 95'} width="100%" height="100%" preserveAspectRatio="none">
 <defs><mask id={id+'zones'}><rect width="150" height="95" fill="black"/>{Array.from({length:6},(_,i)=>(t[2]&(1<<i))?<rect key={i} x={(i%3)*50} y={Math.floor(i/3)*47.5} width="50" height="47.5" fill="white"/>:null)}</mask><filter id={id+'grain'} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="17" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 .25" result="grainAlpha"/><feComposite in="SourceGraphic" in2="grainAlpha" operator="in" result="dust"/><feDisplacementMap in="dust" in2="noise" scale=".5" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
 <g transform={`rotate(${t[4]*90} 75 47.5) ${t[3]?'translate(150 0) scale(-1 1)':''}`}>
 <PhotoSprite name="tissue" group="items" x={0} y={0} width={150} height={95}/>
 <g mask={`url(#${id}zones)`} opacity={t[3]?.64:.84} style={{mixBlendMode:'multiply'}} filter={`url(#${id}grain)`}><g transform={`rotate(${t[1]*90} 75 47.5) translate(15 7.5) ${t[0]===0?'translate(120 0) scale(-1 1)':''}`}>
 <path fill="#34312b" fillRule="evenodd" d={t[0]===1?'M0 20.8L19.4 0H120V80H0ZM5.5 23.8V74.5H114.5V5.5H22Z M118.9 17.8a1.7 1.7 0 1 0-3.4 0a1.7 1.7 0 1 0 3.4 0 M118.9 61.6a1.7 1.7 0 1 0-3.4 0a1.7 1.7 0 1 0 3.4 0':'M0 20.8L19.4 0H120V80H0ZM3 22V77H117V3H21Z M118.9 17.8a1.7 1.7 0 1 0-3.4 0a1.7 1.7 0 1 0 3.4 0 M118.9 61.6a1.7 1.7 0 1 0-3.4 0a1.7 1.7 0 1 0 3.4 0'}/>
 {t[0]===0?<path d="M10 15L108 68M17 67L107 12" stroke="#34312b" strokeWidth="5" fill="none"/>:null}
 </g></g></g>
 </svg>;}
export function HeldTissue({g,detail=false,act}:{g:World;detail?:boolean;act?:(a:Action)=>void}){const odd=tissueTrace(g)[4]%2;return <div style={{position:'relative',width:detail?(odd?'min(85vw,44svh)':'min(92vw,1000px)'):'100%',aspectRatio:odd?'95/150':'150/95'}}><RubbingPaper g={g}/>{detail&&act?<div style={{position:'absolute',right:0,bottom:0,display:'flex',gap:8}}><button className="watermark-command" style={{position:'relative'}} aria-label="保護紙を裏返す" onClick={()=>act({type:'p-rubbing-view',flip:true})}><Icon name="eye"/></button><button className="watermark-command" style={{position:'relative'}} aria-label="保護紙を回す" onClick={()=>act({type:'p-rubbing-view'})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 13A11 11 0 1 1 7 24M6 13l-1-8m1 8 8-1"/></svg></button></div>:null}</div>}
