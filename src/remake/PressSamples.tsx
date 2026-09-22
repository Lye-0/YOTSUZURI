import {useId} from 'react';
import {ProjectedPhoto,ProjectedSurface} from './ProjectedSurface';
import type {Quad} from './projective';
const paper:Quad[]=[[[323,420],[776,420],[769,720],[289,720]],[[865,420],[1324,420],[1359,720],[850,720]]];
const paperWide:Quad[]=[[[739,507],[874,507],[884,527],[742,527]],[[932,507],[1067,507],[1076,527],[936,527]]];
const stamps:Quad[]=[[[403,148],[699,148],[699,399],[403,399]],[[940,148],[1221,148],[1221,397],[940,397]]];
const stampsWide:Quad[]=[[[777,489],[824,489],[831,502],[779,502]],[[965,489],[1013,489],[1020,502],[968,502]]];
function Impression({negative}:{negative:boolean}){const id=useId().replace(/:/g,'');return <svg viewBox="0 0 450 300" width="100%" height="100%" style={{mixBlendMode:'multiply'}} aria-hidden="true"><defs><mask id={id}><rect width="450" height="300" fill="white"/><path d="M225 50L130 220H320Z" fill="black"/></mask></defs><g fill="#292923" opacity=".85">{negative?<rect x="110" y="35" width="230" height="210" mask={`url(#${id})`}/>:<path d="M225 50L130 220H320Z"/>}</g></svg>}
export function PressSamples({wide=false}:{wide?:boolean}){
 const src=import.meta.env.BASE_URL+'remake/closeups/press-samples.webp';
 if(wide)return <>{[0,1].map(i=><div key={i} className="r-proof-sample-layer"><ProjectedPhoto src={src} sourceQuad={stamps[i]} targetQuad={stampsWide[i]}/><ProjectedPhoto src={src} sourceQuad={paper[i]} targetQuad={paperWide[i]}/><ProjectedSurface quad={paperWide[i]} width={450} height={300}><Impression negative={i===1}/></ProjectedSurface></div>)}</>;
 return <svg className="r-proof-samples" viewBox="250 0 1130 890" preserveAspectRatio="xMidYMid meet" aria-label="凸面と凹面の試し押し" role="img"><image href={src} width="1672" height="941"/><foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}>{paper.map((quad,i)=><ProjectedSurface key={i} quad={quad} width={450} height={300}><Impression negative={i===1}/></ProjectedSurface>)}</div></foreignObject></svg>;
}
