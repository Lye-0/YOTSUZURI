import {PrintedSheet} from './PrintedSheet';
import type {Impression} from './printing';
export function HeldPrint({layers,face=0,onFlip}:{layers:Impression[];face?:number;onFlip?:()=>void}){return <div className="r-print-inspection"><PrintedSheet layers={layers} face={face}/><button className="r-print-flip" aria-label="試し刷りの裏表を返す" onClick={onFlip}/></div>}
