import { Paper } from './Documents';
const readings = [['9', '2', '7', '3'], ['46', '03', '18', '57'], ['4', '6', '9', '0']];
const edges = [[[45, 35], [20, 55], [70, 15], [10, 70]], [[65, 20], [15, 60], [35, 55], [75, 25]], [[20, 70], [55, 45], [70, 15], [10, 30]]];
export function Receipts({ v, change }: {
    v: number[];
    change: (i: number, n: number) => void;
}) { return <div className="receipt-apparatus"><div className="receipt-guide start-guide"/><div className="receipts">{[0, 1, 2].map(i => <div key={i}><Paper><span className="tiny">複写控え　{i + 1}</span><div className="receipt-window"><svg viewBox="0 0 100 90" preserveAspectRatio="none"><path d={`M0 ${edges[i][v[i]][0]} L100 ${edges[i][v[i]][1]}`} stroke="#745d3c" strokeWidth="2"/><path d={`M0 ${edges[i][v[i]][0] + 9} L100 ${edges[i][v[i]][1] + 9}`} stroke="#745d3c" strokeWidth=".7"/><text x="50" y="75" textAnchor="middle" fontSize="22">{readings[i][v[i]]}</text></svg></div><span className="tiny">返却欄</span></Paper><input aria-label={`控え${i + 1}の位置`} type="range" min="0" max="3" value={v[i]} onChange={e => change(i, +e.target.value)}/></div>)}</div><div className="receipt-guide end-guide"/><p className="object-note">台の両端から、二本の罫線が続いている。</p></div>; }
