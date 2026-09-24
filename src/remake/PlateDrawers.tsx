import {useId,useState} from 'react';
import {plateIds} from './plates';
import {PlateArtwork} from './PlateArtwork';
import {PhotoControl} from './PhotoControl';
import type {World,Action} from './campaign';
const closedY=[260,365,475,578],openY=[313,418,516,636],floorY=[202,317,413,528],patchY=[181,304,399,507];
export function PlateDrawers({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
 const uid=useId().replace(/:/g,''),open=[0,1,2,3].find(i=>g.flags[`drawer:10:${i}`]),taken=plateIds(g),root=import.meta.env.BASE_URL+'remake/closeups/';
 const [inspection,setInspection]=useState<number|null>(open??null);
 const trigger=(type:'p-drawer'|'p-plate',index:number)=>enabled&&act({type,id:10,index});
 const inspect=(index:number)=>{if(!enabled)return;if(open!==index)trigger('p-drawer',index);setInspection(index);};
 return <><svg className="r-plate-drawers" viewBox={wide?'0 0 1672 941':'230 0 1160 810'} preserveAspectRatio={wide?'none':'xMidYMid slice'} role="group" aria-label="原版の引出し" style={!wide&&inspection!==null?{visibility:'hidden'}:undefined}>
 <defs><clipPath id={uid+'wide'}><polygon points={`332,30 1279,30 1373,155 1373,${open===3?685:641} 249,${open===3?685:641} 249,155`}/></clipPath><clipPath id={uid+'drawer'}><rect x="260" y={open===undefined?0:patchY[open]} width="1095" height="190"/></clipPath></defs>
 <g transform={wide?'matrix(.365 0 0 .25 -9 363)':undefined} clipPath={wide?`url(#${uid}wide)`:undefined}>
 <image href={root+'p10-closed.webp'} width="1672" height="941"/>
 {open!==undefined?<><image href={root+`p10-open-${open}.webp`} width="1672" height="941" clipPath={`url(#${uid}drawer)`}/>{!taken.includes(open)?<svg x="395" y={floorY[open]} width="850" height="43" preserveAspectRatio="none" viewBox="0 0 900 400"><PlateArtwork index={open}/></svg>:null}</>:null}
 {!wide?<>
 {[0,1,2,3].map(i=><PhotoControl key={i} label={`${i+1}段目の引出しを調べる`} rect={[727,(open===i?openY:closedY)[i]-42,178,85]} enabled={enabled} onActivate={()=>inspect(i)}/>)}
 {open!==undefined?<PhotoControl label="開いた引出しを調べる" rect={[390,floorY[open]-8,860,78]} enabled={enabled} onActivate={()=>inspect(open)}/>:null}
 </>:null}
 </g></svg>
 {!wide&&inspection!==null&&open===inspection?<section className="r-plate-inspection" aria-label={`${inspection+1}段目の原版を観察`}>
 <p className="r-plate-caption">{inspection+1}段目の引出し{taken.includes(inspection)?' ― 原版は持ち出し中':''}</p>
 {!taken.includes(inspection)?<div className="r-plate-surface"><PlateArtwork index={inspection}/></div>:<div className="r-plate-empty">引出しは空になっている。</div>}
 <div className="r-plate-actions"><button disabled={!enabled} onClick={()=>{trigger('p-drawer',inspection);setInspection(null);}}>引出しを閉める</button><button disabled={!enabled||(taken.includes(inspection)&&!g.inventory.includes('plates'))} onClick={()=>trigger('p-plate',inspection)}>{taken.includes(inspection)?'この原版を戻す':'この原版を持ち出す'}</button></div>
 </section>:null}</>;
}
export function HeldPlates({g,detail=false}:{g:World;detail?:boolean}){return <div className={'r-held-plates '+(detail?'detail':'')}>{plateIds(g).map(i=><PlateArtwork key={i} index={i}/>)}</div>}
