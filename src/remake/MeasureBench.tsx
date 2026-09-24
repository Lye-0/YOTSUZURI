import {PhotoObject} from './PhotoObject';
import {value,type World,type Action} from './campaign';
const lengths=[5,7,4,6,8];
// Samples, stock, and cut edge share one origin and scale in each camera.
const closeMeasure={left:17,unit:2.8,width:68.2};
const wideMeasure={left:39.8,unit:1.05,width:25};
export function MeasureBench({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
const taken=g.itemValues.register?.[0],n=g.flags['cut:5']&&taken?taken:value(g,5)[0],strip=import.meta.env.BASE_URL+'remake/items/paper-strip.webp';
if(wide){const cut=g.flags['cut:5']?(taken??0)*wideMeasure.unit:0;return <>
{lengths.map((length,i)=>length!==n?<PhotoObject key={i} src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[20.3,54.1+i*.32,length*1.05,.22]} brightness={.75}/>:null)}
{n>0?<PhotoObject src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[39.8,54.45,n*1.05,.24]} brightness={.82}/>:null}
<PhotoObject src={strip} crop={{box:[40+2092*cut/wideMeasure.width,275,2092*(1-cut/wideMeasure.width),150],width:2172,height:724}} rect={[wideMeasure.left+cut,57.25,wideMeasure.width-cut,.8]} brightness={.86}/>
<svg className="r-printed-ink" viewBox="0 0 1000 562.8" preserveAspectRatio="none" aria-hidden="true"><path d="M486.25 325V323H549.25V325" fill="none" stroke="#493728" strokeWidth=".6"/><g fill="none" stroke="#493728" strokeWidth=".5"><circle cx="486.25" cy="325" r=".8"/><circle cx="549.25" cy="325" r=".8"/></g></svg>
</>}
const cut=g.flags['cut:5']?(taken??0)*closeMeasure.unit:0;
return <>
<PhotoObject src={import.meta.env.BASE_URL+'remake/closeups/p05-base.webp'} crop={{box:[250+1150*cut/closeMeasure.width,528,1150*(1-cut/closeMeasure.width),92],width:1672,height:941}} rect={[closeMeasure.left+cut,55.5,closeMeasure.width-cut,11.5]}/>
{lengths.map((length,i)=>length!==n?<PhotoObject key={i} src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[4,11+i*2.7,length*2.8,2.3]} brightness={.86}/>:null)}
<svg className="r-printed-ink" viewBox="0 0 1000 562.8" preserveAspectRatio="none" aria-hidden="true" style={{color:'#352819'}}>
{Array.from({length:25},(_,i)=><g key={i} transform={`translate(${170+i*28} 277)`}><path d={`M0 0V${i%2?-10:-20}`} stroke="currentColor" strokeWidth="1.4"/>{i%2===0?<text x="0" y="-27" fontSize="13" textAnchor="middle" fill="currentColor">{i+2}</text>:null}</g>)}
<g fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="422" cy="350" r="5"/><circle cx="590" cy="350" r="5"/><path d="M422 350V323H590V350M422 323v-10M590 323v-10"/></g>
</svg>
{n>0?<PhotoObject src={strip} crop={{box:[40,275,2092,150],width:2172,height:724}} rect={[closeMeasure.left,39,n*closeMeasure.unit,2.3]} brightness={.9}/>:null}
{lengths.map((length,i)=>length!==n?<button key={i} disabled={!enabled||!!g.flags['cut:5']} className="r-target r-measure-sample" aria-label={`${i+1}枚目の紙片を定規へ合わせる`} style={{left:'4%',top:11+i*2.7+'%',width:length*2.8+'%',height:'2.8%'}} onClick={()=>act({type:'p-set',id:5,values:[length]})}/>:null)}
{n>0&&!g.flags['cut:5']?<button disabled={!enabled} className="r-target" aria-label="測った長さの紙片を切り出す" style={{left:closeMeasure.left+'%',top:'55.5%',width:n*closeMeasure.unit+'%',height:'11.5%'}} onClick={()=>act({type:'p-cut',id:5})}/>:null}
{g.inventory.includes('register')?<button disabled={!enabled} className="r-target" aria-label="紙片をトレーへ戻す" style={{left:'3%',top:'9%',width:'26%',height:'21%'}} onClick={()=>act({type:'p-return-strip',id:5})}/>:null}
</>;
}
