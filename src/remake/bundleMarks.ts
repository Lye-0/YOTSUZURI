/** Stable identities carried with each gathering, independent of its current position. */
export const bundleMarks=['○','◇','＋','∥','△','□'] as const;
export const bundleMark=(source:number)=>bundleMarks[source%6];
