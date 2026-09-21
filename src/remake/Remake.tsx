import {PressSamples} from './PressSamples';
import {InterlockBox} from './InterlockBox';
import {ThreadScene} from './ThreadScene';
import {PressScene,type PressView} from './PressScene';
import {PressMechanism} from './PressMechanism';
import {HeldPrint} from './HeldPrint';
import {PrintedSheet} from './PrintedSheet';
import {decodePrint} from './press';
import {WorkshopPortals} from './WorkshopPortals';
import {PlateDrawers,HeldPlates} from './PlateDrawers';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {apply,initial,readSave,SAVE,type Action,type Focus} from './campaign';
import {SAVE as RECEPTION_SAVE} from './model';
import {itemNames,rooms,type CampaignItem as Item} from './catalog';
import {PhotoDigits} from './PhotoDigits';
import {ReceiptPapers} from './ReceiptPapers';
import {FolioPapers} from './FolioPapers';
import {TicketInk} from './TicketInk';
import {RingLock} from './RingLock';
import {DoorMarks} from './DoorMarks';
import {MeasureBench} from './MeasureBench';
import {ProofPapers} from './ProofPapers';
import {TicketCase} from './TicketCase';
import {KeyParts} from './KeyParts';
import {Balance} from './Balance';
import {officeDrums,drumValues,turnDrum} from './office';
import {Icon} from './Icons';
import {PhotoPatch} from './PhotoPatch';
import {PhotoObject} from './PhotoObject';
import {usePhoto} from './usePhoto';
import {sceneFiles} from './sceneFiles';
import {useOverlayFocus} from './useOverlayFocus';
import {campaignHints} from './hints';
import './remake.css';
const image=(name:string,group='scenes/reception')=>import.meta.env.BASE_URL+'remake/'+group+'/'+name+'.webp';
type Area={name:string;rect:[number,number,number,number];action:()=>void;shape?:string;priority?:number};
function load(){try{return readSave(localStorage.getItem(SAVE))??readSave(localStorage.getItem(RECEPTION_SAVE))??initial()}catch{return initial()}}
export default function Remake(){
const [threadZoom,setThreadZoom]=useState(false);
const [pressView,setPressView]=useState<PressView>('all');
const [worldState,setG]=useState(load),[panel,setPanel]=useState<'settings'|'help'|null>(null),[inspect,setInspect]=useState<Item|null>(null),[hint,setHint]=useState(0),[toast,setToast]=useState(''),[saveFailed,setSaveFailed]=useState(false),[boundary,setBoundary]=useState(false),[resetConfirm,setResetConfirm]=useState(false);
const photo=usePhoto(sceneFiles(worldState));const visibleWorld=useRef(worldState);if(photo.ready)visibleWorld.current=worldState;const g=visibleWorld.current;
useOverlayFocus(Boolean(panel||inspect||boundary));
const world=useRef(worldState),timer=useRef<ReturnType<typeof setTimeout>|null>(null);world.current=worldState;
const say=(text:string)=>{setToast(text);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),2400)};
const act=(a:Action)=>{if(a.type==='back'&&world.current.focus==='object:13'&&threadZoom){setThreadZoom(false);return;}if(a.type==='back'&&world.current.focus==='object:12'&&pressView!=='all'){setPressView('all');return;}const before=world.current;const r=apply(before,a);world.current=r.world;setG(r.world);if(r.message)say(r.message);else if(r.world!==before){if(timer.current)clearTimeout(timer.current);setToast('');}};
useEffect(()=>{try{localStorage.setItem(SAVE,JSON.stringify(worldState));setSaveFailed(false)}catch{setSaveFailed(true)}},[worldState]);
useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(panel)setPanel(null);else if(inspect)setInspect(null);else if(boundary)setBoundary(false);else act({type:'back'})}else if(photo.ready&&!panel&&!inspect&&!boundary&&e.target instanceof HTMLElement&&!['INPUT','BUTTON'].includes(e.target.tagName)){if(e.key==='ArrowLeft')act({type:'turn',delta:-1});if(e.key==='ArrowRight')act({type:'turn',delta:1});if(e.key==='ArrowDown')act({type:'back'});}};addEventListener('keydown',key);return()=>removeEventListener('keydown',key)},[panel,inspect,boundary,photo.ready,pressView,threadZoom]);
useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
useEffect(()=>{for(const facing of [0,1,2,3] as const)for(const url of sceneFiles({...initial(),facing})){const preview=new Image();preview.src=url}},[]);
const focus=(f:Focus)=>{setThreadZoom(false);setPressView('all');act({type:'focus',focus:f});};const areas:Area[]=[];
if(g.room===1){

if(g.focus==='room'){
if(g.facing===3)areas.push({name:'受渡口へ戻る',rect:[38,16,24,64],action:()=>act({type:'go',room:0})});
if(g.facing===1)areas.push({name:'机の引出しを調べる',rect:g.opened.includes(2)?[30,61,41,23]:[32,62,40,10],action:()=>focus('object:2')},{name:'机上のケースを調べる',rect:g.opened.includes(26)?[62,44,10,16]:[62,50,10,10],action:()=>focus('object:26')});
if(g.facing===0)areas.push({name:'校正箱を調べる',rect:[35,52,30,29],action:()=>focus('object:3')},{name:'留められた三枚の札を見る',rect:[42,45,16,5],action:()=>focus('office-tickets')});
}
else if(g.focus.startsWith('object:')){
const id=+g.focus.slice(7),opened=g.opened.includes(id);



if(!opened)areas.push({name:id===26?'ケースの蓋を開く':'引出しの取っ手を引く',rect:id===26?[48,43,10,15]:id===3?[41,60,18,14]:[34,56,31,22],action:()=>act({type:'p-open',id})});
if(id===2&&opened&&!g.collected.includes('receipts'))areas.push({name:'三枚の複写控えを取る',rect:[26,38,47,20],action:()=>act({type:'p-take',id:2,item:'receipts'})});
if(id===3&&opened&&!g.collected.includes('folios'))areas.push({name:'二枚の校正紙を取る',rect:[32,46,36,9],action:()=>act({type:'p-take',id:3,item:'folios'})});
if(id===26&&opened&&!g.collected.includes('keyparts'))areas.push({name:'六枚歯の保守鍵を取る',rect:[35,44,40,8],action:()=>act({type:'p-take',id:26,item:'keyparts'})});
if(id===3)areas.push({name:'三枚の札を近くで見る',rect:[25,16,48,10],action:()=>focus('office-tickets')});
}
}else if(g.room===3){
if(g.focus==='room'){
if(g.facing===2)areas.push({name:'校正室へ戻る',rect:[14,16,19,61],action:()=>act({type:'go',room:2})});
if(g.facing===1)areas.push({name:'印刷室への戸口',rect:[20,18,28,59],action:()=>act({type:'go',room:4})},{name:'天秤の台を調べる',rect:[60,26,28,55],action:()=>focus('object:8')});
if(g.facing===3)areas.push({name:'製本室への戸口',rect:[73,17,15,59],action:()=>act({type:'go',room:5})},{name:'原版の引出しを調べる',rect:[4.5,38,25,22],action:()=>focus('object:10')});
}
}else if(g.room===5){
if(g.focus==='room'){if(g.facing===1)areas.push({name:'活字室へ戻る',rect:[31.6,18,25.6,58.3],action:()=>act({type:'go',room:3})},{name:'締め具を調べる',rect:[70,42,22,19],action:()=>setBoundary(true)});if(g.facing===0)areas.push({name:'綴じ見本を調べる',rect:[29,48,45,15],action:()=>focus('object:13')});if(g.facing===2)areas.push({name:'断裁片を調べる',rect:[34,46,42,16],action:()=>setBoundary(true)});if(g.facing===3)areas.push({name:'封印の箱を調べる',rect:[26,44,30,14],action:()=>setBoundary(true)});}
}else if(g.room===4){
if(g.focus==='room'){if(g.facing===3)areas.push({name:'活字室へ戻る',rect:[31.7,22.1,36.2,58],action:()=>act({type:'go',room:3})});if(g.facing===0)areas.push({name:'刷り機へ近づく',rect:[29,26,42,62],action:()=>focus('object:12')});if(g.facing===2)areas.push({name:'留め輪の小箱を調べる',rect:[27.5,45,17,15],action:()=>focus('object:11')},{name:'試し押しの紙を見る',rect:[44.5,45,23.5,15],action:()=>focus('press-samples')});}
}else if(g.room===2){

if(g.focus==='room'){
if(g.facing===0)areas.push({name:'工具箱を調べる',rect:g.opened.includes(4)?[69,44,12,14]:[69,50,12,8],action:()=>focus('object:4')},{name:g.opened.includes(7)?'活字室へ進む':'工房戸の押し金を調べる',rect:[20,18,18,58],action:()=>g.opened.includes(7)?act({type:'go',room:3}):focus('object:7')});
if(g.facing===1)areas.push({name:'定規のある作業台を調べる',rect:[36,53,32,6],action:()=>focus('object:5')});
if(g.facing===2)areas.push({name:'受渡口へ戻る',rect:[14,17,16,58],action:()=>act({type:'go',room:0})});
if(g.facing===3)areas.push({name:'透かした紙を調べる',rect:[31,54,37,7],action:()=>focus('object:6')});
}else if(g.focus==='object:4'){

if(!g.opened.includes(4))areas.push({name:'工具箱の蓋を持ち上げる',rect:[20,31,65,10],action:()=>act({type:'p-open',id:4})});
else{
if(!g.collected.includes('knife'))areas.push({name:'紙ナイフを取る',rect:[18,34,33,6],action:()=>act({type:'p-take',id:4,item:'knife'})});
if(!g.collected.includes('lens'))areas.push({name:'拡大鏡を取る',rect:[56,30,24,10],action:()=>act({type:'p-take',id:4,item:'lens'})});
}
}

else if(g.focus==='object:7'){

[39.7,46.75,53.7,60.65].forEach((x,i)=>areas.push({name:['丸','二本線','菱形','三日月'][i]+'の押し金',rect:[x-2.1,32.6,4.2,7.6],action:()=>act({type:'p-button',id:7,button:i})}));
areas.push({name:'工房戸の取っ手を回す',rect:[80.5,67,8.5,14],action:()=>act({type:'p-open',id:7})});
}
}else if(g.focus==='room'){
if(g.facing===0){areas.push({name:'受渡台の小箱を調べる',rect:g.boxOpen?[15,39,14,20]:[15,48,14,11],action:()=>focus('box')},{name:'黒い本を開く',rect:g.bookOpen?[48.5,53,15.5,7]:[52.5,53,9,7],action:()=>focus('book')},{name:'壁の紙を読む',rect:[55,20,7,14],action:()=>focus('notice')},{name:'校正室への戸口',rect:[72,16,20,59],action:()=>act({type:'go',room:2})});}
if(g.facing===1){areas.push({name:g.doorOpen?'帳場へ進む':'帳場の戸を調べる',rect:[38,15,20,64],action:()=>g.doorOpen?act({type:'go',room:1}):focus('lock')});}
if(g.facing===2)areas.push({name:'表戸の鎖を調べる',rect:[32,27,35,43],action:()=>focus('front')},{name:'壁の札入れを調べる',rect:[15.15,24.3,12.6,20.8],action:()=>focus('object:1')});
if(g.facing===3)areas.push({name:'搬出間への戸',rect:[17,18,21,65],action:()=>setBoundary(true)},{name:'受渡窓をのぞく',rect:[54,24,29,29],action:()=>focus('passage')});
}else if(g.focus==='box'){

if(!g.boxOpen){areas.push({name:g.latchUp?'留め金を下ろす':'留め金を上げる',rect:[46,36,7,30],priority:4,action:()=>act({type:'latch'})},{name:'箱の蓋を持ち上げる',rect:[19,34,61,13],action:()=>act({type:'lid'})});}
else{areas.push({name:'箱の蓋を閉める',rect:[23,4,53,35],action:()=>act({type:'lid'})});if(!g.keyTaken)areas.push({name:'真鍮の鍵を拾う',rect:[31,46,14,10],action:()=>act({type:'take',item:'key'})});if(!g.cardTaken)areas.push({name:'返却札を拾う',rect:[52.5,45.5,17.5,10],action:()=>act({type:'take',item:'card'})});}
}else if(g.focus==='book'){areas.push({name:'本を閉じる',rect:[18,30,14,48],action:()=>act({type:'book'})});}
else if(g.focus==='lock'){areas.push({name:g.keyInserted?'鍵を回す':'鍵穴',rect:[50,54,9,15],action:()=>act({type:g.keyInserted?'turn-key':'keyhole'})},{name:'戸の取っ手',rect:[48,25,13,23],action:()=>act({type:'door'})});}

else if(g.focus==='front'){areas.push({name:'表戸を押す',rect:[26,27,48,43],action:()=>say('鎖は、外側に掛かっている。')});}



const receptionHelp=g.doorOpen?['帳場への戸が開いている。']:g.keyInserted&&!g.doorUnlocked?['差した鍵を回せる。']:g.boxOpen&&!g.keyTaken?['箱の中に、まだ物が残っている。','横長の金属を、手元へ取れる。']:!g.latchUp?['受渡台に、小さな留め金のある箱がある。','蓋を押さえている金具を先に上げる。']:!g.boxOpen?['留め金が外れても、蓋は閉じたまま。','蓋の手前の縁に触れる。']:!g.doorUnlocked?['鍵と、室内の戸の錠を見比べる。','手元で鍵を選び、鍵穴へ差す。']:['取っ手を使えば戸が開く。'];
const help=campaignHints(g)??receptionHelp;
if(worldState.started&&!photo.hasFrame)return <main className={"remake "+(worldState.reducedMotion?"still":"")} aria-busy={!photo.failed}>{photo.failed?<button onClick={photo.retry}>画像を再読み込み</button>:<div className="r-loading" role="status" aria-label="読み込み中"/>}</main>;
if(!g.started)return <main className="remake-title" style={{backgroundImage:`url(${image('north-notice')})`}}><div><p>夜綴</p><span>YOTSUZURI</span><button onClick={()=>act({type:'start'})}>はじめる</button><small></small></div></main>;
return <main className={'remake '+(g.reducedMotion?'still ':'')+(g.outlines?'outlines':'')} style={{'--light':g.brightness} as CSSProperties}><div className={"r-stage "+(g.focus==="notice"?"r-reading":g.focus==="object:1"?"r-case-reading":g.focus==="object:8"?"r-balance-reading":g.focus==="object:10"?"r-plate-reading":g.focus==="press-samples"?"r-samples-reading":g.focus==="object:11"?"r-interlock-reading":g.focus==="object:13"?(threadZoom?"r-thread-detail":""):g.focus==="object:12"?(pressView==="bed"?"r-press-bed":pressView==="paper"?"r-press-paper":""):"")} aria-busy={!photo.ready}><img className="r-photo" src={photo.shown} draggable={false} alt={g.focus==='room'?rooms[g.room].name+'・'+['北','東','南','西'][g.facing]:'近づいて見た同じ物'}/>{g.room===0&&g.focus==='room'&&g.facing===0&&g.bookOpen?<img className="r-photo r-book-change" src={image('north-book')} alt="" draggable={false}/>:null}
{g.room===0&&g.focus==='room'&&g.facing===0&&g.boxOpen?<PhotoPatch src={image('north-full')} rect={[14.5,37.5,15,22]}/>:null}
{g.room===0&&g.focus==='room'&&g.facing===0&&!g.boxOpen&&g.latchUp?<PhotoPatch src={image('north-released')} rect={[20.5,48.5,2.3,7]}/>:null}
{g.focus==='box'&&!g.boxOpen&&g.latchUp?<PhotoPatch src={image('box-released','closeups')} rect={[46,35,7,32]}/>:null}
{g.focus==='lock'&&g.keyInserted?<PhotoPatch src={image(g.doorUnlocked?'lock-turned':'lock-key','closeups')} rect={[49,53,10,18]}/>:null}
{g.room===0&&g.focus==='room'&&g.facing===1&&!g.doorOpen&&g.keyInserted?<PhotoPatch src={image(g.doorUnlocked?'east-unlocked':'east-key')} rect={[54.5,50,3,5]}/>:null}
{g.boxOpen&&g.focus==='box'?<>{g.keyTaken?<PhotoPatch src={image('box-empty','closeups')} rect={[30.5,46.5,15.5,8]}/>:null}{g.cardTaken?<PhotoPatch src={image('box-empty','closeups')} rect={[52,45.5,18.5,10.5]}/>:null}</>:null}
{g.boxOpen&&g.room===0&&g.focus==='room'&&g.facing===0?<>{g.keyTaken?<PhotoPatch src={image('north-empty')} rect={[18,49,3.5,3]}/>:null}{g.cardTaken?<PhotoPatch src={image('north-empty')} rect={[22,48.8,4.5,3.3]}/>:null}</>:null}
{g.room===0&&g.focus==='room'&&g.facing===0?<PhotoPatch src={image('north-notice')} rect={[55.5,20,6,14]}/>:null}
<WorkshopPortals g={g} act={act}/>
{g.room===3&&g.facing===3&&(g.focus==='room'||g.focus==='object:10')?<PlateDrawers g={g} act={act} wide={g.focus==='room'} enabled={photo.ready}/>:null}
{g.room===1&&g.focus==='room'&&g.facing===1&&g.opened.includes(2)?<><PhotoPatch src={image('east-drawer-open','scenes/office')} rect={[29,60,45,27]}/>{!g.collected.includes('receipts')?<PhotoObject src={image('receipts','items')} rect={[43,66,15,6]} brightness={.84}/>:null}<PhotoDigits values={drumValues(g,2)} windows={[48.1,49.78,51.4].map(x=>({x,y:74.9,width:.65,height:2.1}))}/></>:null}
{g.room===1&&g.focus==='room'&&g.facing===1&&g.opened.includes(26)?<PhotoPatch src={image('east-case-open','scenes/office')} rect={[62,42,10,17]}/>:null}
{g.room===1&&g.focus==='room'&&g.facing===0&&g.opened.includes(3)?<><PhotoPatch src={image('north-open','scenes/office')} rect={[33,51,34,32]}/><PhotoDigits values={drumValues(g,3)} windows={[48.1,49.12,50.12,51.12].map(x=>({x,y:66.6,width:.62,height:1.9}))}/>{!g.collected.includes('folios')?<PhotoObject src={image('folios','items')} rect={[42,57.5,15,3.5]} brightness={.8}/>:null}</>:null}
{g.room===1&&g.focus.startsWith('object:')&&officeDrums[+g.focus.slice(7)]?<PhotoDigits values={drumValues(g,+g.focus.slice(7))} windows={officeDrums[+g.focus.slice(7)][g.opened.includes(+g.focus.slice(7))?'open':'closed']} enabled={photo.ready} onTurn={g.opened.includes(+g.focus.slice(7))?undefined:i=>act({type:'p-set',id:+g.focus.slice(7),values:turnDrum(g,+g.focus.slice(7),i)})}/>:null}
{g.room===1&&g.focus==='room'?(g.facing===1?[2,26]:g.facing===0?[3]:[]).filter(id=>!g.opened.includes(id)).map(id=><PhotoDigits key={id} values={drumValues(g,id)} windows={officeDrums[id].wide}/>):null}
{g.room===1&&g.facing===0?<TicketInk variant={g.focus==='office-tickets'?'close':g.focus==='object:3'?'cabinet':'wide'}/>:null}
{g.room===1&&g.focus==='object:26'&&g.opened.includes(26)&&!g.collected.includes('keyparts')?<div className="r-key-placement"><KeyParts projected/></div>:null}
{g.room===2&&g.focus==='object:4'&&g.opened.includes(4)?<>{!g.collected.includes('knife')?<PhotoPatch src={image('p04-open-full','closeups')} rect={[17.5,34,34,6.5]}/>:null}{!g.collected.includes('lens')?<PhotoPatch src={image('p04-open-full','closeups')} rect={[55.5,30,24.5,10.5]}/>:null}</>:null}
{g.room===2&&g.focus==='room'&&g.facing===0&&g.opened.includes(4)?<><PhotoPatch src={image('north-box-open','scenes/proof')} rect={[69,44,12.5,13.5]}/>{!g.collected.includes('knife')?<PhotoObject src={image('knife','items')} rect={[70.5,51.1,5.2,1.2]} brightness={.65}/>:null}{!g.collected.includes('lens')?<PhotoObject src={image('lens','items')} rect={[76,50.5,3.6,1.7]} brightness={.65}/>:null}</>:null}
{g.room===2&&g.facing===0&&(g.focus==='object:4'||g.focus==='room')?<RingLock g={g} act={act} wide={g.focus==='room'} enabled={photo.ready}/>:null}
{g.room===2&&g.facing===0&&g.focus==='room'&&g.opened.includes(7)?<PhotoPatch src={image('north-door-open','scenes/proof')} rect={[9,9,31,75]}/>:null}
{g.room===2&&g.facing===0&&(g.focus==='object:7'||g.focus==='room')&&!g.opened.includes(7)?<DoorMarks wide={g.focus==='room'}/>:null}
{g.room===2&&g.facing===1&&g.focus==='object:5'?<MeasureBench g={g} act={act} enabled={photo.ready}/>:null}
{g.room===2&&g.facing===1&&g.focus==='room'?<MeasureBench g={g} act={act} wide enabled={false}/>:null}
{g.room===2&&g.focus==='object:6'?<ProofPapers g={g} act={act} enabled={photo.ready}/>:null}
{g.room===2&&g.focus==='room'&&g.facing===3?<div className="r-proof-papers-wide"><ProofPapers g={g} act={act} enabled={false}/></div>:null}
{g.room===0&&g.facing===2&&(g.focus==='room'||g.focus==='object:1')?<TicketCase g={g} act={act} wide={g.focus==='room'} enabled={photo.ready}/>:null}

{g.room===4&&g.facing===2&&g.focus==='room'?<PressSamples wide/>:null}
{g.focus==='press-samples'?<PressSamples/>:null}
{g.room===4&&g.facing===2&&(g.focus==='room'||g.focus==='object:11')?<InterlockBox g={g} act={act} wide={g.focus==='room'} enabled={photo.ready}/>:null}
{g.room===5&&g.facing===0&&g.focus==='room'?<ThreadScene g={g} act={act} wide enabled={false}/>:null}
{g.focus==='object:13'?<ThreadScene g={g} act={act} enabled={photo.ready} zoom={threadZoom} onZoom={setThreadZoom}/>:null}
{g.room===4&&g.facing===0&&g.focus==='room'?<PressMechanism g={g} act={act} wide enabled={false}/>:null}
{g.focus==='object:12'?<PressScene g={g} act={act} view={pressView} onView={setPressView} enabled={photo.ready} showBack={false}/>:null}
{g.room===3&&g.facing===1&&(g.focus==='room'||g.focus==='object:8')?<Balance g={g} act={act} wide={g.focus==='room'} enabled={photo.ready}/>:null}
{areas.map(a=><button disabled={!photo.ready} key={a.name} aria-label={a.name} className={'r-target '+(g.outlines?'marked':'')} style={{left:a.rect[0]+'%',top:a.rect[1]+'%',width:a.rect[2]+'%',height:a.rect[3]+'%',clipPath:a.shape,zIndex:a.priority??2}} onClick={a.action}/>)}
{g.focus==='room'?<><button disabled={!photo.ready} className="r-nav r-left" aria-label="左を向く" onClick={()=>act({type:'turn',delta:-1})}><Icon name="left"/></button><button disabled={!photo.ready} className="r-nav r-right" aria-label="右を向く" onClick={()=>act({type:'turn',delta:1})}><Icon name="right"/></button></>:<button disabled={!photo.ready} className="r-nav r-back" aria-label="元の視点へ戻る" onClick={()=>act({type:'back'})}><Icon name="back"/></button>}
{photo.failed?<button className="r-image-retry" onClick={photo.retry}>画像を再読み込み</button>:null}<div className="r-tools"><button aria-label="調べられる物を表示" aria-pressed={g.outlines} onClick={()=>act({type:'settings',key:'outlines',value:!g.outlines})}><Icon name="eye"/></button><button aria-label="ヒント" onClick={()=>{setPanel('help');setHint(0)}}><Icon name="help"/></button><button aria-label="設定" onClick={()=>{setResetConfirm(false);setPanel('settings')}}><Icon name="settings"/></button></div>
<div className={'r-message '+(toast?'visible':'')} role="status">{toast}</div></div>
<footer className="r-inventory" aria-label="持ち物"><Icon name="bag"/>{g.inventory.map(n=><div className="r-item" key={n}><button aria-label={itemNames[n]+'を選ぶ'} aria-pressed={g.selected===n} className={g.selected===n?'selected':''} onClick={()=>act({type:'select',item:n})}>{n==='proof'?<div className='r-held-print'><PrintedSheet layers={decodePrint(g.itemValues.proof)}/></div>:n==='plates'?<HeldPlates g={g}/>:n==='keyparts'?<KeyParts values={g.itemValues.keyparts}/>:<img src={image(n==='register'?'paper-strip':n,'items')} alt=""/>}</button><button className="r-inspect-button" aria-label={itemNames[n]+'を観察する'} onClick={()=>setInspect(n)}><Icon name="inspect"/></button></div>)}{saveFailed?<span>保存できません</span>:null}</footer>
{inspect?<section className="r-overlay item-view" role="dialog" aria-modal="true" aria-label="手元の物">{inspect==='proof'?<HeldPrint layers={decodePrint(g.itemValues.proof)}/>:inspect==='plates'?<HeldPlates g={g} detail/>:inspect==='receipts'?<ReceiptPapers g={g} act={act}/>:inspect==='folios'?<FolioPapers g={g} act={act}/>:inspect==='keyparts'?<KeyParts values={g.itemValues.keyparts} detail onChange={values=>act({type:'item-arrange',item:'keyparts',values})}/>:<img src={image(inspect==='register'?'paper-strip':inspect,'items')} alt={itemNames[inspect]}/>}<button className="r-nav r-back" aria-label="観察を閉じる" autoFocus onClick={()=>setInspect(null)}><Icon name="back"/></button></section>:null}
{panel?<section className="r-overlay" role="dialog" aria-modal="true" aria-label={panel==='help'?'ヒント':'設定'}><div className="r-panel"><button className="r-panel-close" aria-label="閉じる" autoFocus onClick={()=>setPanel(null)}><Icon name="close"/></button>{panel==='help'?<><p>{help[Math.min(hint,help.length-1)]}</p><div className="hint-step"><button disabled={hint===0} onClick={()=>setHint(h=>h-1)}>前</button><span>{hint+1} / {help.length}</span><button disabled={hint>=help.length-1} onClick={()=>setHint(h=>h+1)}>次</button></div></>:<><h1>設定</h1><label>明るさ<input type="range" min=".75" max="1.4" step=".05" value={g.brightness} onChange={e=>act({type:'settings',key:'brightness',value:+e.target.value})}/></label><label><input type="checkbox" checked={g.reducedMotion} onChange={e=>act({type:'settings',key:'reducedMotion',value:e.target.checked})}/>動きを抑える</label><p className="r-settings-note">物は写真の上で操作できます。手元の物は選んでから使用先へ。虫眼鏡で単体を観察できます。</p><small>進行はこの端末に自動保存されます。旧版の保存とは別です。</small>{resetConfirm?<div className="r-reset"><p>この進行を最初からやり直します。</p><button onClick={()=>{const next=initial();world.current=next;setG(next);setPanel(null);setResetConfirm(false)}}>やり直す</button><button onClick={()=>setResetConfirm(false)}>取り消す</button></div>:<button className="r-reset-link" onClick={()=>setResetConfirm(true)}>最初から</button>}</>}</div></section>:null}
{boundary?<section className="r-overlay" role="dialog" aria-modal="true" aria-label="確認版の範囲"><div className="r-panel"><p>この先は制作中です。</p><p className="r-settings-note"></p><button autoFocus onClick={()=>setBoundary(false)}>戻る</button></div></section>:null}
</main>;
}
