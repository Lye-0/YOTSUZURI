import {useRef,useState} from 'react';
import {apply,initial,type Action,type World} from './campaign';
import {CutawayLock} from './CutawayLock';
import {ForeedgeScene} from './ForeedgeScene';
import {usePhoto} from './usePhoto';
import {sceneFiles} from './sceneFiles';
import './remake.css';
/** Development-only photographic mechanism study; excluded from production routing. */
export default function MechanismLab(){const edge=new URLSearchParams(location.search).get('lab')==='foreedge';const [zoom,setZoom]=useState(false);const [g,setG]=useState<World>(()=>edge?{...initial(),started:true,room:8,facing:2,focus:'object:22',solved:[20],placed:{22:['gatherings','cradle']}}:{...initial(),started:true,room:9,facing:0,focus:'object:27'});const photo=usePhoto(sceneFiles(g)),visible=useRef(g);if(photo.ready)visible.current=g;const act=(a:Action)=>setG(s=>apply(s,a).world);return <main className="remake" data-book-order={g.book.order.join(',')} data-solved={g.solved.join(',')} style={{'--light':1} as React.CSSProperties}><div className={'r-stage '+(edge?(zoom?'r-foreedge-detail':''):'r-cutaway-reading')} aria-busy={!photo.ready}>{edge?<><img className="r-photo" src={photo.shown} alt="小口の支持台"/><ForeedgeScene g={visible.current} act={act} enabled={photo.ready} zoom={zoom} onZoom={setZoom}/></>:<CutawayLock g={visible.current} act={act} enabled={photo.ready}/>}</div><footer className="r-inventory"/></main>}
