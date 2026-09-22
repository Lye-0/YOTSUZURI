import {value,type World} from './campaign';
import {objects,objectById,rooms,itemNames,type CampaignItem} from './catalog';
import {ticketCanLift} from './ticketSlats';
import {matchesNumeric,keyOpens} from './numericRules';
import {interlockMask} from './interlock';
import {canMoveRing,moveRing} from './linkedRings';
import {keeperValues} from './keeper';
import {threadProgress,threadOrder} from './threading';
import {trimFits,trimValues} from './trimming';
import {decodePrint} from './press';
import {sameImpression} from './printing';
import {archivePassable,canMoveShelf,shelfNames,shelfSpecs} from './archiveSpace';
import {envelopeValues} from './envelope';
import {gatheringsTaken,gatheringSources,gatheringValues,matchesOriginalStock} from './gatherings';
import {bookBands,spineOpen} from './weighing';
import {traceLight,opticsValues} from './optics';
import {cradleTaken,cradleReady,cradleValues} from './cradle';
import {correctBookOrder,reconstructedBook} from './book';
import {foreedgeMounted,foreedgeView} from './foreedge';
import {blankStudyValues,missingLeaves} from './blankStudy';
import {frameTaken,joineryReady,joineryValues} from './joinery';
import {tissueTrace,tissueOnMould,rubbingValues} from './rubbing';
import {paperMatchesExit,paperOnExit} from './exitReference';
import {cutawayAligned,cutawayOpen} from './cutaway';
import {clampTaken,clampFits,clampValues} from './clamp';
import {bookAtPress,frameAtPress} from './binding';

type Goal=number|'box'|'door'|'secret'|'exit';
type Base=(g:World)=>string[]|null;
const at=(g:World,id:number,item:CampaignItem)=>!!g.placed[id]?.includes(item);
const has=(g:World,item:CampaignItem)=>g.inventory.includes(item)||Object.values(g.placed).some(items=>items.includes(item))||item==='keyparts'&&!!g.flags.exitKey;
const originalPaper=(g:World)=>gatheringSources(g).every(n=>n<6);
const currentKey=(g:World)=>at(g,30,'keyparts')?value(g,30):g.itemValues.keyparts??[1,1,1,1,1,1];
const traceReady=(g:World)=>tissueTrace(g)[0]===1&&tissueTrace(g)[2]===63;
const directions=['北','東','南','西'];
const labels:Record<number,string>={8:'天秤の台',14:'断裁片の作業台',17:'透かしの作業台',19:'計量台',20:'反射片と留め棒',21:'二枚板の台',22:'小口の見本台',23:'紙標本の作業台',24:'四片の木枠',25:'原型の作業台',30:'製本の作業台'};
const locations:Record<number,string>={12:'印刷室の刷り機',14:'製本室の断裁片の台',21:'修復室の二枚板の台',22:'修復室の南の見本台',23:'原型庫の紙標本の台',25:'原型庫の原型の台',28:'製本室の束の締め具',29:'搬出間の原型の台',30:'搬出間の製本台',31:'搬出間の扉の金具'};

/** Only selects unfinished prerequisites; a solved flag alone never locates a physical item. */
export function nextHintGoal(g:World):Goal{
 if(g.finished||g.flags.exitOpen||g.flags.exitUnlocked||g.flags.exitKey||has(g,'keyparts')&&keyOpens(currentKey(g)))return'exit';
 if(!g.opened.includes(7)){
  if(!has(g,'folios')){
   if(!g.keyTaken&&!g.doorUnlocked)return'box';
   if(!g.doorOpen&&!g.visited.includes(1))return'door';
   if(!has(g,'receipts')){if(!g.opened.includes(2)){if(!g.cardTaken)return'box';if(!has(g,'card-diamond')||!has(g,'card-moon'))return 1;}return 2;}
   return 3;
  }
  if(!has(g,'knife')||!has(g,'lens'))return 4;
  return 7;
 }
 if(g.flags.secret&&!g.visited.includes(9))return'secret';
 if(!has(g,'knife'))return 4;
 if(!g.visited.includes(9)){
  if(!gatheringsTaken(g)||!originalPaper(g)){
   if(!has(g,'proof')||!sameImpression(decodePrint(g.itemValues.proof))){
    if(!has(g,'weights'))return 8;
    if(!has(g,'plates')||!(g.itemValues.plates??[]).includes(0)||!(g.itemValues.plates??[]).includes(3))return 10;
    if(!has(g,'pin'))return 11;
    if(!has(g,'register')||g.itemValues.register?.[0]!==6)return 5;
    return 12;
   }
  }
  if(!cradleTaken(g)&&!has(g,'corner'))return 9;
  if(!has(g,'needle')||!has(g,'thread'))return 13;
  if(!g.visited.includes(8)&&(!has(g,'oldplan')||!trimFits(g.itemValues.oldplan??[])))return 14;
  if(!g.opened.includes(15))return 15;
  if(!has(g,'tissue')||!has(g,'blanks'))return 18;
  if(!gatheringsTaken(g)||!originalPaper(g))return 17;
  if(!cradleTaken(g)&&!has(g,'wedge'))return 19;
  if(!g.visited.includes(8)&&(!archivePassable(value(g,16))||!g.flags['archive:door']))return 16;
  if(!cradleTaken(g))return 21;
  if(!g.flags['optics:guard'])return 20;
  if(!g.solved.includes(22))return 22;
  return'secret';
 }
 if(!has(g,'needle')||!has(g,'thread'))return 13;
 if(!has(g,'tissue')||!has(g,'blanks'))return 18;
 if(!gatheringsTaken(g)||!originalPaper(g))return 17;
 if(!g.solved.includes(23))return 23;
 if(!frameTaken(g)||!has(g,'returnrecord'))return 24;
 if(!has(g,'keyparts'))return 26;
 if(!clampTaken(g))return 28;
 if(!g.solved.includes(27))return 27;
 if(!traceReady(g))return 25;
 if(!g.solved.includes(25))return'exit';
 if(!g.solved.includes(29))return 29;
 return 30;
}

const shelfCache=new Map<string,{index:number;position:number}|null>();
/** One legal next move from the current layout, including layouts reached by backing up. */
export function nextShelfHint(values:number[]){const key=values.join(',');if(shelfCache.has(key))return shelfCache.get(key)!;
 const seen=new Set([key]),queue:{v:number[];first:{index:number;position:number}|null}[]=[{v:values,first:null}];
 for(let head=0;head<queue.length;head++){const {v,first}=queue[head];if(archivePassable(v)){shelfCache.set(key,first);return first;}for(let i=0;i<4;i++)for(const d of[-1,1]){const pos=v[i]+d;if(!canMoveShelf(v,i,pos))continue;const n=[...v];n[i]=pos;const k=n.join(',');if(seen.has(k))continue;seen.add(k);queue.push({v:n,first:first??{index:i,position:pos}})}}shelfCache.set(key,null);return null;
}
function nextRing(mask:number){const queue:{mask:number;first:number}[]=[{mask,first:-1}],seen=new Set([mask]);for(let j=0;j<queue.length;j++){const row=queue[j];if(row.mask===0)return row.first;for(let i=0;i<3;i++)if(canMoveRing(row.mask,i)){const next=moveRing(row.mask,i);if(!seen.has(next)){seen.add(next);queue.push({mask:next,first:row.first<0?i:row.first})}}}return-1;}

export function progressHints(g:World,base:Base,context?:'exit'|'secret'):string[]{
 const located=(item:CampaignItem)=>{const entry=Object.entries(g.placed).find(([,items])=>items.includes(item));if(!entry)return null;const id=+entry[0],o=objectById(id);return{id,place:locations[id]??`${rooms[o?.room??10].name}の${o?.name??'作業台'}`};};
 const need=(item:CampaignItem,id:number,where:string):string[]=>{const n=itemNames[item],loc=located(item);if(g.inventory.includes(item))return[g.selected===item?`選んでいる「${n}」を、${where}へ使う。`:`手元の「${n}」を選んでから、${where}へ使う。`];if(loc)return[`${n}は${loc.place}に置いてある。そこから取り戻して持ってくる。`,...(loc.id===28&&!clampValues(g)[3]?['先に締め具の押さえ板を上げると、枠を取り出せる。']:[]),...(loc.id===12&&g.flags['press:paper-down']?['刷り機の紙を持ち上げてから、部品を外す。']:[]),...(loc.id===22&&item==='cradle'&&at(g,22,'gatherings')?['支持具の上の紙束を先に取り戻す。']:[]),...(loc.id===30&&g.book.clamped?['先に製本台の押さえ板を上げる。']:[]),...(loc.id===30&&g.book.sewn&&['gatherings','blanks','thread'].includes(item)?['製本台の糸でつながっている材料は、押さえ板を上げ、針で糸をほどくと分けられる。']:[])];const source=objects.find(o=>o.rewards.includes(item));if(source&&g.visited.includes(source.room))return[`${n}は、${rooms[source.room].name}の${source.name}で手に入る。`];const next=nextHintGoal(g);return[`まだ${n}が手元にない。`,...(next!==id?global(next):['ほかの部屋に残った作業台や収納を調べる。'])];};
 const finished=(id:number,text:string)=>{const next=nextHintGoal(g);if(next===id)return[text];const steps=global(next);return[`${text} ${steps[0]}`,...steps.slice(1)];};
 const fallback=(id:number)=>{const o=objectById(id)!;return base({...g,room:o.room,facing:o.facing,focus:`object:${id}`})??['目の前の物の形と、対応する資料を見比べる。'];};
 const reward=(id:number)=>{const o=objectById(id)!,left=o.rewards.filter(n=>!g.collected.includes(n));return left.length?[`開いた${o.name}に、${left.map(n=>itemNames[n]).join('と')}が残っている。一つずつ取る。`]:finished(id,`この${o.name}の中身は回収済み。`);};
 const box=():string[]=>{if(!g.boxOpen)return !g.latchUp?['受渡台の小箱は、留め金が蓋を押さえている。','金具を上げてから、蓋の手前を持ち上げる。']:['留め金は外れている。次は小箱の蓋を持ち上げる。'];const left=[!g.keyTaken?'真鍮の鍵':null,!g.cardTaken?'丸印の札':null].filter(Boolean);return left.length?[`開いた小箱に${left.join('と')}が残っている。写真の物に触れて取る。`]:['小箱の中身は回収済み。',...global(nextHintGoal(g))];};
 const door=():string[]=>g.doorOpen?['帳場への戸が開いている。戸口に触れて入れる。']:g.doorUnlocked?['錠は外れている。戸の取っ手を回して開く。']:g.keyInserted?['鍵は差してある。差した鍵を回す。']:g.inventory.includes('key')?['手元の真鍮の鍵を選び、受渡口の東側の鍵穴へ差す。']:box();
 const secret=():string[]=>g.flags.secret?['修復室の北に開いた戸がある。戸口から原型庫へ進む。']:g.flags['repair:trim:1']?['中央の板の覆いは外れている。見えた丸い取っ手を回す。']:g.visited.includes(9)?['以前通った中央の木板が閉じている。','紙ナイフで取っ手の覆いを外し、取っ手を回す。']:!g.solved.includes(22)?['北の板を選ぶ手掛かりは、南の小口の像にある。',...object(22)]:['小口の像と、北の三枚の板の割れ目・補修金具を比べる。','右上が割れ、右の金具が二つの板。紙ナイフを選び、小さな覆いの縁へ使う。'];
 const exitSteps=():string[]=>{if(g.finished)return['外へ出られた。'];if(g.flags.exitOpen)return['搬出口は開いている。開いた戸口から外へ進む。'];if(g.flags.exitUnlocked)return[g.flags.exitKey?'錠は外れている。鍵を抜いてから、戸の取っ手を回す。':'錠は外れている。搬出口の取っ手を回して戸を開く。'];if(g.flags.exitKey)return keyOpens(currentKey(g))?['差した鍵の形が合っている。鍵を回す。']:['差した鍵は、まだ回らない。いったん抜いて歯を調整する。','作業台の本の厚みと、断面模型の上下を足す関係を比べる。'];if(paperOnExit(g))return !traceReady(g)?['この紙は、金具の縁をまだ写し切れていない。紙を回収して原型庫の作業台で写し直す。']:paperMatchesExit(g)?['角・二穴・縁が重なっている。紙を回収し、北の二つの原型と比べる。']:['扉に当てた紙の表裏と向きを変え、角と二つの穴を合わせる。','写した面を裏から見て、原型に当てた向きから半回転させる。'];if(has(g,'keyparts')&&keyOpens(currentKey(g)))return g.inventory.includes('keyparts')?['六枚歯の保守鍵を選んで、搬出口の鍵穴へ差す。']:need('keyparts',30,'扉の鍵穴');if(!traceReady(g))return ['扉の金具には、角切りと二つの穴がある。写しを合わせると向きを比べられる。',...(has(g,'tissue')?object(25):need('tissue',25,'原型'))];if(!g.solved.includes(25))return need('tissue',25,'搬出口の金具');if(!g.solved.includes(29))return['金具の写しを、搬出間の北の二つの原型と比べる。'];return object(30);};
 const exit=():string[]=>[...(g.room!==10&&!g.finished?[g.flags['loading:entry']?'受渡口の西にある搬出間へ戻る。':'受渡口の西側の戸を開き、搬出間へ入る。']:[]),...exitSteps()];

 function object(id:number):string[]{
  const v=value(g,id),open=g.opened.includes(id);
  if([2,3,4,8,9,11,26].includes(id)&&open)return reward(id);
  switch(id){
  case 1:{if(v.every(Boolean))return reward(1);const free=[0,1,2,3].filter(i=>ticketCanLift(v,i));return ['残っている金具の自由端が、どの板の手前に重なるかを見る。','ねじのある側の板を外すと、その金具も一緒に外れる。',`今は${free.map(i=>['一番上','上から二段目','上から三段目','一番下'][i]).join('、')}の板を手前へ引ける。`];}
  case 2:if(matchesNumeric(g,2))return['三桁は合っている。引出しの取っ手を引く。'];if(!g.cardTaken)return['受渡台の小箱にある丸印の札も、穴の数を比べる手掛かりになる。',...box()];if(!has(g,'card-diamond')||!has(g,'card-moon'))return['受渡口の札入れに、まだ返却札が残っている。',...object(1)];return fallback(2);
  case 3:if(matchesNumeric(g,3))return['錠の数字は合っている。校正箱の取っ手を引く。'];if(!has(g,'receipts'))return need('receipts',3,'校正箱の読解');if((g.itemValues.receipts??[]).join()!=='0,2,1')return['手元の三枚の複写控えには、紙の境目で途切れた罫線と印がある。','紙を上下にずらし、境目の罫線と割印が続く位置を探す。'];return ['罫線と割印がつながっている。箱の錠の上にも印が刻まれている。',...fallback(3).slice(2)];
  case 4:return matchesNumeric(g,4)?['環の切れ目が金具の位置に合っている。工具箱の蓋を持ち上げる。']:fallback(4);
  case 5:if(has(g,'register'))return g.itemValues.register?.[0]===6?finished(5,'必要な長さの位置決め片は切り出せている。'):['切り出した片は、必要な長さと違う。トレーへ戻すと切り直せる。','欠けた定規の数字そのものではなく、二つの印の間の差を測る。'];if(!has(g,'knife'))return need('knife',5,'紙を切る場所');return v[0]===6?need('knife',5,'測った長さの紙片'):fallback(5);
  case 6:return g.solved.includes(6)?finished(6,'紙の表裏を返すと、透けた印の左右が逆になることを確かめられた。'):fallback(6);
  case 7:if(open)return finished(7,'工房戸は開いている。');if(matchesNumeric(g,7))return['押し金の順は合っている。工房戸の取っ手を回す。'];if(!has(g,'folios'))return need('folios',7,'工房戸の読解');{const f=g.itemValues.folios??[0,0,1,0,0,0,0,0];if(!f[3]||!f[4])return['手元の両面の校正紙には、中央に折り目がある。','二枚とも折り目で閉じ、片方をもう片方へ重ねる。'];if(!f[6])return['二枚とも折れている。片方を選び、もう一枚へ重ねる。'];if(f[0]!==1||f[1]!==0||f[2]!==0)return['今の冊子では、表紙の傷と頁をまたぐ線がつながらない。','折り目から取り分け、表裏と内外を組み直す。矢印と小さな傷がある頁を表紙にする。'];return fallback(7).slice(3);}
  case 8:return matchesNumeric(g,8)?['天秤は釣り合っている。下の引出しを引く。']:fallback(8);
  case 9:return v.join()==='2,0,3,1'?['印章輪が箱の封印と対応している。右端の箱の蓋を持ち上げる。']:fallback(9);
  case 10:{const ids=g.itemValues.plates??[];if(has(g,'plates')&&ids.includes(0)&&ids.includes(3))return finished(10,at(g,12,'plates')?'持ち出した二枚の原版は刷り機に置いてある。':'二枚の原版は揃っている。');return [...(has(g,'plates')&&ids.length===2?['今持っている版の中に、模様が凹んだものがある。原版を選び、元の引出しへ戻して交換できる。']:[]),...fallback(10)];}
  case 11:{const mask=interlockMask(g);if(mask===0)return['留めが全部退いている。小箱の蓋を持ち上げる。'];const i=nextRing(mask);return ['今の窓に見える留めを比べる。引いた輪を戻す必要がある場合もある。',`${['左','中央','右'][i]}の輪を${mask&(1<<i)?'引く':'押し戻す'}。`];}
  case 12:{if(has(g,'proof')&&sameImpression(decodePrint(g.itemValues.proof)))return finished(12,'二重刷りの紙は手元にある。白く残った輪郭を次の資料と比べられる。');for(const item of ['plates','pin','weights','register'] as const)if(!at(g,12,item))return need(item,12,{plates:'刷り機の版の台',pin:'紙止めの穴',weights:'版の上下',register:'台の手前の溝'}[item]);const layers=g.print.layers;if(layers.some(l=>![0,3].includes(l.plate)||l.rotation!==0||l.face!==0||l.offset!==1)||layers.length===2&&!sameImpression(layers))return['刷り跡の面・向き・見当が揃っていない。新しい紙に換えてやり直せる。','版の向きを合わせ、紙の表裏と小さな十字の位置を確かめてから刷る。'];if(layers.length===2)return g.flags['press:paper-down']?['二枚分を刷れている。紙を持ち上げ、棚の紙を手元へ取る。']:['棚にある二重刷りの紙を手元へ取る。'];if(layers.length===1){if(g.flags['press:paper-down'])return['一枚分は刷れている。紙を持ち上げると版を替えられる。'];if((g.itemValues.plates??[])[g.print.slot]===layers[0].plate)return['一枚分は刷れている。同じ紙を使い、予備のもう一枚の版へ替える。'];}return g.flags['press:paper-down']?['紙は版に重なっている。刷り機の取っ手を動かす。']:['紙の表裏と見当を十字の印に合わせ、紙を版へ重ねる。','二枚の版の向きは元の向き、紙は表、見当は中央。'];}
  case 13:{const n=threadProgress(g);if(n===5)return reward(13);return ['ほどけた部分はそのままに、自由な糸の先を裏側までたどる。',`次は上から${threadOrder[n]+1}段目の縫い目を引く。`];}
  case 14:if(has(g,'oldplan'))return trimFits(g.itemValues.oldplan??[])?finished(14,'両面がつながる見取り図を持っている。'):['持ち出した図面は、裏の線がまだつながっていない。図面を選んで元の作業台へ戻し、紙片を交換できる。',...fallback(14).slice(2,4)];if(trimValues(g)[0]>=0)return trimFits(trimValues(g))?['表も裏も切り口の線がつながった。図面に触れて持ち出す。']:['添えた紙片は、表裏のどちらかの線がずれている。紙片を外して、裏と上下を確かめる。',...fallback(14).slice(2,4)];return fallback(14);
  case 15:{if(open)return finished(15,'保守戸は開いている。');const k=keeperValues(g),left=[0,1,2].filter(i=>!k[i+3]);if(!left.length)return g.flags['keeper:leaf']?['留め板は開いた。丸い取っ手を回す。']:['三つの留めは外れている。縦の留め板を開く。'];const centre=left.find(i=>k[i]===1);return centre!==undefined?[`${['上','中央','下'][centre]}の留めは、大きな逃げ穴の位置にある。手前へ抜ける。`]:['中央の大きな逃げ穴が空いている。残った留めを溝に沿って中央へ動かし、手前へ抜く。'];}
  case 16:{if(archivePassable(v))return g.flags['archive:door']?finished(16,'戸が開き、人が通れる幅も空いている。修復室へ進める。'):['戸の前には通れる幅がある。見えている戸のノブを回す。'];const step=nextShelfHint(v);return ['今の棚の配置から、戸の前に通れる幅を作る。',...(!has(g,'oldplan')?['製本室の断裁片をつないだ図も、床の跡との比較に使える。']:['古い図と床の跡を比べ、棚の長さとレールの方向を見る。']),...(step?[`今は${shelfNames[step.index]}を${shelfSpecs[step.index].axis==='x'?(step.position>v[step.index]?'東':'西'):(step.position>v[step.index]?'南':'北')}へ一段階動かすと、戸を空ける配置へ進められる。`]:[])];}
  case 17:if(gatheringsTaken(g))return originalPaper(g)?finished(17,'原紙と一致する六折は持ち出せている。'):['持ち出した束に原紙と違う紙が混じっている。',...need('gatherings',17,'西書庫の整理布'),...fallback(17).slice(1,4)];{const chosen=gatheringValues(g).slice(1);if(chosen.every(n=>n>=0)&&chosen.every(matchesOriginalStock))return['原紙と一致する三組が布に揃った。鞄の印で六折をまとめて取る。'];return chosen.every(n=>n>=0)?['三組あるが、印の位置や向きが原紙と違う紙が混じっている。',...fallback(17).slice(1,5)]:fallback(17).slice(0,5);}
  case 18:{const left=(['tissue','blanks'] as const).filter(n=>!has(g,n));if(!left.length)return finished(18,'封筒の薄紙と白紙は回収済み。');const e=envelopeValues(g);if(e[0])return['いま見ているのは封筒の裏側。折り返しがある面へ戻す。'];if(e[2]===7)return e[3]===0?['折り返しは全部開いている。内袋を左へ動かすと、中身が見える。']:[`内袋の${left.map(n=>itemNames[n]).join('と')}を近くで見て、一つずつ取る。`];if(!e[1])return has(g,'knife')?['下の折り返しには糊が残っている。紙ナイフを選び、小さな隙間へ使う。']:need('knife',18,'封筒の糊の隙間');return[`${e[2]===0?'右':e[2]===1?'下':'上'}の折り返しを開く。`];}
  case 19:if(has(g,'wedge')||cradleTaken(g))return finished(19,'本の中の木片は取り出せている。');if(spineOpen(g))return['開いた本の背の引出しから、斜面の木片を取る。'];if(!bookBands(g,2).length)return['軽い一冊の金具は外れている。台へ戻して背を近くで見て、背を引く。'];return fallback(19);
  case 20:if(g.flags['optics:guard'])return finished(20,'留め棒は開いている。見本台を使える。');return traceLight(opticsValues(g)).lit?['光が受光部へ届いている。受光部に近づき、留め棒を持ち上げる。']:fallback(20);
  case 21:if(cradleTaken(g))return finished(21,'支持具は組み上げて持ち出せている。');for(const item of ['corner','wedge'] as const)if(!at(g,21,item))return cradleValues(g)[0]?need(item,21,'二枚板の内側'):['上の板を起こしてから、部品を内側へ置く。'];if(cradleReady(g))return cradleValues(g)[0]?['斜面と角当ては合っている。上の板を下ろして支えを確かめる。']:['板が斜面で支えられている。支持具を持ち上げて運べる。'];return cradleValues(g)[0]?fallback(21).slice(1):['いったん上の板を起こすと、角当てと木片を動かせる。',...fallback(21).slice(1,4)];
  case 22:if(!at(g,22,'gatherings')&&g.solved.includes(22))return finished(22,'小口の像は一度つながっている。並べた順は紙束へ引き継いでいる。');if(!g.flags['optics:guard'])return['留め棒が見本台を塞いでいる。まず隣の反射片と光を調べる。',...object(20)];if(!at(g,22,'cradle'))return need('cradle',22,'南の見本台');if(!at(g,22,'gatherings'))return need('gatherings',22,'支持具');if(!foreedgeMounted(g))return['紙束が台の脇に置かれている。一度手元へ戻し、支持具に載せ直す。'];if(!originalPaper(g))return['この束には、原紙と違う紙が混じっている。紙束を回収し、西書庫の整理布へ戻して交換する。'];if(!correctBookOrder(g.book.order,gatheringSources(g)))return fallback(22).slice(1,6);return foreedgeView(g)===2?['小口の線と像がつながっている。割れ目の側と補修金具の数を、北の三枚の板と比べる。']:['束の順は合っている。右へ傾けると、小口に描かれた像を読める。'];
  case 23:if(g.solved.includes(23)&&!at(g,23,'blanks'))return finished(23,'白紙を補う二か所は見つかっている。白紙の束へ引き継いである。');if(!at(g,23,'blanks'))return need('blanks',23,'標本の作業台');if(missingLeaves.every(i=>blankStudyValues(g).includes(i)))return['欠けた葉の二か所へ白紙を置けている。白紙二枚をまとめて持ち帰る。'];return fallback(23);
  case 24:if(!has(g,'returnrecord')&&frameTaken(g))return['組み枠は持ち出せているが、壁の返却記録がまだ残っている。記録を取って観察する。'];if(frameTaken(g))return finished(24,'組み枠と返却記録は回収済み。');if(joineryReady(g))return['四隅が重なって枠が組み上がった。枠を持ち上げて取る。'];return [`今は${joineryValues(g).slice(0,4).filter(n=>n>=0).length}片が溝に入っている。残った片の端を、隣の端と比べる。`,...fallback(24).slice(0,3)];
  case 25:{const t=tissueTrace(g);if(traceReady(g))return at(g,25,'tissue')?['縁と二穴を写し切れている。保護紙を持ち帰り、搬出間の扉に重ねて比べる。']:finished(25,'金具の縁を写した保護紙は持ち出せている。');if(!at(g,25,'tissue'))return need('tissue',25,'原型');if(g.flags['rubbing:inspection'])return rubbingValues(g)[0]===0?['紙は原型の脇にある。原型を裏返し、縁が連続する面にしてから紙を戻す。']:['原型は縁が連続する面になっている。脇の紙を原型へ戻す。'];if(t[2]&&(t[0]!==rubbingValues(g)[0]||t[1]!==rubbingValues(g)[1]))return['紙には、いまの原型の向きと異なる写しが残っている。','練り消しで前の写しを消してから、黒鉛で写し直す。'];if(t[2]&&t[0]===0)return['補強の交差がある面を写している。紙を脇へ移し、原型を裏返してから紙を戻す。','練り消しで前の写しを消し、黒鉛で縁が連続する面を写す。'];if(rubbingValues(g)[0]===0&&tissueOnMould(g))return['いま紙の下にあるのは補強の交差がある面。紙を脇へ移すと原型を返せる。'];return t[2]?['写しは途中までできている。黒鉛を選び、まだ写っていない縁と二穴の周りを擦る。']:['黒鉛を選び、原型に重ねた保護紙の縁と穴の周りを擦る。'];}
  case 26:if(matchesNumeric(g,26))return['返却年の数字が合っている。ケースの蓋を開く。'];if(!has(g,'returnrecord'))return need('returnrecord',26,'保守ケースの年の読解');return fallback(26).slice(1);
  case 27:return cutawayOpen(g)?finished(27,'模型の軸は引けている。上下の金属片の合計が同じ高さになる関係を、保守鍵にも使える。'):cutawayAligned(g)?['金属片の境目が一本に揃っている。右の取っ手を引く。']:fallback(27);
  case 28:if(clampTaken(g))return finished(28,'締め具は持ち出せている。');if(!clampValues(g)[3])return['押さえ板が下りている。いったん上げれば、枠の回収やカムの調整ができる。'];if(!at(g,28,'frame'))return g.solved.includes(28)?['枠は取り出せている。鞄の印で締め具を持ち上げる。']:need('frame',28,'締め具の台');if(clampFits(clampValues(g)))return g.solved.includes(28)?['押さえ板は枠に合っている。枠を取り出してから、締め具を持ち上げる。']:['押さえ板が枠の内側に合っている。下ろして接触を確かめる。'];return fallback(28).slice(0,4);
  case 29:if(g.solved.includes(29)&&!at(g,29,'tissue'))return finished(29,'現在の金具と一致する原型を比べられた。脇の図が本を読む面を示している。');if(!traceReady(g))return['原型に比べるための写しを、原型庫の作業台で作る。',...object(25)];if(!g.solved.includes(25))return['先に写しを現在の搬出口の金具に重ね、接触する面を合わせる。'];if(!at(g,29,'tissue'))return need('tissue',29,'比べる原型');if(value(g,29)[0]!==1)return['こちらの原型は現在の金具と角・穴・補修の位置が違う。紙をもう一方へ移して比べる。'];return paperMatchesExit(g)?['角と二穴の位置が一致している。脇の本の図を確かめ、写しを回収する。']:['原型へ当てた紙の表裏と向きを、扉に重なった向きへ直して比べる。'];
  case 30:{const b=g.book;if(g.flags.exitKey||has(g,'keyparts')&&keyOpens(currentKey(g)))return exit();if(b.sewn&&!reconstructedBook(b,gatheringSources(g)))return b.clamped?['綴じた本の順・白紙の位置・表裏を直すには、まず押さえ板を上げる。']:b.side===0?['綴じた本が裏向きになっている。束全体を裏返して、原型の図の角切りと合わせる。']:['綴じた束の順か白紙の位置が違う。針を使って糸をほどくと、材料を失わず組み直せる。'];if(b.sewn){if(b.clamped)return['糸で綴じられた。押さえ板を上げると、閉じたまま本を動かせる。'];if(bookAtPress(g))return['綴じた本を選び、台の手前へ移して小口を読む。'];if(!at(g,30,'keyparts'))return need('keyparts',30,'製本の作業台');return fallback(30).slice(5);}
   for(const item of ['clamp','frame','gatherings','blanks','thread'] as const)if(!at(g,30,item))return need(item,30,'製本の作業台');if(!clampValues(g)[3]&&!b.clamped)return['押さえ板を上げると、脇の枠や紙束を載せ替えられる。'];if(!frameAtPress(g))return['枠は脇に置かれている。枠を選び、締め具の台へ載せる。'];if(!bookAtPress(g))return['紙束は脇に置かれている。紙束を選び、枠の中へ載せる。'];if(b.clamped&&(!correctBookOrder(b.order,gatheringSources(g))||b.blanks.length!==2||!missingLeaves.every(i=>b.blanks.includes(i))||b.side!==1))return['押さえた束の順・白紙・読む面が、まだ揃っていない。押さえ板を上げて組み直す。'];if(b.clamped)return has(g,'needle')?['束を押さえられている。綴じ針を選び、束を糸で綴じる。']:need('needle',30,'押さえた束');if(!originalPaper(g))return['原紙と違う紙が混じっている。紙束を回収し、西書庫の整理布で選び直す。'];if(!correctBookOrder(b.order,gatheringSources(g)))return['小口の像をつないだ順と、現在の束の順が違う。二つの束へ順に触れて入れ替える。'];if(!missingLeaves.every(i=>b.blanks.includes(i))||b.blanks.length!==2)return['白紙を、原型庫で欠落していた葉と同じ位置の束の中へ入れる。','上から二番目と五番目の束へ一つずつ。違う束へ入れた白紙は、その束を選んで抜ける。'];if(!b.side)return['本の角切りを原型の図と比べる。束全体を裏返して、読む面を合わせる。'];if(!b.closed)return['順と白紙は揃っている。束を閉じる。'];if(!clampFits(clampValues(g)))return['押さえ板の受け座がずれている。上からカムを見て、板が枠に収まる位置へ直す。'];return['束は閉じている。押さえ板を下ろして固定する。'];}
  }
  return fallback(id);
 }
 function global(goal:Goal):string[]{if(goal==='box')return box();if(goal==='door')return door();if(goal==='secret')return secret();if(goal==='exit')return exit();const o=objectById(goal)!;let access:string[]=[];if(o.room===1&&g.room!==1&&!g.doorOpen)access=door();else if(o.room===9&&g.room!==9&&!g.flags.secret)access=secret();else if((o.room===8||o.room===9)&&g.room<8&&(!archivePassable(value(g,16))||!g.flags['archive:door']))access=object(16);else if(o.room===10&&g.room!==10&&!g.flags['loading:entry'])access=['受渡口の西側の戸を開くと、搬出間へ入れる。'];return [...access,`${rooms[o.room].name}の${directions[o.facing]}側にある「${labels[goal]??o.name}」を調べる。`,...object(goal)];}
 if(context==='exit')return exit();if(context==='secret')return secret();
 if(g.focus.startsWith('object:'))return object(+g.focus.slice(7));
 if(g.room===0&&g.focus==='box')return g.keyTaken&&g.cardTaken?['小箱の中身は回収済み。',...global(nextHintGoal(g))]:box();
 if(g.room===0&&g.focus==='lock')return door();
 return global(nextHintGoal(g));
}
