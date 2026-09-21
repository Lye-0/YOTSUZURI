import type {World} from './campaign';
import type {ArchiveEye} from './archiveSpace';
import {Face,Photograph,type UV} from './ArchivePhotos';
import {ArchiveBench} from './ArchiveBench';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {WedgeMesh} from './WedgeMesh';
import {bookBands,scaleAngle,spineOpen,weighingValues} from './weighing';
import {weighingTable,scalePivot,beamPoint,panPosition,riderPoint,bookPosition,looseSaddlePosition,weighingLocalEye,saddleRows} from './weighingGeometry';
const M=500,group='parts/weighing';
const tex=(id:string,crop?:UV):PhotoTexture=>({id,group,crop});
const cloth=tex('book-cover',[.22,.23,.5,.5]),pages:PhotoTexture={id:'book-edge-closed',group:'parts',crop:[250/1672,199/941,1300/1672,654/941]};
const metal=tex('support',[545/1145,200/1374,52/1145,800/1374]);
const brass=tex('saddle',[51/1868,190/842,1767/1868,125/842]);
function Saddle({x,y,z}:{x:number;y:number;z:number}){return <>
 <PhotoCuboid x={x} y={y} z={z+.045} width={.228} depth={.035} height={.004} texture={brass}/>
 <PhotoCuboid x={x} y={y} z={z} width={.004} depth={.035} height={.045} texture={brass}/>
 <PhotoCuboid x={x+.224} y={y} z={z} width={.004} depth={.035} height={.045} texture={brass}/>
 </>;}
function SampleBook({g,index}:{g:World;index:number}){const b=bookPosition(g,index),open=index===2&&spineOpen(g),extension=open?.10:0;
 return <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${b.x*M}px,${-b.z*M}px,${b.y*M}px)`}}>
 <Face x={-.005} y={-.005} z={.0005} width={.23} height={.28} tilt={90}><div style={{position:'absolute',inset:0,background:'#100c0855',boxShadow:'0 0 6px 2px #100c0844'}}/></Face>
 <PhotoCuboid x={0} y={0} z={0} width={.22} depth={.27} height={.003} texture={cloth}/>
 <Face x={.002} y={.269} z={.042} width={.216} height={.039}><Photograph {...pages}/></Face>
 <Face x={.218} y={.001} z={.042} width={.216} height={.039} turn={180}><Photograph {...pages}/></Face>
 <Face x={.218} y={.269} z={.042} width={.268} height={.039} turn={90}><Photograph {...pages}/></Face>
 <Face x={.001} y={.001} z={.042} width={.268} height={.039} turn={-90}><Photograph {...(index===2?tex('mouth'):cloth)}/></Face>
 {index===2?<div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translateX(${-extension*M}px)`}}>
 <Face x={0} y={.02} z={.007} width={.1} height={.23} tilt={90}><Photograph id="drawer" group={group}/></Face>
 <PhotoCuboid x={-.003} y={0} z={0} width={.004} depth={.27} height={.045} texture={cloth}/>
 {!g.collected.includes('wedge')?<WedgeMesh x={.015} y={.065} z={.007}/>:null}
 </div>:null}
 <PhotoCuboid x={0} y={0} z={.042} width={.22} depth={.27} height={.003} texture={cloth} top={tex('book-cover')}/>
 <Face x={0} y={0} z={.0452} width={.22} height={.27} tilt={90}><svg viewBox="0 0 220 270" width="100%" height="100%"><text x="110" y="147" fill="#b49a68" opacity=".53" fontFamily="Yu Mincho,serif" fontSize="24" letterSpacing="5" textAnchor="middle">見本</text></svg></Face>
 {bookBands(g,index).map(({index:band,slot})=><Saddle key={band} x={-.004} y={saddleRows[slot]} z={0}/>)}
 </div>;
}
function ScaleSupport(){return <>
 <PhotoCuboid x={.22} y={.16} z={.82} width={.2} depth={.16} height={.04} texture={tex('support',[328/1145,1260/1374,488/1145,95/1374])} top={tex('support',[350/1145,1215/1374,440/1145,40/1374])}/>
 <PhotoCuboid x={.305} y={.225} z={.86} width={.03} depth={.03} height={.34545} texture={metal}/>
 <Face x={.278} y={.27} z={1.29145} width={.084} height={.086}><Photograph id="support" group={group} crop={[514/1145,14/1374,127/1145,134/1374]}/></Face>
 <Face x={.362} y={.215} z={1.29145} width={.084} height={.086} turn={180}><Photograph id="support" group={group} crop={[514/1145,14/1374,127/1145,134/1374]} mirror/></Face>
 <PhotoCuboid x={.313} y={.215} z={1.253} width={.014} depth={.07} height={.014} texture={metal}/>
 </>;}
function Beam({g}:{g:World}){const columns=[{sx:20,sw:445,x:-.191633,w:.152258},{sx:465,sw:186,x:-.039375,w:.081375},{sx:651,sw:1419,x:.042,w:.638}];
 return <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${scalePivot.x*M}px,${-scalePivot.z*M}px,${scalePivot.y*M}px) rotateZ(${scaleAngle(g)}deg)`}}>
 <PhotoCuboid x={-.191633} y={-.018} z={-.0175} width={.871633} depth={.018} height={.035} texture={tex('beam',[700/2092,324/752,1200/2092,44/752])}/>
 {columns.map(c=><div key={c.sx} style={{display:'contents'}}><Face x={c.x} y={0} z={.067375} width={c.w} height={.1365}><Photograph id="beam" group={group} crop={[c.sx/2092,200/752,c.sw/2092,312/752]}/></Face><Face x={c.x+c.w} y={-.018} z={.067375} width={c.w} height={.1365} turn={180}><Photograph id="beam" group={group} crop={[c.sx/2092,200/752,c.sw/2092,312/752]} mirror/></Face></div>)}
 <Face x={0} y={.001} z={.0175} width={.68} height={.035}><svg viewBox="0 0 680 35" width="100%" height="100%" preserveAspectRatio="none"><g fill="#d5c69c" stroke="#d5c69c" opacity=".92">{Array.from({length:17},(_,n)=><g key={n}><path d={`M${45+n*37.5} 1v${n%2?8:12}`} strokeWidth="1.4"/>{n%2===0?<text x={45+n*37.5} y="32" fontSize="18" fontFamily="serif" textAnchor="middle" stroke="none">{n}</text>:null}</g>)}</g></svg></Face>
 </div>;
}
function Pan({g}:{g:World}){const p=panPosition(g),a=beamPoint(g,-.18,-.027);return <>
 <PhotoCuboid x={a[0]-.005} y={a[1]-.005} z={p.z} width={.01} depth={.01} height={.22} texture={metal}/>
 <PhotoCuboid x={p.x} y={p.y} z={p.z-.01} width={.3} depth={.3} height={.01} texture={tex('pan',[.1,.07,.8,.025])} top={tex('pan')}/>
 </>;}
function Poise({g,eye}:{g:World;eye:ArchiveEye}){const p=riderPoint(g),e=weighingLocalEye(eye),angle=Math.atan2(e.x-p[0],e.y-p[1]),w=.055;return <Face x={p[0]-Math.cos(angle)*w/2} y={p[1]+Math.sin(angle)*w/2+.02} z={p[2]+.007} width={w} height={.12} turn={angle*180/Math.PI}><Photograph id="poise" group={group}/></Face>;}
export function WeighingWorld({g,eye}:{g:World;eye:ArchiveEye}){const t=weighingTable,v=weighingValues(g);return <><ArchiveBench x={t.x} y={t.y} turn={90}/><div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${t.x*M}px,0,${t.y*M}px) rotateY(90deg)`}}>
 <ScaleSupport/><Beam g={g}/><Pan g={g}/><Poise g={g} eye={eye}/>
 {[0,1,2,3].map(index=><SampleBook key={index} g={g} index={index}/>)}
 {v.slice(2).map((place,index)=>place<0?<Saddle key={index} {...looseSaddlePosition(g,index)}/>:null)}
 </div></>;}
