import {useRef,useState} from 'react';
import {apply,initial,type Action,type World} from './campaign';
import {CutawayScene} from './CutawayScene';
import {ForeedgeScene} from './ForeedgeScene';
import {PressScene,type PressView} from './PressScene';
import {usePhoto} from './usePhoto';
import {sceneFiles} from './sceneFiles';
import './remake.css';
/** Development-only photographic mechanism study; excluded from production routing. */
export default function MechanismLab(){
 const query=new URLSearchParams(location.search),mode=query.get('lab'),edge=mode==='foreedge',press=mode==='press',sources=query.get('stock')==='mixed'?[0,1,6,7,2,3]:query.get('stock')==='reordered'?[0,1,4,5,2,3]:[0,1,2,3,4,5];
 const [zoom,setZoom]=useState(false);const [pressView,setPressView]=useState<PressView>('all');
 const [g,setG]=useState<World>(():World=>edge?{...initial(),started:true,room:8,facing:2,focus:'object:22',solved:[20],placed:{22:['gatherings','cradle']},itemValues:{gatherings:sources}}:press?{...initial(),started:true,room:4,facing:0,focus:'object:12',placed:{12:['plates','pin','weights','register']},itemValues:{plates:[0,3],register:[6]}}:{...initial(),started:true,room:9,facing:0,focus:'object:27'});
 const photo=usePhoto(sceneFiles(g)),visible=useRef(g);if(photo.ready)visible.current=g;
 const act=(a:Action)=>setG(s=>apply(s,a).world);
 return <main className="remake" data-book-order={g.book.order.join(',')} data-solved={g.solved.join(',')} data-impressions={JSON.stringify(g.print.layers)} style={{'--light':1} as React.CSSProperties}>
 <div className={'r-stage '+(edge?(zoom?'r-foreedge-detail':''):press?(pressView==='bed'?'r-press-bed':pressView==='paper'?'r-press-paper':''):'r-optical-reading')} aria-busy={!photo.ready}>
 {edge?<><img className="r-photo" src={photo.shown} alt="小口の支持台"/><ForeedgeScene g={visible.current} act={act} enabled={photo.ready} zoom={zoom} onZoom={setZoom}/></>:press?<><img className="r-photo" src={photo.shown} alt="刷り機"/><PressScene g={visible.current} act={act} enabled={photo.ready} view={pressView} onView={setPressView}/></>:<CutawayScene g={visible.current} act={photo.ready?act:undefined}/>}
 </div><footer className="r-inventory"/></main>;
}
