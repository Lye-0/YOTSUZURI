import {useId} from 'react';
import {plateIds} from './plates';
import {PlateArtwork} from './PlateArtwork';
import type {World,Action} from './campaign';
const closedY=[260,365,475,578],openY=[313,418,516,636],floorY=[202,317,413,528],patchY=[181,304,399,507];
export function PlateDrawers({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
 const uid=useId().replace(/:/g,''),open=[0,1,2,3].find(i=>g.flags[`drawer:10:${i}`]),taken=plateIds(g),root=import.meta.env.BASE_URL+'remake/closeups/';
 const trigger=(type:'p-drawer'|'p-plate',index:number)=>enabled&&act({type,id:10,index});
 return <svg className="r-plate-drawers" viewBox={wide?'0 0 1672 941':'480 120 680 640'} preserveAspectRatio="none" role="group" aria-label="原版の引出し">
 <defs><clipPath id={uid+'wide'}><polygon points={`332,30 1279,30 1373,155 1373,${open===3?685:641} 249,${open===3?685:641} 249,155`}/></clipPath><clipPath id={uid+'drawer'}><rect x="260" y={open===undefined?0:patchY[open]} width="1095" height="190"/></clipPath></defs>
 <g transform={wide?'matrix(.365 0 0 .25 -9 363)':undefined} clipPath={wide?`url(#${uid}wide)`:undefined}>
 <image href={root+'p10-closed.webp'} width="1672" height="941"/>
 {open!==undefined?<><image href={root+`p10-open-${open}.webp`} width="1672" height="941" clipPath={`url(#${uid}drawer)`}/>{!taken.includes(open)?<svg x="395" y={floorY[open]} width="850" height="43" preserveAspectRatio="none" viewBox="0 0 900 400"><PlateArtwork index={open}/></svg>:null}</>:null}
 {!wide?<>
 {[0,1,2,3].map(i=><g key={i} role="button" tabIndex={enabled?0:-1} aria-label={`${i+1}段目の引出しを${open===i?'閉める':'引く'}`} onClick={()=>trigger('p-drawer',i)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();trigger('p-drawer',i)}}}><rect className="r-paper-hit" x="727" y={(open===i?openY:closedY)[i]-42} width="178" height="85"/></g>)}
 {open!==undefined?<g role="button" tabIndex={enabled?0:-1} aria-label={taken.includes(open)?'原版を引出しへ戻す':'原版を取る'} onClick={()=>trigger('p-plate',open)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();trigger('p-plate',open)}}}><rect className="r-paper-hit" x="390" y={floorY[open]-8} width="860" height="78"/></g>:null}
 </>:null}
 </g></svg>;
}
export function HeldPlates({g,detail=false}:{g:World;detail?:boolean}){return <div className={'r-held-plates '+(detail?'detail':'')}>{plateIds(g).map(i=><PlateArtwork key={i} index={i}/>)}</div>}
