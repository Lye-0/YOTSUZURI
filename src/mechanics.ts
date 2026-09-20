import { BOOK_ORDER } from './engine';
export const edgeHeights = (order: number[], blanks: number[], master: number) => {
    const raw = [2, 2, 1, 1, 3, 4];
    const heights = order.map((n, i) => raw[n] + (blanks.includes(i) ? 1 : 0));
    return master === 1 ? heights : [...heights].reverse();
};
// Each relief plate covers one half of the inked area. A registration corner
// belongs to the physical plate, so rotation changes both impression and datum.
const channel = [1, 3, 4, 2, 4, 1];
export const plateCells = (plate: number) => Array.from({ length: 36 }, (_, i) => { const x = i % 6, y = Math.floor(i / 6); return y >= channel[x] && (x + y) % 2 === plate ? 1 : 0; });
export function rotateCells(c: number[], turns: number) {
    let out = [...c];
    for (let t = 0; t < ((turns % 4) + 4) % 4; t++) {
        const old = out;
        out = old.map((_, i) => { const x = i % 6, y = Math.floor(i / 6); return old[(5 - x) * 6 + y]; });
    }
    ;
    return out;
}
export function impression(v: number[]) { const a = rotateCells(plateCells(0), (v[0] + 3) % 4); const b = rotateCells(plateCells(1), (v[1] + 1) % 4); return a.map((n, i) => { const x = i % 6, y = Math.floor(i / 6), sx = x + (v[3] - 1); return n || (sx >= 0 && sx < 6 ? b[y * 6 + sx] : 0) ? 1 : 0; }).map((n, i, c) => v[2] ? c[Math.floor(i / 6) * 6 + 5 - i % 6] : n); }
export const reconstructed = (order: number[]) => order.every((n, i) => n === BOOK_ORDER[i]);
export const folioMarks = [2, 1, 0, 2, 3, 0, 1, 3];
export function foldPages(outerA: number, flipA: number, flipB: number) {
    const a = flipA ? [2, 1, 8, 7] : [1, 2, 7, 8];
    const b = flipB ? [4, 3, 6, 5] : [3, 4, 5, 6];
    const outer = outerA ? a : b, inner = outerA ? b : a;
    return [...outer.slice(0, 2), ...inner, ...outer.slice(2)];
}
