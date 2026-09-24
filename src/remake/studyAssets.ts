const photoPath=(id:string,group:string)=>import.meta.env.BASE_URL+`remake/${group}/${id}.webp`;
export const studyFiles=['study-leaf-plain','study-leaf-deckled','study-leaf-foxed','study-stub-cut','study-stub-torn','blank-fold-top','study-linen-mat'].map(id=>photoPath(id,'parts/study'));
