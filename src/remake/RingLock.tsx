import {PhotoObject} from './PhotoObject';
import {value,type World,type Action} from './campaign';
export function RingLock({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
const v=value(g,4),cx=wide?75.8:49.2,cy=wide?54.5:55.8;
const radii=wide?[1.9,1.3]:[13.5,9.2];
return <>{radii.map((w,i)=>{const h=w*1672/941,rect:[number,number,number,number]=[cx-w/2,cy-h/2,w,h],rotation=(v[i]-[3,6][i])*45;return <span key={i}><PhotoObject src={import.meta.env.BASE_URL+`remake/parts/ring-${i?'inner':'outer'}.webp`} rect={rect} transform={`rotate(${rotation}deg)`} brightness={.73}/>{!wide&&!g.opened.includes(4)?<button className="r-target r-ring-target" disabled={!enabled} aria-label={i?'内側の環を回す':'外側の環を回す'} style={{left:rect[0]+'%',top:rect[1]+'%',width:w+'%',height:h+'%',borderRadius:'50%',zIndex:3+i}} onClick={()=>{const values=[...v];values[i]=(values[i]+1)%8;act({type:'p-set',id:4,values})}}/>:null}</span>})}</>;
}
