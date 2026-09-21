import type {World} from './campaign';
import {gatheringSources} from './gatherings';
import {BUNDLE_THICKNESS} from './book';
export const foreedgeMounted=(g:World)=>!!g.placed[22]?.includes('gatherings')&&!!g.placed[22]?.includes('cradle')&&g.flags['foreedge:mounted']!==false;
export const foreedgeView=(g:World)=>foreedgeMounted(g)?g.values[22]?.[6]??1:1;
export const foreedgeHeight=(g:World)=>gatheringSources(g).reduce((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*.006;
export const foreedgePaper={width:.20,depth:.15,unit:.006};
