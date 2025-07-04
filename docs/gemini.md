# Geminiドキュメント - SafeMD プロジェクト

このドキュメントは、Geminiがこのプロジェクトで作業する上での前提条件やコンテキストを記録します。

## プロジェクト概要

- **目的:** 非エンジニアでも簡単にマークダウンを記述できるようにするための、シンプルなウェブアプリケーションを開発する。
- **種類:** フロントエンドのみで構成されるウェブアプリケーション。
- **プロジェクト名:** SafeMD

## 技術スタック

- **フレームワーク:** React
- **言語:** TypeScript
- **ビルドツール:** Vite
- **デプロイ先:** Cloudflare Pages

## 開発言語

- **主要言語:** 日本語
- コードのコメントやドキュメント、UIのテキストなどは日本語を基本とします。

## これまでの経緯

- Vite (react-tsテンプレート) を使用してプロジェクトをセットアップしました。
- `README.md` を作成し、プロジェクトの基本情報を記載しました。
- `_gitignore` を `.gitignore` にリネームし、`node_modules` などの不要なファイルがバージョン管理されないように設定しました。

## マークダウンエディタの要件

- **レイアウト:** 左右分割 (左にエディタ、右にプレビュー)
- **リアルタイムプレビュー:** 有効
- **サポートするマークダウン機能:**
    - 基本的な記法 (ヘッダー、リスト、リンク、画像など)
    - テーブル
    - コードブロック (シンタックスハイライト付き)
    - タスクリスト
    - 絵文字

## 新しい要件: 編集モードの切り替え

- **マークダウン編集モード:** 現在の実装のように、直接マークダウンを記述するモード。
- **GUI編集モード (WYSIWYG-like):** Wordのようなビジュアル編集を行い、その結果をマークダウンとしてコピーできるモード。
    - `@uiw/react-md-editor` を使用して実装。 -> **Tiptap に変更**
    - **GUIモード時のプレビュー:** 不要。プレビュー画面は非表示にする。
    - **マークダウン出力:** GUIモードで編集した内容をマークダウンとしてコピーできる機能を提供する。