import {PrintedSheet} from './PrintedSheet';
import {targetImpressions} from './printing';
// The reference and a successful print share the actual ink geometry.
export function PressReference(){
 return <svg viewBox="0 0 970 460" width="100%" height="100%" role="img" aria-label="完成見本・二版重ね刷り">
 <PrintedSheet layers={targetImpressions}/>
 <text x="95" y="43" fill="#433a29" fontSize="32" fontFamily="serif" letterSpacing="3">完成見本　・　二版重ね刷り</text>
 </svg>;
}
