import type {World} from './campaign';
// Front stitches join the two holes of a station. These back runs connect stations.
export const threadBackLinks=[[0,3],[3,1],[1,4],[4,2]] as const;
export const threadBackPaths=[
 'M810 289 C640 230 480 550 730 656 C850 700 1100 550 866 523',
 'M806 523 C610 550 590 405 760 405 C1080 405 1100 345 864 365',
 'M808 365 C600 340 520 715 810 710 C1170 720 1000 650 867 609',
 'M806 609 C570 665 550 485 770 485 C1130 485 1180 408 865 443',
] as const;
export const threadTail=2;
export function unravelOrder(){const order:number[]=[threadTail];while(order.length<5){const previous=threadBackLinks.find(([,to])=>to===order.at(-1));if(!previous||order.includes(previous[0]))throw Error('Thread must be one open continuous path');order.push(previous[0]);}return order;}
export const threadOrder=unravelOrder();
export function threadProgress(g:World){if(g.solved.includes(13)||g.collected.includes('needle')||g.collected.includes('thread'))return 5;const seq=g.sequences[13]??[];let n=0;while(n<5&&seq[n]===threadOrder[n])n++;return n;}
export function threadPhoto(g:World){const progress=threadProgress(g);return g.flags['thread:back']?`p13-back-${Math.min(progress,4)}`:progress===5?'p13-front-empty':'p13-front';}
export type ThreadAction={type:'p-thread-flip';id:13}|{type:'p-thread-pull';id:13;station:number};
export function applyThread(s:World,a:ThreadAction):{world:World;message?:string}{
 if(s.room!==5||s.facing!==0||s.focus!=='object:13')return{world:s};
 const g=structuredClone(s);
 if(a.type==='p-thread-flip'){g.flags['thread:back']=!g.flags['thread:back'];return{world:g};}
 const progress=threadProgress(g);if(progress===5||!Number.isInteger(a.station)||a.station<0||a.station>4)return{world:s};
 if(a.station!==threadOrder[progress])return{world:s,message:'糸が張って、動かない。'};
 g.sequences[13]=threadOrder.slice(0,progress+1);
 if(progress===4&&!g.solved.includes(13))g.solved.push(13);
 return{world:g};
}
