import { asset } from './data';
import type { Game } from './engine';
type Patch={room:number;image:string;box:[number,number,number,number];when:(g:Game)=>boolean};
const patches:Patch[]=[
{room:1,image:'office-state',box:[38,79,31,21],when:g=>g.opened.includes(2)},
{room:1,image:'office-state',box:[73,59,11,18],when:g=>g.opened.includes(26)},
{room:2,image:'proof-state',box:[3,49,25,39],when:g=>g.opened.includes(4)},
{room:5,image:'binding-state',box:[5,46,23,37],when:g=>g.opened.includes(9)},
{room:5,image:'binding-state',box:[29,38,29,27],when:g=>g.collected.includes('thread')&&g.collected.includes('needle')},
{room:5,image:'binding-state',box:[36,59,36,36],when:g=>g.collected.includes('clamp')},
{room:7,image:'east-state',box:[21,58,32,28],when:g=>g.collected.includes('gatherings')},
{room:7,image:'east-state',box:[72,65,21,15],when:g=>g.opened.includes(19)},
{room:9,image:'vault-state',box:[34,64,31,25],when:g=>g.collected.includes('frame')}
];
export function SceneChanges({g}:{g:Game}){return <>{patches.filter(p=>p.room===g.room&&p.when(g)).map((p,i)=>{const [x,y,w,h]=p.box;return <img key={i} className="scene-patch" src={asset(p.image)} alt="" draggable={false} style={{clipPath:`inset(${y}% ${100-x-w}% ${100-y-h}% ${x}%)`}}/>})}</>}
