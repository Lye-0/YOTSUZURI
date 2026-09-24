import {PhotoSprite} from './PhotoSprite';
export function ThreadChart(){return <svg className="r-thread-chart" viewBox="0 0 900 650" width="100%" height="100%" aria-label="綴じ糸の見本" role="img"><PhotoSprite name="threadchart" group="items" x={0} y={0} width={900} height={650}/><g fill="none" stroke="#524835" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".78" style={{mixBlendMode:'multiply'}}>
 <path d="M280 156Q421 143 444 166Q560 145 629 158L637 488Q517 478 448 491Q350 477 272 488Z M444 166L448 491"/>
 {[244,380].map(y=><g key={y}><circle cx="419" cy={y} r="7"/><circle cx="470" cy={y} r="7"/><path d={`M425 ${y}H464`}/></g>)}
 <path d="M419 244C336 258 567 392 470 380" strokeDasharray="7 8"/>
 <path d="M419 380C330 453 238 425 190 338 M470 244C557 217 655 260 704 318"/>
 <ellipse cx="187" cy="326" rx="24" ry="10"/><path d="M174 325V376Q187 386 200 376V325 M166 367Q190 387 209 365 M165 374Q189 394 211 372"/>
 <path d="M702 322L787 388L719 316Q706 311 702 322Z"/><ellipse cx="714" cy="321" rx="7" ry="3" transform="rotate(35 714 321)"/>
 <path d="M688 247Q644 209 593 211M606 196L592 211L608 222"/>
 </g><g fill="#524835" opacity=".8" fontFamily="serif" fontSize="24"><text x="163" y="435">留め</text><text x="733" y="440">針</text><text x="481" y="333">裏</text></g></svg>}
