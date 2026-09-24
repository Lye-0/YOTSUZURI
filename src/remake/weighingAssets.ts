import {archivePhotoUrl} from './archiveAssets';
export const weighingFiles=['book-cover','support','beam','pan','saddle','poise','drawer','mouth','wedge-side','wedge-ramp','wedge-end'].map(n=>archivePhotoUrl(n,'parts/weighing')).concat([archivePhotoUrl('wedge','items'),archivePhotoUrl('book-edge-closed','parts')]);
