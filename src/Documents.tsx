import { impression } from './mechanics';
import { MaintenanceMap } from './PrintArtifacts';
import { Watermark } from './Watermark';
import type { ReactNode } from 'react';
import { asset } from './data';
export function Paper({ children, className = '' }: {
    children: ReactNode;
    className?: string;
}) { return <div className={'paper ' + className} style={{ backgroundImage: `url(${asset('paper')})` }}>{children}</div>; }
export function Mark({ n, size = 36 }: {
    n: number;
    size?: number;
}) { return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2.6">{n % 4 === 0 ? <circle cx="20" cy="20" r="11"/> : n % 4 === 1 ? <path d="M13 8V32M25 8V32"/> : n % 4 === 2 ? <path d="M20 5L34 20L20 35L6 20Z"/> : <path d="M28 8A14 14 0 1 0 28 32A12 12 0 0 1 28 8Z"/>}</g></svg>; }
export function Document({ name }: {
    name: string;
}) {
    if (name === '刷り紙の窓')
        return <Paper className="document"><div className="paper-heading">刷り紙の窓</div><svg viewBox="0 0 180 180">{impression([1, 3, 0, 1]).map((n, i) => <rect key={i} x={i % 6 * 30} y={Math.floor(i / 6) * 30} width="30" height="30" fill={n ? '#30291e' : '#9d8862'} fillOpacity={n ? 1 : .15}/>)}</svg><p>白く残った部分を抜いた紙。丸い見当穴が左上にある。</p></Paper>;
    if (name === '旧書庫の見取り図')
        return <MaintenanceMap />;
    return <Paper className="document"><div className="paper-heading">{name}</div>
        {name === '帰路' ? <><svg viewBox="0 0 600 280"><g fill="none" stroke="currentColor" strokeWidth="3"><path d="M40 50H560V230H40Z M240 50V230M400 50V230M40 135H400"/><path d="M150 180H480V80" strokeDasharray="8 7"/><path d="M470 95L480 80L490 95"/></g><text x="80" y="90">受渡</text><text x="280" y="90">帳場</text><text x="440" y="180">搬出</text><text x="440" y="40">路地</text></svg><p>表戸は外から施錠。搬出戸は所内用の鍵。</p></> :
            name === '返却札' ? <div className="ticket-grid">{[[0, 2], [2, 1], [3, 3]].map(([m, h]) => <div className="ticket" key={h}><Mark n={m}/><span>{'◉'.repeat(h)}</span></div>)}</div> :
                name === '三枚の控え' ? <><p className="muted-ink">受注　／　作業　／　返却</p><div className="receipt-lines">{['受注　／　発送　／　返却', '三枚の罫線には、同じ破れ目がある。', '控えは、校正箱の台へ並べられる。'].map(x => <p key={x}>{x}</p>)}</div><p>罫線の欠けを合わせる。</p></> :
                    name === '発送と返却' ? <><div className="ledger-paper">{['冊号　受注　発送　返却', '二　　4/8　 4/9　 4/9  ━━', '四　　3/2　 3/5　 3/7  ━━━━', '一　　2/8　 3/9　 4/1  ━', '三　　3/6　 3/7　 4/2  ━━━'].map(t => <p key={t}>{t}</p>)}</div><p className="stamp">返</p></> :
                        name === '折り見本' ? <><svg viewBox="0 0 600 250"><g fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 30H250V205H20Z M135 30V205" strokeDasharray="5 4"/><path d="M350 45Q420 20 480 45V205Q420 180 350 205Z"/><path d="M480 45Q540 20 580 45V205Q540 180 480 205Z"/><path d="M265 115H330M320 106L330 115L320 124"/><path d="M35 60H95M35 75H90M520 60H565M520 75H560"/></g><text x="60" y="135">4</text><text x="190" y="135">1</text><text x="395" y="135">2</text><text x="525" y="135">3</text></svg><p>傷のある紙を外へ。表紙から、右の頁だけを読む。</p></> :
                            name === '基準の長さ' ? <><svg viewBox="0 0 600 200"><path d="M60 120H550" stroke="currentColor" strokeWidth="3"/>{Array.from({ length: 10 }, (_, i) => <g key={i}><path d={`M${70 + i * 48} 120v${i % 3 === 0 ? 35 : 18}`} stroke="currentColor"/><text x={62 + i * 48} y="180">{i + 3}</text></g>)}<path d="M70 70H358M70 60V90M358 60V90" stroke="currentColor" strokeWidth="5"/></svg><p>端は欠けている。基準片の両端には印。</p></> :
                                name === '紙の表裏' ? <><div className="reference-sample"><span style={{ transform: 'scaleX(-1)', display: 'block' }}><Mark n={3} size={70}/></span><i /><em /></div><p>欠けた角、印、繊維の傾き。同じ紙の裏側。</p></> :
                                    name === '試し押し' ? <><svg viewBox="0 0 600 220"><path d="M80 25H240V185H80ZM100 45V165H190V45Z" fill="currentColor" fillRule="evenodd"/><path d="M520 25H440V81H360V185H520Z" fill="currentColor"/><text x="120" y="215" fontSize="16">試刷 一</text><text x="400" y="215" fontSize="16">試刷 二</text></svg><p>高い面だけが紙に触れる。版と刷りでは、左右が反転する。</p></> :
                                        name === '釣合い' ? <><div className="large-ink">Ⅱ　＋　Ⅲ　＝　Ⅴ</div><p>支点から皿までの距離は等しい。</p></> :
                                            name === '見当と転写' ? <><svg viewBox="0 0 600 250"><g fill="none" stroke="currentColor" strokeWidth="2"><rect x="60" y="30" width="160" height="180"/><circle cx="75" cy="45" r="6"/><path d="M195 35V65H210"/><rect x="370" y="30" width="160" height="180"/><circle cx="385" cy="45" r="6"/><path d="M505 35V65H520"/><path d="M120 95H175V175H120Z M430 95H485V175H430Z" strokeDasharray="5 5"/><path d="M245 120H345M330 110L345 120L330 130"/></g></svg><p>丸い穴と、欠けた角。二度刷りしても紙は同じ位置。</p></> :
                                                name === '綴じ穴' ? <><svg viewBox="0 0 600 240">{[0, 1, 2, 3, 4, 5].map(i => <g key={i}><circle cx={70 + i * 90} cy="70" r="6"/><text x={63 + i * 90} y="45">{i + 1}</text></g>)}<path d="M430 70Q270 205 160 70Q350 10 520 70Q390 230 250 70" fill="none" stroke="#795c38" strokeWidth="5"/><circle cx="430" cy="70" r="13" fill="none" stroke="currentColor"/><text x="420" y="125">結</text></svg><p>上から交差して見えても、糸は別の高さを通る。</p></> :
                                                    name === '断裁の線' ? <><div className="large-ink">┏　┓　┗　┛</div><p>切り落とされた縁にも、刷りの線が続いている。</p></> :
                                                        name === '床の台座跡' || name === '補修された棚' ? <><svg viewBox="0 0 600 300"><g fill="none" stroke="currentColor" strokeWidth="3"><rect x="60" y="20" width="450" height="250"/><path d="M60 170H180V90H300V210H420V20" strokeDasharray="9 7"/><rect x="160" y="100" width="70" height="150"/><rect x="320" y="55" width="150" height="45"/></g><text x="350" y="35">修復室</text><text x="65" y="295">旧配置</text></svg><p>二本の鋲は長い棚。白い継ぎは短い棚。床の線は台座の跡。</p></> :
                                                            name === '透かし' ? <><div className="watermark-row">{[1, 3, 5].map((n) => <div key={n}><Watermark index={n} reference/></div>)}</div><p>折り線の同じ側。欠けた星の向きと、下の小さな輪。</p></> :
                                                                name === '金具の重さ' ? <><div className="ledger-paper"><p>冊　 総重量　 金具</p>{['一　　14　　　2', '二　　17　　　5', '三　　13　　　4', '四　　18　　　6'].map(t => <p key={t}>{t}</p>)}</div><p>紙の枚数と寸法は同じ。</p></> :
                                                                    (name === '小口の見本' || name === '小口の扱い') ? <><svg viewBox="0 0 600 160"><path d="M80 40H245V125H80Z M355 40L535 15V100L355 125Z" fill="none" stroke="currentColor" strokeWidth="3"/>{[0, 1, 2, 3, 4, 5].map(n => <path key={n} d={`M80 ${50 + n * 12}H245 M355 ${50 + n * 12}L535 ${25 + n * 12}`} stroke="currentColor"/>)}<path d="M270 80H330M315 68L330 80L315 92" fill="none" stroke="currentColor" strokeWidth="2"/></svg><p>頁を開かず、束の縁を少しずらす。</p></> :
                                                                        name === '空の穴' ? <><svg viewBox="0 0 600 200">{[0, 1, 2, 3, 4, 5, 6].map(i => <g key={i} transform={`translate(${30 + i * 80},25)`}><path d="M0 0V140H65V0" fill="none" stroke="currentColor"/><circle cx="15" cy="40" r="4"/><circle cx="15" cy="100" r="4"/>{[1, 4].includes(i) ? <path d="M15 40Q50 65 15 100" stroke="#795c38" fill="none" strokeWidth="3"/> : <path d="M30 5V135" stroke="currentColor"/>}</g>)}</svg><p>糸だけが残る対の穴。印刷のない紙も、一冊の一部。</p></> :
                                                                            name === '原型の肩' || name === '裏口の鍵穴' ? <><svg viewBox="0 0 600 220"><path d="M90 80H430L465 115V170H90Z" fill="none" stroke="currentColor" strokeWidth="5"/><path d="M430 80L465 115H430Z" fill="#92774c"/><path d="M465 50l35-20M478 68l35-15M480 160l30 20" stroke="currentColor" strokeWidth="2"/><text x="190" y="130">搬出戸</text></svg><p>肩には三角の切欠き。新しい金具だけ、擦れが浅い。</p></> :
                                                                                name === '断面の錠' ? <><svg viewBox="0 0 600 230"><path d="M35 145H565" stroke="currentColor" strokeDasharray="5 5"/>{[2, 1, 4].map((h, i) => <g key={i}><rect x={100 + i * 150} y="20" width="35" height={h * 25} fill="#756744"/><rect x={100 + i * 150} y={20 + h * 25} width="35" height={(5 - h) * 25} fill="#bcaa7f"/></g>)}</svg><p>受け側と歯の合計が揃うと、境目を横切って回る。</p></> :
                                                                                    <p>紙に残った痕跡を、もう一度たどる。</p>}
    </Paper>;
}
