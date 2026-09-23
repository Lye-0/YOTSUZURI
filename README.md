# 夜綴 — YOTSUZURI

雨の夜の製本所で、一冊の本を綴じ直して帰路を探すブラウザ脱出ゲーム。写真の部屋と道具を調べ、紙の表裏・重ね刷り・書架・小口・鍵の構造を読み解きます。

## 起動

```powershell
mise trust
mise install
pnpm install --frozen-lockfile
pnpm dev
```

<http://127.0.0.1:5199/>。`remake.html` も同じ改修版を開きます。Node と pnpm の版は `mise.toml` に固定しています。

```powershell
pnpm test
pnpm check:assets
pnpm build
pnpm preview
```

成果物は `dist/`。静的ホスティングで動き、サーバーやアカウントは不要です。

## 操作と保存

- 左右で向きを変え、写真の物へ触れると近づきます。下中央で元の視点へ戻ります。
- 持ち物は選択してから対象へ使います。小さな虫眼鏡で単体を観察できます。
- 戸は開いてから通り、中身は別に拾います。作業途中の配置や、紙の裏表も保存します。
- カメラの印で現在の景色を記録できます。記録帳から見返し、メモを付けられます。
- 見取り図は訪問済みの部屋だけを示します。現在通れる経路で戻れます。
- 設定で音、音量、明るさ、動きを変更できます。目の印は操作箇所の補助、疑問符は段階式ヒントです。
- 進行と記録は同じブラウザの localStorage へ保存されます。改修前の版の保存とは別です。

## 構成

- `src/remake/campaign.ts`：状態、操作、保存の移行。各機構の規則は同じディレクトリの専用モジュール。
- `src/remake/Remake.tsx`：部屋、接写、持ち物、設定と観察記録。
- `public/remake/scenes`：各室の背景と状態差分。
- `public/remake/closeups`：背景に対応した接写写真。
- `public/remake/parts`：同じ場所・持ち物・進行状態で共有する写真部品。
- `public/remake/items`：道具と紙の写真素材。
- `docs/remake/manifest.json`：採用写真の寸法、容量、生成元の台帳。
- `docs/remake/27_CAMPAIGN_WALKTHROUGH.md`：初期状態からの通し操作と、その確認範囲。

11室・30の仕掛けを持ちます。4〜6時間は設計時の目標で、初見の実測値ではありません。作者の通し操作と自動テストを、初見の難易度や楽しさの保証とは扱いません。

## GitHub Pagesへの公開

`.github/workflows/pages.yml` は `remake` ブランチへのプッシュで実行します。テスト・素材チェック・ビルドがすべて成功した場合に `dist/` を公開します。

初回のみ、GitHubの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。`github-pages` 環境にブランチ制限がある場合は `remake` を許可します。

```powershell
git push origin remake
```

公開予定URL：<https://lye-0.github.io/YOTSUZURI/>

Nodeは `mise.toml` と同じ `24.19.0`、pnpmは `package.json` の `packageManager` を使用します。Viteの相対パス設定 `base: './'` により、ゲームと画像は `/YOTSUZURI/` 配下でも読み込めます。追加のデプロイ用シークレットは不要です。

設定参考：[GitHub公式・カスタムワークフローによるPages公開](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
