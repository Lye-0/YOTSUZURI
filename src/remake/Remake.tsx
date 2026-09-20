import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {apply,initial,readSave,SAVE,boxState,sceneName,type Action,type Focus,type Item,type World} from './model';
import {Icon} from './Icons';
import {PhotoPatch} from './PhotoPatch';
import {usePhoto} from './usePhoto';
import {useOverlayFocus} from './useOverlayFocus';
import './remake.css';
const image=(name:string,group='scenes/reception')=>import.meta.env.BASE_URL+'remake/'+group+'/'+name+'.webp';
type Area={name:string;rect:[number,number,number,number];action:()=>void;shape?:string;priority?:number};
function load(){try{return readSave(localStorage.getItem(SAVE))??initial()}catch{return initial()}}
export default function Remake(){
const [g,setG]=useState(load),[panel,setPanel]=useState<'settings'|'help'|null>(null),[inspect,setInspect]=useState<Item|null>(null),[hint,setHint]=useState(0),[toast,setToast]=useState(''),[saveFailed,setSaveFailed]=useState(false),[boundary,setBoundary]=useState(false),[resetConfirm,setResetConfirm]=useState(false);
useOverlayFocus(Boolean(panel||inspect||boundary));
const world=useRef(g),timer=useRef<ReturnType<typeof setTimeout>|null>(null);world.current=g;
const say=(text:string)=>{setToast(text);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),2400)};
const act=(a:Action)=>{const r=apply(world.current,a);world.current=r.world;setG(r.world);if(r.message)say(r.message)};
useEffect(()=>{try{localStorage.setItem(SAVE,JSON.stringify(g));setSaveFailed(false)}catch{setSaveFailed(true)}},[g]);
useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(panel)setPanel(null);else if(inspect)setInspect(null);else if(boundary)setBoundary(false);else act({type:'back'})}else if(!panel&&!inspect&&!boundary&&e.target instanceof HTMLElement&&!['INPUT','BUTTON'].includes(e.target.tagName)){if(e.key==='ArrowLeft')act({type:'turn',delta:-1});if(e.key==='ArrowRight')act({type:'turn',delta:1});if(e.key==='ArrowDown')act({type:'back'});}};addEventListener('keydown',key);return()=>removeEventListener('keydown',key)},[panel,inspect,boundary]);
useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
useEffect(()=>{const groups:Record<string,string[]>={'scenes/reception':['north-closed','north-released','north-full','north-empty','north-book','north-notice','east-closed','east-key','east-unlocked','east-open','south','west'],closeups:['box-closed','box-released','box-full','box-empty','lock-empty','lock-key','lock-turned','book-open','front-chain','service-window','notice'],items:['key','card']};for(const [group,names] of Object.entries(groups))for(const name of names){const photo=new Image();photo.src=image(name,group)}},[]);
const focus=(f:Focus)=>act({type:'focus',focus:f});let src=image(g.facing===0?'north-closed':g.facing===1&&!g.doorOpen?'east-closed':sceneName(g));const areas:Area[]=[];
if(g.focus==='room'){
if(g.facing===0){areas.push({name:'受渡台の小箱を調べる',rect:g.boxOpen?[15,39,14,20]:[15,48,14,11],action:()=>focus('box')},{name:'黒い本を開く',rect:g.bookOpen?[48.5,53,15.5,7]:[52.5,53,9,7],action:()=>focus('book')},{name:'壁の紙を読む',rect:[55,20,7,14],action:()=>focus('notice')},{name:'校正室への戸口',rect:[72,16,20,59],action:()=>setBoundary(true)});}
if(g.facing===1){areas.push({name:g.doorOpen?'帳場へ進む':'帳場の戸を調べる',rect:[38,15,20,64],action:()=>g.doorOpen?setBoundary(true):focus('lock')});}
if(g.facing===2)areas.push({name:'表戸の鎖を調べる',rect:[32,27,35,43],action:()=>focus('front')});
if(g.facing===3)areas.push({name:'搬出間への戸',rect:[17,18,21,65],action:()=>setBoundary(true)},{name:'受渡窓をのぞく',rect:[54,24,29,29],action:()=>focus('passage')});
}else if(g.focus==='box'){
src=image(g.boxOpen?'box-full':'box-closed','closeups');
if(!g.boxOpen){areas.push({name:g.latchUp?'留め金を下ろす':'留め金を上げる',rect:[46,36,7,30],priority:4,action:()=>act({type:'latch'})},{name:'箱の蓋を持ち上げる',rect:[19,34,61,13],action:()=>act({type:'lid'})});}
else{areas.push({name:'箱の蓋を閉める',rect:[23,4,53,35],action:()=>act({type:'lid'})});if(!g.keyTaken)areas.push({name:'真鍮の鍵を拾う',rect:[31,46,14,10],action:()=>act({type:'take',item:'key'})});if(!g.cardTaken)areas.push({name:'返却札を拾う',rect:[52.5,45.5,17.5,10],action:()=>act({type:'take',item:'card'})});}
}else if(g.focus==='book'){src=image('book-open','closeups');areas.push({name:'本を閉じる',rect:[18,30,14,48],action:()=>act({type:'book'})});}
else if(g.focus==='lock'){src=image('lock-empty','closeups');areas.push({name:g.keyInserted?'鍵を回す':'鍵穴',rect:[50,54,9,15],action:()=>act({type:g.keyInserted?'turn-key':'keyhole'})},{name:'戸の取っ手',rect:[48,25,13,23],action:()=>act({type:'door'})});}
else if(g.focus==='front'){src=image('front-chain','closeups');areas.push({name:'表戸を押す',rect:[26,27,48,43],action:()=>say('鎖は、外側に掛かっている。')});}
else if(g.focus==='notice')src=image('notice','closeups');
else if(g.focus==='passage')src=image('service-window','closeups');
const photo=usePhoto(src);
const help=g.doorOpen?['帳場への戸が開いている。']:g.keyInserted&&!g.doorUnlocked?['差した鍵を回せる。']:g.boxOpen&&!g.keyTaken?['箱の中に、まだ物が残っている。','横長の金属を、手元へ取れる。']:!g.latchUp?['受渡台に、小さな留め金のある箱がある。','蓋を押さえている金具を先に上げる。']:!g.boxOpen?['留め金が外れても、蓋は閉じたまま。','蓋の手前の縁に触れる。']:!g.doorUnlocked?['鍵と、室内の戸の錠を見比べる。','手元で鍵を選び、鍵穴へ差す。']:['取っ手を使えば戸が開く。'];
if(!g.started)return <main className="remake-title" style={{backgroundImage:`url(${image('north-notice')})`}}><div><p>夜綴</p><span>YOTSUZURI</span><button onClick={()=>act({type:'start'})}>はじめる</button><small>受渡口・視点と操作の確認版</small></div></main>;
return <main className={'remake '+(g.reducedMotion?'still':'')} style={{'--light':g.brightness} as CSSProperties}><div className={"r-stage "+(g.focus==="notice"?"r-reading":"")} aria-busy={!photo.ready}><img className="r-photo" src={photo.shown} draggable={false} alt={g.focus==='room'?['受渡台','帳場の戸','表戸','搬出間の受渡窓'][g.facing]:'近づいて見た同じ物'}/>{g.focus==='room'&&g.facing===0&&g.bookOpen?<img className="r-photo r-book-change" src={image('north-book')} alt="" draggable={false}/>:null}
{g.focus==='room'&&g.facing===0&&g.boxOpen?<PhotoPatch src={image('north-full')} rect={[14.5,37.5,15,22]}/>:null}
{g.focus==='room'&&g.facing===0&&!g.boxOpen&&g.latchUp?<PhotoPatch src={image('north-released')} rect={[20.5,48.5,2.3,7]}/>:null}
{g.focus==='box'&&!g.boxOpen&&g.latchUp?<PhotoPatch src={image('box-released','closeups')} rect={[46,35,7,32]}/>:null}
{g.focus==='lock'&&g.keyInserted?<PhotoPatch src={image(g.doorUnlocked?'lock-turned':'lock-key','closeups')} rect={[49,53,10,18]}/>:null}
{g.focus==='room'&&g.facing===1&&!g.doorOpen&&g.keyInserted?<PhotoPatch src={image(g.doorUnlocked?'east-unlocked':'east-key')} rect={[54.5,50,3,5]}/>:null}
{g.boxOpen&&g.focus==='box'?<>{g.keyTaken?<PhotoPatch src={image('box-empty','closeups')} rect={[30.5,46.5,15.5,8]}/>:null}{g.cardTaken?<PhotoPatch src={image('box-empty','closeups')} rect={[52,45.5,18.5,10.5]}/>:null}</>:null}
{g.boxOpen&&g.focus==='room'&&g.facing===0?<>{g.keyTaken?<PhotoPatch src={image('north-empty')} rect={[18,49,3.5,3]}/>:null}{g.cardTaken?<PhotoPatch src={image('north-empty')} rect={[22,48.8,4.5,3.3]}/>:null}</>:null}
{g.focus==='room'&&g.facing===0?<PhotoPatch src={image('north-notice')} rect={[55.5,20,6,14]}/>:null}
{areas.map(a=><button disabled={!photo.ready} key={a.name} aria-label={a.name} className={'r-target '+(g.outlines?'marked':'')} style={{left:a.rect[0]+'%',top:a.rect[1]+'%',width:a.rect[2]+'%',height:a.rect[3]+'%',clipPath:a.shape,zIndex:a.priority??2}} onClick={a.action}/>)}
{g.focus==='room'?<><button className="r-nav r-left" aria-label="左を向く" onClick={()=>act({type:'turn',delta:-1})}><Icon name="left"/></button><button className="r-nav r-right" aria-label="右を向く" onClick={()=>act({type:'turn',delta:1})}><Icon name="right"/></button></>:<button className="r-nav r-back" aria-label="元の視点へ戻る" onClick={()=>act({type:'back'})}><Icon name="back"/></button>}
<div className="r-tools"><button aria-label="調べられる物を表示" aria-pressed={g.outlines} onClick={()=>act({type:'settings',key:'outlines',value:!g.outlines})}><Icon name="eye"/></button><button aria-label="ヒント" onClick={()=>{setPanel('help');setHint(0)}}><Icon name="help"/></button><button aria-label="設定" onClick={()=>{setResetConfirm(false);setPanel('settings')}}><Icon name="settings"/></button></div>
<div className={'r-message '+(toast?'visible':'')} role="status">{toast}</div></div>
<div className="r-orientation-hint" aria-hidden="true">↻ 横向きで大きく表示</div><footer className="r-inventory" aria-label="持ち物"><Icon name="bag"/>{g.inventory.map(n=><div className="r-item" key={n}><button aria-label={(n==='key'?'真鍮の鍵':'返却札')+'を選ぶ'} aria-pressed={g.selected===n} className={g.selected===n?'selected':''} onClick={()=>act({type:'select',item:n})}><img src={image(n,'items')} alt=""/></button><button className="r-inspect-button" aria-label={(n==='key'?'真鍮の鍵':'返却札')+'を観察する'} onClick={()=>setInspect(n)}><Icon name="inspect"/></button></div>)}{saveFailed?<span>保存できません</span>:null}</footer>
{inspect?<section className="r-overlay item-view" role="dialog" aria-modal="true" aria-label="手元の物"><img src={image(inspect,'items')} alt={inspect==='key'?'真鍮の鍵':'返却札'}/><button className="r-nav r-back" aria-label="観察を閉じる" autoFocus onClick={()=>setInspect(null)}><Icon name="back"/></button></section>:null}
{panel?<section className="r-overlay" role="dialog" aria-modal="true" aria-label={panel==='help'?'ヒント':'設定'}><div className="r-panel"><button className="r-panel-close" aria-label="閉じる" autoFocus onClick={()=>setPanel(null)}><Icon name="close"/></button>{panel==='help'?<><p>{help[Math.min(hint,help.length-1)]}</p><div className="hint-step"><button disabled={hint===0} onClick={()=>setHint(h=>h-1)}>前</button><span>{hint+1} / {help.length}</span><button disabled={hint>=help.length-1} onClick={()=>setHint(h=>h+1)}>次</button></div></>:<><h1>設定</h1><label>明るさ<input type="range" min=".75" max="1.4" step=".05" value={g.brightness} onChange={e=>act({type:'settings',key:'brightness',value:+e.target.value})}/></label><label><input type="checkbox" checked={g.reducedMotion} onChange={e=>act({type:'settings',key:'reducedMotion',value:e.target.checked})}/>動きを抑える</label><p className="r-settings-note">物は写真の上で操作できます。手元の物は選んでから使用先へ。虫眼鏡で単体を観察できます。</p><small>進行はこの端末に自動保存されます。旧版の保存とは別です。</small>{resetConfirm?<div className="r-reset"><p>この確認版を最初からやり直します。</p><button onClick={()=>{const next=initial();world.current=next;setG(next);setPanel(null);setResetConfirm(false)}}>やり直す</button><button onClick={()=>setResetConfirm(false)}>取り消す</button></div>:<button className="r-reset-link" onClick={()=>setResetConfirm(true)}>最初から</button>}</>}</div></section>:null}
{boundary?<section className="r-overlay" role="dialog" aria-modal="true" aria-label="確認版の範囲"><div className="r-panel"><p>受渡口の確認範囲はここまでです。</p><p className="r-settings-note">視点と物の操作を確認してから、続く部屋を制作します。</p><button autoFocus onClick={()=>setBoundary(false)}>受渡口へ戻る</button></div></section>:null}
</main>;
}
