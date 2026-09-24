import {useEffect,useState} from 'react';
const loaded=new Set<string>(),pending=new Map<string,Promise<void>>();
function decode(source:string){if(loaded.has(source))return Promise.resolve();const existing=pending.get(source);if(existing)return existing;const promise=new Promise<void>((resolve,reject)=>{const photo=new Image();photo.onload=()=>{photo.decode().then(()=>{loaded.add(source);pending.delete(source);resolve()}).catch(()=>{pending.delete(source);reject(new Error(source))})};photo.onerror=()=>{pending.delete(source);reject(new Error(source))};photo.src=source});pending.set(source,promise);return promise}
export function usePhoto(sources:string[]){
const signature=sources.join('\n'),source=sources[0],cached=sources.every(s=>loaded.has(s));
const [frame,setFrame]=useState({source,signature:''}),[failed,setFailed]=useState(false),[retryCount,retry]=useState(0);
useEffect(()=>{let active=true;setFailed(false);Promise.all(signature.split('\n').map(decode)).then(()=>{if(active)setFrame({source,signature})}).catch(()=>{if(active)setFailed(true)});return()=>{active=false}},[source,signature,retryCount]);
const ready=cached||frame.signature===signature&&!failed;
return {shown:ready?source:frame.source,ready,hasFrame:cached||frame.signature!=='',failed,retry:()=>retry(n=>n+1)};
}
