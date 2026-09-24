import type {InkWindow} from './PhotoDigits';
import type {World} from './campaign';
import {value} from './campaign';
export const officeDrums:Record<number,{closed:InkWindow[];open:InkWindow[];wide:InkWindow[];offset:number}>={
2:{offset:0,closed:[43.9,48.9,54].map(x=>({x,y:43,width:2.2,height:7.1})),open:[44.2,48.8,53.3].map(x=>({x,y:69.2,width:2,height:6.3})),wide:[50.05,50.92,51.82].map(x=>({x,y:64.05,width:.38,height:1.3}))},
3:{offset:3,closed:[45.35,47.94,50.53,53.11].map(x=>({x,y:48.5,width:1.4,height:5.4})),open:[45,47.82,50.55,53.35].map(x=>({x,y:69.5,width:1.4,height:5.4})),wide:[48.6,49.4,50.2,51].map(x=>({x,y:56.8,width:.38,height:1.4}))},
26:{offset:0,closed:[42.9,48.5,54.2,59.8].map(x=>({x,y:61.5,width:2.8,height:5.9})),open:[42.9,48.5,54.2,59.8].map(x=>({x,y:61.5,width:2.8,height:5.9})),wide:[65.85,66.64,67.48,68.29].map(x=>({x,y:56.22,width:.39,height:1.12}))},
};
export function drumValues(g:World,id:number){return value(g,id).slice(officeDrums[id].offset)}
export function turnDrum(g:World,id:number,index:number){const values=[...value(g,id)];const slot=index+officeDrums[id].offset;values[slot]=(values[slot]+1)%10;return values;}
