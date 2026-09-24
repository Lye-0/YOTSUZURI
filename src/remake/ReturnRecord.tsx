import {MaintenanceMark} from './MaintenanceMark';
import {Icon} from './Icons';
import {Photograph} from './ArchivePhotos';
import {RepairPanelInk} from './RepairPanelInk';
export function ReturnRecord({detail=false,zoom=false,onZoom}:{detail?:boolean;zoom?:boolean;onZoom?:()=>void}){const enlarged=detail&&zoom;return <div style={{position:'relative',width:detail?(enlarged?'min(88vw,33svh)':'min(92vw,1000px)'):'100%',aspectRatio:enlarged?'360/760':'28/20'}}><div style={{position:'absolute',inset:0,overflow:'hidden'}}><div style={{position:'absolute',width:enlarged?'388.889%':'100%',height:enlarged?'131.579%':'100%',left:enlarged?'-50%':0,top:enlarged?'-26.316%':0}}><Photograph id="return-sheet" group="parts/joinery"/><svg viewBox="0 0 1400 1000" style={{position:'absolute',inset:0,width:'100%',height:'100%',color:'#3f3830'}}>
 <g fill="currentColor" fontFamily="Yu Mincho,serif" fontSize="37"><text x="710" y="115" textAnchor="middle" letterSpacing="15">所内保守原本</text>{['受入','発送','返却'].map((s,i)=><text key={s} x={605+i*270} y="220" textAnchor="middle">{s}</text>)}</g>
 <g stroke="#53483b" fill="none" opacity=".65" strokeWidth="2"><path d="M195 255H1300M195 470H1300M195 685H1300M195 900H1300M465 180V900M740 180V900M1010 180V900M1300 180V900"/></g>
 {[0,1,2].map((row)=><g key={row} transform={`translate(280 ${275+row*215})`}><g transform="scale(.075)"><RepairPanelInk split={row===1?'left':'right'} straps={row===0?3:2}/></g></g>)}
 {[[1918,1923,1926],[1919,1925,1931],[1919,1924,1927]].map((years,row)=><g key={row} fill="#423a31" fontFamily="serif" fontSize="52">{years.map((year,col)=><text key={col} x={605+270*col} y={375+215*row} textAnchor="middle">{year}</text>)}</g>)}
 <g transform="translate(1170 105) scale(1.35)" color="#765344" opacity=".8"><MaintenanceMark/></g>
 </svg></div></div>{detail?<button className="watermark-command" aria-label={zoom?"返却記録の全体を見る":"記録の小口絵を拡大する"} style={{right:6,bottom:6}} onClick={onZoom}><Icon name={zoom?"back":"inspect"}/></button>:null}</div>;}
