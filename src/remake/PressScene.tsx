import {PressMechanism,referenceQuad} from './PressMechanism';
import {sameImpression} from './printing';
import {PressReference} from './PressReference';
import {ProjectedSurface} from './ProjectedSurface';
import {PhotoControl} from './PhotoControl';
import {Icon} from './Icons';
import {value,placed,type World,type Action} from './campaign';
export type PressView='all'|'bed'|'paper'|'reference';
export function PressScene({g,act,enabled=true,view='all',onView,showBack=true}:{g:World;act:(a:Action)=>void;enabled?:boolean;view?:PressView;onView:(view:PressView)=>void;showBack?:boolean}){
 const down=!!g.flags['press:paper-down'],v=value(g,12),loaded=placed(g,12,'plates');
 const change=(i:number,max:number)=>{const values=[...v];values[i]=(values[i]+1)%max;act({type:'p-set',id:12,values});};
 if(view==='reference')return <><div className="r-press-reference-view"><PressReference/></div>{showBack?<button className="r-nav r-back" aria-label="刷り機全体を見る" onClick={()=>onView('all')}><Icon name="back"/></button>:null}</>;
 return <><div className="r-press-workspace"><svg className="r-press-world" viewBox="300 425 1372 390" preserveAspectRatio="xMidYMid meet"><image href={import.meta.env.BASE_URL+'remake/closeups/p12-base.webp'} width="1672" height="941"/>
 <foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}><PressMechanism g={g} act={act} enabled={enabled}/></div></foreignObject>
 <foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}><ProjectedSurface quad={referenceQuad} width={970} height={460}><svg viewBox="0 0 970 460" width="100%" height="100%"><PhotoControl label="完成見本の紙を見る" rect={[0,0,970,460]} enabled={enabled} onActivate={()=>onView('reference')}/></svg></ProjectedSurface></div></foreignObject>
 </svg></div><div className="r-press-taskbar">
 <p role="status">{sameImpression(g.print.layers)?'見本と同じ形に刷り上がった':down?'紙に触れると持ち上げる':'紙に触れると台へ重ねる · 予備の版に触れると交換'}　{g.print.layers.length} / 2 回刷り</p>
 <div className="r-press-actions">
 <button disabled={!enabled||!loaded||down} onClick={()=>change(g.print.slot,4)}>版を90°回す</button>
 <button disabled={!enabled||down} onClick={()=>change(2,2)}>紙を裏返す</button>
 <button disabled={!enabled||down} onClick={()=>change(3,3)}>紙の位置：{['左','中央','右'][v[3]]}</button>
 <button className="r-press-print" disabled={!enabled||!down||g.print.layers.length>=2} onClick={()=>act({type:'p-print',id:12})}>取っ手を引いて刷る</button>
 {g.print.layers.length>0?<button disabled={!enabled||down} onClick={()=>act({type:'p-take-print',id:12})}>刷った紙を取る</button>:null}
 </div></div></>;
}
