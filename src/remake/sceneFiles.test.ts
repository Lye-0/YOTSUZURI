import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,it,expect} from 'vitest';
import {initial,type World,type Focus} from './campaign';
import {sceneFiles,mainPhoto} from './sceneFiles';
import {photoBounds} from './photoBounds';
import {threadOrder} from './threading';
import {validKeeper} from './keeper';
import {initialTrim} from './trimming';
describe('写真フレームの依存',()=>{
it('序盤の開閉と部分取得に必要な全写真が存在する',()=>{
const foci:Record<number,Focus[]>={0:['room','box','book','lock','notice','front','passage','object:1'],1:['room','office-tickets','object:2','object:3','object:26'],2:['room','object:4','object:5','object:6','object:7'],3:['room','object:8','object:10'],4:['room','object:11','object:12','press-samples'],5:['room','object:13']};
for(const room of [0,1,2,3,4,5])for(const facing of [0,1,2,3] as const)for(const focus of foci[room])for(const opened of [[],[1,2,3,4,7,8,11,26]])for(const collected of [[],['receipts','folios','knife','card-diamond','weights'] as const]){
const g:World={...initial(),room,facing,focus,opened,collected:[...collected],boxOpen:opened.length>0,latchUp:true,keyTaken:true,keyInserted:true,doorUnlocked:true,doorOpen:true,bookOpen:true,inventory:['card','card-moon','receipts','folios','knife','lens','register','keyparts']};
for(const path of sceneFiles(g))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
});
it('写真部品に透過と切り出し情報があり、途中の原版収納も描ける',()=>{
const manifest=JSON.parse(readFileSync('docs/remake/manifest.json','utf8')) as {group:string;id:string;alpha:boolean}[];
for(const asset of manifest.filter(a=>a.group==='parts')){expect(asset.alpha,asset.id).toBe(true);expect(photoBounds[`parts/${asset.id}`],asset.id).toBeDefined();}
for(let i=0;i<4;i++)for(const path of sceneFiles({...initial(),room:3,facing:3,focus:'object:10',flags:{[`drawer:10:${i}`]:true},inventory:['plates'],itemValues:{plates:[i]}}))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
});
it('綴じ見本の表裏・全ての途中段階・部分回収の写真が存在する',()=>{
for(let n=0;n<=5;n++)for(const back of [false,true])for(const collected of [[],['needle'],['thread'],['needle','thread']])for(const focus of ['room','object:13'] as const){
 const g:World={...initial(),room:5,facing:0,focus,sequences:{13:threadOrder.slice(0,n)},flags:{'thread:back':back},collected:collected as World['collected']};
 for(const path of sceneFiles(g))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
expect(photoBounds['items/needle']).toBeDefined();expect(photoBounds['items/thread']).toBeDefined();
});
it('連動箱の八つの途中状態と開閉・取得状態の写真が存在する',()=>{
for(let mask=0;mask<8;mask++)for(const open of mask===0?[false,true]:[false])for(const taken of open?[false,true]:[false]){
const g:World={...initial(),room:4,facing:2,focus:'object:11',values:{11:[mask,0]},opened:open?[11]:[],collected:taken?['pin']:[]};
for(const path of sceneFiles(g))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
});
it('封印の接写・部分取得・隣室の戸口に必要な写真が存在する',()=>{
for(const opened of [[],[9]])for(const collected of [[],['corner'],['threadchart'],['corner','threadchart']])for(const [room,facing,focus] of [[5,3,'object:9'],[5,3,'room'],[3,3,'room'],[4,3,'room']] as const){
const g:World={...initial(),room,facing,focus,opened,collected:collected as World['collected']};
for(const path of sceneFiles(g))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
});
it('保守戸の途中位置・受け皿・開閉写真がそろっている',()=>{
for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)for(let mask=0;mask<8;mask++){
const values=[a,b,c,...[0,1,2].map(i=>(mask>>i)&1)];if(!validKeeper(values))continue;
for(const focus of ['room','object:15'] as const)for(const leaf of mask===7?[false,true]:[false]){
const g:World={...initial(),room:3,facing:0,focus,values:{15:values},flags:{'keeper:leaf':leaf},opened:leaf?[15]:[]};
for(const path of sceneFiles(g))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
}
});
it('図面の組み合わせ・持ち出し・角当ての所在を描ける',()=>{
for(const candidate of [-1,0,1,2])for(const back of [0,1])for(const taken of candidate<0?[false]:[false,true])for(const corner of [false,true]){
const values=initialTrim();values[0]=candidate;values[4]=back;
const g:World={...initial(),room:5,facing:2,focus:'object:14',values:{14:values},flags:{'trim:taken':taken},placed:{14:corner?['corner']:[]},inventory:taken?['oldplan']:[],itemValues:taken?{oldplan:values}:{}};
for(const focus of ['room','object:14'] as const)for(const path of sceneFiles({...g,focus}))expect(existsSync(resolve('public',path.replace(/^\//,''))),path).toBe(true);
}
});
it('操作前後の写真を同じ対象の状態から選ぶ',()=>{const g:World={...initial(),room:1,facing:1,focus:'object:2',opened:[2]};expect(mainPhoto(g)).toContain('p02-open-full');expect(mainPhoto({...g,collected:['receipts']})).toContain('p02-open-empty');expect(sceneFiles({...initial(),room:2,facing:0,opened:[4,7]})).toEqual(expect.arrayContaining(['/remake/scenes/proof/north-box-open.webp','/remake/scenes/proof/north-door-open.webp']))});
});
