import type {CSSProperties} from 'react';

export type InkWindow={x:number;y:number;width:number;height:number;angle?:number};
/** Ink only: the ivory drums, apertures and their shadows belong to the photograph. */
export function PhotoDigits({values,windows,onTurn,enabled=true}:{values:number[];windows:InkWindow[];onTurn?:(index:number)=>void;enabled?:boolean}){
return <>{windows.map((w,i)=><span key={i} className="r-drum-ink" style={{left:w.x+'%',top:w.y+'%',width:w.width+'%',height:w.height+'%',transform:`rotate(${w.angle??0}deg)`} as CSSProperties}><svg viewBox="0 0 40 70" preserveAspectRatio="none" aria-hidden="true"><text x="20" y="52" textAnchor="middle">{values[i]}</text></svg>{onTurn?<button disabled={!enabled} aria-label={`${i+1}桁目の輪を回す（${values[i]}）`} onClick={()=>onTurn(i)}/>:null}</span>)}</>;
}
