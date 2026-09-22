import {describe,it,expect} from 'vitest';
import {inkAt,plateContact,sameImpression,targetImpressions,type Impression} from './printing';
describe('実物の接触面から導く二重刷り',()=>{
 it('同じ輪郭の凸版と凹版では接触する場所が逆になる',()=>{
  for(const [x,y] of [[120,70],[450,180],[800,360]])expect(plateContact(0,x,y)).toBe(!plateContact(1,x,y));
 });
 it('裏返しと見当のずれが刷った形を変える',()=>{
  expect(sameImpression(targetImpressions)).toBe(true);
  expect(sameImpression(targetImpressions.map(l=>({...l,face:1})))).toBe(true);
  expect(sameImpression([targetImpressions[0],{...targetImpressions[1],face:1}])).toBe(false);
  expect(sameImpression(targetImpressions.map(l=>({...l,offset:0})))).toBe(false);
  expect(inkAt(targetImpressions[0],900-120,70)).toBe(plateContact(0,120,70));
 });
 it('全候補を比較すると、同じ完成輪郭は表または裏の同じ面に二枚を重ねた場合だけ',()=>{
  const variants=(plate:number)=>{const out:Impression[]=[];for(let rotation=0;rotation<4;rotation++)for(let face=0;face<2;face++)for(let offset=0;offset<3;offset++)out.push({plate,rotation,face,offset});return out;};
  const matches:Impression[][]=[];
  for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)for(const x of variants(a))for(const y of variants(b))if(sameImpression([x,y]))matches.push([x,y]);
  expect(matches).toEqual([targetImpressions,targetImpressions.map(l=>({...l,face:1}))]);
 });
});
