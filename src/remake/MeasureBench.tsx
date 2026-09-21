import {PhotoObject} from './PhotoObject';
import {PhotoPatch} from './PhotoPatch';
import {value,type World,type Action} from './campaign';
const lengths=[5,7,4,6,8];
export function MeasureBench({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
const n=value(g,5)[0],taken=g.itemValues.register?.[0],strip=import.meta.env.BASE_URL+'remake/items/paper-strip.webp';
if(wide){const cut=g.flags['cut:5']?(taken??0)*1.05:0;return <>
{lengths.map((length,i)=>length!==n?<PhotoObject key={i} src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[20.3,54.1+i*.32,length*1.05,.22]} brightness={.75}/>:null)}
{n>0?<PhotoObject src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[39.8,54.45,n*1.05,.24]} brightness={.82}/>:null}
<PhotoObject src={strip} crop={{box:[40+2092*cut/26.6,275,2092*(1-cut/26.6),150],width:2172,height:724}} rect={[38.2+cut,57.25,26.6-cut,.8]} brightness={.86}/>
<svg className="r-printed-ink" viewBox="0 0 1000 562.8" preserveAspectRatio="none" aria-hidden="true"><path d="M486.25 325V323H549.25V325" fill="none" stroke="#493728" strokeWidth=".6"/><g fill="none" stroke="#493728" strokeWidth=".5"><circle cx="486.25" cy="325" r=".8"/><circle cx="549.25" cy="325" r=".8"/></g></svg>
</>}
return <>
{g.flags['cut:5']&&taken?<PhotoPatch src={import.meta.env.BASE_URL+'remake/closeups/p05-empty-strip.webp'} rect={[13.7,54.5,taken*2.8,13]}/>:null}
{lengths.map((length,i)=>length!==n?<PhotoObject key={i} src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[4,11+i*2.7,length*2.8,2.3]} brightness={.86}/>:null)}
<svg className="r-printed-ink" viewBox="0 0 1000 562.8" preserveAspectRatio="none" aria-hidden="true" style={{color:'#352819'}}>
{Array.from({length:25},(_,i)=><g key={i} transform={`translate(${170+i*28} 277)`}><path d={`M0 0V${i%2?-10:-20}`} stroke="currentColor" strokeWidth="1.4"/>{i%2===0?<text x="0" y="-27" fontSize="13" textAnchor="middle" fill="currentColor">{i+2}</text>:null}</g>)}
<g fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="422" cy="350" r="5"/><circle cx="590" cy="350" r="5"/><path d="M422 350V323H590V350M422 323v-10M590 323v-10"/></g>
</svg>
{n>0?<PhotoObject src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[17,39,n*2.8,2.3]} brightness={.9}/>:null}
{lengths.map((length,i)=>length!==n?<button key={i} disabled={!enabled} className="r-target" aria-label={`${i+1}枚目の紙片を定規へ合わせる`} style={{left:'4%',top:11+i*2.7+'%',width:length*2.8+'%',height:'2.8%'}} onClick={()=>act({type:'p-set',id:5,values:[length]})}/>:null)}
{n>0&&!g.flags['cut:5']?<button disabled={!enabled} className="r-target" aria-label="測った長さの紙片を切り出す" style={{left:'14.5%',top:'55.5%',width:n*2.8+'%',height:'11.5%'}} onClick={()=>act({type:'p-cut',id:5})}/>:null}
{g.inventory.includes('register')?<button disabled={!enabled} className="r-target" aria-label="紙片をトレーへ戻す" style={{left:'3%',top:'9%',width:'26%',height:'21%'}} onClick={()=>act({type:'p-return-strip',id:5})}/>:null}
</>;
}
