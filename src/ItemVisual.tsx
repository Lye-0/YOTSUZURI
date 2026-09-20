import { asset, items } from './data';
export function ItemVisual({id}:{id:string}){const shape=items[id].shape;return ['knife','lens','key','thread'].includes(shape)?<img className="item-photo" src={asset(shape)} alt="" draggable={false}/>:<span className={'item-silhouette '+shape}/>}
