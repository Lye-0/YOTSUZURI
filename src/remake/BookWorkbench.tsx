import {useRef,useState,useLayoutEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import type {CampaignItem} from './catalog';
import {WorldCamera} from './WorldCamera';
import {LoadingWorld} from './LoadingWorld';
import {MagnifyingLens} from './MagnifyingLens';
import {archiveProjectEye,type ShelfPoint} from './archiveSpace';
import {bookWorkEye,bookWorkFrame,bookWorkPoint,finalPaperPose,finalKeyPoint,type BookWorkView} from './bookWorkspaceGeometry';
import {finalPlaced,bookAtPress,frameAtPress,finalPlatenHeight} from './binding';
import {finalGroups,finalRenderedHeight} from './FinalBookBody';
import {clampValues,camCentre} from './clamp';
import {Icon} from './Icons';
import {separateTarget} from './screenTargets';
const names:Partial<Record<CampaignItem,string>>={clamp:'締め具',frame:'綴じ枠',gatherings:'紙束',blanks:'白紙',needle:'綴じ針',thread:'麻糸',keyparts:'保守鍵'};
export function BookWorkbench({g,act,view,onView}:{g:World;act?:((a:Action)=>void);view:BookWorkView;onView:(v:BookWorkView)=>void}){
 const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[picked,setPicked]=useState<CampaignItem|null>(null),[first,setFirst]=useState<number|null>(null),[adding,setAdding]=useState(false),[lens,setLens]=useState<readonly[number,number]|null>(null),frame=bookWorkFrame(view),eye=bookWorkEye(g,view),width=frame.width*scale,height=frame.height*scale,has=(n:CampaignItem)=>finalPlaced(g,n),paper=finalPaperPose(g),groups=finalGroups(g),locked=g.book.clamped||g.book.sewn,v=clampValues(g),platen=finalPlatenHeight(g);
 useLayoutEffect(()=>{const fit=()=>setScale(host.current!.clientWidth/frame.width);fit();const r=new ResizeObserver(fit);r.observe(host.current!);return()=>r.disconnect()},[frame.width]);
 const go=(next:BookWorkView)=>{setFirst(null);setPicked(null);setLens(null);onView(next)};
 const point=(p:ShelfPoint)=>{const q=archiveProjectEye(bookWorkPoint(p),eye);return[q[0]*scale,q[1]*scale] as const;};
 const box=(ps:readonly ShelfPoint[],minimum=0):CSSProperties=>{const q=ps.map(point),xs=q.map(p=>p[0]),ys=q.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,w=Math.max(minimum,Math.max(...xs)-Math.min(...xs)),h=Math.max(minimum,Math.max(...ys)-Math.min(...ys)),left=Math.max(0,cx-w/2),top=Math.max(0,cy-h/2);return{left,top,width:Math.max(0,Math.min(width,cx+w/2)-left),height:Math.max(0,Math.min(height-45,cy+h/2)-top)};};
 const patch=(x:number,y:number,z:number,w:number,d:number)=>box([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],32);
 const choose=(item:CampaignItem)=>{if(g.selected==='needle'&&item==='gatherings'){act?.({type:g.book.sewn?'p-book-unpick':'p-book-sew',id:30});return;}setPicked(n=>n===item?null:item)};
 const button=(label:string,style:CSSProperties,click:()=>void,pressed=false)=><button className="env-screen-hit" aria-label={label} aria-pressed={pressed} style={style} onClick={click}/>;
 const command=(label:string,icon:Parameters<typeof Icon>[0]['name'],click:()=>void,offset:number,pressed=false)=><button className="watermark-command" aria-label={label} aria-pressed={pressed} style={{left:width/2+offset-22,top:height-120}} onClick={click}><Icon name={icon}/></button>;
 const changeRow=(position:number)=>{if(locked)return;if(adding){if(!g.book.blanks.includes(position))act?.({type:'p-book-blank',id:30,position});setAdding(false);return;}if(first===null){setFirst(position);return;}if(first!==position){const order=[...g.book.order];[order[first],order[position]]=[order[position],order[first]];act?.({type:'p-book-order',id:30,order})}setFirst(null)};
 const camPoints=[0,1,2].map(i=>{const c=camCentre(v,i);return point([.08+c[0],.08+c[1],platen+.034])}),keyPoints=[0,1,2,3,4,5].map(i=>point(finalKeyPoint(i,g.values[30]?.[i]??1)));
 const selected=g.selected&&names[g.selected]&&!has(g.selected)?g.selected:null;
 return <div ref={host} className="archive-view" role="group" aria-label="製本の作業台"><WorldCamera eye={eye} frame={frame} scale={scale}><LoadingWorld g={g} eye={eye} pixelScale={scale}/></WorldCamera>
 {act?<div className="envelope-hit-layer">
 {view==='all'?<>
 {selected?button(`${names[selected]}を作業台に置く`,{...({clamp:patch(.08,.08,.02,.44,.38),frame:patch(.12,.12,.04,.36,.30),gatherings:patch(paper.x,paper.y,paper.z,.20,.15),blanks:patch(.30,.52,.012,.22,.17),needle:patch(.56,.20,.003,.08,.03),thread:patch(.55,.38,.003,.09,.06),keyparts:box([[0,1.022,.10],[.237,1.022,.10],[.237,1.022,-.02],[0,1.022,-.02]],44)}[selected as 'clamp'|'frame'|'gatherings'|'blanks'|'needle'|'thread'|'keyparts']),zIndex:3},()=>{act({type:'p-place',id:30,target:selected});setPicked(selected)}):null}
 {has('clamp')?button('締め具を選ぶ',box([[.09,.315,.10],[.12,.315,.30]],40),()=>choose('clamp'),picked==='clamp'):null}
 {has('frame')?button('綴じ枠を選ぶ',frameAtPress(g)?patch(.12,.39,.04,.36,.025):box([[.12,0,0],[.48,0,0],[.48,-.12,.274],[.12,-.12,.274]],40),()=>choose('frame'),picked==='frame'):null}
 {has('gatherings')?button('紙束を選ぶ',box([[paper.x,paper.y+.15,paper.z+finalRenderedHeight(g)],[paper.x+.20,paper.y+.15,paper.z+finalRenderedHeight(g)],[paper.x+.20,paper.y+.17,paper.z],[paper.x,paper.y+.17,paper.z]],32),()=>choose('gatherings'),picked==='gatherings'):null}
 {has('blanks')&&g.book.blanks.length<2?button('白紙を選ぶ',patch(.30,.52,.012,.22,.17),()=>choose('blanks'),picked==='blanks'):null}
 {has('needle')?button('綴じ針を選ぶ',patch(.56,.20,.003,.08,.03),()=>choose('needle'),picked==='needle'):null}
 {has('thread')&&!g.book.sewn?button('麻糸を選ぶ',patch(.55,.38,.003,.09,.06),()=>choose('thread'),picked==='thread'):null}
 {has('keyparts')?button('保守鍵を選ぶ',box([[0,1.022,.10],[.237,1.022,.10],[.237,1.022,-.02],[0,1.022,-.02]],40),()=>choose('keyparts'),picked==='keyparts'):null}
 {has('clamp')?button(v[3]?'押さえ板を下ろす':'押さえ板を上げる',(()=>{const p=point([.30,.27,platen+.383]);return{left:p[0]-32,top:p[1]-22,width:64,height:44}})(),()=>act({type:'p-book-clamp',id:30})):null}
 {picked&&has(picked)?<>
 {['clamp','gatherings','keyparts'].includes(picked)?command(`${names[picked]}を近くで見る`,'eye',()=>go(picked==='clamp'?'cams':picked==='gatherings'?'book':'compare'),-58):null}
 {picked==='frame'||picked==='gatherings'?command((picked==='frame'?frameAtPress(g):bookAtPress(g))?`${names[picked]}を脇へ移す`:`${names[picked]}を締め具に載せる`,'move',()=>act({type:'p-book-mount',id:30,item:picked}),0):null}
 {picked==='blanks'?command('白紙を束の中へ入れる','insert',()=>{setAdding(true);go('book')},-29):null}
 {picked==='needle'?command(g.book.sewn?'綴じ糸をほどく':'束を糸で綴じる','stitch',()=>act({type:g.book.sewn?'p-book-unpick':'p-book-sew',id:30}),-29):null}
 {command(`${names[picked]}を持ち物へ戻す`,'bag',()=>{act({type:'p-retrieve',id:30,item:picked});setPicked(null)},58)}
 </>:null}
 </>:null}
 {view==='book'?<>
 {!locked?groups.map(row=>{const y=paper.y+.15+row.shift,style=box([[paper.x,y,paper.z+row.top],[paper.x+.20,y,paper.z+row.top],[paper.x+.20,y,paper.z+row.bottom],[paper.x,y,paper.z+row.bottom]],24);return <button key={row.position} className="env-screen-hit" aria-label={`${row.visibleIndex+1}番目の束${adding?'に白紙を入れる':'を選ぶ'}`} aria-pressed={first===row.position} style={{...style,outline:first===row.position?'1px solid #e0cea0':undefined}} onClick={()=>changeRow(row.position)}/>;}):null}
 {has('blanks')&&!locked?command(adding?'白紙を入れる操作をやめる':'白紙を束の中へ入れる','insert',()=>{setAdding(n=>!n);setFirst(null)},-87,adding):null}
 {first!==null&&g.book.blanks.includes(first)&&!locked?command('選んだ束から白紙を抜く','bag',()=>{act({type:'p-book-blank',id:30,position:first});setFirst(null)},-29):null}
 {!locked?command(g.book.closed?'束を広げる':'束を閉じる','fold',()=>{act({type:'p-book-close',id:30});setFirst(null)},29):null}
 {!g.book.clamped?command('束全体を裏返す','flip',()=>{act({type:'p-book-side',id:30});setFirst(null)},87):null}
 {g.book.sewn&&!g.book.clamped&&bookAtPress(g)?command('綴じた本を手前で読む','eye',()=>{act({type:'p-book-mount',id:30,item:'gatherings'});go('compare')},-29):null}
 </>:null}
 {view==='cams'?<>{camPoints.map((p,i)=><button key={i} className="env-screen-hit" aria-label={`${i+1}個目の偏心カムを回す`} style={{left:p[0]-22,top:p[1]-22,width:44,height:44,clipPath:separateTarget(p,camPoints.filter((_,j)=>j!==i))}} onClick={()=>act({type:'p-clamp-turn',id:28,index:i})}/>)}{command(v[3]?'押さえ板を下ろす':'押さえ板を上げる','back',()=>act({type:'p-book-clamp',id:30}),0)}</>:null}
 {view==='compare'&&has('keyparts')?<>{keyPoints.map((p,i)=><button key={i} className="env-screen-hit" aria-label={`${i+1}枚目の歯を調整する`} style={{left:p[0]-22,top:p[1]-22,width:44,height:44,clipPath:separateTarget(p,keyPoints.filter((_,j)=>j!==i))}} onClick={()=>{const values=[...(g.values[30]??[1,1,1,1,1,1])];values[i]=values[i]%4+1;act({type:'p-set',id:30,values})}}/>)}{command('保守鍵を持ち物へ戻す','bag',()=>act({type:'p-retrieve',id:30,item:'keyparts'}),0)}</>:null}
 {g.selected==='lens'&&['book','compare'].includes(view)?<div role="slider" tabIndex={0} aria-label="拡大鏡を動かす" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lens?Math.round(lens[0]/frame.width*100):50} style={{position:'absolute',inset:'0 0 145px',touchAction:'none',pointerEvents:'auto'}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);const b=host.current!.getBoundingClientRect();setLens([(e.clientX-b.left)/scale,(e.clientY-b.top)/scale])}} onPointerMove={e=>{if(e.buttons||e.pointerType==='touch'&&e.currentTarget.hasPointerCapture(e.pointerId)){const b=host.current!.getBoundingClientRect();setLens([(e.clientX-b.left)/scale,(e.clientY-b.top)/scale])}}} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const p=lens??[frame.width/2,frame.height/2];setLens([Math.max(0,Math.min(frame.width,p[0]+(e.key==='ArrowLeft'?-30:e.key==='ArrowRight'?30:0))),Math.max(0,Math.min(frame.height-145/scale,p[1]+(e.key==='ArrowUp'?-30:e.key==='ArrowDown'?30:0)))])}}}/>:null}
 </div>:null}
 {g.selected==='lens'&&lens?<MagnifyingLens g={g} eye={eye} scale={scale} point={lens} renderScene={enlarged=><LoadingWorld g={g} eye={enlarged} pixelScale={scale}/>}/>:null}
 </div>;
}
