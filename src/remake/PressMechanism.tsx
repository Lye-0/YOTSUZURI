import {value,placed,type World,type Action} from './campaign';
import {ProjectedSurface} from './ProjectedSurface';
import {PressReference} from './PressReference';
import {PlateArtwork} from './PlateArtwork';
import {PrintedSheet} from './PrintedSheet';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl} from './PhotoControl';
import {PhotoPatch} from './PhotoPatch';
import {betweenQuads,homography,project,type Quad} from './projective';
const bed:Quad=[[535,477],[1040,477],[1222,733],[360,733]],stock:Quad=[[1175,505],[1375,505],[1440,575],[1218,582]],shelf:Quad=[[1240,625],[1390,625],[1465,713],[1302,719]];
export const referenceQuad:Quad=[[1415,621],[1550,616],[1630,700],[1490,711]];
const closeToWide=betweenQuads(bed,[[738,495],[886,489],[997,530],[780,540]]);
const bedPart=(x:number,y:number,w:number,h:number):Quad=>{const m=homography(1000,1000,bed);return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(p=>project(p as [number,number],m)) as unknown as Quad;};
export function PressMechanism({g,act,enabled=true,wide=false}:{g:World;act:(a:Action)=>void;enabled?:boolean;wide?:boolean}){
 const v=value(g,12),slot=g.print.slot,ids=g.itemValues.plates??[],down=!!g.flags['press:paper-down'];
 const quad=(q:Quad):Quad=>wide?q.map(p=>project(p,closeToWide)) as unknown as Quad:q;
 const change=(index:number,max:number)=>{const next=[...v];next[index]=(next[index]+1)%max;act({type:'p-set',id:12,values:next});};
 const material=(item:'plates'|'pin'|'weights'|'register')=>act(!g.selected&&placed(g,12,item)?{type:'p-retrieve',id:12,item}:{type:'p-place',id:12,target:item});
 return <div className="r-press-mechanism">
 {!wide?<PhotoPatch src={import.meta.env.BASE_URL+'remake/closeups/p12-empty-shelf.webp'} rect={[65.5,47,34.5,40]}/>:null}
 <ProjectedSurface quad={quad(referenceQuad)} width={970} height={460}><PressReference/></ProjectedSurface>
 <ProjectedSurface quad={quad(bed)} width={1000} height={1000}><svg viewBox="0 0 1000 1000" width="100%" height="100%">
 <g fill="none" stroke="#d4caaa" strokeWidth="4" opacity=".85"><path d="M810 310h48m-24-18v36"/></g>
 {!wide&&!placed(g,12,'plates')?<PhotoControl label="原版を台へ置く" rect={[110,327,780,346]} enabled={enabled} onActivate={()=>material('plates')}/>:null}
 </svg></ProjectedSurface>
 {placed(g,12,'plates')?ids.map((id,i)=><ProjectedSurface key={id} className="r-press-motion" quad={quad(i===slot?bed:stock)} width={i===slot?1000:900} height={i===slot?1000:400}><svg viewBox={i===slot?'0 0 1000 1000':'0 0 900 400'} width="100%" height="100%">
 <g transform={i===slot?`rotate(${v[i]*90} 500 500)`:undefined}>{i===slot?<svg x="110" y="327" width="780" height="346"><PlateArtwork index={id}/></svg>:<PlateArtwork index={id}/>}</g>
 {!wide?<PhotoControl label={i===slot?'版を四分の一回転する':'もう一枚の版に替える'} rect={i===slot?(v[i]%2?[327,110,346,780]:[110,327,780,346]):[0,0,900,400]} enabled={enabled&&!down} onActivate={()=>i===slot?(g.selected==='weights'?material('weights'):change(slot,4)):act({type:'p-press-select',id:12,slot:i as 0|1})}/>:null}
 </svg></ProjectedSurface>):null}
 <ProjectedSurface className="r-press-motion" quad={quad(down?bedPart(110+(v[3]-1)*52,327,780,346):shelf)} width={970} height={460}><div className="r-press-paper-turn" style={{transform:down?'rotateY(180deg)':'rotateY(0deg)'}}><div className="r-press-paper-front"><PrintedSheet layers={g.print.layers} face={v[2]}/></div><div className="r-press-paper-back"><PrintedSheet layers={g.print.layers} face={1-v[2]}/></div></div><svg className="r-press-paper-hit" viewBox="0 0 970 460" width="100%" height="100%">{!wide?<PhotoControl label={down?'紙を持ち上げる':'紙を版に重ねる'} rect={[0,0,970,460]} enabled={enabled&&placed(g,12,'plates')} onActivate={()=>act({type:'p-press-paper',id:12})}/>:null}</svg></ProjectedSurface>
 <ProjectedSurface quad={quad(bed)} width={1000} height={1000}><svg viewBox="0 0 1000 1000" width="100%" height="100%">
 {placed(g,12,'weights')?<><PhotoSprite name="press-weight" x={150} y={260} width={700} height={85}/><PhotoSprite name="press-weight" x={150} y={655} width={700} height={85}/></>:null}
 {!wide?<PhotoControl label={placed(g,12,'weights')?'押さえを取り外す':'押さえを台へ置く'} rect={[150,245,700,95]} enabled={enabled&&!down} onActivate={()=>material('weights')}/>:null}
 </svg></ProjectedSurface>
 <ProjectedSurface quad={quad([[1410,510],[1548,510],[1612,574],[1475,580]])} width={970} height={460}><svg viewBox="0 0 970 460" width="100%" height="100%"><g transform="translate(0 7)"><PrintedSheet layers={[]}/></g><PrintedSheet layers={[]}/>{!wide?<PhotoControl label="新しい試し紙に換える" rect={[0,0,970,460]} enabled={enabled} onActivate={()=>act({type:'p-new-sheet',id:12})}/>:null}</svg></ProjectedSurface>
 <ProjectedSurface quad={quad([[0,0],[1672,0],[1672,941],[0,941]])} width={1672} height={941}><svg className="r-press-controls" viewBox="0 0 1672 941" preserveAspectRatio="none">
 {placed(g,12,'register')?<PhotoSprite name="paper-strip" group="items" x={507} y={751} width={459} height={17}/>:null}
 {placed(g,12,'pin')?<g transform="translate(1 -17) rotate(-62 427 706)"><PhotoSprite name="pin" group="items" x={397} y={648} width={60} height={58}/></g>:null}
 {!wide?<><PhotoControl label={placed(g,12,'pin')?'紙止めを外す':'紙止めを差す'} rect={[371,630,105,112]} enabled={enabled&&!down} onActivate={()=>material('pin')}/><PhotoControl label={placed(g,12,'register')?'位置決め片を取り外す':'溝へ位置決め片を置く'} rect={[503,748,460,59]} enabled={enabled&&!down} onActivate={()=>material('register')}/></>:null}
 </svg></ProjectedSurface>
 </div>;
}
