import type {World} from './campaign';
import {envelopeValues} from './envelope';
export const envelopeUrl=(id:string,group='parts/envelope')=>import.meta.env.BASE_URL+`remake/${group}/${id}.webp`;
export const envelopeFiles=['back-closed','front-closed','right-open','lower-open','all-open','inner-tray'].map(n=>envelopeUrl(n)).concat(['tissue','blanks'].map(n=>envelopeUrl(n,'items')));
export const envelopePhoto=(g?:World)=>{const v=g?envelopeValues(g):[0,0,0,0];return v[0]?'front-closed':v[2]===7?'all-open':v[2]===3?'lower-open':v[2]===1?'right-open':'back-closed';};
