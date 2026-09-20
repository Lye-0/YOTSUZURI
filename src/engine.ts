import { getPuzzle, items, neighbors } from './data';
export type Game = {
    version: 1;
    started: boolean;
    room: number;
    visited: number[];
    values: Record<number, number[]>;
    sequences: Record<number, number[]>;
    solved: number[];
    opened: number[];
    collected: string[];
    inventory: string[];
    seen: string[];
    records: Record<number, number[]>;
    secretOpen: boolean;
    finished: boolean;
    showHotspots: boolean;
    sound: boolean;
    motion: boolean;
    brightness: number;
    elapsed: number;
};
export const SAVE_KEY = 'yotsuzuri:save:v1';
export const fresh = (): Game => ({ version: 1, started: false, room: 0, visited: [0], values: {}, sequences: {}, solved: [], opened: [], collected: [], inventory: [], seen: [], records: {}, secretOpen: false, finished: false, showHotspots: false, sound: false, motion: true, brightness: 1, elapsed: 0 });
export const initials: Record<number, number[]> = {
    1: [0, 0, 0, 0], 2: [0, 0, 0], 3: [0, 0, 0, 0, 0, 0, 0], 4: [0, 0], 5: [0], 6: [-1, 0], 7: [0, 0, 1, 0], 8: [0, 0, 0], 9: [0, 1, 2, 3], 10: [], 11: [0, 0], 12: [0, 0, 0, 1], 13: [], 14: [0, 1, 2, 3], 15: [0, 0, 0], 16: [0, 0, 2, 1, 0, 0, 0, 0], 17: [], 18: [0, 0, 0], 19: [-1], 20: [0, 0], 21: [0, 0], 22: [0, 1, 2, 3, 4, 5, 0], 23: [], 24: [0, 0, 0, 0], 25: [0, 0], 26: [0, 0, 0, 0], 27: [1, 1, 1], 28: [0, 0, 0], 29: [0], 30: [1, 1, 1, 1, 1, 1]
};
export const value = (g: Game, id: number) => g.values[id] ?? initials[id];
export const same = (a: number[], b: number[]) => a.length === b.length && a.every((n, i) => n === b[i]);
export const BOOK_ORDER = [3, 0, 5, 1, 4, 2];
export const RECEIVER = [1, 3, 4, 2, 4, 1];
export const modelReceivers = [2, 1, 4];
export const keyOpens = (v: number[]) => v.length === 6 && v.every((n, i) => n + RECEIVER[i] === 5);
export const shelfBlocks = [{ axis: 'x', fixed: 2, len: 2 }, { axis: 'y', fixed: 2, len: 3 }, { axis: 'x', fixed: 3, len: 2 }, { axis: 'y', fixed: 4, len: 3 }] as const;
export function canSlide(v: number[], i: number, n: number) {
    if (v.length > 4 && !same(v.slice(4), [3, 1, 2, 0]))
        return false;
    const b = shelfBlocks[i];
    if (!b || !Number.isInteger(n) || n < 0 || n + b.len > 6)
        return false;
    const cells = new Set<string>();
    shelfBlocks.forEach((c, k) => {
        if (i !== k)
            for (let a = 0; a < c.len; a++)
                cells.add(c.axis === 'x' ? `${v[k] + a},${c.fixed}` : `${c.fixed},${v[k] + a}`);
    });
    for (let x = Math.min(v[i], n); x < Math.max(v[i], n) + b.len; x++)
        if (cells.has(b.axis === 'x' ? `${x},${b.fixed}` : `${b.fixed},${x}`))
            return false;
    return true;
}
export function roomAllowed(g: Game, room: number) {
    if (room < 0 || room > 10)
        return false;
    if (room === 10 || room < 3)
        return true;
    if (!g.opened.includes(7))
        return false;
    if (room >= 6 && room <= 9 && !g.opened.includes(15))
        return false;
    if (room >= 8 && room <= 9 && !g.solved.includes(16))
        return false;
    if (room === 9 && !g.secretOpen)
        return false;
    return true;
}
export const missing = (g: Game, id: number) => getPuzzle(id).needs.filter(x => !g.inventory.includes(x));
export function solvedValue(g: Game, id: number) {
    const v = value(g, id), seq = g.sequences[id] ?? [];
    switch (id) {
        case 1: return same(v, [1, 1, 1, 1]);
        case 2: return same(v, [6, 8, 4]);
        case 3: return same(v.slice(3), [9, 1, 8, 6]);
        case 4: return same(v, [3, 6]);
        case 5: return v[0] === 6;
        case 6: return same(v, [1, 1]);
        case 7: return same(seq.slice(-4), [2, 0, 3, 1]);
        case 8: return v.length === 3 && v.every(x => x === 1 || x === 2) && v.reduce((sum, x, i) => sum + (x === 1 ? 1 : -1) * [2, 3, 5][i], 0) === 0;
        case 9:
        case 14: return same(v, [2, 0, 3, 1]);
        case 10: return same([...v].sort(), [0, 3]);
        case 11: return same(v, [2, 4]);
        case 12: return same(v, [1, 3, 0, 1]);
        case 13: return same(seq.slice(-4), [4, 1, 5, 2]);
        case 15: return same(v, [1, 1, 1]);
        case 16: return v[0] === 4 && same(v.slice(4), [3, 1, 2, 0]);
        case 17: return same([...v].sort(), [1, 3, 5]);
        case 18: return same(v, [1, 1, 1]);
        case 19: return v[0] === 2;
        case 20: return same(v, [1, 2]);
        case 21: return same(v, [1, 1]);
        case 22: return same(v.slice(0, 6), BOOK_ORDER) && v[6] === 2;
        case 23: return same([...v].sort(), [1, 4]);
        case 24: return same(v, [1, 3, 2, 0]);
        case 25: return same(v, [1, 2]);
        case 26: return same(v, [1, 9, 2, 7]);
        case 27: return v.length === 3 && v.every((n, i) => n + modelReceivers[i] === 5);
        case 28: return same(v, [2, 1, 3]);
        case 29: return v[0] === 1;
        case 30: return keyOpens(v) && same(value(g, 22).slice(0, 6), BOOK_ORDER) && same([...value(g, 23)].sort(), [1, 4]) && value(g, 29)[0] === 1;
        default: return false;
    }
}
export type Action = {
    type: 'start';
} | {
    type: 'move';
    room: number;
    map?: boolean;
} | {
    type: 'set';
    id: number;
    values: number[];
} | {
    type: 'sequence';
    id: number;
    button: number;
} | {
    type: 'release';
    id: number;
    index: number;
} | {
    type: 'slide';
    index: number;
    position: number;
} | {
    type: 'test';
    id: number;
} | {
    type: 'open';
    id: number;
} | {
    type: 'take';
    id: number;
    item: string;
} | {
    type: 'observe';
    name: string;
} | {
    type: 'secret';
} | {
    type: 'finish';
} | {
    type: 'settings';
    key: 'sound' | 'motion' | 'showHotspots' | 'brightness';
    value: boolean | number;
} | {
    type: 'tick';
    seconds: number;
};
export type Result = {
    game: Game;
    message?: string;
    success?: boolean;
};
export function reduce(s: Game, a: Action): Result {
    let g = structuredClone(s);
    let message: string | undefined, success = false;
    if ('id' in a && (!getPuzzle(a.id) || (getPuzzle(a.id).room !== g.room && !(g.room === 10 && [22, 23, 29].includes(a.id)))))
        return { game: s };
    if (a.type === 'slide' && g.room !== 6)
        return { game: s };
    const solve = (id: number) => {
        if (!missing(g, id).length && solvedValue(g, id) && !g.solved.includes(id)) {
            g.solved.push(id);
            message = getPuzzle(id).notice;
            success = true;
        }
    };
    if (a.type === 'start')
        g.started = true;
    if (a.type === 'move') {
        if (!roomAllowed(g, a.room) || (a.map ? !g.visited.includes(a.room) : !neighbors[g.room].includes(a.room)))
            return { game: s, message: 'ここからは、まだ通れない。' };
        g.room = a.room;
        if (!g.visited.includes(a.room))
            g.visited.push(a.room);
    }
    if (a.type === 'set') {
        if (!validValue(a.id, a.values))
            return { game: s };
        if (g.solved.includes(a.id) && ![7, 12, 22, 23, 25, 27, 29, 30].includes(a.id))
            return { game: s };
        g.values[a.id] = [...a.values];
        if (a.id !== 12)
            g.records[a.id] = [...a.values];
        if (![5, 6, 10, 12, 17, 19, 21, 22, 23, 25, 27, 29, 30].includes(a.id))
            solve(a.id);
    }
    if (a.type === 'sequence') {
        if (![7, 13].includes(a.id) || a.button < 0 || a.button > (a.id === 7 ? 3 : 5))
            return { game: s };
        g.sequences[a.id] = [...(g.sequences[a.id] ?? []), a.button].slice(-4);
        solve(a.id);
    }
    if (a.type === 'release') {
        const v = [...value(g, a.id)];
        const order = a.id === 1 ? [1, 3, 0, 2] : a.id === 15 ? [1, 2, 0] : [2, 0, 1];
        if (![1, 15, 18].includes(a.id) || a.index < 0 || a.index >= v.length)
            return { game: s };
        if (v[a.index])
            return { game: s };
        const next = order.find(x => !v[x]);
        if (next !== a.index)
            return { game: s, message: '重なった部分が、動きを止めている。' };
        v[a.index] = 1;
        g.values[a.id] = v;
        solve(a.id);
    }
    if (a.type === 'slide') {
        const v = [...value(g, 16)];
        if (!canSlide(v, a.index, a.position))
            return { game: s, message: '棚が当たって、これ以上は動かない。' };
        v[a.index] = a.position;
        g.values[16] = v;
        solve(16);
    }
    if (a.type === 'test') {
        if (!getPuzzle(a.id))
            return { game: s };
        const need = missing(g, a.id);
        if (need.length)
            return { game: s, message: 'この作業には、まだ道具が足りない。' };
        solve(a.id);
        if (!success && !g.solved.includes(a.id))
            message = a.id === 30 ? '鍵は奥まで入るが、まだ回らない。' : a.id === 12 ? 'インクは紙に移った。' : '形がまだ合わない。';
        g.records[a.id] = [...value(g, a.id)];
    }
    if (a.type === 'open') {
        if (!g.solved.includes(a.id))
            return { game: s, message: 'まだ留め金が掛かっている。' };
        if (!g.opened.includes(a.id))
            g.opened.push(a.id);
        message = getPuzzle(a.id).rewards.length ? '中に、手で取れる物がある。' : '戸が開いた。';
    }
    if (a.type === 'take') {
        const p = getPuzzle(a.id);
        if (!p || !g.solved.includes(a.id) || (p.box && !g.opened.includes(a.id)) || !p.rewards.includes(a.item) || g.collected.includes(a.item))
            return { game: s };
        g.collected.push(a.item);
        g.inventory.push(a.item);
        if (a.item === 'cradle')
            g.inventory = g.inventory.filter(x => !['corner', 'wedge'].includes(x));
        message = items[a.item].name + 'を手元に収めた。';
        success = true;
    }
    if (a.type === 'observe') {
        if (!g.seen.includes(a.name))
            g.seen.push(a.name);
    }
    if (a.type === 'secret') {
        if (g.room !== 8)
            return { game: s };
        g.secretOpen = true;
        message = '蝶番が動き、壁の奥が見えた。';
        success = true;
    }
    if (a.type === 'finish') {
        if (g.room === 10 && g.solved.includes(30)) {
            g.finished = true;
            success = true;
        }
        else
            return { game: s };
    }
    if (a.type === 'settings') {
        if (a.key === 'brightness')
            g.brightness = Math.min(1.4, Math.max(.8, Number(a.value)));
        else
            g[a.key] = a.value === true;
    }
    if (a.type === 'tick')
        g.elapsed += Math.max(0, Math.min(60, a.seconds));
    return { game: g, message, success };
}
export function parseSave(raw: string | null): Game | null {
    try {
        const v = JSON.parse(raw ?? 'null');
        if (!v || v.version !== 1 || !Number.isInteger(v.room) || v.room < 0 || v.room > 10)
            return null;
        for (const k of ['solved', 'opened'])
            if (!Array.isArray(v[k]) || v[k].some((x: number) => !Number.isInteger(x) || x < 1 || x > 30))
                return null;
        for (const k of ['inventory', 'collected'])
            if (!Array.isArray(v[k]) || v[k].some((x: string) => !items[x]))
                return null;
        if (!Array.isArray(v.visited) || v.visited.some((x: number) => !Number.isInteger(x) || x < 0 || x > 10) || !Array.isArray(v.seen))
            return null;
        if (!v.values || typeof v.values !== 'object' || !v.sequences || typeof v.sequences !== 'object')
            return null;
        if (v.values[16]?.length === 4)
            v.values[16] = [...v.values[16], ...(v.solved.includes(16) ? [3, 1, 2, 0] : [0, 0, 0, 0])];
        for (const [k, a] of Object.entries(v.values))
            if (!validValue(Number(k), a as number[]))
                return null;
        for (const [k, a] of Object.entries(v.sequences))
            if (![7, 13].includes(Number(k)) || !Array.isArray(a) || a.length > 4 || a.some(n => !Number.isInteger(n) || n < 0 || n > (Number(k) === 7 ? 3 : 5)))
                return null;
        if (['started', 'secretOpen', 'finished', 'showHotspots', 'sound', 'motion'].some(k => typeof v[k] !== 'boolean') || v.seen.some((n: unknown) => typeof n !== 'string'))
            return null;
        if (Array.isArray(v.values) || Array.isArray(v.sequences) || !v.records || typeof v.records !== 'object' || Array.isArray(v.records))
            return null;
        for (const [k, a] of Object.entries(v.records))
            if (!Array.isArray(a) || !getPuzzle(Number(k)) || a.some(n => typeof n !== 'number' || !Number.isFinite(n)))
                return null;
        const g = { ...fresh(), ...v } as Game;
        g.brightness = Math.min(1.4, Math.max(.8, Number(g.brightness) || 1));
        g.elapsed = Math.max(0, Number(g.elapsed) || 0);
        return g;
    }
    catch {
        return null;
    }
}
export function validValue(id: number, v: number[]) {
    if (!initials[id] || !Array.isArray(v) || !v.every(n => Number.isInteger(n)))
        return false;
    if ([10, 17, 23].includes(id))
        return new Set(v).size === v.length && v.length <= (id === 17 ? 3 : 2) && v.every(n => n >= 0 && n < (id === 10 ? 4 : id === 17 ? 6 : 7));
    if (v.length !== initials[id].length)
        return false;
    const max: Record<number, number> = { 1: 1, 2: 9, 3: 9, 4: 7, 5: 9, 6: 2, 7: 7, 8: 2, 9: 3, 11: 7, 12: 3, 13: 5, 14: 3, 15: 1, 16: 4, 18: 1, 19: 3, 20: 3, 21: 3, 22: 5, 24: 3, 25: 3, 26: 9, 27: 4, 28: 3, 29: 1, 30: 4 };
    if (!v.every(n => n >= ([6, 19].includes(id) ? -1 : 0) && n <= max[id]))
        return false;
    if ([9, 14].includes(id) && new Set(v).size !== 4)
        return false;
    if (id === 22 && (new Set(v.slice(0, 6)).size !== 6 || v[6] > 2))
        return false;
    if ([27, 30].includes(id) && v.some(n => n < 1))
        return false;
    if (id === 16 && v.slice(4).some(n => n > 3))
        return false;
    if (id === 3 && v.slice(0, 3).some(n => n > 3))
        return false;
    return true;
}
