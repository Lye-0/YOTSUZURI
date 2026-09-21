import {useState} from 'react';
import {PrintedSheet} from './PrintedSheet';
import type {Impression} from './printing';
export function HeldPrint({layers}:{layers:Impression[]}){const [face,setFace]=useState(0);return <div className="r-print-inspection"><PrintedSheet layers={layers} face={face}/><button className="r-print-flip" aria-label="試し刷りの裏表を返す" onClick={()=>setFace(face?0:1)}/></div>}
