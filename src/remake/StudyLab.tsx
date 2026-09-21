import {useState} from 'react';
import {apply,initial,type Action,type World} from './campaign';
import {BlankStudyScene} from './BlankStudyScene';
import {studyFiles} from './studyAssets';
import {archivePhotoFiles} from './archiveAssets';
import {repairFiles} from './repairAssets';
import {usePhoto} from './usePhoto';
import {Icon} from './Icons';
import './remake.css';
export default function StudyLab(){const [g,setG]=useState<World>(()=>({...initial(),started:true,room:9,facing:3,focus:'object:23',inventory:['blanks']})),[index,setIndex]=useState<number|undefined>(),photo=usePhoto([...studyFiles,...archivePhotoFiles,...repairFiles]),act=(a:Action)=>setG(s=>apply(s,a).world);return <main className="remake" data-positions={g.values[23]?.join(',')} data-flags={JSON.stringify(g.flags)}><div className="r-stage r-optical-reading" aria-busy={!photo.ready}>{photo.ready?<BlankStudyScene g={g} act={act} index={index} onInspect={setIndex}/>:<div className="r-loading"/>}{index!==undefined?<button className="r-nav r-back" aria-label="標本の全体へ戻る" onClick={()=>setIndex(undefined)}><Icon name="back"/></button>:null}</div><footer className="r-inventory">{g.inventory.includes('blanks')?<div className="r-item"><button aria-label="白紙の束を選ぶ" className={g.selected==='blanks'?'selected':''} onClick={()=>act({type:'select',item:'blanks'})}><img src="/remake/items/blanks.webp" alt=""/></button></div>:null}</footer></main>}
