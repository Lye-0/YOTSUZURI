import {trimSeams,originalSeam} from './trimming';
import {archiveOldPlan} from './archivePlan';
function artwork(edition:number|'body',back:boolean){
 const seam=edition==='body'?originalSeam:trimSeams[edition],door=edition==='body'?270:[320,285,270][edition],paths:[string,number][]=[];
 const add=(path:string,width=3.4)=>paths.push([path,width]);
 if(back){
  add('M45 60H555V440H45Z M54 69H546V431H54Z');
  for(const y of seam.back){add(`M70 ${y}C150 ${y-46} 222 ${y+46} 300 ${y}S406 ${y-24} 435 ${y}H480Q520 ${y} 535 ${y-22}`);add(`M150 ${y}q18 -26 39 0q-18 28 -39 0 M270 ${y}q18 -26 39 0q-18 28 -39 0`);}
  add('M77 85L95 101L77 117L61 101Z M510 392l18 -16l17 16l-17 16Z');
 }else{
  add(edition===0?'M70 90H470 M530 90H540V410H440 M380 410H70V230 M70 160V90 M300 90V249 M300 324V410':`M70 90H540V${door} M540 ${door+70}V410H440 M380 410H70V230 M70 160V90 M300 90V249 M300 324V410`);
  add(edition===0?'M470 95v30h60V95 M470 90a60 60 0 0 0 60 60V90':`M535 ${door}h-30v70h30 M540 ${door}a70 70 0 0 0-70 70H540`,2.2);
  add('M70 160H77V230H70 M380 90V97H440V90 M300 249a75 75 0 0 1-75 75H300 M380 410v-60a60 60 0 0 1 60 60',2.1);
  for(const i of [0,1,3]){const [x,y,w,h]=archiveOldPlan[i].rect;add(`M${x} ${y}h${w}v${h}h${-w}Z`);}
  add(`M425 ${seam.front[1]}H500V${seam.front[2]}H425Z`);
  for(const x of [117,187])add(`M${x} 154v8m0 -3h8`);
  for(const x of [106,253])add(`M${x} 340v-10m-4 3h11`);
  add('M342 165v9h10 M384 165v9h-10 M500 192h9v8 M500 234h9v-8',2.2);
  // A small elevation records the repaired front-left post, at the old north-east corner.
  add('M224 293h34v24h-34Z M227 314l17 -17 M243 317l9 23',2.2);
  add(`M414 ${seam.front[3]}H450m6 0h58 M452 ${seam.front[3]-6}l4 13`,2.1);
  add('M100 450h70m-70 -4v8m35 -8v8m35 -8v8 M93 58V28m-7 12l7 -12l7 12',2.2);
 }
 return paths;
}
export function TrimInk({edition,back}:{edition:number|'body';back:boolean}){return <g fill="none" stroke="#4e493b" strokeLinecap="round" strokeLinejoin="round" opacity=".8">{artwork(edition,back).map(([d,width],i)=><path key={i} d={d} strokeWidth={width}/>)}</g>;}
