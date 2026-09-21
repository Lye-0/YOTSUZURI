import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const input=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const masterRoot=process.argv[3];
if(!masterRoot)throw Error('Provide research masters directory');
const previous=JSON.parse(await fs.readFile('docs/remake/manifest.json','utf8').catch(()=> '[]'));
const manifest=previous.filter(a=>!input.some(b=>a.id===b.id&&a.group===b.group));
for(const a of input){const relative=a.group+'/'+a.id;const target='public/remake/'+relative+'.webp';const master=path.join(masterRoot,relative+'.png');await fs.mkdir(path.dirname(target),{recursive:true});await fs.mkdir(path.dirname(master),{recursive:true});await fs.copyFile(a.source,master);await sharp(a.source).webp({quality:91,effort:6}).toFile(target);const info=await sharp(target).metadata();manifest.push({id:a.id,group:a.group,path:target.replace('public/',''),width:info.width,height:info.height,alpha:info.hasAlpha,bytes:(await fs.stat(target)).size,source:path.basename(a.source),master:relative+'.png'});}
await fs.writeFile('docs/remake/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log({count:manifest.length,MiB:+(manifest.reduce((s,a)=>s+a.bytes,0)/1048576).toFixed(2)});
