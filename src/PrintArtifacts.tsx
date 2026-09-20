import { impression, plateCells, rotateCells } from './mechanics';
import { Paper } from './Documents';
export function PlateFace({ index, turn }: {
    index: number;
    turn: number;
}) { const cells = rotateCells(plateCells(index), index === 0 ? 3 : 1); return <svg className="plate-face" viewBox="0 0 200 200" style={{ transform: `rotate(${turn * 90}deg)` }}><defs><linearGradient id={'brass-' + index}><stop stopColor="#685332"/><stop offset=".48" stopColor="#bba16b"/><stop offset="1" stopColor="#78613b"/></linearGradient></defs><rect x="3" y="3" width="194" height="194" rx="3" fill={'url(#brass-' + index + ')'} stroke="#312319" strokeWidth="5"/>{cells.map((n, i) => n ? <rect key={i} x={25 + i % 6 * 25} y={25 + Math.floor(i / 6) * 25} width="25" height="25" fill="#34291c" stroke="#887045" strokeWidth=".5"/> : null)}<circle cx={index === 0 ? 12 : 188} cy={index === 0 ? 188 : 12} r="5" fill="#191710"/><path d={index === 0 ? 'M5 18H18V5' : 'M170 195V182H195'} fill="none" stroke="#ebe0b9" strokeWidth="3"/></svg>; }
const mapMarks: Record<number, [
    string,
    number
]> = { 0: ['Ⅰ', 3], 13: ['Ⅱ', 1], 20: ['Ⅲ', 2], 16: ['Ⅳ', 0], 12: ['Ⅰ', 0], 25: ['Ⅱ', 3], 27: ['Ⅲ', 1], 23: ['Ⅳ', 2] };
export function MaintenanceMap({ mask = false }: {
    mask?: boolean;
}) { const ink = impression([1, 3, 0, 1]); return <Paper className="maintenance-map"><div className="paper-heading">書架・保守配置</div><svg viewBox="0 0 320 350"><g transform="translate(10 20)">{Array.from({ length: 36 }, (_, i) => <g key={i} transform={`translate(${i % 6 * 50} ${Math.floor(i / 6) * 50})`}><rect width="50" height="50" fill="none" stroke="#85734f" strokeWidth=".6"/>{mapMarks[i] ? <><text x="7" y="17" fontSize="12">{mapMarks[i][0]}</text><path d="M17 29H34M26 20V29" stroke="#4b3a22" strokeWidth="3" transform={`rotate(${mapMarks[i][1] * 90} 25 28)`}/></> : <path d="M4 42H16M34 8H45" stroke="#b4a17a"/>}{mask && ink[i] ? <rect width="50" height="50" fill="#272219"/> : null}</g>)}</g><circle cx="7" cy="13" r="4" fill="none" stroke="currentColor"/><path d="M300 3V13H314" fill="none" stroke="currentColor"/></svg><small>{mask ? '窓から、四つの向きが見える。' : '同じ番号に、異なる保守位置が記されている。'}</small></Paper>; }
