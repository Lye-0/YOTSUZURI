/** The same workshop stamps appear on the slips and their matching lock. */
export function ReceiptSeal({row=2}:{row?:number}){
 return <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
 {row===0?<><circle r="12"/><path d="M-12 -4H12M-12 4H12"/></>:row===1?<><path d="M0 -13L16 0L0 13L-16 0Z M-8 0H8"/><circle r="3"/></>:<path d="M-16 -12H8L16 -4V12H-16Z M-10 0H10 M0 -12V12"/>}
 </g>;
}
export function ReceiptLockSeal({wide=false,open=false}:{wide?:boolean;open?:boolean}){
 const y=wide?(open?355:309):(open?346:228),scale=wide?.42:1.3;
 return <svg className="r-receipt-lock-seal" viewBox="0 0 1000 562.8" preserveAspectRatio="none" aria-hidden="true"><g transform={`translate(500 ${y}) scale(${scale})`}><g transform="translate(0 .8)" style={{color:'#e0b774',opacity:.6}}><ReceiptSeal/></g><g style={{color:'#2d2016',opacity:.95}}><ReceiptSeal/></g></g></svg>;
}
