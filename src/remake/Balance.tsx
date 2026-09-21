import {useEffect,useState} from 'react';
import {PhotoSprite} from './PhotoSprite';
import {value,type World,type Action} from './campaign';
const mass=[2,3,5],sizes=[[68,101],[92,132],[112,154]],bench=[1111,1210,1327];
export function Balance({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
const [held,setHeld]=useState<number|null>(null),v=value(g,8);
useEffect(()=>setHeld(null),[wide]);
const difference=v.reduce((s,side,i)=>s+(side===1?mass[i]:side===2?-mass[i]:0),0),angle=Math.max(-9,Math.min(9,-difference*2.4)),rad=angle*Math.PI/180;
const balanced=v.every(n=>n>0)&&difference===0;
const arms=[-320,320].map(dx=>({x:822+dx*Math.cos(rad),y:120+dx*Math.sin(rad)+14}));
const positions=v.map((side,i)=>{if(!side)return{x:bench[i],y:604};const a=arms[side-1],members=v.map((s,j)=>s===side?j:-1).filter(j=>j>=0),at=members.indexOf(i),offset=members.length===1?0:members.length===2?(at?45:-45):i===2?0:i===0?-55:55;return{x:a.x+offset,y:a.y-18+303-(members.length===3&&i===2?18:0)}});
const place=(side:number)=>{if(held===null||!enabled)return;const values=[...v];values[held]=side;act({type:'p-set',id:8,values});setHeld(null)};
const part=(i:number)=>`balance-weight-${['small','medium','large'][i]}`;
return <svg className="r-balance" viewBox={wide?'0 0 1672 941':'380 0 1050 941'} preserveAspectRatio="none" aria-label="天秤" role="group">
<defs><clipPath id="balance-clear-pin"><rect x="793" y="603" width="66" height="160"/></clipPath><clipPath id="balance-drawer"><rect x="0" y="690" width="1672" height="251"/></clipPath><clipPath id="balance-wide-pin"><rect x="1226" y="501" width="42" height="80"/></clipPath><clipPath id="balance-wide-drawer"><rect x="978" y="542" width="555" height="285"/></clipPath></defs>
{!wide?<><image href={import.meta.env.BASE_URL+'remake/closeups/p08-base.webp'} width="1672" height="941"/><image href={import.meta.env.BASE_URL+'remake/closeups/p08-pin-clear.webp'} width="1672" height="941" clipPath="url(#balance-clear-pin)"/>{g.opened.includes(8)?<image href={import.meta.env.BASE_URL+'remake/closeups/p08-open-empty.webp'} width="1672" height="941" clipPath="url(#balance-drawer)"/>:null}</>:<><image href={import.meta.env.BASE_URL+'remake/scenes/type/east-pin-clear.webp'} width="1672" height="941" clipPath="url(#balance-wide-pin)"/>{g.opened.includes(8)?<image href={import.meta.env.BASE_URL+'remake/scenes/type/east-open.webp'} width="1672" height="941" clipPath="url(#balance-wide-drawer)"/>:null}</>}
<g transform={wide?'matrix(.4 0 0 .45 871.2 237)':undefined}>
<PhotoSprite name="balance-pin" x={810+(wide?100:0)} y={611-(balanced||g.opened.includes(8)?60:0)} width={33} height={128}/>
{[2,0,1].map(i=>{const {x,y}=positions[i],[w,h]=sizes[i],lift=held===i&&!wide?-8:0;return <g key={i} transform={`translate(0 ${lift})`}><PhotoSprite name={part(i)} x={x-w/2} y={y-h} width={w} height={h}/><text x={x} y={y-h*.27} textAnchor="middle" fill="#c6a46d" fontFamily="Georgia,serif" fontSize={h*.17} opacity=".8">{mass[i]}</text></g>})}
{arms.map((a,i)=><PhotoSprite key={i} name="balance-pan" x={a.x-116.5} y={a.y-18} width={233} height={350}/>)}
<g transform={`rotate(${angle} 822 120)`}><PhotoSprite name="balance-beam" x={483} y={85} width={678} height={72}/></g>
{g.opened.includes(8)&&!g.collected.includes('weights')?<PhotoSprite name="weights" group="items" x={625+(wide?100:0)} y={735} width={400} height={65}/>:null}
{!wide?<>
{held!==null?<><g role="button" tabIndex={enabled?0:-1} aria-label="重りを台へ戻す" onClick={()=>place(0)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();place(0)}}}><rect className="r-paper-hit" x="1050" y="545" width="375" height="68"/></g>{arms.map((a,i)=><g key={i} role="button" tabIndex={enabled?0:-1} aria-label={i?'右の皿へ置く':'左の皿へ置く'} onClick={()=>place(i+1)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();place(i+1)}}}><ellipse className="r-paper-hit" cx={a.x} cy={a.y+292} rx="121" ry="60"/></g>)}</>:null}
{positions.map(({x,y},i)=><g key={i} role="button" tabIndex={enabled?0:-1} aria-label={`${mass[i]}の重りを持つ`} onClick={()=>enabled&&setHeld(held===i?null:i)} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();setHeld(held===i?null:i)}}}><rect className="r-paper-hit" x={x-Math.max(100,sizes[i][0]+12)/2} y={y-sizes[i][1]-8} width={Math.max(100,sizes[i][0]+12)} height={Math.max(100,sizes[i][1]*.75)}/></g>)}
{!g.opened.includes(8)?<g role="button" tabIndex={enabled?0:-1} aria-label="引出しの取っ手を引く" onClick={()=>enabled&&act({type:'p-open',id:8})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-open',id:8})}}}><rect className="r-paper-hit" x="688" y="760" width="280" height="95"/></g>:!g.collected.includes('weights')?<g role="button" tabIndex={enabled?0:-1} aria-label="刷り機の押さえを取る" onClick={()=>enabled&&act({type:'p-take',id:8,item:'weights'})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-take',id:8,item:'weights'})}}}><rect className="r-paper-hit" x="615" y="727" width="420" height="80"/></g>:null}
</>:null}
</g></svg>;
}
