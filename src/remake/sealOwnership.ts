export type SealFoot='v'|'bar';
export type SealChip='angular'|'round';
export const sealFragments:{mark:number;foot:SealFoot;chip:SealChip}[]=[
 {mark:0,foot:'v',chip:'angular'},{mark:1,foot:'v',chip:'round'},
 {mark:2,foot:'bar',chip:'angular'},{mark:3,foot:'bar',chip:'round'},
];
export const sealReceivers:{foot:SealFoot;chip:SealChip}[]=[
 {foot:'bar',chip:'angular'},{foot:'v',chip:'angular'},
 {foot:'bar',chip:'round'},{foot:'v',chip:'round'},
];
export const sealCode=sealReceivers.map(r=>{const matches=sealFragments.filter(f=>f.foot===r.foot&&f.chip===r.chip);if(matches.length!==1)throw Error('Seal ownership must be unambiguous');return matches[0].mark;});
export const matchesSealCode=(values:number[])=>values.length===4&&values.every((n,i)=>n===sealCode[i]);
