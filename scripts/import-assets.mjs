import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const entries=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const manifest=[];
for(const a of entries){const target=`public/assets/${a.category}/${a.id}.webp`;await fs.mkdir(path.dirname(target),{recursive:true});await sharp(a.source).webp({quality:88,effort:6}).toFile(target);const m=await sharp(target).metadata();manifest.push({id:a.id,path:target.replace('public/',''),width:m.width,height:m.height,bytes:(await fs.stat(target)).size,source:path.basename(a.source),generator:'OpenAI imagegen',accepted:true});}
await fs.mkdir('docs',{recursive:true});await fs.writeFile('docs/assets.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`${manifest.length} accepted assets imported`);
