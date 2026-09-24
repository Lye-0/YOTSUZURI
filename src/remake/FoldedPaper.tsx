import {photoBounds} from './photoBounds';
import {paperStocks} from './gatherings';
import {PrintedMark} from './PrintedMark';
export function FoldedPaper({index=0,flip=false,rotate=false,illuminated=false}:{index?:number;flip?:boolean;rotate?:boolean;illuminated?:boolean}){
 const p=photoBounds['parts/watermark/folded-paper'];if(!p)return null;const stock=paperStocks[index];
 return <svg viewBox="0 0 150 200" preserveAspectRatio="none" width="100%" height="100%" style={{display:'block',overflow:'visible'}} aria-hidden="true"><g transform={rotate?'translate(150 200) rotate(180)':undefined}><g transform={flip?'translate(150 0) scale(-1 1)':undefined}>
 <svg width="150" height="200" viewBox={p.bounds.join(' ')} preserveAspectRatio="none"><image href={import.meta.env.BASE_URL+'remake/parts/watermark/folded-paper.webp'} width={p.width} height={p.height} style={{filter:illuminated?'brightness(1.08) saturate(.8)':undefined}}/></svg>
 {illuminated?<><path d="M47 12V188M59 12V188" stroke="#6e624c" strokeWidth=".65" opacity=".1"/><g transform={`translate(102 ${stock.y*200}) scale(${stock.hand} 1)`} style={{color:'#726849',opacity:.24}}><PrintedMark n={3} size={31}/><path d="M-15 22H15M-15 27H15" stroke="currentColor" strokeWidth="1.2"/></g></>:null}
 </g></g></svg>;
}
export function GatheringTop(){return <svg viewBox="0 0 200 150" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true"><g transform="translate(200 0) rotate(90)"><svg width="150" height="200"><FoldedPaper/></svg></g></svg>;}
