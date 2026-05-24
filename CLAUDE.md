# CLAUDE.md — x-survey-front（フロントエンド）

## プロジェクト概要
YouTubeネタ発掘のためのサーベイツール（フロントエンド）

## 技術スタック
- React（create-react-app）
- JavaScript
- CSS-in-JS（インラインスタイル）

## ディレクトリ構成
x-survey-front/
├── src/
│   └── App.js      # メインコンポーネント（全機能をここに集約）
├── public/
└── package.json

## 主要機能
- トレンド分析 / アカウント分析 / キーワード調査 / ネタ生成の4モード
- バックエンドAPI呼び出し（/survey）
- 結果のTXT保存
- 結果のPDF保存（印刷機能使用）

## ローカル起動
npm start

## ビルド＆デプロイ
- GitHub: https://github.com/yamanoazalea-ship-it/x-survey-front
- Render: https://x-survey-front.onrender.com
- GitHubにpushすると自動デプロイ

## APIエンドポイント
- 本番: https://x-survey-app.onrender.com/survey
- ローカル開発時: http://127.0.0.1:8000/survey

## 注意事項
- App.js一枚に全機能をまとめている（シンプル構成）
- スタイルはインラインで記述
- コンポーネント分割は機能追加時に検討
