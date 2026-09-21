type Point=readonly [number,number];
/** Split enlarged hit areas at the midpoint between visible objects. */
export function separateTarget(center:Point,peers:Point[],half=22){
 let polygon:Point[]=[[-half,-half],[half,-half],[half,half],[-half,half]];
 for(const peer of peers){const dx=peer[0]-center[0],dy=peer[1]-center[1],limit=(dx*dx+dy*dy)/2;if(limit<.001)continue;const next:Point[]=[];
  for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],da=a[0]*dx+a[1]*dy-limit,db=b[0]*dx+b[1]*dy-limit;if(da<=0)next.push(a);if((da<=0)!==(db<=0)){const t=da/(da-db);next.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}
  polygon=next;
 }
 return `polygon(${polygon.map(([x,y])=>`${(x+half)/(half*2)*100}% ${(y+half)/(half*2)*100}%`).join(',')})`;
}
