import {readSave,type World} from './campaign';
import type {ArchiveDetail} from './ArchiveRoom';
import type {SealView} from './SealCases';
import type {PressView} from './PressScene';
import type {CampaignItem} from './catalog';
export type SceneRecord={id:string;time:number;aspect:number;world:World;detail:ArchiveDetail;keeperZoom:boolean;sealView:SealView;threadZoom:boolean;pressView:PressView;trimInspect:number|null;inspect:CampaignItem|null;memo:string};
export const JOURNAL_SAVE='yotsuzuri:remake:journal:v1';
export function readJournal():SceneRecord[]{try{const rows=JSON.parse(localStorage.getItem(JOURNAL_SAVE)??'[]');if(!Array.isArray(rows))return[];return rows.slice(-120).flatMap(r=>{if(!r||typeof r.id!=='string'||typeof r.time!=='number')return[];const world=readSave(JSON.stringify(r.world));if(!world)return[];return[{...r,world,memo:typeof r.memo==='string'?r.memo.slice(0,1000):'',detail:r.detail??null,keeperZoom:!!r.keeperZoom,threadZoom:!!r.threadZoom,trimInspect:typeof r.trimInspect==='number'?r.trimInspect:null,inspect:r.inspect??null,sealView:r.sealView??'all',pressView:r.pressView??'all'}]});}catch{return[]}}
