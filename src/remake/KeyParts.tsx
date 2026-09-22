const part=(name:string)=>import.meta.env.BASE_URL+`remake/parts/${name}.webp`;
const centers=[1158,1248,1338,1428,1518,1608];
function Piece({name,box,size,x,y,width,height}:{name:string;box:string;size:[number,number];x:number;y:number;width:number;height:number}){return <svg x={x} y={y} width={width} height={height} viewBox={box} preserveAspectRatio="none"><image href={part(name)} width={size[0]} height={size[1]}/></svg>}
/** The visible blade extends out of its stationary photographed screw housing. */
export function KeyParts({values=[1,1,1,1,1,1],onChange,detail=false,projected=false,inserted=false}:{values?:number[];onChange?:(v:number[])=>void;detail?:boolean;projected?:boolean;inserted?:boolean}){
const [zoom,setZoom]=useState(false);
const change=(i:number)=>{const next=[...values];next[i]=next[i]%4+1;onChange?.(next)};
const graphic=<svg style={{overflow:inserted?'hidden':undefined}} className={'r-key-photo '+(detail?'detail':'')} viewBox={inserted?'0 0 1100 887':detail&&zoom?'1000 350 740 490':'0 0 1774 887'} preserveAspectRatio={projected?'none':'xMidYMid meet'} role={onChange?'group':'img'} aria-label="六枚歯の保守鍵">
{centers.map((x,i)=><g key={i}><Piece name="key-blade" box="351 95 320 1357" size={[1024,1536]} x={x-29} y={416+(values[i]-1)*45} width={58} height={249}/><Piece name="key-tooth" box="616 172 304 708" size={[1536,1024]} x={x-39} y={478} width={78} height={185}/></g>)}
<image href={part('key-shaft')} width="1774" height="887"/>
{centers.map(x=><g key={x}><path d={`M${x-35} 620H${x+35}`} stroke="#503617" strokeWidth="1.5"/><path d={`M${x-35} 621H${x+35}`} stroke="#e4ca81" strokeWidth=".8" opacity=".6"/></g>)}
{onChange?centers.map((x,i)=><g key={i} role="button" tabIndex={0} aria-label={`${i+1}枚目の歯を調整する`} onClick={()=>change(i)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();change(i)}}}><rect className="r-paper-hit" x={x-43} y="520" width="86" height={160+(values[i]-1)*45}/></g>):null}
</svg>;
return detail?<div className="r-key-inspection">{graphic}<button className="r-key-zoom" aria-label={zoom?'鍵全体を見る':'鍵の歯を拡大する'} onClick={()=>setZoom(n=>!n)}><Icon name="inspect"/></button></div>:graphic;
}
import {useState} from 'react';
import {Icon} from './Icons';
