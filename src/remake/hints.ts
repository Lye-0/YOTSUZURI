import type {World} from './campaign';
export function campaignHints(g:World):string[]|null{
if(g.room===1){
if(g.focus==='object:26')return ['保守用のケース。四桁の輪がある。','受け付けた日と、戻ってきた日は違う。','奥に残された返却記録と、帳場の控えを比べる。'];
if(g.focus==='object:3'||g.inventory.includes('receipts')&&!g.collected.includes('folios'))return ['三枚の控えには、同じ番号が付いている。','手元で控えを観察し、紙を上下にずらして罫線をつなぐ。','受付・作業・返却は別の欄。返却の欄だけを左から読む。','四桁は 9186。錠を合わせてから取っ手を引く。'];
if(!g.opened.includes(2))return ['机の引出しには三桁の錠がある。','留められた三枚の札と、受渡口の返却札は同じ印を持つ。','穴が一つ、二つ、三つの順に、対応する数字を読む。','三桁は 684。錠を合わせてから取っ手を引く。'];
if(!g.collected.includes('receipts'))return ['開いた引出しに、紙が残っている。'];
return ['折り紙は手元で観察できる。校正室にも、紙と印の見本がある。'];
}
return null;
}
