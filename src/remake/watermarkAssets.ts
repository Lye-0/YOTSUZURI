import {archivePhotoUrl} from './archiveAssets';
export const watermarkFiles=[...['folded-paper','lightbox','sorting-cloth'].map(n=>archivePhotoUrl(n,'parts/watermark')),...['bench-front','bench-top','bench-side'].map(n=>archivePhotoUrl(n)),archivePhotoUrl('book-edge-closed','parts')];
