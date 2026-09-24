export function canMoveRing(mask:number,index:number){
 if(!Number.isInteger(mask)||mask<0||mask>7||!Number.isInteger(index)||index<0||index>2)return false;
 return index===0||((mask&(1<<(index-1)))!==0&&(mask&((1<<(index-1))-1))===0);
}
export function moveRing(mask:number,index:number){return canMoveRing(mask,index)?mask^(1<<index):mask;}
