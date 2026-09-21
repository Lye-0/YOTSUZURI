import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {repairPanels,secretDoor,panelKnob,coverBoard} from './repairNorth';
export const panelEye=(index:number)=>archiveLookAt([repairPanels[index].x+.5,secretDoor.y,1.05],0,{x:repairPanels[index].x+.5,y:1.6,height:1.05,focal:650,centerX:350,centerY:500});
export const panelKnobPoint=(index:number,open:boolean):ShelfPoint=>open?[repairPanels[index].x+.036,secretDoor.y-panelKnob.u,panelKnob.z]:[repairPanels[index].x+panelKnob.u,secretDoor.y+.04,panelKnob.z];
export const panelCoverPoint=(index:number,removed:boolean):ShelfPoint=>removed?[repairPanels[index].x-.12+coverBoard.width/2,.168,.28]:[repairPanels[index].x+coverBoard.u+coverBoard.width/2,secretDoor.y+.06,coverBoard.top-coverBoard.height/2];
