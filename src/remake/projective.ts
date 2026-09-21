export type Point=readonly [number,number];
export type Quad=readonly [Point,Point,Point,Point];
export function homography(width:number,height:number,q:Quad){
const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=q,dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
let g=0,h=0;
if(Math.abs(dx3)+Math.abs(dy3)>1e-9){const det=dx1*dy2-dx2*dy1;if(Math.abs(det)<1e-9)throw new Error('Degenerate photograph plane');g=(dx3*dy2-dx2*dy3)/det;h=(dx1*dy3-dx3*dy1)/det;}
return [(x1-x0+g*x1)/width,(x3-x0+h*x3)/height,x0,(y1-y0+g*y1)/width,(y3-y0+h*y3)/height,y0,g/width,h/height] as const;
}
export function project(p:Point,m:ReturnType<typeof homography>):Point{const [a,b,c,d,e,f,g,h]=m,den=g*p[0]+h*p[1]+1;return[(a*p[0]+b*p[1]+c)/den,(d*p[0]+e*p[1]+f)/den]}
export function cssProjection(width:number,height:number,q:Quad){const [a,b,c,d,e,f,g,h]=homography(width,height,q);return `matrix3d(${[a,d,0,g,b,e,0,h,0,0,1,0,c,f,0,1].join(',')})`}
export function betweenQuads(from:Quad,to:Quad){
const [a,b,c,d,e,f,g,h]=homography(1,1,from),det=a*(e-f*h)-b*(d-f*g)+c*(d*h-e*g);if(Math.abs(det)<1e-12)throw new Error('Degenerate source plane');
const inv=[e-f*h,c*h-b,b*f-c*e,f*g-d,a-c*g,c*d-a*f,d*h-e*g,b*g-a*h,a*e-b*d].map(n=>n/det),dest=[...homography(1,1,to),1];
const m=Array.from({length:9},(_,i)=>{const row=Math.floor(i/3),col=i%3;return[0,1,2].reduce((s,k)=>s+dest[row*3+k]*inv[k*3+col],0)});return m.slice(0,8).map(n=>n/m[8]) as unknown as ReturnType<typeof homography>;
}
export function cssQuadProjection(from:Quad,to:Quad){const [a,b,c,d,e,f,g,h]=betweenQuads(from,to);return `matrix3d(${[a,d,0,g,b,e,0,h,0,0,1,0,c,f,0,1].join(',')})`}
