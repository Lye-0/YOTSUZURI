import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const input=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const masterRoot=process.argv[3];
if(!masterRoot)throw Error('Provide research masters directory');
for(const a of input.filter(a=>a.group==='parts')){const metadata=await sharp(a.source).metadata();if(!metadata.hasAlpha||(await sharp(a.source).stats()).channels.at(-1).min===255)throw Error(`Photographic component ${a.id} requires actual transparent pixels; candidate was not imported`);}
const previous=JSON.parse(await fs.readFile('docs/remake/manifest.json','utf8').catch(()=> '[]'));
const manifest=previous.filter(a=>!input.some(b=>a.id===b.id&&a.group===b.group));
for(const a of input){const relative=a.group+'/'+a.id;const target='public/remake/'+relative+'.webp';const master=path.join(masterRoot,relative+'.png');await fs.mkdir(path.dirname(target),{recursive:true});await fs.mkdir(path.dirname(master),{recursive:true});await fs.copyFile(a.source,master);await sharp(a.source).webp({quality:91,effort:6}).toFile(target);const info=await sharp(target).metadata();manifest.push({id:a.id,group:a.group,path:target.replace('public/',''),width:info.width,height:info.height,alpha:info.hasAlpha,bytes:(await fs.stat(target)).size,source:path.basename(a.source),master:relative+'.png'});}
for(const a of manifest.filter(a=>a.alpha&&!a.bounds)){
const {data,info}=await sharp('public/'+a.path).ensureAlpha().raw().toBuffer({resolveWithObject:true});let x0=info.width,y0=info.height,x1=-1,y1=-1;
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
a.bounds=x1<0?[0,0,info.width,info.height]:[x0,y0,x1-x0+1,y1-y0+1];
}
const parts=Object.fromEntries(manifest.filter(a=>a.alpha).map(a=>[a.group+'/'+a.id,{width:a.width,height:a.height,bounds:a.bounds}]));
await fs.writeFile('src/remake/photoBounds.ts','// Generated from accepted photographs by scripts/import-remake.mjs.\nexport const photoBounds:Record<string,{width:number;height:number;bounds:[number,number,number,number]}>= '+JSON.stringify(parts,null,2)+';\n');
await fs.writeFile('docs/remake/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log({count:manifest.length,MiB:+(manifest.reduce((s,a)=>s+a.bytes,0)/1048576).toFixed(2)});
