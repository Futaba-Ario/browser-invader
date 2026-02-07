# Browser Invader

ブラウザで遊べる、インベーダー風の2Dシューティングゲームです。  
HTML5 Canvas + Vanilla JavaScript（ES Modules）で実装しています。

## Play Online
- https://futaba-ario.github.io/browser-invader/

## Features
- 自機移動 / 敵編隊 / 敵弾 / 当たり判定 / スコア管理
- タイトル画面・ゲームオーバー・リトライ
- `localStorage` によるハイスコア保存
- GitHub Pages への自動デプロイ対応

## Controls
- `ArrowLeft` / `ArrowRight`: 移動
- `Space`: 発射
- `Enter`: 開始 / リトライ

## Local Development
ES Modules を使用しているため、ローカルHTTPサーバーで起動してください。

```powershell
git clone https://github.com/Futaba-Ario/browser-invader.git
cd browser-invader
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

## Deploy (GitHub Pages)
`main` ブランチへの push をトリガーに `.github/workflows/pages.yml` が実行され、静的サイトを配信します。

注記: GitHub プランによっては private repository で GitHub Pages が利用できない場合があります。デプロイがスキップされる場合は、リポジトリを public に変更してください。
