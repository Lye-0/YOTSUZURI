export function Watermark({ index, reference = false }: {
    index: number;
    reference?: boolean;
}) { const group = Math.floor(index / 2); const correct = reference || index % 2 === 1; const x = [30, 60, 40][group], y = [35, 50, 70][group]; return <svg viewBox="0 0 100 120"><path d="M50 0V120M0 60H100" stroke="currentColor" strokeDasharray="3 4" opacity=".5"/><g transform={correct ? '' : `translate(100 0) scale(-1 1)`}><path d={`M${x} ${y - 15}l14 15 -14 15 -14-15Z`} fill="none" stroke="currentColor" strokeWidth="2"/><path d={`M${x + 3} ${y - 10}l8 9`} stroke="currentColor" strokeWidth="3"/><circle cx={[25, 70, 62][group]} cy="100" r="5" fill="none" stroke="currentColor" strokeWidth="2"/></g></svg>; }
