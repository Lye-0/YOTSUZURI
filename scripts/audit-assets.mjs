import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile('docs/remake/manifest.json','utf8'));
const names=new Set();let bytes=0;
for(const asset of manifest){if(names.has(asset.path)||!asset.path.startsWith('remake/'))throw Error('Duplicate or invalid asset '+asset.path);names.add(asset.path);const file=path.join('public',asset.path),stat=await fs.stat(file),metadata=await sharp(file).metadata();if(stat.size!==asset.bytes||metadata.width!==asset.width||metadata.height!==asset.height)throw Error('Manifest mismatch: '+file);if(Boolean(metadata.hasAlpha)!==Boolean(asset.alpha))throw Error('Alpha mismatch: '+file);bytes+=stat.size;}
for(const file of await fs.readdir('public',{recursive:true})){if(/\.(png|jpe?g|webp)$/i.test(file)&&!names.has(file.replaceAll('\\','/')))throw Error('Unregistered or retired image: '+file);}
console.log(JSON.stringify({acceptedImages:manifest.length,totalMiB:+(bytes/1048576).toFixed(2),unregisteredImages:0},null,2));
