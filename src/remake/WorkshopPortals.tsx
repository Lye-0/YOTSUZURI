import {SealCases} from './SealCases';
import {PortalView} from './PortalView';
import {Balance} from './Balance';
import {PlateDrawers} from './PlateDrawers';
import {photoPath} from './sceneFiles';
import type {World,Action} from './campaign';
export function WorkshopPortals({g,act}:{g:World;act:(a:Action)=>void}){
 if(g.focus!=='room')return null;
 if(g.room===3&&g.facing===1)return <PortalView src={photoPath('east','scenes/press')} opening={[[342,174],[788,174],[788,724],[342,724]]} frame={[55,153,1020,574]}/>;
 if(g.room===3&&g.facing===3)return <PortalView src={photoPath('west','scenes/binding')} opening={[[1210,170],[1444,170],[1444,715],[1210,715]]} frame={[823,150,1003,565]}><SealCases g={{...g,room:5,facing:3}} act={act} wide enabled={false}/></PortalView>;
 if(g.room===4&&g.facing===3){const other:World={...g,room:3,focus:'room'};return <PortalView src={photoPath('west','scenes/type')} opening={[[530,208],[1135,208],[1135,752],[530,752]]} frame={[332,188,1003,565]}><PlateDrawers g={other} act={act} wide enabled={false}/><WorkshopPortals g={other} act={act}/></PortalView>;}
 if(g.room===5&&g.facing===1){const other:World={...g,room:3,focus:'room'};return <PortalView src={photoPath('east','scenes/type')} opening={[[529,170],[957,170],[957,718],[529,718]]} frame={[233,145,1020,574]}><Balance g={other} act={act} wide enabled={false}/><WorkshopPortals g={other} act={act}/></PortalView>;}
 return null;
}
