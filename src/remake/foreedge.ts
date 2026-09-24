import type {World} from './campaign';
import {gatheringSources} from './gatherings';
import {BUNDLE_THICKNESS} from './book';
export const foreedgeMounted=(g:World)=>!!g.placed[22]?.includes('gatherings')&&!!g.placed[22]?.includes('cradle');
export const foreedgeView=(g:World)=>foreedgeMounted(g)?g.values[22]?.[6]??1:1;
export const foreedgeHeight=(g:World)=>gatheringSources(g).reduce((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*.006;
export const foreedgePaper={width:.20,depth:.15,unit:.006};
export function foreedgeBands(g:World){const sources=gatheringSources(g);let top=foreedgeHeight(g);return g.book.order.map((slot,index)=>{const height=BUNDLE_THICKNESS[sources[slot]]*.006,bottom=top-height,band={index,top,bottom,height};top=bottom;return band;});}
