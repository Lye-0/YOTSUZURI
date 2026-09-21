import {archivePhotoUrl} from './archiveAssets';
export const repairFiles=[...['mirror','lamp','receiver','relay','guard','iron-face','iron-top'].map(id=>archivePhotoUrl(id,'parts/optics')),...['plaster','floor'].map(id=>archivePhotoUrl(id,'scenes/repair')),...['window','worktop','bench-front'].map(id=>archivePhotoUrl(id,'parts/repair'))];
