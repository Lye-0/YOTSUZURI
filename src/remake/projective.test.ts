import {it,expect} from 'vitest';
import {homography,project,betweenQuads,type Quad} from './projective';
it('写真上の斜めの四隅に、同じ紙面の四隅が一致する',()=>{const q:Quad=[[310,220],[1230,310],[1190,665],[280,610]],m=homography(900,338,q);for(const [i,p]of ([[0,0],[900,0],[900,338],[0,338]] as const).entries()){const actual=project(p,m);expect(actual[0]).toBeCloseTo(q[i][0],8);expect(actual[1]).toBeCloseTo(q[i][1],8)}});
it('撮影された台形そのものを別の写真面へ写す',()=>{const from:Quad=[[231,123],[1418,127],[1634,199],[31,199]],to:Quad=[[569,329],[1202,336],[1144,377],[424,373]],m=betweenQuads(from,to);from.forEach((p,i)=>{const out=project(p,m);expect(out[0]).toBeCloseTo(to[i][0],7);expect(out[1]).toBeCloseTo(to[i][1],7)})});
