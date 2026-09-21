/** Exactly the same ink is projected onto each photographed view of the three sheets. */
export function TicketInk({variant}:{variant:'close'|'cabinet'|'wide'}){
const p=variant==='close'?[[21,45,1],[50,45,1],[79,45,1]]:variant==='cabinet'?[[35,20,.13],[50,20,.13],[64,20,.13]]:[[45.2,47.2,.05],[50,47.2,.05],[54.9,47.2,.05]];
return <svg className="r-printed-ink" viewBox="0 0 1000 562.8" preserveAspectRatio="none" aria-hidden="true">{p.map(([x,y,s],i)=><g key={i} transform={`translate(${x*10},${y*5.628}) scale(${s})`} fill="#46382b" stroke="#46382b" strokeWidth="2">
{i===0?<circle cx="0" cy="0" r="22" fill="none"/>:i===1?<path d="M0 -27 L23 0 L0 27 L-23 0Z" fill="none"/>:<path d="M10 -27 A28 28 0 1 0 10 27 A23 23 0 0 1 10 -27Z"/>}
<text x="0" y="112" textAnchor="middle" fontFamily="Georgia,serif" fontSize="73" stroke="none">{[8,6,4][i]}</text>
</g>)}</svg>;
}
