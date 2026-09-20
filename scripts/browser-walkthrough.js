// Run with Playwright MCP browser_run_code_unsafe(filename=absolute path).
// This walkthrough uses the rendered controls. localStorage is read only for
// assertions/pathfinding; progress is never injected. Run on a QA browser profile.
async (page) => {
const out='C:/Users/kawau/Documents/MY DEVELOPMENT TEMP/脱出ゲーム/4_YOTSUZURI/verification/';
const names=['','札入れ','帳場の引出し','校正箱','工具箱','欠けた定規','三枚の試し刷り','工房戸','釣合いの箱','封印の箱','原版の引出し','留め輪','校正刷り機','綴じ見本','断裁片','書庫の保守戸','可動書架','透かしの束','封筒の折り返し','重さの違う本','見本台の灯り','角当てと木片','小口の見本','白紙の位置','四片の組み枠','原型の写し','鍵部品のケース','断面の錠','束の締め具','二つの原型','閉じた本'];
const rooms=['受渡口','帳場','校正室','活字室','印刷室','製本室','西書庫','東書庫','修復室','原型庫','搬出間'];
const pr=[0,0,1,1,2,2,2,0,3,5,3,4,4,5,5,3,6,7,6,7,8,8,8,9,9,9,1,9,5,10,10];
const neighbors=[[1,2,10],[0],[0,3],[2,4,5,6],[3,5],[3,4,6],[3,5,7,8],[6],[6,9],[8],[0]];
const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('yotsuzuri:save:v1')));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
// DOM activation avoids the MCP's per-click screenshot overhead. Every action
// still passes through the production React event handler and state reducer.
const activate=async locator=>{await locator.waitFor({state:'visible',timeout:4000});if(await locator.isDisabled())throw Error('Disabled control');await locator.evaluate(el=>el.click());await page.waitForTimeout(30)};
const click=async name=>activate(page.getByRole('button',{name,exact:true}));
const close=async()=>{if(await page.locator('dialog').count())await click('閉じて部屋に戻る')};
const range=async(name,n)=>{await page.getByRole('slider',{name,exact:true}).fill(String(n));await page.waitForTimeout(30)};
const digits=async(a,label='桁目')=>{for(let i=0;i<a.length;i++){const l=page.getByRole('button',{name:(i+1)+label+'を増やす',exact:true});const current=Number(await page.locator('.dial output').nth(i).innerText());for(let n=current;n!==a[i];n=(n+1)%(label==='桁目'?10:5)|| (label==='桁目'?0:1))await activate(l)}};
const swap=async(target,kind)=>{for(let i=0;i<target.length;i++){const buttons=page.locator('.order.'+kind+'>button');const values=await buttons.evaluateAll(es=>es.map(e=>Number(e.getAttribute('aria-label').split(' ').at(-1))-1));if(values[i]!==target[i]){await activate(buttons.nth(i));await activate(buttons.nth(values.indexOf(target[i])));}}};
const go=async target=>{await close();let g=await read();if(g.room===target)return;const allowed=n=>n<3||n===10||(g.opened.includes(7)&&(n<6||g.opened.includes(15))&&(n<8||n===10||g.solved.includes(16))&&(n!==9||g.secretOpen));const q=[[g.room,[]]],seen=new Set([g.room]);let path;while(q.length){const [n,p]=q.shift();if(n===target){path=p;break}for(const m of neighbors[n])if(!seen.has(m)&&allowed(m)){seen.add(m);q.push([m,[...p,m]])}}if(!path)throw Error('No path '+target);for(const n of path)await click(rooms[n]+' →')};
await page.setViewportSize({width:1440,height:1000});
await close();let g=await read();if(!g.started)await click('戸をたたく →');
// Resumes an interrupted QA walkthrough, without overwriting a save.
const completed=[];
for(let id=1;id<=30;id++){
g=await read();if(g.solved.includes(id)&&([7,15].includes(id)?g.opened.includes(id):true)){completed.push(id);continue;}
if(id===23){await go(8);await click('壁の図面の縁');}
await go(pr[id]);await activate(page.locator('.hotspot').filter({has:page.locator('span',{hasText:names[id]})}));
await page.screenshot({path:out+'p'+String(id).padStart(2,'0')+'-before.png',fullPage:true});
switch(id){
case 1:case 15:case 18:for(const n of id===1?[2,4,1,3]:id===15?[2,3,1]:[3,1,2])await click(n+'枚目を引く');break;
case 2:await digits([6,8,4]);break;
case 3:await range('控え1の位置',0);await range('控え2の位置',2);await range('控え3の位置',1);await digits([9,1,8,6]);break;
case 4:case 11:for(const [i,n] of (id===4?[3,6]:[2,4]).entries())for(let j=0;j<n;j++)await click((i===0?'外':'内')+'の環を回す');break;
case 5:await click('6目盛');await click('紙ナイフで切り離す');break;
case 6:await activate(page.locator('.paper-samples>button').nth(1));await click('表を見ている ↻');await click('見本と重ねる');break;
case 7:for(const n of ['菱形','丸','三日月','二本線'])await click(n);break;
case 8:await activate(page.getByRole('button',{name:'左皿',exact:true}).nth(0));await activate(page.getByRole('button',{name:'左皿',exact:true}).nth(1));await activate(page.getByRole('button',{name:'右皿',exact:true}).nth(2));break;
case 9:await swap([2,0,3,1],'seal');break;
case 10:await activate(page.locator('.plate-choices>button').nth(0));await activate(page.locator('.plate-choices>button').nth(3));await click('二枚を取り出す');break;
case 12:await click('版Aを回す');for(let n=0;n<3;n++)await click('版Bを回す');await click('ハンドルを下ろす');break;
case 13:await click('台を裏返す');await page.screenshot({path:out+'p13-thread.png',fullPage:true});await click('台を表へ戻す');for(const n of [5,2,6,3])await click(n+'番の穴を外す');break;
case 14:await swap([2,0,3,1],'scraps');break;
case 16:for(const [i,n] of [3,1,2,0].entries())for(let j=0;j<n;j++)await click('書架'+(i+1)+'の留めを回す');for(const [name,n] of [['棚3を左へ',2],['棚2を下へ',3],['棚4を下へ',2],['棚1を右へ',4]])for(let j=0;j<n;j++)await click(name);break;
case 17:for(const n of [1,3,5])await activate(page.locator('.watermarks>button').nth(n));await click('同じ紙を取り分ける');break;
case 19:await activate(page.locator('.weighed-books>button').nth(2));await click('背を開く');break;
case 20:await click('左の反射片を回す');await click('中央の反射片を回す');await click('中央の反射片を回す');break;
case 21:await click('角当てを回す');await click('木片を回す');await click('二つの穴を合わせて組む');break;
case 22:await swap([3,0,5,1,4,2],'book');await range('束の傾き',2);await click('小口を見る');break;
case 23:for(const n of [2,5])await click(n+'番目の隙間');await click('綴じ痕を確かめる');break;
case 24:for(const [i,n] of [1,3,2,0].entries())for(let j=0;j<n;j++)await click(['上','右','下','左'][i]+'の木片を回す');break;
case 25:await click('写しを裏返す 表');await click('写しを回す ↻');await click('写しを回す ↻');await click('肩を合わせる');break;
case 26:await digits([1,9,2,7]);break;
case 27:await digits([3,4,1],'枚目の歯');await click('軸を回す');break;
case 28:for(const [i,n] of [2,1,3].entries())for(let j=0;j<n;j++)await click(['左','奥','右'][i]+'のカムを回す');break;
case 29:await click('右の原型');await click('鍵穴にあてがう');break;
case 30:await digits([4,2,1,3,1,4],'枚目の歯');await click('鍵を差し、回す');break;
}
g=await read();if(!g.solved.includes(id))throw Error('Puzzle did not solve: '+id+' '+JSON.stringify(g.values[id]));
if(await page.getByRole('button',{name:'留め金を外して開ける',exact:true}).count())await click('留め金を外して開ける');
if(await page.getByRole('button',{name:'戸を開ける',exact:true}).count())await click('戸を開ける');
while(await page.locator('.take-item').count())await activate(page.locator('.take-item').first());
await page.screenshot({path:out+'p'+String(id).padStart(2,'0')+'-after.png',fullPage:true});
completed.push(id);await close();await page.screenshot({path:out+'room-after-'+String(id).padStart(2,'0')+'.png',fullPage:true});
if(id===14){await page.reload();await page.locator('.room-stage').waitFor();const saved=await read();if(!saved.solved.includes(id))throw Error('Save reload failed');}
}
await go(10);await click('閉じた本');await click('戸を押して、外へ');await page.screenshot({path:out+'ending.png',fullPage:true});g=await read();if(!g.finished)throw Error('Ending not reached');return {completed,finished:g.finished,inventory:g.inventory,errors};
}
