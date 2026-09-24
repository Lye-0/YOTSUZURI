import {useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import type {Action,World} from './campaign';
import {archiveProjectEye,type ArchiveEye,type ShelfPoint} from './archiveSpace';
import {bookBands,spineOpen,weighingValues} from './weighing';
import {beamPoint,bookPosition,looseSaddlePosition,panPosition,riderPoint,saddleRows,weighingWorld,type WeighingDetail} from './weighingGeometry';
import {Icon} from './Icons';
export type WeighingPresentation={g:World;onAct?:(a:Action)=>void;onInspect?:()=>void;detail?:WeighingDetail;onDetail?:(d:WeighingDetail)=>void};
export function WeighingInputs({g,onAct,onInspect,detail,onDetail,eye,scale}:{eye:ArchiveEye;scale:number}&WeighingPresentation){
 const [selected,setSelected]=useState(-1),drag=useRef<{id:number;x:number;y:number;value:number;dx:number;dy:number}|null>(null),v=weighingValues(g),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const project=(p:ShelfPoint)=>archiveProjectEye(weighingWorld(p),eye);
 const point=(p:ShelfPoint)=>{const a=project(p);return [a[0]*scale,a[1]*scale] as const;};
 const rect=(x:number,y:number,z:number,w:number,d:number,min=0):CSSProperties=>{const p=[[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]].map(a=>project([a[0],a[1],a[2]])),l=Math.min(...p.map(a=>a[0]))*scale,t=Math.min(...p.map(a=>a[1]))*scale,r=Math.max(...p.map(a=>a[0]))*scale,b=Math.max(...p.map(a=>a[1]))*scale;return {left:(l+r)/2-Math.max(min,r-l)/2,top:(t+b)/2-Math.max(min,b-t)/2,width:Math.max(min,r-l),height:Math.max(min,b-t)};};
 const hit=(label:string,style:CSSProperties,action:()=>void,active=false)=><button key={label} className={'env-screen-hit'+(active?' weighing-selected':'')} style={style} aria-label={label} onClick={e=>{e.stopPropagation();action();}}/>;
 const command=(label:string,p:ShelfPoint,icon:'inspect'|'back'|'left'|'right',action:()=>void)=>{const [x,y]=point(p);return <button key={label} className="watermark-command" aria-label={label} style={{left:Math.max(5,Math.min(width-49,x-22)),top:Math.max(5,Math.min(height-110,y-22))}} onClick={action}><Icon name={icon}/></button>;};
 if(onInspect)return hit('計量台を調べる',rect(0,0,.87,1.65,.65,44),onInspect);
 if(!onAct)return null;
 const choose=(object:number)=>setSelected(n=>n===object?-1:object);
 const inspect=(index:number)=>{setSelected(index);onDetail?.({kind:'weighing-book',index,side:'cover'});};
 const pan=panPosition(g),rp=riderPoint(g);
 const moveRider=(e:PointerEvent<HTMLButtonElement>)=>{const s=drag.current;if(!s||s.id!==e.pointerId)return;const change=((e.clientX-s.x)*s.dx+(e.clientY-s.y)*s.dy)/(s.dx*s.dx+s.dy*s.dy)*16;onAct({type:'p-weigh-rider',id:19,value:Math.max(0,Math.min(16,Math.round(s.value+change)))});};
 return <div className="envelope-hit-layer">
 {!detail?<>
 {hit(selected>=0?'選んだ物を皿に載せる':'秤の皿を調べる',rect(pan.x,pan.y,pan.z,.3,.3,44),()=>selected>=0?onAct({type:'p-weigh-place',id:19,object:selected}):v[0]>=0?choose(v[0]):onDetail?.({kind:'weighing-scale'}))}
 {[0,1,2,3].map(index=>{if(v[0]===index)return null;const b=bookPosition(g,index);return hit(`${index+1}冊目の本を選ぶ`,rect(b.x,b.y,b.z+.05,.22,.27,40),()=>selected>=4?(()=>{onAct({type:'p-weigh-attach',id:19,index:selected-4,book:index});setSelected(-1);})():choose(index),selected===index);})}
 {v.slice(2).some((place,index)=>place<0&&v[0]!==index+4)?hit('外した金具を近くで見る',rect(.42,.365,.87,.56,.22,44),()=>onDetail?.({kind:'weighing-tray'})):null}
 {selected>=0&&selected<4?(()=>{const b=bookPosition(g,selected);return command('選んだ本を近くで見る',[b.x+.11,b.y+.135,b.z+.12],'inspect',()=>inspect(selected));})():null}
 {v[0]>=0?command('皿の物を台へ戻す',[pan.x+.15,pan.y+.36,pan.z],'back',()=>{onAct({type:'p-weigh-place',id:19,object:-1});setSelected(-1);}):null}
 {command('棹の目盛りを近くで見る',[.78,.285,1.27],'inspect',()=>onDetail?.({kind:'weighing-scale'}))}
 </>:detail.kind==='weighing-tray'?<>
 {v.slice(2).map((place,index)=>{if(place>=0||v[0]===index+4)return null;const b=looseSaddlePosition(g,index);return hit(`${index+1}個目の金具を選ぶ`,rect(b.x,b.y,b.z+.05,.228,.035,36),()=>choose(index+4),selected===index+4);})}
 </>:detail.kind==='weighing-scale'?<>
 {Array.from({length:17},(_,value)=>{const p=point(beamPoint(g,.045+value*.0375,.035));return hit(`錘を目盛り${value}へ動かす`,{left:p[0]-Math.max(5,12*scale),top:p[1]-22,width:Math.max(10,24*scale),height:32},()=>onAct({type:'p-weigh-rider',id:19,value}));})}
 <button className="env-screen-hit env-screen-drag" aria-label="秤の錘を動かす" style={(()=>{const p=point([rp[0],rp[1]+.02,rp[2]-.065]);return {left:p[0]-22,top:p[1]-22,width:44,height:44};})()} onPointerDown={e=>{const a=point(beamPoint(g,.045,.0175)),b=point(beamPoint(g,.645,.0175));drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,value:v[1],dx:b[0]-a[0],dy:b[1]-a[1]};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={moveRider} onPointerUp={e=>{moveRider(e);drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}/>
 {command('錘を一目盛り左へ',[.55,.52,1.10],'left',()=>onAct({type:'p-weigh-rider',id:19,value:Math.max(0,v[1]-1)}))}
 {command('錘を一目盛り右へ',[.78,.52,1.10],'right',()=>onAct({type:'p-weigh-rider',id:19,value:Math.min(16,v[1]+1)}))}
 </>:(()=>{const b=bookPosition(g,detail.index),open=detail.index===2&&spineOpen(g);return detail.side==='cover'?<>
 {bookBands(g,detail.index).map(({index,slot})=>hit(`${index+1}個目の金具を外す`,rect(b.x-.004,b.y+saddleRows[slot],b.z+.049,.228,.035,36),()=>onAct({type:'p-weigh-detach',id:19,index})))}
 {command('本の背を近くで見る',[b.x-.035,b.y+.135,b.z+.04],'inspect',()=>onDetail?.({...detail,side:'spine'}))}
 </>:<>
 {command(open?'本の背を閉じる':'本の背を引く',[b.x-(open?.12:.01),b.y+.26,b.z+.015],open?'right':'left',()=>onAct({type:'p-weigh-spine',id:19,book:detail.index}))}
 {open?hit(g.collected.includes('wedge')?'木片を引出しへ戻す':'引出しの木片を取る',rect(b.x-.085,b.y+.065,b.z+.043,.07,.13,44),()=>g.collected.includes('wedge')?onAct({type:'p-weigh-return-wedge',id:19}):onAct({type:'p-take',id:19,item:'wedge'})):null}
 </>;})()}
 </div>;
}
