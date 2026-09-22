import {PressMechanism,referenceQuad} from './PressMechanism';
import {PressReference} from './PressReference';
import {ProjectedSurface} from './ProjectedSurface';
import {PhotoControl} from './PhotoControl';
import {Icon} from './Icons';
import type {World,Action} from './campaign';
export type PressView='all'|'bed'|'paper'|'reference';
export function PressScene({g,act,enabled=true,view='all',onView,showBack=true}:{g:World;act:(a:Action)=>void;enabled?:boolean;view?:PressView;onView:(view:PressView)=>void;showBack?:boolean}){
 const bounds=view==='bed'?'350 430 920 480':view==='paper'?'1140 455 532 340':'0 0 1672 941';
 const action=(a:Action)=>{act(a);if(a.type==='p-press-paper'&&!g.flags['press:paper-down'])onView('all');};
 if(view==='reference')return <><div className="r-press-reference-view"><PressReference/></div>{showBack?<button className="r-nav r-back" aria-label="刷り機全体を見る" onClick={()=>onView('all')}><Icon name="back"/></button>:null}</>;
 return <><svg className="r-press-world" viewBox={bounds} preserveAspectRatio="none"><image href={import.meta.env.BASE_URL+'remake/closeups/p12-base.webp'} width="1672" height="941"/>
 <foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}><PressMechanism g={g} act={action} enabled={enabled&&view!=='all'}/></div></foreignObject>
 {view==='all'?<>
 <PhotoControl label="版の台へ近づく" rect={[350,430,820,340]} enabled={enabled} onActivate={()=>onView('bed')}/>
 <PhotoControl label="紙と予備の版へ近づく" rect={[1140,455,532,320]} enabled={enabled} onActivate={()=>onView('paper')}/>
 <PhotoControl label="刷り機の取っ手を動かす" rect={[1440,23,195,152]} enabled={enabled} onActivate={()=>act({type:'p-print',id:12})}/>
 </>:null}
 <foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}><ProjectedSurface quad={referenceQuad} width={970} height={460}><svg viewBox="0 0 970 460" width="100%" height="100%"><PhotoControl label="完成見本の紙を見る" rect={[0,0,970,460]} enabled={enabled} onActivate={()=>onView('reference')}/></svg></ProjectedSurface></div></foreignObject>
 </svg>{view!=='all'&&showBack?<button className="r-nav r-back" aria-label="刷り機全体を見る" onClick={()=>onView('all')}><Icon name="back"/></button>:null}</>;
}
