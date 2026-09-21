import {value,placed,type World,type Action} from './campaign';
import {ProjectedSurface} from './ProjectedSurface';
import {PlateArtwork} from './PlateArtwork';
import {PrintedSheet} from './PrintedSheet';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl} from './PhotoControl';
import {PhotoPatch} from './PhotoPatch';
import {betweenQuads,project,type Quad} from './projective';
const bed:Quad=[[535,477],[1040,477],[1222,733],[360,733]],stock:Quad=[[1161,497],[1397,493],[1498,574],[1211,579]],shelf:Quad=[[1252,604],[1548,598],[1666,710],[1329,718]];
const closeToWide=betweenQuads(bed,[[738,495],[886,489],[997,530],[780,540]]);
export function PressMechanism({g,act,enabled=true,wide=false}:{g:World;act:(a:Action)=>void;enabled?:boolean;wide?:boolean}){
 const v=value(g,12),slot=g.print.slot,ids=g.itemValues.plates??[],down=!!g.flags['press:paper-down'];
 const quad=(q:Quad):Quad=>wide?[project(q[0],closeToWide),project(q[1],closeToWide),project(q[2],closeToWide),project(q[3],closeToWide)]:q;
 const change=(index:number,max:number)=>{const next=[...v];next[index]=(next[index]+1)%max;act({type:'p-set',id:12,values:next});};
 const material=(item:'plates'|'pin'|'weights'|'register')=>act(!g.selected&&placed(g,12,item)?{type:'p-retrieve',id:12,item}:{type:'p-place',id:12,target:item});
 return <div className="r-press-mechanism">
 {!wide?<PhotoPatch src={import.meta.env.BASE_URL+'remake/closeups/p12-empty-shelf.webp'} rect={[65.5,47,34.5,40]}/>:null}
 <ProjectedSurface quad={quad(bed)} width={1000} height={1000}><svg viewBox="0 0 1000 1000" width="100%" height="100%">
 <g fill="none" stroke="#d4caaa" strokeWidth="4" opacity=".85"><path d="M868 280h48m-24-18v36"/></g>
 {placed(g,12,'plates')&&ids[slot]!==undefined?<g transform={`rotate(${v[slot]*90} 500 500)`}><svg x="50" y="300" width="900" height="400"><PlateArtwork index={ids[slot]}/></svg></g>:null}
 {down?<svg x={50+(v[3]-1)*60} y="300" width="900" height="400"><PrintedSheet layers={g.print.layers} face={v[2]}/></svg>:null}
 {placed(g,12,'weights')?<><PhotoSprite name="press-weight" x={150} y={250} width={700} height={95}/><PhotoSprite name="press-weight" x={150} y={655} width={700} height={95}/></>:null}
 {!wide?<>
 <PhotoControl label={down?'紙を持ち上げる':placed(g,12,'plates')?'版を四分の一回転する':'原版を台へ置く'} rect={[50,300,900,400]} enabled={enabled} onActivate={()=>down?act({type:'p-press-paper',id:12}):g.selected==='weights'?material('weights'):placed(g,12,'plates')?change(slot,4):material('plates')}/>
 <PhotoControl label={placed(g,12,'weights')?'押さえを取り外す':'押さえを台へ置く'} rect={[150,235,700,115]} enabled={enabled&&!down} onActivate={()=>material('weights')}/>
 </>:null}
 </svg></ProjectedSurface>
 <ProjectedSurface quad={quad(stock)} width={900} height={400}><svg viewBox="0 0 900 400" width="100%" height="100%">
 {placed(g,12,'plates')&&ids[1-slot]!==undefined?<PlateArtwork index={ids[1-slot]}/>:<PrintedSheet layers={[]}/>}
 {!wide?<PhotoControl label="もう一枚の版に替える" rect={[0,0,900,400]} enabled={enabled&&!down} onActivate={()=>act({type:'p-press-select',id:12,slot:slot?0:1})}/>:null}
 </svg></ProjectedSurface>
 {!down?<ProjectedSurface quad={quad(shelf)} width={970} height={460}><PrintedSheet layers={g.print.layers} face={v[2]}/></ProjectedSurface>:null}
 <ProjectedSurface quad={quad([[1450,508],[1598,508],[1665,570],[1526,574]])} width={970} height={460}><svg viewBox="0 0 970 460" width="100%" height="100%"><g transform="translate(0 7)"><PrintedSheet layers={[]}/></g><PrintedSheet layers={[]}/>{!wide?<PhotoControl label="新しい試し紙に換える" rect={[0,0,970,460]} enabled={enabled} onActivate={()=>act({type:'p-new-sheet',id:12})}/>:null}</svg></ProjectedSurface>
 <ProjectedSurface quad={quad([[0,0],[1672,0],[1672,941],[0,941]])} width={1672} height={941}><svg className="r-press-controls" viewBox="0 0 1672 941" preserveAspectRatio="none"><g>
 {placed(g,12,'register')?<PhotoSprite name="paper-strip" group="items" x={507} y={751} width={459} height={17}/>:null}
 {placed(g,12,'pin')?<g transform="translate(1 -17) rotate(-62 427 706)"><PhotoSprite name="pin" group="items" x={397} y={648} width={60} height={58}/></g>:null}
 {!wide?<>
 <PhotoControl label="刷り機の取っ手を動かす" rect={[1440,23,195,152]} enabled={enabled} onActivate={()=>act({type:'p-print',id:12})}/>
 <PhotoControl label={placed(g,12,'pin')?'紙止めを外す':'紙止めを差す'} rect={[371,630,105,112]} enabled={enabled&&!down} onActivate={()=>material('pin')}/>
 <PhotoControl label={placed(g,12,'register')?'位置決め片を取り外す':'溝へ位置決め片を置く'} rect={[503,748,460,59]} enabled={enabled&&!down} onActivate={()=>material('register')}/>
 {!down?<>
 <PhotoControl label="紙を版に重ねる" rect={[1340,629,215,79]} enabled={enabled} onActivate={()=>act({type:'p-press-paper',id:12})}/>
 <PhotoControl label="紙を裏返す" rect={[1240,586,89,68]} enabled={enabled} onActivate={()=>change(2,2)}/>
 <PhotoControl label="紙の見当をずらす" rect={[1570,639,90,83]} enabled={enabled} onActivate={()=>change(3,3)}/>
 {g.print.layers.length?<PhotoControl label="試し刷りを手元へ取る" rect={[1336,711,206,58]} enabled={enabled} onActivate={()=>act({type:'p-take-print',id:12})}/>:null}
 </>:null}
 </>:null}
 </g></svg></ProjectedSurface>
 </div>;
}
