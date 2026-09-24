import {panelKnob} from './repairNorth';
/** Same proportions and repair positions as the accepted panel photograph. Units: millimetres. */
export function RepairPanelInk({split='right',straps=2}:{split?:'left'|'right';straps?:2|3}={}){return <g fill="none" stroke="currentColor" strokeWidth="16" strokeLinejoin="round">
 <path d="M24 32H405Q500-20 595 32H992V2100H24ZM127 124H889V2070H127ZM127 574H889M127 663H889M127 1678H889M127 1730H889M321 124V574M505 124V574M705 124V574"/>
 {[242,956,1735].map(y=><path key={y} d={`M5 ${y}H79V${y+136}H5Z`}/>)}
 {(straps===3?[933,1190,1497]:[933,1497]).map(y=><path key={y} d={`M864 ${y}l133-5v44l-133 5Z`}/>)}
 <path d={split==='right'?'M778 126L810 269L795 328L795 368L824 416L846 477L838 523L856 571':'M220 125l50 130-25 92 40 78-25 146'}/>
 <circle cx={panelKnob.u*1000} cy={(2.1-panelKnob.z)*1000} r="38"/>
 </g>;}
