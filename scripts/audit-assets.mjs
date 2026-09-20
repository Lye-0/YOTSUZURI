import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile('docs/assets.json','utf8'));
const names=new Set();let bytes=0;
for(const a of manifest){if(names.has(a.path)||!a.accepted)throw Error('Duplicate or unaccepted '+a.path);names.add(a.path);const p=path.join('public',a.path),s=await fs.stat(p),m=await sharp(p).metadata();if(s.size!==a.bytes||m.width!==a.width||m.height!==a.height)throw Error('Manifest mismatch '+p);bytes+=s.size;}
for(const p of await fs.readdir('public/assets',{recursive:true})){if(/\.(png|jpe?g|webp)$/i.test(p)&&!names.has('assets/'+p.replaceAll('\\','/')))throw Error('Unregistered image '+p);}
for(const id of ['reception','office','proof','type','press','binding','west','east','repair','vault','exit','ending','reception-open','type-open','west-open','repair-open','paper','workbench','foreedge','ring','knife','lens','key','thread'])if(!manifest.some(a=>a.id===id))throw Error('Missing runtime image '+id);
for(const id of ['ring','lens','thread'])if(!(await sharp('public/'+manifest.find(a=>a.id===id).path).metadata()).hasAlpha)throw Error('Transparent cutout lost alpha: '+id);
console.log(JSON.stringify({acceptedImages:manifest.length,totalMiB:+(bytes/1048576).toFixed(2),unregisteredImages:0},null,2));
