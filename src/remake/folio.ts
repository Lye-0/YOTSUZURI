export const folioMarks=[2,1,0,2,3,0,1,3];
export function foldPages(outerA:number,flipA:number,flipB:number){const a=flipA?[2,1,8,7]:[1,2,7,8],b=flipB?[4,3,6,5]:[3,4,5,6],outer=outerA?a:b,inner=outerA?b:a;return[...outer.slice(0,2),...inner,...outer.slice(2)];}
