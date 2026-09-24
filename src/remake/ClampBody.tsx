import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {FrameBody,joinerySpace} from './FrameBody';
import {validJoinery} from './joinery';
import {clampValues,clampPlatenHeight,camAxes,camCentre,camRadius,platenPose,platenSize} from './clamp';
const group='parts/clamp',wood:PhotoTexture={id:'platen-top',group,crop:[.2,.2,.6,.5]},iron:PhotoTexture={id:'iron-arch',group,crop:[.28,.19,.30,.04]},steel:PhotoTexture={id:'cam-disc',group,crop:[.47,.25,.12,.13]};
function Collar(){const r=.023,texture={id:'iron-arch',group,crop:[.45,.075,.10,.030] as const};return <>
 {Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,b=(i+1)*Math.PI/12,x0=.22+r*Math.cos(a),y0=.19+r*Math.sin(a),x1=.22+r*Math.cos(b),y1=.19+r*Math.sin(b);return <Face key={i} x={x1} y={y1} z={.357} width={Math.hypot(x1-x0,y1-y0)} height={.027} turn={Math.atan2(y1-y0,x0-x1)*180/Math.PI}><Photograph {...texture} crop={[.45+i*.1/24,.075,.1/24,.030]}/></Face>})}
 <Face x={.22-r} y={.19-r} z={.357} width={r*2} height={r*2} tilt={90} resolution={8}><div style={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden'}}><Photograph {...texture}/><div style={{position:'absolute',inset:'24%',borderRadius:'50%',background:'#100d08'}}/></div></Face>
 </>;}
function Cam({g,index,z}:{g:World;index:number;z:number}){const v=clampValues(g),[x,y]=camCentre(v,index),axis=camAxes[index],r=camRadius;return <>
 <div style={{...joinerySpace,transform:`translate3d(${x*500}px,${-z*500}px,${y*500}px) rotateY(${-v[index]*90}deg)`}}>
 <Face x={-r} y={-r} z={.034} width={r*2} height={r*2} tilt={90} resolution={14}><Photograph id="cam-disc" group={group}/></Face>
 {Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,b=(i+1)*Math.PI/12,x0=r*Math.cos(a),y0=r*Math.sin(a),x1=r*Math.cos(b),y1=r*Math.sin(b);return <Face key={i} x={x1} y={y1} z={.034} width={Math.hypot(x1-x0,y1-y0)} height={.010} turn={Math.atan2(y1-y0,x0-x1)*180/Math.PI}><Photograph {...steel}/></Face>})}
 </div>
 <Face x={axis[0]-.007} y={axis[1]-.007} z={z+.041} width={.014} height={.014} tilt={90} resolution={12}><Photograph id="cam-disc" group={group} crop={[.837,.448,.101,.095]} clip="circle(49%)"/></Face>
 </>;}
export function ClampBody({g,frame=false,platenHeight,children}:{g:World;frame?:boolean;platenHeight?:number;children?:import('react').ReactNode}){const v=clampValues(g),p=platenPose(v),z=platenHeight??clampPlatenHeight(g),frameValues=validJoinery(g.itemValues.frame)?g.itemValues.frame:[0,1,2,3,0,1,2,3,0,0,0,0];return <>
 <PhotoCuboid x={0} y={0} z={0} width={.44} depth={.38} height={.020} texture={wood} top={{id:'base-top',group}} insetEdges={.002}/>
 {frame?<div style={{...joinerySpace,transform:'translate3d(20px,-10px,20px)'}}><FrameBody values={frameValues}/></div>:null}
 {children}
 <PhotoCuboid x={.015} y={.15} z={.02} width={.025} depth={.08} height={.30} texture={iron}/><PhotoCuboid x={.400} y={.15} z={.02} width={.025} depth={.08} height={.30} texture={iron}/>
 <PhotoCuboid x={.015} y={.15} z={.285} width={.41} depth={.08} height={.045} texture={iron}/>
 <Face x={.01} y={.235} z={.36} width={.42} height={.34} resolution={4}><Photograph id="iron-arch" group={group} clip="inset(8.2% 0 0 0)"/></Face>
 <Face x={.43} y={.145} z={.36} width={.42} height={.34} turn={180} resolution={4}><Photograph id="iron-arch" group={group} mirror clip="inset(8.2% 0 0 0)"/></Face>
 <Collar/>
 <div style={{...joinerySpace,transform:`translate3d(${p.x*500}px,${-z*500}px,${p.y*500}px) rotateY(${-p.angle}deg)`}}><PhotoCuboid x={0} y={0} z={0} width={platenSize.width} depth={platenSize.depth} height={platenSize.height} texture={wood} top={{id:'platen-top',group}} insetEdges={.001}/><PhotoCuboid x={0} y={0} z={.020} width={.003} depth={platenSize.depth} height={.017} texture={steel}/><PhotoCuboid x={0} y={0} z={.020} width={platenSize.width} depth={.003} height={.017} texture={steel}/><Face x={.114} y={.084} z={.022} width={.068} height={.068} tilt={90} resolution={12}><Photograph id="pressure-socket" group={group}/></Face></div>
 <PhotoCuboid x={.032} y={.04} z={z+.020} width={.012} depth={.282} height={.008} texture={iron}/><PhotoCuboid x={.032} y={.04} z={z+.020} width={.380} depth={.014} height={.008} texture={iron}/><PhotoCuboid x={.400} y={.04} z={z+.020} width={.012} depth={.19} height={.008} texture={iron}/>
 {camAxes.map((axis,i)=><div key={i} style={{display:'contents'}}><PhotoCuboid x={axis[0]-.007} y={axis[1]-.018} z={z+.020} width={.014} depth={.036} height={.004} texture={iron}/><PhotoCuboid x={axis[0]-.003} y={axis[1]-.003} z={z+.024} width={.006} depth={.006} height={.016} texture={iron}/><Cam g={g} index={i} z={z}/></div>)}
 <Face x={.149} y={.194} z={z+.40} width={.142} height={.38} resolution={6}><Photograph id="spindle" group={group}/></Face>
 <Face x={.291} y={.186} z={z+.40} width={.142} height={.38} turn={180} resolution={6}><Photograph id="spindle" group={group} mirror/></Face>
 </>;}
