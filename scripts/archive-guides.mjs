import fs from 'node:fs/promises';
import {archiveRoom,shelfSpecs,initialShelves,canMoveShelf,archivePassable,shelfRect} from '../src/remake/archiveSpace.ts';
const root='docs/remake/archive-guides';await fs.mkdir(root,{recursive:true});
const wrap=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const wall=(key,width,door,window=false,lamp=false)=>{
 const w=width*300,h=840;let body=`<rect width="${w}" height="840" fill="#a49a82"/><rect y="540" width="${w}" height="300" fill="#40382c"/>`;
 for(let x=18;x<w;x+=65)body+=`<path d="M${x} 558V823" stroke="#554836" stroke-width="3"/>`;
 body+=`<path d="M0 0H${w}V840H0Z" fill="none" stroke="#30291f" stroke-width="32"/><path d="M0 541H${w}" stroke="#30291f" stroke-width="22"/>`;
 if(window){body+='<rect x="404" y="119" width="347" height="332" fill="#342a21"/><rect x="420" y="135" width="315" height="300" fill="#293945"/><path d="M577.5 135V435M420 285H735" stroke="#463929" stroke-width="16"/>';}
 if(door){const [a,b,closed]=door,x=a*300,dw=(b-a)*300;body+=`<rect x="${x-18}" y="198" width="${dw+36}" height="642" fill="#30291f"/><rect x="${x}" y="216" width="${dw}" height="624" fill="${closed?'#45372b':'#101110'}"/>`;if(closed){for(let k=1;k<7;k++)body+=`<path d="M${x+dw*k/7} 226V829" stroke="#33291f" stroke-width="3"/>`;body+=`<circle cx="${x+dw-37}" cy="531" r="12" fill="#51482f"/>`;}}
 if(lamp)body+='<path d="M210 178V237M188 174H232L245 217H175Z" fill="#806a3a" stroke="#403623" stroke-width="5"/><ellipse cx="210" cy="215" rx="26" ry="10" fill="#d8b461"/>';
 return fs.writeFile(`${root}/wall-${key}.svg`,wrap(w,h,body));
};
await wall('north',4.2,null,true);await wall('east',5.2,[...archiveRoom.eastDoor,true]);await wall('south',4.2,[4.2-archiveRoom.southDoor[1],4.2-archiveRoom.southDoor[0],false]);await wall('west',5.2,[5.2-archiveRoom.westDoor[1],5.2-archiveRoom.westDoor[0],false],false,true);
let plan='<rect width="600" height="720" fill="#ece8dc"/><g transform="translate(75 80)"><rect width="420" height="520" fill="#d4c5ab" stroke="#514535" stroke-width="5"/>';
for(const [i,v]of initialShelves().entries()){const r=shelfRect(initialShelves(),i);plan+=`<rect x="${r.x*100}" y="${r.y*100}" width="${r.width*100}" height="${r.depth*100}" fill="${['#829d87','#9f8473','#a29b70','#7d8a9d'][i]}" stroke="#34382f" stroke-width="2"/><text x="${(r.x+r.width/2)*100}" y="${(r.y+r.depth/2)*100}" text-anchor="middle" font-family="sans-serif" font-size="20">${shelfSpecs[i].key.toUpperCase()}</text>`;}
plan+='<circle cx="230" cy="300" r="12" fill="#504434"/><path d="M230 275V239m-8 12l8 -12l8 12" fill="none" stroke="#504434" stroke-width="3"/><path d="M140 0H245" stroke="#5793b5" stroke-width="8"/><path d="M420 292.5V406.25M0 258.375V380.25M140 520H245" stroke="#93587a" stroke-width="8"/></g><g fill="#453d32" font-family="sans-serif" font-size="17"><text x="75" y="35">EAST ARCHIVE · 4.2 × 5.2 m</text><text x="75" y="650">A: N–S / B: N–S / C: E–W / D: E–W</text><text x="75" y="681">Camera: (2.3, 3.0), height 1.6 m</text></g>';
await fs.writeFile(`${root}/floorplan.svg`,wrap(600,720,plan));
const queue=[initialShelves()],seen=new Set([queue[0].join(',')]);let goals=0;
for(let k=0;k<queue.length;k++){const v=queue[k];if(archivePassable(v))goals++;for(let i=0;i<4;i++)for(let p=0;p<shelfSpecs[i].stops.length;p++)if(canMoveShelf(v,i,p)){const n=v.map((a,j)=>i===j?p:a),key=n.join(',');if(!seen.has(key)){seen.add(key);queue.push(n);}}}
console.log({reachable:queue.length,passable:goals});
