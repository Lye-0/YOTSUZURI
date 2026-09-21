import {useId,useState,useEffect} from 'react';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl} from './PhotoControl';
import {SealGlyph} from './SealGlyph';
import {ThreadChart} from './ThreadChart';
import {sealFragments,sealReceivers} from './sealOwnership';
import {value,type World,type Action} from './campaign';
export type SealView='all'|'lock'|'contents'|`trace:${number}`|`fragment:${number}`;
const centers=[239,649,1034,1435],wheels=[1373,1414,1454,1495];
export function sealFrame(view:SealView):[number,number,number,number]{if(view==='lock')return [1290,465,300,170];if(view==='contents')return [1200,285,425,340];if(view.startsWith('trace:'))return [centers[+view.slice(6)]-125,340,250,265];return [0,0,1672,941];}
export function SealCases({g,act,wide=false,enabled=true,view='all',onView}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean;view?:SealView;onView?:(v:SealView)=>void}){
 const uid=useId().replace(/:/g,''),open=g.opened.includes(9),values=value(g,9),base=import.meta.env.BASE_URL+'remake/',[back,setBack]=useState(false);
 useEffect(()=>setBack(false),[view]);
 const fragment=view.startsWith('fragment:')?+view.slice(9):null;
 if(fragment!==null&&!wide)return <><div className="r-seal-fragment"><svg viewBox="0 0 800 1000" width="100%" height="100%"><PhotoSprite name={back?`seal-back-${sealFragments[fragment].chip}`:`seal-front-${fragment}`} x={90} y={40} width={620} height={900}/></svg></div><button className="r-thread-flip" aria-label="封印の断片を裏返す" aria-pressed={back} disabled={!enabled} onClick={()=>setBack(v=>!v)}><svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 10A11 11 0 0 1 26 14M25 6l1 8-8-1M25 22A11 11 0 0 1 6 18M7 26l-1-8 8 1"/></svg></button></>;
 return <svg className="r-seal-cases" viewBox={(wide?[0,0,1672,941]:sealFrame(view)).join(' ')} preserveAspectRatio="none" role="group" aria-label="封印の残る四つの箱">
 <defs><clipPath id={uid+'boxes'}><path d={open?'M65 414L178 301L1146 301L1202 402L1223 113L1564 113L1540 359L1609 465L1603 591L65 591Z':'M65 414L178 301L1534 303L1609 416L1603 591L65 591Z'}/></clipPath><clipPath id={uid+'lid'}><rect x="1200" y="95" width="425" height="393"/></clipPath></defs>
 <g transform={wide?'translate(468 385) scale(.25 .21)':undefined}>
 <g clipPath={wide?`url(#${uid}boxes)`:undefined}>
 <image href={base+'closeups/p09-cases-base.webp'} width="1672" height="941"/>
 {open?<image href={base+'closeups/p09-open-empty.webp'} width="1672" height="941" clipPath={`url(#${uid}lid)`}/>:null}
 </g>
 {sealReceivers.map((r,i)=><g key={i} transform={`translate(${centers[i]} ${i===3?506:508})`} fill="none" stroke="#4e1810" strokeWidth="2.6" strokeLinecap="round" opacity=".9"><path d={r.foot==='v'?'M-10 -3L0 4L10 -3':'M-11 1H11'}/></g>)}
 {wheels.map((x,i)=><svg key={i} x={x-11} y="535" width="22" height="25" color="#523721"><SealGlyph mark={values[i]}/></svg>)}
 {centers.map((x,i)=><g key={i} transform={`rotate(${[-5,3,-3,5][i]} ${x} 633)`} style={{filter:'drop-shadow(1px 3px 2px #0008)'}}><PhotoSprite name={`seal-front-${i}`} x={x-42} y={608} width={84} height={50}/></g>)}
 {open?<>
 {!g.collected.includes('threadchart')?<g transform="translate(1290 388) skewX(-8) scale(.18 .075)"><svg width="900" height="650"><ThreadChart/></svg></g>:null}
 {!g.collected.includes('corner')?<g transform="rotate(-12 1520 418)"><PhotoSprite name="corner" group="items" x={1476} y={389} width={66} height={49}/></g>:null}
 </>:null}
 </g>
 {!wide?<>
 {view==='all'?<>
 {centers.map((x,i)=><PhotoControl key={'trace'+i} label={`${i+1}番目の箱の痕跡を見る`} rect={[x-135,401,270,i===3?104:184]} enabled={enabled} onActivate={()=>onView?.(`trace:${i}`)}/>)}
 {centers.map((x,i)=><PhotoControl key={'fragment'+i} label={`${i+1}枚目の封印の断片を見る`} rect={[x-87,603,174,130]} enabled={enabled} onActivate={()=>onView?.(`fragment:${i}`)}/>)}
 <PhotoControl label="四つの印章輪へ近づく" rect={[1318,511,223,70]} enabled={enabled} onActivate={()=>onView?.('lock')}/>
 <PhotoControl label={open?'開いた箱をのぞく':'右端の箱の蓋を持ち上げる'} rect={[1220,305,367,96]} enabled={enabled} onActivate={()=>{if(!open)act({type:'p-open',id:9});else onView?.('contents');}}/>
 </>:null}
 {view==='lock'?<>
 {!open?wheels.map((x,i)=><PhotoControl key={i} label={`${i+1}番目の印章輪を回す`} rect={[x-19,522,38,51]} enabled={enabled} onActivate={()=>act({type:'p-set',id:9,values:values.map((n,j)=>i===j?(n+1)%4:n)})}/>):null}
 <PhotoControl label={open?'開いた箱をのぞく':'右端の箱の蓋を持ち上げる'} rect={[1310,469,253,39]} enabled={enabled} onActivate={()=>{if(!open)act({type:'p-open',id:9});else onView?.('contents');}}/>
 </>:null}
 {view==='contents'&&open?<>
 {!g.collected.includes('threadchart')?<PhotoControl label="糸の見本を取る" rect={[1262,375,190,75]} enabled={enabled} onActivate={()=>act({type:'p-take',id:9,item:'threadchart'})}/>:null}
 {!g.collected.includes('corner')?<PhotoControl label="金属角当てを取る" rect={[1467,374,91,79]} enabled={enabled} onActivate={()=>act({type:'p-take',id:9,item:'corner'})}/>:null}
 </>:null}
 </>:null}
 </svg>;
}
