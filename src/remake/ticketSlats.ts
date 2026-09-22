export type TicketRect=readonly[number,number,number,number];
export const ticketSlats=[
 {rect:[490,180,690,68] as TicketRect,depth:2},
 {rect:[490,275,690,68] as TicketRect,depth:1},
 {rect:[490,370,690,68] as TicketRect,depth:0},
 {rect:[490,465,690,68] as TicketRect,depth:1},
];
// Each tongue is fixed only to its owner's plank. The free end covers another plank's front.
export const ticketKeepers=[
 {owner:0,rect:[1110,212,38,124] as TicketRect,up:false},
 {owner:1,rect:[520,307,38,124] as TicketRect,up:false},
 {owner:3,rect:[1110,382,38,124] as TicketRect,up:true},
];
const overlaps=(a:TicketRect,b:TicketRect)=>a[0]<b[0]+b[2]&&a[0]+a[2]>b[0]&&a[1]<b[1]+b[3]&&a[1]+a[3]>b[1];
export function ticketBlockers(values:readonly number[],index:number){const target=ticketSlats[index];if(!target)return[];return ticketKeepers.filter(k=>k.owner!==index&&!values[k.owner]&&ticketSlats[k.owner].depth>target.depth&&overlaps(k.rect,target.rect)).map(k=>k.owner);}
export const ticketCanLift=(values:readonly number[],index:number)=>Number.isInteger(index)&&index>=0&&index<4&&!values[index]&&ticketBlockers(values,index).length===0;
