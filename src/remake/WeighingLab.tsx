import {useRef,useState} from 'react';
import {apply,initial,type Action,type World} from './campaign';
import {ArchiveScene,archivePhotoFiles} from './ArchiveScene';
import {initialWeighing,scaleMass,weighingValues} from './weighing';
import {WEIGHING_FRAME,weighingEye,type WeighingDetail} from './weighingGeometry';
import {watermarkFiles} from './watermarkAssets';
import {envelopeFiles} from './envelopeAssets';
import {weighingFiles} from './weighingAssets';
import {usePhoto} from './usePhoto';
import './remake.css';
export default function WeighingLab(){const q=new URLSearchParams(location.search),mode=q.get('pose'),view=q.get('view'),book=Number(q.get('book')??2);
 const [g,setG]=useState<World>(()=>{const v=initialWeighing(),g:World={...initial(),started:true,room:7,facing:3,focus:'object:19',values:{19:v}};if(mode==='loaded'){v[0]=2;v[1]=10;}if(mode==='loose'||mode==='open'){v[3]=-1;v[4]=-1;if(mode==='open')g.flags['weighing:spine']=true;}return g;});
 const detail:WeighingDetail|undefined=view==='scale'?{kind:'weighing-scale'}:view==='book'?{kind:'weighing-book',index:book,side:q.get('side')==='spine'?'spine':'cover'}:undefined;
 const photo=usePhoto([...archivePhotoFiles,...watermarkFiles,...envelopeFiles,...weighingFiles]),visible=useRef(g);if(photo.ready)visible.current=g;
 const act=(a:Action)=>setG(s=>apply(s,a).world);
 return <main className="remake" data-mass={scaleMass(g)} data-rider={weighingValues(g)[1]}><div className="r-stage r-weighing-reading" aria-busy={!photo.ready}>{photo.ready?<ArchiveScene values={g.values[16]??[0,6,0,4]} room={7} facing={3} frame={WEIGHING_FRAME} camera={weighingEye(visible.current,detail)} envelope={{g:visible.current}} watermark={{g:visible.current}} weighing={{g:visible.current}}/>:photo.failed?<button onClick={photo.retry}>画像を再読み込み</button>:<div className="r-loading"/>}</div><footer className="r-inventory"/></main>;
}
