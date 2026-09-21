import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {lightBaffles,lightSource,lightReceiver,mirrorRows,mirrorStops,opticsValues,traceLight,type LightPoint} from './optics';
export const opticalPosition=([x,y]:LightPoint)=>[.10+x*.62,.04+y*.62] as const;
export const opticalBeamZ=.866;
const metal:PhotoTexture={id:'iron-face',group:'parts/optics'},metalTop:PhotoTexture={id:'iron-top',group:'parts/optics'},copper:PhotoTexture={id:'relay',group:'parts/optics',crop:[.24,.2,.16,.35]};
function ContactShadow({x,y,w,d}:{x:number;y:number;w:number;d:number}){return <Face x={x-.006} y={y-.006} z={.8205} width={w+.012} height={d+.012} tilt={90}><div style={{position:'absolute',inset:'5%',background:'#120e0b55',boxShadow:'1px 2px 4px 2px #120e0b55',borderRadius:'8%'}}/></Face>;}
export function OpticalWorld({g}:{g:World}){
 const v=opticsValues(g),ray=traceLight(v),source=opticalPosition(lightSource),receiver=opticalPosition(lightReceiver),open=g.flags['optics:guard'];
 return <>
 {[0,1].map(i=>{const y=opticalPosition([0,mirrorRows[i]])[1],x=opticalPosition([mirrorStops[v[i]],0])[0];return <div key={i} style={{display:'contents'}}>
 <Face x={.16} y={y-.012} z={.821} width={.45} height={.024} tilt={90}><Photograph id="rail"/></Face>
 <PhotoCuboid x={x-.032} y={y-.02} z={.822} width={.064} depth={.04} height={.009} texture={metal} top={metalTop}/>
 <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${x*500}px,0,${y*500}px) rotateY(${v[i+2]===0?45:-45}deg)`}}>
 <PhotoCuboid x={-.0395} y={-.003} z={.831} width={.079} depth={.006} height={.07} texture={metal} top={metalTop}/>
 <Face x={-.0395} y={.0031} z={.901} width={.079} height={.07}><Photograph id="mirror" group="parts/optics"/></Face>
 <Face x={.0395} y={-.0031} z={.901} width={.079} height={.07} turn={180}><Photograph id="mirror" group="parts/optics" mirror/></Face>
 </div>
 </div>;})}
 {lightBaffles.map(([x,y,w,h],i)=>{const p=opticalPosition([x,y]);return <div key={i} style={{display:'contents'}}><ContactShadow x={p[0]} y={p[1]} w={w*.62} d={h*.62}/><PhotoCuboid x={p[0]} y={p[1]} z={.82} width={w*.62} depth={h*.62} height={.09} texture={metal} top={metalTop}/></div>;})}
 <ContactShadow x={source[0]-.04} y={source[1]-.0275} w={.04} d={.055}/>
 <ContactShadow x={receiver[0]} y={receiver[1]-.0275} w={.04} d={.055}/>
 <PhotoCuboid x={source[0]-.04} y={source[1]-.0275} z={.828} width={.04} depth={.055} height={.075} texture={metal} top={metalTop}/>
 <Face x={source[0]+.0001} y={source[1]+.0275} z={.903} width={.055} height={.075} turn={90}><Photograph id="lamp" group="parts/optics"/></Face>
 <PhotoCuboid x={receiver[0]} y={receiver[1]-.0275} z={.82} width={.04} depth={.055} height={.075} texture={metal} top={metalTop}/>
 <Face x={receiver[0]-.0001} y={receiver[1]-.0275} z={.895} width={.055} height={.075} turn={-90}><Photograph id="receiver" group="parts/optics"/>{ray.lit?<div style={{position:'absolute',left:'32%',top:'27%',width:'36%',height:'29%',background:'#f5cb7480',borderRadius:'50%',boxShadow:'0 0 5px 2px #e9b75366',mixBlendMode:'screen'}}/>:null}</Face>
 <Face x={.10} y={.04} z={opticalBeamZ} width={.62} height={.62} tilt={90}><svg viewBox="0 0 1000 1000" width="100%" height="100%"><polyline points={ray.points.map(p=>p.map(n=>n*1000).join(',')).join(' ')} fill="none" stroke="#ffd39a" strokeWidth="10" opacity=".15"/><polyline points={ray.points.map(p=>p.map(n=>n*1000).join(',')).join(' ')} fill="none" stroke="#ffe4b6" strokeWidth="3.5" opacity=".8"/></svg></Face>
 <Face x={receiver[0]+.0401} y={receiver[1]+.014} z={.834} width={.028} height={.012} turn={90}><Photograph id="receiver" group="parts/optics" crop={[396/1074,1250/1464,275/1074,138/1464]}/></Face>
 {[[receiver[0]+.04,.138,.902,.138],[.902,.138,.902,.249],[receiver[0]+.04,.153,.86,.153],[.86,.153,.86,.29],[.86,.29,.962,.29],[.962,.249,.962,.29]].map(([x,y,a,b],i)=><PhotoCuboid key={i} x={Math.min(x,a)} y={Math.min(y,b)} z={.822} width={Math.max(.003,Math.abs(a-x))} depth={Math.max(.003,Math.abs(b-y))} height={.003} texture={copper}/>)}
 {[.902,.962].map(x=><PhotoCuboid key={x} x={x} y={.249} z={.822} width={.003} depth={.003} height={.014} texture={copper}/>)}
 <Face x={.87} y={.247} z={.91} width={.138} height={.0915}><Photograph id="relay" group="parts/optics" crop={[244/2172,55/724,920/2172,610/724]}/></Face>
 <Face x={1.008-(ray.lit?.026:0)} y={.247} z={.901} width={.112} height={.035}><Photograph id="relay" group="parts/optics" crop={[1164/2172,99/724,746/2172,265/724]}/></Face>
 <PhotoCuboid x={1.09} y={.20} z={.82} width={.055} depth={.045} height={.09} texture={metal} top={metalTop}/>
 <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${1.12*500}px,${-.91*500}px,${.247*500}px) rotateZ(${open?-90:0}deg)`}}>
 <Face x={-.0285} y={0} z={.032} width={.42} height={.082}><Photograph id="guard" group="parts/optics"/></Face>
 <Face x={.3915} y={-.006} z={.032} width={.42} height={.082} turn={180}><Photograph id="guard" group="parts/optics" mirror/></Face>
 </div>
 </>;
}
