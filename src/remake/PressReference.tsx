import {useId} from 'react';
import {PrintedSheet} from './PrintedSheet';
import {targetImpressions} from './printing';
export function PressReference(){const id=useId().replace(/:/g,'');return <svg viewBox="0 0 970 230" width="100%" height="100%" role="img" aria-label="欠けた二版重ね刷りの見本"><defs><clipPath id={id}><path d="M0 0H970V165L880 173L815 157L740 197L650 174L560 218L450 192L340 221L225 180L120 202L0 188Z"/></clipPath></defs><g clipPath={`url(#${id})`}><svg width="970" height="460"><PrintedSheet layers={targetImpressions}/></svg><text x="95" y="43" fill="#433a29" fontSize="32" fontFamily="serif">二版重ね刷り・見本</text></g></svg>}
