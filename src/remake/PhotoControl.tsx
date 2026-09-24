import {useRef,type ReactNode} from 'react';
// A touch action can replace its target (put down -> pick up) before Chrome's
// compatibility click. Keep this across those two component instances.
let directTouchSequence=false;
export function trackPhotoPointer(pointerType:string){directTouchSequence=pointerType==='touch';}
export function PhotoControl({label,rect,onActivate,enabled=true,children,directTouch=false}:{label:string;rect:[number,number,number,number];onActivate:()=>void;enabled?:boolean;children?:ReactNode;directTouch?:boolean}){
 const touch=useRef<[number,number]|null>(null);
 return <g role="button" aria-label={label} aria-disabled={!enabled} tabIndex={enabled?0:-1}
 onPointerDown={e=>{if(directTouch){trackPhotoPointer(e.pointerType);if(directTouchSequence)touch.current=[e.clientX,e.clientY];}}}
 onPointerCancel={()=>{touch.current=null;}}
 onPointerUp={e=>{const start=touch.current;touch.current=null;if(directTouch&&enabled&&e.pointerType==='touch'&&start&&Math.hypot(e.clientX-start[0],e.clientY-start[1])<12){e.preventDefault();onActivate();}}}
 onClick={e=>{if(enabled&&(!directTouch||!directTouchSequence||e.detail===0))onActivate();}}
 onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();onActivate();}}}>{children}<rect className="r-paper-hit" x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]}/></g>;
}
