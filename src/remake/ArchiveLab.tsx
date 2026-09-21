import {archiveTraceEye} from './archivePlan';
import {useEffect,useRef,useState} from 'react';
import {ArchiveScene,archivePhotoFiles} from './ArchiveScene';
import {initialShelves,validShelves,canMoveShelf,archiveLookAt,shelfFootPoint} from './archiveSpace';
import {usePhoto} from './usePhoto';
import {Icon} from './Icons';
const SAVE='yotsuzuri:archive-lab:v2';
function restore(){try{const s=JSON.parse(localStorage.getItem(SAVE)??'null');if(s&&validShelves(s.values))return {values:s.values as number[],open:s.open===true};}catch{}return {values:initialShelves(),open:false};}
export default function ArchiveLab(){
 const [saved]=useState(restore),[values,setValues]=useState(saved.values),[room,setRoom]=useState<6|7>(6),[facing,setFacing]=useState(0),[open,setOpen]=useState(saved.open),[message,setMessage]=useState(''),[selected,setSelected]=useState(-1),[keyboard,setKeyboard]=useState(false),[trace,setTrace]=useState<number|null>(null),[detail,setDetail]=useState<[number,number]|null>(null),[busy,setBusy]=useState(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);const photo=usePhoto(archivePhotoFiles);
 useEffect(()=>{localStorage.setItem(SAVE,JSON.stringify({values,open}));},[values,open]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const move=(i:number,p:number)=>{if(busy)return;if(canMoveShelf(values,i,p)){setValues(v=>v.map((n,j)=>i===j?p:n));setMessage('');setBusy(true);timer.current=setTimeout(()=>setBusy(false),240);}else setMessage('他の棚に当たる。');};
 const turn=(n:number)=>{setFacing(f=>(f+n+4)%4);setSelected(-1);setMessage('');};
 const camera=detail?archiveLookAt(shelfFootPoint(values,...detail),facing):trace!==null?archiveTraceEye(trace,facing):undefined,close=detail!==null||trace!==null;
 return <main className="remake"><div className="r-stage" aria-busy={!photo.ready}>
 {photo.ready?<ArchiveScene values={values} facing={facing} room={room} doorOpen={open} camera={camera} selected={close?-1:selected} busy={busy} keyboard={keyboard} onSelect={close||room===7?undefined:(i,k)=>{setSelected(i);setKeyboard(k);setMessage('');}} onMove={close||room===7?undefined:move} onInspect={(i,end)=>{setDetail([i,end]);setSelected(-1);}} onDoor={close||room===7?undefined:()=>{setOpen(v=>!v);setSelected(-1);}} onTrace={close?undefined:i=>{setTrace(i);setSelected(-1);}} onPortal={close?undefined:r=>{if(r===6||r===7){setRoom(r);setSelected(-1);}else setMessage('接続先を制作中。');}}/>:photo.failed?<button className="r-image-retry" onClick={photo.retry}>画像を再読み込み</button>:<div className="r-loading"/>}
 {close?<button className="r-nav r-back" aria-label="書庫全体へ戻る" onClick={()=>{setDetail(null);setTrace(null);}}><Icon name="back"/></button>:<><button className="r-nav r-left" aria-label="左を向く" onClick={()=>turn(-1)}><Icon name="left"/></button><button className="r-nav r-right" aria-label="右を向く" onClick={()=>turn(1)}><Icon name="right"/></button></>}
 {message?<div className="archive-feedback" role="status">{message}</div>:null}
 </div></main>;
}
