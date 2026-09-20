import { MaintenanceMap, PlateFace } from './PrintArtifacts';
import { Receipts } from './Receipts';
import { Watermark } from './Watermark';
import { ItemVisual } from './ItemVisual';
import { useState } from 'react';
import { asset, getPuzzle, items } from './data';
import { type Action, type Game, value, same, BOOK_ORDER, RECEIVER, shelfBlocks, canSlide, missing } from './engine';
import { edgeHeights, impression, foldPages, folioMarks } from './mechanics';
import { Mark, Paper, Document } from './Documents';
type Props = {
    id: number;
    g: Game;
    act: (a: Action) => void;
};
const labels = ['左', '中央', '右'];
function Dial({ n, max = 10, min = 0, label, onChange }: {
    n: number;
    max?: number;
    min?: number;
    label: string;
    onChange: (n: number) => void;
}) { return <div className="dial"><button aria-label={label + 'を増やす'} onClick={() => onChange(n === max - 1 ? min : n + 1)}>▴</button><output aria-label={label}>{n}</output><button aria-label={label + 'を減らす'} onClick={() => onChange(n === min ? max - 1 : n - 1)}>▾</button></div>; }
function Order({ v, set, kind }: {
    v: number[];
    set: (v: number[]) => void;
    kind: 'seal' | 'scraps' | 'book';
}) {
    const [pick, select] = useState<number | null>(null);
    return <div className={'order ' + kind}>{v.map((n, i) => <button key={i} className={pick === i ? 'selected' : ''} aria-label={`${i + 1}番目の${kind === 'book' ? '束' : '片'} ${n + 1}`} onClick={() => {
                if (pick === null)
                    select(i);
                else {
                    const w = [...v];
                    [w[i], w[pick]] = [w[pick], w[i]];
                    set(w);
                    select(null);
                }
            }}><span className="piece-number">{n + 1}</span>{kind === 'seal' ? <svg viewBox="0 0 80 100"><path d={['M0 50 L12 30 L25 60 L38 35 L50 55 L65 20 L80 50', 'M0 50 L20 75 L35 20 L48 75 L60 25 L80 50', 'M0 50 L15 20 L30 35 L42 70 L62 40 L80 50', 'M0 50 L15 65 L30 25 L50 70 L65 55 L80 50'][n]} fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="40" cy="50" r={18 + n * 3} fill="none" stroke="currentColor"/></svg> : kind === 'scraps' ? <svg viewBox="0 0 100 150"><path d={`M0 ${[50, 110, 20, 80][n]} L100 ${[80, 130, 50, 110][n]}`} stroke="currentColor" strokeWidth="3"/><path d={`M0 ${[90, 45, 120, 65][n]} L100 ${[65, 20, 90, 45][n]}`} stroke="currentColor" strokeWidth="2"/></svg> : <span className="book-edge" style={{ backgroundImage: `url(${asset('foreedge')})`, backgroundSize: '600% 100%', backgroundPosition: `${BOOK_ORDER.indexOf(n) * 20}% center` }}/>}</button>)}<small>二つを選ぶと、位置を入れ替えられる。</small></div>;
}
function Pins({ v, set, receivers, practice = false }: {
    v: number[];
    set: (v: number[]) => void;
    receivers: number[];
    practice?: boolean;
}) { return <><div className={'pin-lock ' + (practice ? 'practice' : '')}><div className="shear-line"/>{v.map((n, i) => <div className="pin-column" key={i}><span className="receiver" style={{ height: receivers[i] * 18, bottom: n * 18 }}/><span className="key-tooth" style={{ height: n * 18 }}/><span className="pin-boundary" style={{ bottom: n * 18 + 15 }}/></div>)}</div><div className="dial-row">{v.map((n, i) => <Dial key={i} n={n} min={1} max={5} label={`${i + 1}枚目の歯`} onChange={n => { const a = [...v]; a[i] = n; set(a); }}/>)}</div></>; }
export function Puzzle({ id, g, act }: Props) {
    const p = getPuzzle(id), v = value(g, id), solved = g.solved.includes(id), opened = g.opened.includes(id);
    const [side, setSide] = useState(false);
    const [page, setPage] = useState(0);
    const [hint, setHint] = useState(0);
    const set = (values: number[]) => act({ type: 'set', id, values });
    const change = (i: number, n: number) => { const a = [...v]; a[i] = n; set(a); };
    const toggle = (n: number, max: number) => {
        if (v.includes(n))
            set(v.filter(x => x !== n));
        else if (v.length < max)
            set([...v, n]);
    };
    const test = (text = '合わせる') => <button className="physical-action" onClick={() => act({ type: 'test', id })}>{text}</button>;
    let body;
    switch (id) {
        case 1:
        case 15:
        case 18: {
            const order = id === 1 ? [1, 3, 0, 2] : id === 15 ? [1, 2, 0] : [2, 0, 1];
            body = <div className={'slats ' + (id === 18 ? 'envelope' : '')}>{v.map((n, i) => <button key={i} style={{ zIndex: 10 - order.indexOf(i), transform: `translate(${n ? 'var(--pull-distance,75px)' : '0px'},0) rotate(${id === 18 ? (i - 1) * 6 : 0}deg)` }} disabled={!!n} aria-label={`${i + 1}枚目を引く`} onClick={() => act({ type: 'release', id, index: i })}><span className="tab-notch" style={{ left: 25 + order.indexOf(i) * 16 + '%' }}/>{id === 1 ? <><Mark n={i % 4}/><span className="paper-hole">{i % 3 + 1}</span></> : <span className="metal-grip"/>}</button>)}</div>;
            break;
        }
        case 2:
        case 26:
            body = <><div className="stamped-tags">{id === 2 ? [2, 0, 3].map((m, i) => <Paper key={m}><Mark n={m}/><b>{[6, 8, 4][i]}</b></Paper>) : <Document name="発送と返却"/>}</div><div className="dial-row brass-inset">{v.map((n, i) => <Dial key={i} n={n} label={`${i + 1}桁目`} onChange={n => change(i, n)}/>)}</div></>;
            break;
        case 3:
            body = <><Receipts v={v.slice(0, 3)} change={change}/><div className="dial-row">{v.slice(3).map((n, i) => <Dial key={i} n={n} label={`${i + 1}桁目`} onChange={n => change(i + 3, n)}/>)}</div></>;
            break;
        case 4:
        case 11:
            body = <div className="ring-device"><div className="ring-bolt"/>{v.map((n, i) => <button key={i} className={'ring ring-' + i} aria-label={`${i === 0 ? '外' : '内'}の環を回す`} onClick={() => change(i, (n + 1) % 8)} style={{ transform: `rotate(${(n - (id === 4 ? [3, 6] : [2, 4])[i]) * 45}deg)` }}><img src={asset('ring')} alt=""/></button>)}<span className="ring-label">切れ目に留め爪を通す</span></div>;
            break;
        case 5:
            body = <><Document name="基準の長さ"/><div className="lengths">{[3, 5, 6, 8, 9].map(n => <button key={n} className={v[0] === n ? 'selected' : ''} style={{ width: 55 + n * 18 }} onClick={() => set([n])}>{Array.from({ length: n }, (_, i) => <i key={i}/>)}<span>{n}目盛</span></button>)}</div>{test('紙ナイフで切り離す')}</>;
            break;
        case 6:
            body = <><Document name="紙の表裏"/><div className="paper-samples">{[0, 1, 2].map(n => <button key={n} className={v[0] === n ? 'selected' : ''} onClick={() => change(0, n)}><Paper><span className={'sample-notch notch-' + n}/><Mark n={n === 2 ? 2 : 3}/><span className={'fibers fibers-' + n}/></Paper></button>)}</div><button onClick={() => change(1, v[1] ? 0 : 1)}>{v[1] ? '裏を見ている' : '表を見ている'} ↻</button><div className={'sample-view ' + (v[1] ? 'flipped' : '')}><Mark n={v[0] === 2 ? 2 : 3}/><i style={{ left: v[0] === 1 ? 10 : undefined, right: v[0] === 1 ? 'auto' : 10 }}/><em className={'fibers fibers-' + v[0]}/></div>{test('見本と重ねる')}</>;
            break;
        case 7: {
            const slots = [[8, 1, 2, 7], [6, 3, 4, 5]];
            const pages = foldPages(v[0], v[1], v[2]);
            body = <>{g.inventory.includes('folios') ? <div className="folio-work"><div className="folio-controls"><button onClick={() => change(0, v[0] ? 0 : 1)}>{v[0] ? '傷のある紙が外側' : '傷のない紙が外側'}</button>{[1, 2].map((n) => <button key={n} onClick={() => change(n, v[n] ? 0 : 1)}>{n === 1 ? '傷のある紙' : 'もう一枚'}を裏返す {v[n] ? '裏' : '表'}</button>)}</div><div className="flat-folios">{slots.map((s, i) => <Paper key={i} className={i === 0 ? 'scarred-folio' : ''}><span className="fold-line"/>{(v[i + 1] ? [...s].reverse() : s).map((n, j) => <div key={j} className="folio-cell"><Mark n={folioMarks[n - 1]}/></div>)}</Paper>)}</div><div className="folded-book"><Paper><small>{page + 1} / 8　{page % 2 === 0 ? '右の頁' : '左の頁'}</small><Mark n={folioMarks[pages[page] - 1]} size={72}/></Paper><button onClick={() => setPage((page + 7) % 8)}>前の頁</button><button onClick={() => setPage((page + 1) % 8)}>頁をめくる</button></div></div> : <p className="object-note">戸には、四つの印の押し金がある。</p>}<div className="mark-buttons">{[0, 1, 2, 3].map(n => <button key={n} aria-label={['丸', '二本線', '菱形', '三日月'][n]} onClick={() => act({ type: 'sequence', id, button: n })}><Mark n={n}/></button>)}</div><div className="sequence-trace">{(g.sequences[id] ?? []).map((n, i) => <Mark key={i} n={n} size={20}/>)}</div></>;
            break;
        }
        case 8: {
            const sums = [1, 2].map(s => v.reduce((a, n, i) => a + (n === s ? [2, 3, 5][i] : 0), 0));
            body = <><div className="balance" style={{ transform: `rotate(${Math.max(-10, Math.min(10, (sums[0] - sums[1]) * 2))}deg)` }}><div className="balance-arm"/><div className="pan left-pan">{sums[0]}</div><div className="pan right-pan">{sums[1]}</div></div><div className="weights">{v.map((n, i) => <div key={i}><b>{['Ⅱ', 'Ⅲ', 'Ⅴ'][i]}</b><div>{['台', '左皿', '右皿'].map((s, j) => <button key={s} className={n === j ? 'selected' : ''} onClick={() => change(i, j)}>{s}</button>)}</div></div>)}</div></>;
            break;
        }
        case 9:
        case 14:
            body = <>{id === 9 ? <div className="seal-imprints">{[2, 0, 3, 1].map((n, i) => <span key={i} style={{ clipPath: ['polygon(0 50%,15% 30%,30% 60%,48% 35%,65% 55%,82% 20%,100% 50%,100% 100%,0 100%)', 'polygon(0 50%,25% 75%,44% 20%,60% 75%,75% 25%,100% 50%,100% 100%,0 100%)', 'polygon(0 50%,19% 20%,37% 35%,52% 70%,77% 40%,100% 50%,100% 100%,0 100%)', 'polygon(0 50%,19% 65%,37% 25%,62% 70%,81% 55%,100% 50%,100% 100%,0 100%)'][n] }}/>)}</div> : <Paper><p className="tiny">旧書庫・床板の継ぎ目</p><svg viewBox="0 0 400 80"><path d="M0 20 L400 130 M0 120 L400 20" stroke="currentColor" fill="none"/></svg></Paper>}<Order kind={id === 9 ? 'seal' : 'scraps'} v={v} set={set}/></>;
            break;
        case 10:
            body = <><Document name="試し押し"/><div className="plate-choices">{[0, 1, 2, 3].map(n => <button key={n} className={v.includes(n) ? 'selected' : ''} onClick={() => toggle(n, 2)}><div className={'engraving engraving-' + n}><span /></div><small>{n + 1}　{v.includes(n) ? '押さえた' : ''}</small></button>)}</div>{test('二枚を取り出す')}</>;
            break;
        case 12: {
            const printed = g.records[12];
            body = <><div className="print-machine"><div className="print-plates">{[0, 1].map(i => <button key={i} aria-label={`版${i ? 'B' : 'A'}を回す`} onClick={() => change(i, (v[i] + 1) % 4)}><PlateFace index={i} turn={v[i]}/><span>版{i ? 'B' : 'A'}　↻</span></button>)}</div><Paper><div className={'print-output ' + (g.records[12] ? 'inked' : '')}><div className="register-mark top"/><div className="register-mark bottom"/>{printed ? <svg viewBox="0 0 180 180">{impression(printed).map((n, i) => n ? <rect key={i} x={i % 6 * 30} y={Math.floor(i / 6) * 30} width={30} height={30} fill="#30281e"/> : null)}</svg> : <span>刷り紙</span>}</div></Paper></div><div className="physical-controls"><button onClick={() => change(2, v[2] ? 0 : 1)}>紙 {v[2] ? '裏' : '表'} ↻</button><label>見当<input aria-label="見当のずれ" type="range" min="0" max="2" value={v[3]} onChange={e => change(3, +e.target.value)}/></label>{test('ハンドルを下ろす')}</div></>;
            break;
        }
        case 13:
            body = <><button onClick={() => setSide(!side)}>台を{side ? '表へ戻す' : '裏返す'}</button>{side ? <Document name="綴じ穴"/> : <div className="thread-frame"><div className="threads">{[0, 1, 2, 3, 4, 5].map(n => <i key={n}/>)}</div><div className="hole-buttons">{[0, 1, 2, 3, 4, 5].map(n => <button key={n} aria-label={`${n + 1}番の穴を外す`} onClick={() => act({ type: 'sequence', id, button: n })}>{n + 1}</button>)}</div></div>}<div className="sequence-trace">{(g.sequences[id] ?? []).map(n => n + 1).join(' → ')}</div></>;
            break;
        case 16:
            body = <><div className="rail-locks">{v.slice(4).map((n, i) => <button key={i} aria-label={`書架${i + 1}の留めを回す`} onClick={() => change(i + 4, (n + 1) % 4)}><span>{['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'][i]}</span><svg viewBox="0 0 50 50" style={{ transform: `rotate(${n * 90}deg)` }}><path d="M12 28H38M25 12V28" stroke="currentColor" strokeWidth="5"/></svg></button>)}</div>{g.inventory.includes('oldplan') ? <><button onClick={() => setSide(!side)}>{side ? '旧図を閉じる' : '旧図を広げる'}</button>{side ? <><MaintenanceMap mask={page === 1 && g.inventory.includes('proof')}/>{g.inventory.includes('proof') ? <button onClick={() => setPage(page ? 0 : 1)}>{page ? '窓の紙を外す' : '刷り紙の窓を重ねる'}</button> : null}</> : null}</> : null}<div className="shelf-board"><span className="shelf-exit"/>{Array.from({ length: 36 }, (_, i) => <i className="floor-tile" key={i}/>)}{shelfBlocks.map((b, i) => <div key={i} className={'shelf-block shelf-' + i} style={{ left: (b.axis === 'x' ? v[i] : b.fixed) * 100 / 6 + '%', top: (b.axis === 'y' ? v[i] : b.fixed) * 100 / 6 + '%', width: (b.axis === 'x' ? b.len : 1) * 100 / 6 + '%', height: (b.axis === 'y' ? b.len : 1) * 100 / 6 + '%' }}><button disabled={!canSlide(v, i, v[i] - 1)} aria-label={`棚${i + 1}を${b.axis === 'x' ? '左' : '上'}へ`} onClick={() => act({ type: 'slide', index: i, position: v[i] - 1 })}>{b.axis === 'x' ? '‹' : '⌃'}</button><span>{['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'][i]}</span><button disabled={!canSlide(v, i, v[i] + 1)} aria-label={`棚${i + 1}を${b.axis === 'x' ? '右' : '下'}へ`} onClick={() => act({ type: 'slide', index: i, position: v[i] + 1 })}>{b.axis === 'x' ? '›' : '⌄'}</button></div>)}</div><p className="object-note">床の継ぎ目に沿って、書架が動く。</p></>;
            break;
        case 17:
            body = <><Document name="透かし"/><div className="watermarks">{[0, 1, 2, 3, 4, 5].map(n => <button key={n} className={v.includes(n) ? 'selected' : ''} onClick={() => toggle(n, 3)}><Paper><span className="fold-line"/><Watermark index={n}/><small>{n + 1}</small></Paper></button>)}</div>{test('同じ紙を取り分ける')}</>;
            break;
        case 19:
            body = <><div className="weighed-books">{[14, 17, 13, 18].map((n, i) => <button key={i} className={v[0] === i ? 'selected' : ''} onClick={() => set([i])}><span className="cloth-book" style={{ filter: `hue-rotate(${i * 18}deg)` }}/><strong>{n} 匁</strong><small>金具 {['二', '五', '四', '六'][i]}</small></button>)}</div><Document name="金具の重さ"/>{test('背を開く')}</>;
            break;
        case 20:
            body = <><div className="light-table"><div className="lamp-source"/><svg viewBox="0 0 600 220"><path d={v[0] === 1 ? (v[1] === 2 ? 'M0 150 H170 V65 H430 V200' : 'M0 150 H170 V65 H600') : 'M0 150 H600'} stroke="#ffe3a0" strokeWidth="4" fill="none"/><rect x="405" y="185" width="50" height="25" fill="#2c2018" stroke="#a98f52"/></svg>{v.map((n, i) => <button key={i} className={'reflector reflector-' + i} aria-label={`${labels[i]}の反射片を回す`} onClick={() => change(i, (n + 1) % 4)} style={{ transform: `rotate(${[0, -45, 45, 90][n]}deg)` }}/>)}</div></>;
            break;
        case 21:
            body = <><div className={'assembly ' + (solved ? 'assembled' : '')}><button className="corner-piece" aria-label="角当てを回す" onClick={() => change(0, (v[0] + 1) % 4)} style={{ transform: `rotate(${v[0] * 90}deg)` }}/><button className="wedge-piece" aria-label="木片を回す" onClick={() => change(1, (v[1] + 1) % 4)} style={{ transform: `rotate(${v[1] * 90}deg)` }}/></div>{test('二つの穴を合わせて組む')}</>;
            break;
        case 22:
            body = <><Order kind="book" v={v.slice(0, 6)} set={a => set([...a, v[6]])}/><div className={'foreedge-view fan-' + v[6]}>{v.slice(0, 6).map((n, i) => <span key={i} style={{ backgroundImage: `url(${asset('foreedge')})`, backgroundSize: '600% 100%', backgroundPosition: `${BOOK_ORDER.indexOf(n) * 20}% center` }}/>)}</div><label className="fan-control">束の傾き<input type="range" min="0" max="2" aria-label="束の傾き" value={v[6]} onChange={e => change(6, +e.target.value)}/></label>{test('小口を見る')}</>;
            break;
        case 23:
            body = <><Document name="空の穴"/><div className="blank-slots">{[0, 1, 2, 3, 4, 5, 6].map(n => <button key={n} aria-label={`${n + 1}番目の隙間`} className={v.includes(n) ? 'inserted' : ''} onClick={() => toggle(n, 2)}><span>{v.includes(n) ? '白紙' : '＋'}</span></button>)}</div>{test('綴じ痕を確かめる')}</>;
            break;
        case 24:
            body = <div className="join-frame">{v.map((n, i) => <button key={i} aria-label={`${['上', '右', '下', '左'][i]}の木片を回す`} className={'frame-part part-' + i} onClick={() => change(i, (n + 1) % 4)}><svg viewBox="0 0 200 50" style={{ transform: `rotate(${(n - [1, 3, 2, 0][i]) * 90}deg)` }}><path d="M0 10 H20 V0 H180 V20 H200 V40 H180 V50 H20 V30 H0Z" fill="#6b482a" stroke="#d5b477" strokeWidth="2"/></svg></button>)}</div>;
            break;
        case 25:
            body = <><div className="rubbing"><Paper><svg viewBox="0 0 300 200"><path d="M50 80 L85 45 H240 V145 H50Z" fill="none" stroke="#382f22" strokeWidth="4"/><path d="M50 80 L85 45 H240 V145 H50Z" fill="#726040" fillOpacity=".3" stroke="#382f22" strokeDasharray="3 4" transform={`translate(150 100) rotate(${v[1] * 90 - 180}) scale(${v[0] ? 1 : -1} 1) translate(-150 -100)`}/></svg></Paper></div><button onClick={() => change(0, v[0] ? 0 : 1)}>写しを裏返す　{v[0] ? '裏' : '表'}</button><button onClick={() => change(1, (v[1] + 1) % 4)}>写しを回す ↻</button>{test('肩を合わせる')}</>;
            break;
        case 27:
            body = <><Pins v={v} set={set} receivers={[2, 1, 4]} practice/>{test('軸を回す')}</>;
            break;
        case 28:
            body = <><div className="cam-press"><div className="press-bar" style={{ transform: `rotate(${(v[0] - 2 - v[2] + 3) * 5}deg) translateY(${(v[0] - 2 + v[1] - 1 + v[2] - 3) * 8}px)` }}/><span className="level-target"/><div className="cams">{v.map((n, i) => <button key={i} aria-label={`${['左', '奥', '右'][i]}のカムを回す`} onClick={() => change(i, (n + 1) % 4)}><i style={{ transform: `rotate(${n * 90}deg)` }}/><div className="cam-gauge"><b style={{ bottom: 20 + (n - [2, 1, 3][i]) * 8 }}/></div><span>{['左', '奥', '右'][i]} {n}</span></button>)}</div></div></>;
            break;
        case 29:
            body = <><Document name="裏口の鍵穴"/><div className="master-plates">{[0, 1].map(n => <button key={n} className={v[0] === n ? 'selected' : ''} onClick={() => set([n])}><svg viewBox="0 0 220 120"><path d={n ? 'M15 40 L45 10 H205 V100 H15Z' : 'M15 10 H205 V100 H15Z'} fill="#8d743e" stroke="#d4be87" strokeWidth="3"/><path d="M65 100 V75 H85 V35 H110 V60 H135 V20 H160 V100" fill="none" stroke="#241d13" strokeWidth="5"/></svg><span>{n ? '右の原型' : '左の原型'}</span></button>)}</div>{test('鍵穴にあてがう')}</>;
            break;
        case 30: {
            const order = value(g, 22), blanks = value(g, 23), master = value(g, 29)[0];
            const assembled = same(order.slice(0, 6), BOOK_ORDER) && same([...blanks].sort(), [1, 4]) && master === 1;
            body = <><p className="object-note">束を綴じ、閉じた本の端面を原型へあてる。</p><Order kind="book" v={order.slice(0, 6)} set={a => act({ type: 'set', id: 22, values: [...a, order[6]] })}/><div className="blank-slots">{[0, 1, 2, 3, 4, 5, 6].map(n => <button key={n} aria-label={`白紙の隙間${n + 1}`} className={blanks.includes(n) ? 'inserted' : ''} onClick={() => act({ type: 'set', id: 23, values: blanks.includes(n) ? blanks.filter(x => x !== n) : blanks.length < 2 ? [...blanks, n] : blanks })}>{blanks.includes(n) ? '白紙' : '＋'}</button>)}</div><button onClick={() => act({ type: 'set', id: 29, values: [master ? 0 : 1] })}>{master ? '三角の肩' : '四角の肩'}の原型</button><div className="closed-edge" aria-label="完成本の端面">{edgeHeights(order.slice(0, 6), blanks, master).map((n, i) => <span key={i} style={{ height: 30 + n * 16 }}><i>{Array.from({ length: n }, () => '─').join('')}</i></span>)}</div><Pins v={v} set={set} receivers={RECEIVER}/>{test('鍵を差し、回す')}</>;
            break;
        }
        default: body = null;
    }
    return <div className={'puzzle puzzle-' + id} data-puzzle={id}><div className="puzzle-heading"><h2>{p.name}</h2><button className="hint-toggle" onClick={() => setHint(h => Math.min(3, h + 1))}>手がかり</button></div>{hint > 0 ? <aside className="hint"><span>{p.hint[hint - 1]}</span><button onClick={() => setHint(0)} aria-label="手がかりを閉じる">×</button></aside> : null}<div className="puzzle-body" style={{ backgroundImage: `url(${asset('workbench')})` }}>{body}</div>{missing(g, id).length && !solved ? <p className="missing">作業台の空き：{missing(g, id).map(n => items[n].name).join('・')}</p> : null}{solved ? <div className="result-tray"><p>{p.notice}</p>{p.box && !opened ? <button onClick={() => act({ type: 'open', id })}>{[7, 15].includes(id) ? '戸を開ける' : '留め金を外して開ける'}</button> : p.rewards.filter(n => !g.collected.includes(n)).map(n => <button className="take-item" key={n} onClick={() => act({ type: 'take', id, item: n })}><ItemVisual id={n}/>{items[n].name}を取る</button>)}{p.rewards.length > 0 && p.rewards.every(n => g.collected.includes(n)) ? <span className="empty-tray">中身を取り出した。</span> : null}{id === 30 ? <button className="exit-action" onClick={() => act({ type: 'finish' })}>戸を押して、外へ</button> : null}</div> : null}</div>;
}
