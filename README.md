# Browser Invader

ブラウザで動く、インベーダー風2DシューティングのMVPです。

## Features
- Canvas + Vanilla JavaScriptで実装
- 自機移動 / 敵編隊 / 敵弾 / 当たり判定 / スコア
- タイトル画面、ゲームオーバー、リトライ
- `localStorage` でハイスコア保存
- GitHub Pagesでそのまま公開可能

## Controls
- `ArrowLeft` / `ArrowRight`: 移動
- `Space`: 発射
- `Enter`: 開始 / リトライ

## Local Run
ES Modulesを使っているため、ローカルHTTPサーバーで起動してください。

```powershell
cd c:\Users\xlast\.gemini\antigravity\scratch\browser-invader
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

## GitHub Pages
`main` ブランチへの push で `.github/workflows/pages.yml` が実行され、静的サイトを配信します。
