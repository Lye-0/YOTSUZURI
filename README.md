# 夜綴 — YOTSUZURI

雨の夜の製本所で、一冊の本を綴じ直して帰路を探すブラウザ脱出ゲーム。

11エリア、30の仕掛け。写真の部屋を調べ、紙の表裏・重ね刷り・書架・小口・鍵の構造を読み解きます。単純な物理パズルと、複数の部屋をまたぐ推理を組み合わせています。

## 起動

```powershell
mise trust
mise install
pnpm install --frozen-lockfile
pnpm dev
```

`http://127.0.0.1:5199/`。Node / pnpm の版は `mise.toml` に固定しています。

```powershell
pnpm test
pnpm check:assets
pnpm build
pnpm preview
```

本番成果物は `dist/`。静的ホスティングで動作し、サーバーやアカウントは不要です。デプロイは自動では行いません。

## 操作・保存

- 部屋の対象を押すと近づきます。「調べる場所」で対象位置を表示できます。
- 環や木片は押して回転、二つの片を選んで入れ替え、歯は上下ボタンで調整します。
- 収納は解除・開ける・中身を取るの三段階。取得済みの資料を仕掛けの横へ表示できます。
- 進行は同じブラウザの localStorage に保存。設定から JSON の書き出し・読み込みができます。
- 音は初期状態でオフ。明るさ、動き、対象表示を変更できます。Escape で拡大画面を閉じます。

## 構成

- `src/engine.ts`：状態・操作・保存検証。既読フラグを正解条件に使いません。
- `src/Puzzles.tsx`：30の操作画面。`Documents.tsx` は正確な印刷図版。
- `src/SceneChanges.tsx`：収納・道具回収と部屋写真の差分。
- `public/assets/rooms`：部屋・通路・状態変化・終幕の採用写真。
- `public/assets/details`：小口の絵、回転する真鍮環。
- `public/assets/items`：道具写真。`materials`：机と紙の素材。
- `docs/assets.json`：採用素材の寸法・容量・生成元の台帳。
- `scripts/browser-walkthrough.js`：Playwright MCP で操作する通し検証。QA用ブラウザで実行します。

プレイ時間と初見難易度は、実際の初見プレイヤーでの計測が必要です。自動検証の成功を初見の楽しさや長さの保証にはしていません。
