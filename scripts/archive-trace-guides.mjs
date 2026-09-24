import fs from 'node:fs/promises';
import sharp from 'sharp';
import {archiveOldPlan,oldFootprint} from '../src/remake/archivePlan.ts';
const root='docs/remake/archive-guides';
for(const room of [6,7]){
 const marks=archiveOldPlan.flatMap((s,i)=>{
  if(s.room!==room)return [];
  const r=oldFootprint(i),x=r.x*250,y=r.y*250,w=r.width*250,h=r.depth*250;
  return [`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c7bda4" stroke="#625447" stroke-width="2"/>`,...[[.04,.06],[.96,.06],[.04,.94],[.96,.94]].map(([a,b])=>`<ellipse cx="${x+w*a}" cy="${y+h*b}" rx="9" ry="6" fill="#504336"/>`)];
 });
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="1300"><rect width="1050" height="1300" fill="#908474"/>${marks.join('')}</svg>`;
 await fs.writeFile(`${root}/floor-traces-${room}.svg`,svg);
 await sharp(Buffer.from(svg)).png().toFile(`${root}/floor-traces-${room}.png`);
}
