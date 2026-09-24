import {archivePhotoUrl as photo} from './archiveAssets';
export const cradleFiles=[...['lower-board','upper-board','hinge'].map(id=>photo(id,'parts/cradle')),...['corner-flat','steel-pin','keeper-pin-front'].map(id=>photo(id,'parts')),...['wedge-ramp','wedge-side','wedge-end'].map(id=>photo(id,'parts/weighing'))];
