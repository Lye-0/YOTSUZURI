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
import {usePhoto} from './usePhoto';
import {Icon} from './Icons';
import './remake.css';
export default function RepairLab(){const q=new URLSearchParams(location.search),[g,setG]=useState<World>(()=>({...initial(),room:8,facing:Number(q.get('facing')??2) as Facing,focus:q.get('view')==='optics'?'object:20':'room',started:true,flags:{'archive:door':true},values:{16:[0,2,0,0],20:q.get('pose')==='lit'?[3,3,0,0]:[0,1,1,0]}})),[message,setMessage]=useState(''),[view,setView]=useState<OpticalView>('all'),detail=g.focus==='object:20';
 const act=(a:Action)=>{const r=apply(g,a);setG(r.world);setMessage(r.message??'');};
 const photo=usePhoto([...archivePhotoFiles,...watermarkFiles,...weighingFiles,...envelopeFiles,...repairFiles]);
 return <main className="remake" data-optics={g.values[20].join(',')} data-guard={!!g.flags['optics:guard']}><div className={'r-stage '+(detail?'r-optical-reading':'')} aria-busy={!photo.ready}>{photo.ready?<ArchiveScene values={[0,2,0,0]} room={8} facing={g.facing} camera={detail?opticalEye(view):repairEye(g.facing)} frame={detail?{width:1000,height:900}:undefined} doorOpen envelope={{g}} watermark={{g}} weighing={{g}} repair={{g,view,onView:setView,onAct:detail?act:undefined,onInspectOptics:!detail&&g.facing===2?()=>act({type:'focus',focus:'object:20'}):undefined}}/>:<div className="r-loading"/>}{detail?<button className="r-nav r-back" aria-label="元の視点へ戻る" onClick={()=>view!=='all'?setView('all'):act({type:'back'})}><Icon name="back"/></button>:<><button className="r-nav r-left" aria-label="左を向く" onClick={()=>act({type:'turn',delta:-1})}><Icon name="left"/></button><button className="r-nav r-right" aria-label="右を向く" onClick={()=>act({type:'turn',delta:1})}><Icon name="right"/></button></>}<div className={'r-message '+(message?'visible':'')} role="status">{message}</div></div><footer className="r-inventory"/></main>;
}
