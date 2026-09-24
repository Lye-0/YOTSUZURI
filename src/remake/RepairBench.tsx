import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
const top:PhotoTexture={id:'worktop',group:'parts/repair'},edge:PhotoTexture={id:'bench-front',group:'parts/repair',crop:[.025,.13,.95,.10]},leg:PhotoTexture={id:'bench-front',group:'parts/repair',crop:[.072,.26,.043,.63]},apron:PhotoTexture={id:'bench-front',group:'parts/repair',crop:[.13,.25,.74,.13]};
export function RepairBench({x,y,turn,width=2.2,depth=.7}:{x:number;y:number;turn:number;width?:number;depth?:number}){return <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${x*500}px,0,${y*500}px) rotateY(${turn}deg)`}}>
 <PhotoCuboid x={0} y={0} z={.76} width={width} depth={depth} height={.06} texture={edge} top={top}/>
 <PhotoCuboid x={.08} y={.08} z={.63} width={width-.16} depth={.045} height={.13} texture={apron}/>
 <PhotoCuboid x={.08} y={depth-.125} z={.63} width={width-.16} depth={.045} height={.13} texture={apron}/>
 <PhotoCuboid x={.08} y={.08} z={.63} width={.045} depth={depth-.16} height={.13} texture={apron}/>
 <PhotoCuboid x={width-.125} y={.08} z={.63} width={.045} depth={depth-.16} height={.13} texture={apron}/>
 {[.08,width-.17].flatMap(x=>[.08,depth-.17].map(y=><PhotoCuboid key={`${x}:${y}`} x={x} y={y} z={0} width={.09} depth={.09} height={.76} texture={leg}/>))}
 </div>;}
