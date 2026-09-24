import {useRef,useState,type PointerEvent} from 'react';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl,trackPhotoPointer} from './PhotoControl';
import {ProjectedSurface} from './ProjectedSurface';
import {betweenQuads,project,type Quad,type Point} from './projective';
import {TrimPaper} from './TrimPaper';
import {trimValues} from './trimming';
import type {World,Action} from './campaign';
const CLOSE:Quad=[[420,230],[1500,302],[1430,666],[350,594]],WIDE:Quad=[[624,500],[1235,504],[1211,546],[600,542]],PLANE:Quad=[[0,0],[1450,0],[1450,850],[0,850]],INVERSE=betweenQuads(CLOSE,PLANE);
const HOME=[80,280,480],BODY=760;
function TrimCanvas({g,act,enabled,onInspect,pointer,selectedPaper,onSelectPaper}:{g:World;act:(a:Action)=>void;enabled:boolean;onInspect?:(i:number)=>void;pointer:(e:PointerEvent<SVGGElement>)=>Point;selectedPaper:number|null;onSelectPaper?:(i:number|null)=>void}){
 const v=trimValues(g),taken=!!g.flags['trim:taken'],back=!!v[4],target=back?BODY-140:BODY+460,corner=g.placed[14]?.includes('corner'),[drag,setDrag]=useState<{index:number;start:Point;delta:Point}|null>(null);
 const down=(e:PointerEvent<SVGGElement>,index:number)=>{if(!enabled)return;e.preventDefault();trackPhotoPointer(e.pointerType);onSelectPaper?.(null);e.currentTarget.setPointerCapture(e.pointerId);setDrag({index,start:pointer(e),delta:[0,0]});};
 const touchPaper=(i:number)=>{if(v[0]===i&&!taken){act({type:'p-trim-remove',id:14});onSelectPaper?.(null);}else onInspect?.(i);};
 const move=(e:PointerEvent<SVGGElement>)=>{if(!drag)return;const p=pointer(e);setDrag({...drag,delta:[p[0]-drag.start[0],p[1]-drag.start[1]]});};
 const up=(e:PointerEvent<SVGGElement>)=>{if(!drag)return;const p=pointer(e),dx=p[0]-drag.start[0],dy=p[1]-drag.start[1],i=drag.index;setDrag(null);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(Math.hypot(dx,dy)<20){touchPaper(i);return;}const startX=v[0]===i?target:HOME[i],centerX=startX+70+dx,centerY=450+dy;if(!taken&&Math.abs(centerX-(target+70))<155&&Math.abs(centerY-450)<280)act({type:'p-trim-place',id:14,index:i});else if(v[0]===i&&!taken)act({type:'p-trim-remove',id:14});};
 return <svg viewBox="0 0 1450 850" width="100%" height="100%" style={{overflow:'visible',touchAction:'none'}}>
 {enabled&&selectedPaper!==null?<g role="button" tabIndex={0} aria-label="紙片の選択を外す" onClick={()=>onSelectPaper?.(null)} onKeyDown={e=>{if(e.key==='Escape'||e.key==='Enter')onSelectPaper?.(null)}}><rect className="r-trim-background-hit" width="1450" height="850"/></g>:null}
 {!taken?<g style={{filter:'drop-shadow(2px 5px 3px #0006)'}}><svg x={BODY} y="200" width="460" height="500"><TrimPaper part="body" back={back}/></svg>{enabled?<PhotoControl directTouch label={v[0]>=0?'図面を持ち出す':selectedPaper!==null?'選んだ紙片を図面へ添える':'断裁された図面を見る'} rect={[BODY,200,460,500]} onActivate={()=>{if(g.selected==='corner')act({type:'p-place',id:14,target:'corner'});else if(v[0]>=0)act({type:'p-trim-take',id:14});else if(selectedPaper!==null){act({type:'p-trim-place',id:14,index:selectedPaper});onSelectPaper?.(null);}else onInspect?.(-1);}}/>:null}</g>:enabled?<PhotoControl directTouch label="図面を作業台へ戻す" rect={[690,150,700,630]} onActivate={()=>{if(g.selected==='corner')act({type:'p-place',id:14,target:'corner'});else act({type:'p-trim-return',id:14});}}/>:null}
 {corner?<g><PhotoSprite name="corner-flat" x={BODY-15} y={596} width={145} height={132}/>{enabled?<PhotoControl directTouch label="角当てを手元へ戻す" rect={[BODY-25,590,160,150]} onActivate={()=>act({type:'p-retrieve',id:14,item:'corner'})}/>:null}</g>:null}
 {enabled&&!taken&&v[0]<0&&selectedPaper!==null?<g className="r-trim-drop"><PhotoControl directTouch label="選んだ紙片を切り口へ添える" rect={[target,200,140,500]} onActivate={()=>{if(g.selected==='corner')act({type:'p-place',id:14,target:'corner'});else{act({type:'p-trim-place',id:14,index:selectedPaper});onSelectPaper?.(null);}}}/><text x={target+70} y="740" textAnchor="middle" pointerEvents="none">ここへ添える</text></g>:null}
 {[0,1,2].filter(i=>!taken||v[0]!==i).sort((a,b)=>(drag?.index===a?1:0)-(drag?.index===b?1:0)).map(i=>{const d=drag?.index===i?drag.delta:[0,0],x=(v[0]===i?target:HOME[i])+d[0],y=200+d[1];return <g key={i} transform={`translate(${x} ${y})`} style={{filter:drag?.index===i?'drop-shadow(9px 18px 8px #0007)':'drop-shadow(1px 4px 2px #0006)'}}><svg width="140" height="500"><TrimPaper part={i} back={!!v[i+5]} rotation={v[i+1]}/></svg>{enabled?<g role="button" tabIndex={0} aria-label={`${i+1}枚目の断裁片を調べる・動かす`} onPointerDown={e=>down(e,i)} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>setDrag(null)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();touchPaper(i);}if(e.key==='ArrowRight'){e.preventDefault();act({type:'p-trim-place',id:14,index:i});}if(e.key==='ArrowLeft'&&v[0]===i){e.preventDefault();act({type:'p-trim-remove',id:14});}}}><rect className={"r-paper-hit"+(selectedPaper===i?" r-trim-selected-hit":"")} width="140" height="500"/></g>:null}</g>;})}
 </svg>;
}
export function TrimBench({g,act,wide=false,enabled=true,onInspect,selectedPaper=null,onSelectPaper}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean;onInspect?:(i:number)=>void;selectedPaper?:number|null;onSelectPaper?:(i:number|null)=>void}){
 const ref=useRef<SVGSVGElement>(null);
 const pointer=(e:PointerEvent<SVGGElement>):Point=>{const b=ref.current!.getBoundingClientRect();return project([350+(e.clientX-b.left)*1250/b.width,225+(e.clientY-b.top)*535/b.height],INVERSE);};
 const contents=<ProjectedSurface quad={wide?WIDE:CLOSE} width={1450} height={850} affine><TrimCanvas g={g} act={act} enabled={!wide&&enabled} onInspect={onInspect} pointer={pointer} selectedPaper={selectedPaper} onSelectPaper={onSelectPaper}/></ProjectedSurface>;
 if(wide)return contents;

 return <svg ref={ref} className="r-trim-world" viewBox="350 225 1250 535" preserveAspectRatio="none" style={{touchAction:'none'}} role="group" aria-label="断裁片の作業台"><image href={import.meta.env.BASE_URL+'remake/closeups/p14-table.webp'} width="1672" height="941"/><foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}>{contents}</div></foreignObject></svg>;
}
