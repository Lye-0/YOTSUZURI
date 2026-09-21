import {useState} from 'react';
import {apply,initial,type World,type Action} from './campaign';
import type {Facing} from './model';
import {ArchiveScene} from './ArchiveScene';
import {archivePhotoFiles} from './archiveAssets';
import {watermarkFiles} from './watermarkAssets';
import {weighingFiles} from './weighingAssets';
import {envelopeFiles} from './envelopeAssets';
import {repairFiles} from './repairAssets';
import {repairEye,opticalEye,type OpticalView} from './repairSpace';
import {cradleEye} from './cradleGeometry';
import {foreedgeEye,foreedgeFrame,type ForeedgeView} from './foreedgeGeometry';
import {HeldCradle} from './HeldCradle';
import {HeldGatherings} from './HeldGatherings';
import {itemNames} from './catalog';
import {usePhoto} from './usePhoto';
import {Icon} from './Icons';
import './remake.css';
function start(q:URLSearchParams):World{
 const view=q.get('view'),pose=q.get('pose'),g:World={...initial(),room:8,started:true,facing:Number(q.get('facing')??(view==='cradle'?1:2)) as Facing,focus:view==='book'?'object:22':view==='cradle'?'object:21':view==='optics'?'object:20':'room',flags:{'archive:door':true},values:{16:[0,2,0,0],20:pose==='lit'?[3,3,0,0]:[0,1,1,0],21:pose==='good'?[0,0,2,0]:pose==='top'?[1,0,2,0]:[1,1,0,1]}};
 if(view==='cradle'){g.placed[21]=!pose||pose==='empty'?[]:['corner','wedge'];g.inventory=g.placed[21].length?[]:['corner','wedge'];}
 if(view==='book'){
  g.flags['optics:guard']=true;g.itemValues.cradle=[0,0,2,0];g.itemValues.gatherings=q.get('stock')==='mixed'?[0,1,6,7,2,3]:[0,1,2,3,4,5];
  g.placed[22]=pose==='empty'?[]:pose==='stand'?['cradle']:pose==='paper'?['gatherings']:['cradle','gatherings'];
  if(pose==='good')g.book.order=[3,0,5,1,4,2];g.values[22]=[...g.book.order,pose==='good'?2:1];g.flags['foreedge:mounted']=pose!=='paper';
 }
 return g;
}
export default function RepairLab(){
 const q=new URLSearchParams(location.search),[g,setG]=useState<World>(()=>start(q)),[message,setMessage]=useState(''),[view,setView]=useState<OpticalView>('all'),[side,setSide]=useState(q.get('side')==='1'),bookView=(q.get('detail')??'all') as ForeedgeView;
 const optical=g.focus==='object:20',cradle=g.focus==='object:21',book=g.focus==='object:22',detail=optical||cradle||book;
 const act=(a:Action)=>{const r=apply(g,a);setG(r.world);setMessage(r.message??'');};
 const photo=usePhoto([...archivePhotoFiles,...watermarkFiles,...weighingFiles,...envelopeFiles,...repairFiles]);
 const camera=book?foreedgeEye(g,bookView):cradle?cradleEye(side):optical?opticalEye(view):repairEye(g.facing),frame=book?foreedgeFrame(bookView):detail?{width:1000,height:900}:undefined;
 return <main className="remake" data-optics={g.values[20].join(',')} data-cradle={g.values[21].join(',')} data-guard={!!g.flags['optics:guard']}>
 <div className={'r-stage '+(book&&bookView==='edge'?'r-book-edge':book&&bookView==='painting'?'r-book-painting':detail?'r-optical-reading':'')} aria-busy={!photo.ready}>
 {photo.ready?<ArchiveScene values={[0,2,0,0]} room={8} facing={g.facing} camera={camera} frame={frame} doorOpen envelope={{g}} watermark={{g}} weighing={{g}} repair={{g,view,onView:setView,cradleSide:side,onCradleSide:setSide,onInspectCradle:!detail&&g.facing===1?()=>act({type:'focus',focus:'object:21'}):undefined,onAct:detail?act:undefined,onInspectOptics:!detail&&g.facing===2?()=>act({type:'focus',focus:'object:20'}):undefined}}/>:<div className="r-loading"/>}
 {detail?<button className="r-nav r-back" aria-label="元の視点へ戻る" onClick={()=>cradle&&side?setSide(false):view!=='all'?setView('all'):act({type:'back'})}><Icon name="back"/></button>:<><button className="r-nav r-left" aria-label="左を向く" onClick={()=>act({type:'turn',delta:-1})}><Icon name="left"/></button><button className="r-nav r-right" aria-label="右を向く" onClick={()=>act({type:'turn',delta:1})}><Icon name="right"/></button></>}
 <div className={'r-message '+(message?'visible':'')} role="status">{message}</div></div>
 <footer className="r-inventory">{g.inventory.map(item=><div className="r-item" key={item}><button aria-label={itemNames[item]+'を選ぶ'} className={g.selected===item?'selected':''} onClick={()=>act({type:'select',item})}>{item==='cradle'?<HeldCradle g={g}/>:item==='gatherings'?<HeldGatherings g={g}/>:<img src={import.meta.env.BASE_URL+`remake/items/${item}.webp`} alt=""/>}</button></div>)}</footer>
 </main>;
}
