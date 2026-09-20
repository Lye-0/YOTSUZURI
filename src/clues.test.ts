import { it, expect } from 'vitest';
import { impression, foldPages, folioMarks } from './mechanics';
import { parseSave, fresh, validValue } from './engine';
it('入れ子と表裏の8通りが実際の頁順を変え、右頁の読みは一意', () => { const codes = []; for (let outer = 0; outer < 2; outer++)
    for (let a = 0; a < 2; a++)
        for (let b = 0; b < 2; b++) {
            const pages = foldPages(outer, a, b);
            expect([...pages].sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
            codes.push(pages.filter((_, i) => i % 2 === 0).map(n => folioMarks[n - 1]).join(''));
        } expect(codes.filter(c => c === '2031')).toHaveLength(1); expect(foldPages(1, 0, 0)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]); });
it('見当・面・回転の96通りで、正しい刷りの一致は一通り', () => {
    const target = impression([1, 3, 0, 1]).join('');
    const matches = [];
    for (let a = 0; a < 4; a++)
        for (let b = 0; b < 4; b++)
            for (let side = 0; side < 2; side++)
                for (let offset = 0; offset < 3; offset++)
                    if (impression([a, b, side, offset]).join('') === target)
                        matches.push([a, b, side, offset]);
    expect(matches).toEqual([[1, 3, 0, 1]]);
});
it('記録や既読配列が壊れている保存を読み込まない', () => { expect(parseSave(JSON.stringify({ ...fresh(), seen: [{}] }))).toBeNull(); expect(parseSave(JSON.stringify({ ...fresh(), records: { 12: ['x'] } }))).toBeNull(); expect(validValue(16, [0, 0, 2, 1, 4, 0, 0, 0])).toBe(false); });
