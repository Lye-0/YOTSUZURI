import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { asset, roomNames, roomAssets, puzzles, neighbors, locations, cluesByRoom, items } from './data';
import { fresh, parseSave, reduce, roomAllowed, SAVE_KEY, type Action, type Game } from './engine';
import { ItemVisual } from './ItemVisual';
import { SceneChanges } from './SceneChanges';
import { Puzzle } from './Puzzles';
import { Document, Paper } from './Documents';
const itemDocuments: Record<string, string> = { card: '返却札', receipts: '三枚の控え', folios: '折り見本', threadchart: '綴じ穴', oldplan: '旧書庫の見取り図', tissue: '紙の表裏', returnrecord: '発送と返却', proof: '刷り紙の窓' };
function Modal({ title, children, onClose, wide = false }: {
    title: string;
    children: ReactNode;
    onClose: () => void;
    wide?: boolean;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => { const prior = document.activeElement as HTMLElement | null; ref.current?.showModal(); return () => { ref.current?.close(); prior?.focus(); }; }, []);
    return <dialog ref={ref} className={wide ? 'wide' : ''} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => {
            if (e.target === e.currentTarget)
                onClose();
        }}><header className="modal-top"><span>{title}</span><button autoFocus aria-label="閉じて部屋に戻る" onClick={onClose}>戻る <span>×</span></button></header>{children}</dialog>;
}
function initialLoad() {
    try {
        return parseSave(localStorage.getItem(SAVE_KEY)) ?? fresh();
    }
    catch {
        return fresh();
    }
}
export default function App() {
    const [g, setGame] = useState<Game>(initialLoad);
    const current = useRef(g);
    current.current = g;
    const [puzzle, setPuzzle] = useState<number | null>(null), [doc, setDoc] = useState<string | null>(null), [item, setItem] = useState<string | null>(null), [panel, setPanel] = useState<'map' | 'notes' | 'settings' | null>(null), [toast, setToast] = useState(''), [saveError, setSaveError] = useState(false), [compare, setCompare] = useState<string | null>(null), [reset, setReset] = useState(false);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const act = (a: Action) => {
        const r = reduce(current.current, a);
        current.current = r.game;
        setGame(r.game);
        if (r.message) {
            setToast(r.message);
            clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setToast(''), 5000);
        }
        if (r.game.sound && r.success)
            playClick();
    };
    useEffect(() => {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(g));
            setSaveError(false);
        }
        catch {
            setSaveError(true);
        }
    }, [g]);
    useEffect(() => {
        if (!g.started || g.finished)
            return;
        const t = setInterval(() => {
            if (document.visibilityState === 'visible')
                act({ type: 'tick', seconds: 15 });
        }, 15000);
        return () => clearInterval(t);
    }, [g.started, g.finished]);
    useEffect(() => () => clearTimeout(toastTimer.current), []);
    const observe = (name: string) => { act({ type: 'observe', name }); setDoc(name); };
    const move = (room: number, map = false) => { act({ type: 'move', room, map }); setPuzzle(null); setPanel(null); setCompare(null); };
    const roomImage = roomAssets[g.room] + (g.room === 0 && g.opened.includes(7) ? '-open' : g.room === 3 && g.opened.includes(15) ? '-open' : g.room === 6 && g.solved.includes(16) ? '-open' : g.room === 8 && g.secretOpen ? '-open' : '');
    if (!g.started)
        return <main className="title-screen" style={{ backgroundImage: `url(${asset('reception')})` }}><div className="title-shade"/><div className="title-copy"><p className="eyebrow">一冊だけ、まだ返されていない。</p><h1>夜<span>綴</span></h1><p className="roman">Y O T S U Z U R I</p><div className="title-rule"/><p className="intro">雨の製本所。<br />灯りの下に、閉じられなかった本がある。</p><button className="start" onClick={() => act({ type: 'start' })}>戸をたたく <span>→</span></button><small>音は初期状態ではオフです。進行は自動で保存されます。</small></div><span className="title-edition">夜綴製本所　／　雨の夜</span></main>;
    if (g.finished)
        return <main className="ending" style={{ backgroundImage: `url(${asset('ending')})` }}><div><p className="eyebrow">雨が、やんでいる。</p><h1>返された一冊。</h1><p>振り返ると、工房の灯りが一つ消えた。<br />本を抱える手には、まだ紙の温度が残っている。</p><button onClick={() => { const back = { ...g, finished: false }; current.current = back; setGame(back); }}>工房の記憶へ戻る</button><small>夜綴 — YOTSUZURI</small></div></main>;
    return <main className={'game ' + (!g.motion ? 'no-motion' : '')} style={{ '--brightness': g.brightness } as CSSProperties}><header className="game-top"><button className="wordmark" onClick={() => setPanel('settings')}>夜綴</button><div className="room-title"><span className="room-index">{String(g.room + 1).padStart(2, '0')}</span><h1>{roomNames[g.room]}</h1></div><div className="tools"><button onClick={() => setPanel('map')}>見取り図</button><button onClick={() => setPanel('notes')}>記録</button><button aria-label="設定" onClick={() => setPanel('settings')}>設定</button></div></header><section className="room-stage" aria-label={roomNames[g.room]}><img className="room-photo" src={asset(roomImage)} alt={`${roomNames[g.room]}。雨の夜の製本所。`} draggable={false}/><SceneChanges g={g}/><div className="scene-vignette"/>{puzzles.filter(p => p.room === g.room).map(p => { const [x, y, w, h] = locations[p.id]; return <button key={p.id} className={'hotspot ' + (g.showHotspots ? 'revealed ' : '') + (g.opened.includes(p.id) ? 'opened' : '')} style={{ left: x + '%', top: y + '%', width: w + '%', height: h + '%' }} aria-label={p.name} onClick={() => setPuzzle(p.id)}><span>{p.name}{g.solved.includes(p.id) ? ' ·' : ''}</span></button>; })}{g.room === 8 ? <button className={'hotspot hidden-panel ' + (g.showHotspots ? 'revealed' : '')} style={{ left: '39%', top: '8%', width: '23%', height: '40%' }} aria-label="壁の図面の縁" onClick={() => {
                if (g.secretOpen)
                    move(9);
                else
                    act({ type: 'secret' });
            }}><span>{g.secretOpen ? '奥へ進む' : '図面の縁'}</span></button> : null}<div className="room-caption">{g.room === 0 ? '雨の音だけが、入口に残っている。' : g.room === 8 && g.secretOpen ? '壁の向こうにも、灯りがある。' : '紙と木の匂いがする。'}</div><button className={'explore-toggle ' + (g.showHotspots ? 'active' : '')} aria-pressed={g.showHotspots} onClick={() => act({ type: 'settings', key: 'showHotspots', value: !g.showHotspots })}>{g.showHotspots ? '印を消す' : '調べる場所'}</button></section><div className="under-scene"><nav className="room-nav" aria-label="部屋の移動">{neighbors[g.room].map(room => <button key={room} onClick={() => move(room)} disabled={!roomAllowed(g, room)}>{roomNames[room]}<span>{roomAllowed(g, room) ? ' →' : ' · 閉'}</span></button>)}</nav><div className="evidence-links"><span>机上・壁面</span>{cluesByRoom[g.room].filter(n => n !== '返却札' && n !== '三枚の控え').map(name => <button key={name} onClick={() => observe(name)}>{name}</button>)}</div></div><footer className="inventory"><span className="inventory-label">手元</span><div className="inventory-items">{g.inventory.length ? g.inventory.map(n => <button key={n} aria-label={items[n].name} title={items[n].name} onClick={() => setItem(n)}><ItemVisual id={n}/><small>{items[n].name}</small></button>) : <p>取り出したものが、ここに収まる。</p>}</div><span className={'save-status ' + (saveError ? 'error' : '')}>{saveError ? '保存できません。設定から書き出してください。' : '自動保存'}</span></footer><div role="status" aria-live="polite" className={'toast ' + (toast ? 'visible' : '')}>{toast}</div>
    {puzzle !== null ? <Modal title={roomNames[g.room]} onClose={() => { setPuzzle(null); setCompare(null); }} wide><div className={'detail-layout ' + (compare ? 'comparing' : '')}><Puzzle key={puzzle} id={puzzle} g={g} act={act}/>{compare ? <aside className="comparison"><button onClick={() => setCompare(null)}>比較を閉じる ×</button><Document name={compare}/></aside> : null}</div><div className="compare-tray"><label>手元の資料と比べる <select aria-label="比較する資料" value={compare ?? ''} onChange={e => setCompare(e.target.value || null)}><option value="">資料を選ぶ</option>{Array.from(new Set([...g.seen, ...g.inventory.map(n => itemDocuments[n]).filter(Boolean)])).map(n => <option key={n}>{n}</option>)}</select></label></div></Modal> : null}
    {doc ? <Modal title="残されたもの" onClose={() => setDoc(null)}><Document name={doc}/><p className="saved-note">記録へ写した。</p></Modal> : null}
    {item ? <Modal title="手元のもの" onClose={() => setItem(null)}>{itemDocuments[item] ? <Document name={itemDocuments[item]}/> : <div className="item-inspect" style={{ backgroundImage: `url(${asset('workbench')})` }}><ItemVisual id={item}/><h2>{items[item].name}</h2><p>手に取ると、使い込まれた跡が見える。</p></div>}</Modal> : null}
    {panel ? <Modal title={panel === 'map' ? '見取り図' : panel === 'notes' ? '記録' : '設定'} onClose={() => { setPanel(null); setReset(false); }}>{panel === 'map' ? <div className="map-grid">{roomNames.map((n, i) => <button key={n} className={i === g.room ? 'current' : ''} disabled={!g.visited.includes(i) || i === g.room || !roomAllowed(g, i)} onClick={() => move(i, true)}><span>{String(i + 1).padStart(2, '0')}</span>{g.visited.includes(i) ? n : '未踏'}</button>)}<p>訪れた場所へ戻れる。</p></div> : panel === 'notes' ? <div className="notebook"><Paper><p className="eyebrow">目に留まったもの</p>{Array.from(new Set([...g.seen, ...g.inventory.map(n => itemDocuments[n]).filter(Boolean)])).map(n => <button key={n} onClick={() => { setPanel(null); observe(n); }}>{n} →</button>)}{!g.seen.length && !g.inventory.length ? <p>まだ何も記していない。</p> : null}</Paper></div> : <div className="settings"><p>調べたい場所を押すと近づけます。<br />「調べる場所」で対象を表示できます。答えは表示しません。</p><label>画面の明るさ<input aria-label="明るさ" type="range" min=".8" max="1.4" step=".05" value={g.brightness} onChange={e => act({ type: 'settings', key: 'brightness', value: +e.target.value })}/></label>{(['sound', 'motion', 'showHotspots'] as const).map((k, i) => <label key={k}><input type="checkbox" checked={g[k]} onChange={e => act({ type: 'settings', key: k, value: e.target.checked })}/>{['小さな効果音', '画面の動き', '調べる場所を表示'][i]}</label>)}<div className="save-tools"><button onClick={() => { const u = URL.createObjectURL(new Blob([JSON.stringify(g)], { type: 'application/json' })); const a = document.createElement('a'); a.href = u; a.download = 'yotsuzuri-save.json'; a.click(); URL.revokeObjectURL(u); }}>保存データを書き出す</button><label className="file-input">保存データを読み込む<input type="file" accept="application/json,.json" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f)
                        return;
                    const next = parseSave(await f.text());
                    if (next) {
                        current.current = next;
                        setGame(next);
                        setPanel(null);
                        setToast('記録を読み込んだ。');
                    }
                    else
                        setToast('この記録は読み込めません。現在の進行は残っています。');
                }}/></label></div>{reset ? <div className="reset-confirm"><p>現在の進行を消して、最初から始めます。</p><button onClick={() => { const next = fresh(); current.current = next; setGame(next); setPanel(null); setReset(false); }}>進行を消す</button><button onClick={() => setReset(false)}>戻る</button></div> : <button className="quiet" onClick={() => setReset(true)}>初めから</button>}</div>}</Modal> : null}</main>;
}
let audioContext: AudioContext | undefined;
function playClick() {
    try {
        audioContext ??= new AudioContext();
        void audioContext.resume();
        const o = audioContext.createOscillator(), gain = audioContext.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(310, audioContext.currentTime);
        o.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + .16);
        gain.gain.setValueAtTime(.04, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .18);
        o.connect(gain);
        gain.connect(audioContext.destination);
        o.start();
        o.stop(audioContext.currentTime + .2);
    }
    catch { /* Audio is optional; gameplay remains available. */ }
}
