import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,it,expect} from 'vitest';
import {initial,type World,type Focus} from './campaign';
import {sceneFiles,mainPhoto} from './sceneFiles';
import {photoBounds} from './photoBounds';
describe('写真フレームの依存',()=>{
it('序盤の開閉と部分取得に必要な全写真が存在する',()=>{
const foci:Record<number,Focus[]>={0:['room','box','book','lock','notice','front','passage','object:1'],1:['room','office-tickets','object:2','object:3','object:26'],2:['room','object:4','object:5','object:6','object:7'],3:['room','object:8','object:10'],4:['room','object:12']};
for(const room of [0,1,2,3,4])for(const facing of [0,1,2,3] as const)for(const focus of foci[room])for(const opened of [[],[1,2,3,4,7,8,26]])for(const collected of [[],['receipts','folios','knife','card-diamond','weights'] as const]){
const g:World={...initial(),room,facing,focus,opened,collected:[...collected],boxOpen:opened.length>0,latchUp:true,keyTaken:true,keyInserted:true,doorUnlocked:true,doorOpen:true,bookOpen:true,inventory:['card','card-moon','receipts','folios','knife','lens','register','keyparts']};
for(const path of sceneFiles(g))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
});
it('写真部品に透過と切り出し情報があり、途中の原版収納も描ける',()=>{
const manifest=JSON.parse(readFileSync('docs/remake/manifest.json','utf8')) as {group:string;id:string;alpha:boolean}[];
for(const asset of manifest.filter(a=>a.group==='parts')){expect(asset.alpha,asset.id).toBe(true);expect(photoBounds[`parts/${asset.id}`],asset.id).toBeDefined();}
for(let i=0;i<4;i++)for(const path of sceneFiles({...initial(),room:3,facing:3,focus:'object:10',flags:{[`drawer:10:${i}`]:true},inventory:['plates'],itemValues:{plates:[i]}}))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
});
it('操作前後の写真を同じ対象の状態から選ぶ',()=>{const g:World={...initial(),room:1,facing:1,focus:'object:2',opened:[2]};expect(mainPhoto(g)).toContain('p02-open-full');expect(mainPhoto({...g,collected:['receipts']})).toContain('p02-open-empty');expect(sceneFiles({...initial(),room:2,facing:0,opened:[4,7]})).toEqual(expect.arrayContaining(['/remake/scenes/proof/north-box-open.webp','/remake/scenes/proof/north-door-open.webp']))});
});
