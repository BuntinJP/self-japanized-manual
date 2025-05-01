---
title: configuration.md
description: Configuring Glance
---

```
翻訳元:https://github.com/glanceapp/glance/blob/main/docs/configuration.md
```

# Glanceの設定

- [事前設定されたページ](#事前設定されたページ)
- [設定ファイル](#設定ファイル)
  - [自動リロード](#自動リロード)
  - [環境変数](#環境変数)
  - [他の設定ファイルの取り込み](#他の設定ファイルの取り込み)
- [サーバー](#サーバー)
- [ドキュメント](#ドキュメント)
- [ブランディング](#ブランディング)
- [テーマ](#テーマ)
  - [利用可能なテーマ](#利用可能なテーマ)
- [ページとカラム](#ページとカラム)
- [ウィジェット](#ウィジェット)
  - [RSS](#rss)
  - [動画](#動画)
  - [Hacker News](#hacker-news)
  - [Lobsters](#lobsters)
  - [Reddit](#reddit)
  - [検索ウィジェット](#検索ウィジェット)
  - [グループ](#グループ)
  - [分割カラム](#分割カラム)
  - [カスタムAPI](#カスタムapi)
  - [拡張機能](#拡張機能)
  - [天気](#天気)
  - [モニター](#モニター)
  - [リリース](#リリース)
  - [Dockerコンテナ](#dockerコンテナ)
  - [DNSの統計](#dnsの統計)
  - [サーバーの統計](#サーバーの統計)
  - [リポジトリ](#リポジトリ)
  - [ブックマーク](#ブックマーク)
  - [カレンダー](#カレンダー)
  - [カレンダー（レガシー）](#カレンダーレガシー)
  - [ChangeDetection.io](#changedetectionio)
  - [時計](#時計)
  - [マーケット](#マーケット)
  - [Twitchチャンネル](#twitchチャンネル)
  - [Twitchトップゲーム](#twitchトップゲーム)
  - [iframe](#iframe)
  - [HTML](#html)


## 事前設定されたページ
すべての利用可能な設定オプションを読む時間を費やしたくなく、すぐに始めるための何かが欲しい場合は、[この`glance.yml`ファイル](/glance/glance.yml)を使用して、必要に応じて変更を加えることができます。これにより、以下のようなページが表示されます：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/preconfigured-page-preview.png)

ウィジェットを設定したり、さらに追加したり、追加のページを追加したりして、自分のものにしましょう！

## 設定ファイル

### 自動リロード
自動設定リロードがサポートされており、コンテナ/サービスを再起動することなく、設定ファイルに変更を加えて保存時に反映させることができます。環境変数への変更は再読み込みをトリガーせず、手動での再起動が必要です。設定ファイルを削除すると、そのファイルの監視が停止し、再作成されても監視されません。

> [!NOTE]
>
> 無効な設定でGlanceを起動しようとすると、エラーで終了します。有効な設定でGlanceを正常に起動した後、エラーを引き起こす変更を加えた場合、コンソールにそのエラーが表示され、Glanceは古い設定で実行を続けます。その後、変更を続けてエラーがなくなると、新しい設定が読み込まれます。

> [!CAUTION]
>
> 設定ファイルを再読み込みすると、キャッシュされたデータがクリアされ、再読み込みするたびにデータを新たに要求する必要があります。これを頻繁に行うと、一部のAPIでレート制限が発生する可能性があります。再読み込み間で永続するキャッシュは将来追加される予定です。

### 環境変数
設定のどこでも環境変数の挿入がサポートされています。これは`${ENV_VAR}`構文を通じて行われます。存在しない環境変数を使用しようとすると、エラーが発生し、Glanceは起動しないか、保存時に新しい設定を読み込みません。例：

```yaml
server:
  host: ${HOST}
  port: ${PORT}
```

文字列の途中でも使用できます：

```yaml
- type: rss
  title: ${RSS_TITLE}
  feeds:
    - url: http://domain.com/rss/${RSS_CATEGORY}.xml
```

文字列だけでなく、あらゆる種類の値で動作します：

```yaml
- type: rss
  limit: ${RSS_LIMIT}
```

環境変数として解釈されずに`${NAME}`構文を設定で使用する必要がある場合は、バックスラッシュ`\`を前に付けてエスケープできます：

```yaml
something: \${NOT_AN_ENV_VAR}
```

### 他の設定ファイルの取り込み
メイン設定ファイル内から他の設定ファイルを含めることがサポートされています。これは`!include`ディレクティブと、含めたいファイルへの相対または絶対パスを使用して行われます。パスが相対的な場合、メイン設定ファイルからの相対パスになります。さらに、含まれるファイル内で環境変数を使用でき、含まれるファイルへの変更は自動的に再読み込みをトリガーします。例：

```yaml
pages:
  !include: home.yml
  !include: videos.yml
  !include: homelab.yml
```

含めるファイルには追加のインデントがあってはならず、その値はトップレベルにあるべきで、ファイルが含まれる場所に応じて適切な量のインデントが自動的に追加されます。例：

`glance.yml`

```yaml
pages:
  - name: Home
    columns:
      - size: full
        widgets:
          !include: rss.yml
  - name: News
    columns:
      - size: full
        widgets:
          - type: group
            widgets:
              !include: rss.yml
              - type: reddit
                subreddit: news
```

`rss.yml`

```yaml
- type: rss
  title: News
  feeds:
    - url: ${RSS_URL}
```

`!include`ディレクティブは設定ファイルのどこでも使用できますが、独自の行にあり、適切なインデントを持っている必要があります。

`!include`ディレクティブを使用する際にYAMLの解析エラーが発生した場合、報告される行番号は正確でない可能性があります。これは、YAMLそのものがファイルの包含をサポートしていないため、ファイルの包含がYAMLの解析前に行われるためです。このような場合のデバッグを支援するために、`config:print`コマンドを使用して、包含が解決された完全な設定ファイルを行番号付きで表示できます：

```sh
glance --config /path/to/glance.yml config:print | less -N
```

Dockerコンテナ内でGlanceを実行している場合、これはもう少し複雑になります：

```sh
docker run --rm -v ./glance.yml:/app/config/glance.yml glanceapp/glance config:print | less -N
```

これは、印刷したい設定が現在の作業ディレクトリにあり、`glance.yml`という名前であることを前提としています。

## サーバー
サーバーの設定は、トップレベルの`server`プロパティを通じて行われます。例：

```yaml
server:
  port: 8080
  assets-path: /home/user/glance-assets
```

### プロパティ

| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| host | string | いいえ |  |
| port | number | いいえ | 8080 |
| base-url | string | いいえ | |
| assets-path | string | いいえ |  |

#### `host`
サーバーが待ち受けるアドレス。`localhost`に設定すると、サーバーが実行されているマシンのみがダッシュボードにアクセスできます。デフォルトではすべてのインターフェースで待ち受けます。

#### `port`
1から65,535の間の数値で、そのポートが他のものによって既に使用されていない限り。

#### `base-url`
Glanceがホストされる基本URL。リバースプロキシを使用していて、Glanceをディレクトリの下でホストしている場合を除いて、これを指定する必要はありません。その場合は、この値を`/glance`または何でもディレクトリが呼ばれているものに設定できます。完全なドメインとパスを指定しない限り、先頭のスラッシュ（`/`）が必要であることに注意してください。

> [!IMPORTANT]
> Glanceサーバーにリクエストを転送する前に、`base-url`プレフィックスを削除する必要があります。
> Caddyでは、[`handle_path`](https://caddyserver.com/docs/caddyfile/directives/handle_path)または[`uri strip_prefix`](https://caddyserver.com/docs/caddyfile/directives/uri)を使用してこれを行うことができます。

#### `assets-path`
サーバーが`/assets/`パスの下で提供するディレクトリへのパス。これは、Monitorウィジェットのようなウィジェットで、アイコンURLを指定する必要があり、外部ソースを指すのではなく、すべてのアイコンをセルフホストしたい場合に便利です。

> [!IMPORTANT]
>
> dockerを通じてインストールする場合、パスはコンテナ内のファイルを指します。アセットパスをコンテナ内の同じパスにマウントすることを忘れないでください。
> 例：
>
> アセットが以下にある場合：
> ```
> /home/user/glance-assets
> ```
>
> 以下をマウントする必要があります：
> ```
> /home/user/glance-assets:/app/assets
> ```
>
> そして、設定には以下を含める必要があります：
> ```
> assets-path: /app/assets
> ```

##### 例

`glance-assets`ディレクトリに`gitea-icon.png`ファイルがあり、以下のようにアセットパスを指定した場合：

```yaml
assets-path: /home/user/glance-assets
```

アセットパスからアセットを指すには、以下のように`/assets/`パスを使用します：

```yaml
icon: /assets/gitea-icon.png
```

## ドキュメント
すべてのページの`<head>`にカスタムHTMLを挿入したい場合は、`document`プロパティを使用して行うことができます。例：

```yaml
document:
  head: |
    <script src="/assets/custom.js"></script>
```

## ブランディング
トップレベルの`branding`プロパティを通じて、ブランディングのさまざまな部分を調整できます。例：

```yaml
branding:
  custom-footer: |
    <p>Powered by <a href="https://github.com/glanceapp/glance">Glance</a></p>
  logo-url: /assets/logo.png
  favicon-url: /assets/logo.png
```

### プロパティ

| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| hide-footer | bool | いいえ | false |
| custom-footer | string | いいえ |  |
| logo-text | string | いいえ | G |
| logo-url | string | いいえ | |
| favicon-url | string | いいえ | |

#### `hide-footer`
`true`に設定すると、フッターを非表示にします。

#### `custom-footer`
フッターに使用するカスタムHTMLを指定します。

#### `logo-text`
ナビゲーションにある「G」の代わりに使用するカスタムテキストを指定します。

#### `logo-url`
ナビゲーションにある「G」の代わりに使用するカスタム画像のURLを指定します。`logo-text`と`logo-url`の両方が設定されている場合、`logo-url`のみが使用されます。

#### `favicon-url`
ファビコンに使用するカスタム画像のURLを指定します。

## テーマ
テーマ設定はトップレベルの`theme`プロパティを通じて行われます。色の値は[HSL](https://giggster.com/guide/basics/hue-saturation-lightness/)（色相、彩度、明度）形式です。[このようなカラーピッカー](https://hslpicker.com/)を使用して、他の形式から色をHSLに変換できます。値はスペースで区切られ、どの数値にも`%`は必要ありません。

例：

```yaml
theme:
  background-color: 100 20 10
  primary-color: 40 90 40
  contrast-multiplier: 1.1
```

### 利用可能なテーマ
独自のテーマを設定する時間を費やしたくない場合は、[いくつかの利用可能なテーマ(※github)](https://github.com/glanceapp/glance/blob/main/docs/themes.md)があり、その値を単にコピーできます。

### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| light | boolean | いいえ | false |
| background-color | HSL | いいえ | 240 8 9 |
| primary-color | HSL | いいえ | 43 50 70 |
| positive-color | HSL | いいえ | `primary-color`と同じ |
| negative-color | HSL | いいえ | 0 70 70 |
| contrast-multiplier | number | いいえ | 1 |
| text-saturation-multiplier | number | いいえ | 1 |
| custom-css-file | string | いいえ | |

#### `light`
スキームが明るいか暗いか。これは背景色を変更せず、テキストの色を反転させて明るい背景に適切に見えるようにします。

#### `background-color`
ページとウィジェットの色。

#### `primary-color`
ページ全体で使用される色で、主に未訪問のリンクを示します。

#### `positive-color`
株価が上昇している、Twitchチャンネルがライブである、または監視されているサイトがオンラインであるなど、何かが肯定的であることを示すために使用されます。設定されていない場合、`primary-color`の値が使用されます。

#### `negative-color`
`positive-color`の反対。

#### `contrast-multiplier`
テキストのコントラスト（つまり視認性）を増減するために使用されます。値が`1.3`の場合、テキストはスキームに応じて30％明るく/暗くなります。ページ上のテキストが暗すぎて読みにくいと思われる場合に使用してください。例：

![1と1.3のコントラストの違い](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/contrast-multiplier-example.png)

#### `text-saturation-multiplier`
テキストの彩度を増減するために使用され、高い彩度のカスタム背景色を使用し、テキストがより中立的な色を持つ必要がある場合に便利です。`0.5`は彩度が50％低くなり、`1.5`は50％高くなることを意味します。

#### `custom-css-file`
カスタムCSSファイルへのパス。外部またはサーバー設定のアセットパス内のものです。例：

```yaml
theme:
  custom-css-file: /assets/my-style.css
```

> [!TIP]
>
> Glanceは多くのユーティリティクラスを使用しているため、一部の要素をターゲットにするのが難しい場合があります。特定のウィジェットのスタイルを簡単にするために、各ウィジェットには`widget-type-{name}`クラスがあります。例えば、RSSウィジェット内のリンクだけを大きくしたい場合は、次のセレクタを使用できます：
>
> ```css
> .widget-type-rss a {
>     font-size: 1.5rem;
> }
> ```
>
> さらに、すべてのウィジェットで利用可能な`css-class`プロパティを使用して、個々のウィジェットにカスタムクラス名を設定することもできます。


## ページとカラム
![ページとカラムの図](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/pages-and-columns-illustration.png)

ページとカラムを使用することで、ウィジェットが整理されます。各ページには最大3つのカラムを含むことができ、各カラムには任意の数のウィジェットを持つことができます。

### ページ
ページはトップレベルの`pages`プロパティを通じて定義されます。最初に定義されたページがホームページになり、すべてのページは定義された順序でナビゲーションバーに自動的に追加されます。例：

```yaml
pages:
  - name: Home
    columns: ...

  - name: Videos
    columns: ...

  - name: Homelab
    columns: ...
```

### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| name | string | はい | |
| slug | string | いいえ | |
| width | string | いいえ | |
| center-vertically | boolean | いいえ | false |
| hide-desktop-navigation | boolean | いいえ | false |
| expand-mobile-page-navigation | boolean | いいえ | false |
| show-mobile-header | boolean | いいえ | false |
| columns | array | はい | |

#### `name`
ナビゲーションバーに表示されるページの名前。

#### `slug`
ページにアクセスするために使用されるURLフレンドリーなタイトルのバージョン。例えば、ページのタイトルが「RSS Feeds」の場合、slugを`feeds`に設定することで、`localhost:8080/feeds`を通じてページにアクセスできるようになります。定義されていない場合、タイトルから自動的に生成されます。

#### `width`
デスクトップでのページの最大幅。可能な値は`slim`と`wide`です。

* デフォルト：`1600px`（値が指定されていない場合）
* slim：`1100px`
* wide：`1920px`

> [!NOTE]
>
> `slim`を使用する場合、そのページに許可される最大カラム数は`2`です。

#### `center-vertically`
`true`に設定すると、ページ上のコンテンツを垂直方向に中央揃えにします。コンテンツがビューポートの高さより高い場合は効果がありません。

#### `hide-desktop-navigation`
デスクトップでページの上部にナビゲーションリンクを表示するかどうか。

#### `expand-mobile-page-navigation`
モバイルページナビゲーションをデフォルトで展開するかどうか。

#### `show-mobile-header`
モバイルでページの名前を表示するヘッダーを表示するかどうか。ヘッダーは意図的に多くの垂直方向の空白を持ち、コンテンツを下に押し下げて、背の高いデバイスでより簡単に到達できるようにします。

プレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/mobile-header-preview.png)

### カラム
カラムは各ページの`columns`プロパティを使用して定義されます。カラムには`full`と`small`の2種類があり、これは幅を指します。smallカラムは固定量の幅（300px）を占め、fullカラムは残りの幅をすべて占めます。ページごとに最大3つのカラムを持つことができ、1つまたは2つのfullカラムを持つ必要があります。例：

```yaml
pages:
  - name: Home
    columns:
      - size: small
        widgets: ...
      - size: full
        widgets: ...
      - size: small
        widgets: ...
```

### プロパティ
| 名前 | 型 | 必須 |
| ---- | ---- | -------- |
| size | string | はい |
| widgets | array | いいえ |

以下は可能なカラム構成のいくつかです：

![カラム構成 small-full-small](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/column-configuration-1.png)

```yaml
columns:
  - size: small
    widgets: ...
  - size: full
    widgets: ...
  - size: small
    widgets: ...
```

![カラム構成 small-full-small](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/column-configuration-2.png)

```yaml
columns:
  - size: full
    widgets: ...
  - size: small
    widgets: ...
```

![カラム構成 small-full-small](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/column-configuration-3.png)

```yaml
columns:
  - size: full
    widgets: ...
  - size: full
    widgets: ...
```

## ウィジェット
ウィジェットは各カラムの`widgets`プロパティを使用して定義されます。例：

```yaml
pages:
  - name: Home
    columns:
      - size: small
        widgets:
          - type: weather
            location: London, United Kingdom
```

> [!NOTE]
>
> 現在、すべてのウィジェットがすべてのカラムサイズに適合するように設計されているわけではありませんが、一部のウィジェットはこの制限を緩和するのに役立つ異なる「スタイル」を提供しています。

### 共有プロパティ
| 名前 | 型 | 必須 |
| ---- | ---- | -------- |
| type | string | はい |
| title | string | いいえ |
| title-url | string | いいえ |
| cache | string | いいえ |
| css-class | string | いいえ |

#### `type`
ウィジェットを指定するために使用されます。

#### `title`
ウィジェットのタイトル。空白のままにすると、ウィジェットによって定義されます。

#### `title-url`
ウィジェットのタイトルをクリックしたときに移動するURL。空白のままにすると、ウィジェットによって定義されます（利用可能な場合）。

#### `cache`
取得したデータをメモリに保持する時間。値は文字列で、数字の後にs、m、h、dのいずれかが続く必要があります。例：

```yaml
cache: 30s # 30秒
cache: 5m  # 5分
cache: 2h  # 2時間
cache: 1d  # 1日
```

> [!NOTE]
>
> すべてのウィジェットがキャッシュ期間を変更できるわけではありません。カレンダーと天気ウィジェットは1時間ごとに更新され、これは変更できません。

#### `css-class`
特定のウィジェットインスタンスにカスタムCSSクラスを設定します。

### RSS
複数のRSSフィードからの記事のリストを表示します。

例：

```yaml
- type: rss
  title: News
  style: horizontal-cards
  feeds:
    - url: https://feeds.bloomberg.com/markets/news.rss
      title: Bloomberg
    - url: https://moxie.foxbusiness.com/google-publisher/markets.xml
      title: Fox Business
    - url: https://moxie.foxbusiness.com/google-publisher/technology.xml
      title: Fox Business
```

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| style | string | いいえ | vertical-list |
| feeds | array | はい |
| thumbnail-height | float | いいえ | 10 |
| card-height | float | いいえ | 27 |
| limit | integer | いいえ | 25 |
| preserve-order | bool | いいえ | false |
| single-line-titles | boolean | いいえ | false |
| collapse-after | integer | いいえ | 5 |

##### `limit`
表示する記事の最大数。

##### `collapse-after`
「もっと見る」ボタンが表示される前に表示される記事の数。`-1`に設定すると、折りたたまれません。

##### `preserve-order`
`true`に設定すると、記事の順序はフィードにあるとおりに保持されます。フィードが記事の重要性を示す独自の並べ替え順序を使用している場合に便利です。多くのフィードを持ちながらこのプロパティを使用する場合、最初に定義されたフィードに15の記事がある場合、2番目のフィードからの記事はリストの15番目の記事の後に開始されるため、各個別のフィードに`limit`を設定することをお勧めします。

##### `single-line-titles`
`true`に設定すると、各投稿のタイトルが1行を超える場合に切り捨てられます。スタイルが`vertical-list`に設定されている場合にのみ適用されます。

##### `style`
ウィジェットの外観を変更するために使用されます。可能な値は以下の通りです：

* `vertical-list` - `full`および`small`カラムに適しています
* `detailed-list` - `full`カラムに適しています
* `horizontal-cards` - `full`カラムに適しています
* `horizontal-cards-2` - `full`カラムに適しています

以下は各スタイルのプレビューです：

`vertical-list`

![RSSウィジェットのvertical-listスタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-feed-vertical-list-preview.png)

`detailed-list`

![RSSウィジェットのdetailed-listスタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-widget-detailed-list-preview.png)

`horizontal-cards`

![RSSウィジェットのhorizontal-cardsスタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-feed-horizontal-cards-preview.png)

`horizontal-cards-2`

![RSSウィジェットのhorizontal-cards-2スタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-widget-horizontal-cards-2-preview.png)

##### `thumbnail-height`
サムネイルの高さを変更するために使用されます。スタイルが`horizontal-cards`に設定されている場合にのみ機能します。デフォルト値は`10`で、単位は`rem`です。例えば、サムネイルの高さを2倍にしたい場合は、`20`に設定できます。

##### `card-height`
`horizontal-cards-2`スタイルを使用する場合のカードの高さを変更するために使用されます。デフォルト値は`27`で、単位は`rem`です。

##### `feeds`
RSS/atomフィードの配列。タイトルはオプションで変更できます。

###### 各フィードのプロパティ
| 名前 | 型 | 必須 | デフォルト | 備考 |
| ---- | ---- | -------- | ------- | ----- |
| url | string | はい | | |
| title | string | いいえ | フィードによって提供されるタイトル | |
| hide-categories | boolean | いいえ | false | `detailed-list`スタイルにのみ適用 |
| hide-description | boolean | いいえ | false | `detailed-list`スタイルにのみ適用 |
| limit | integer | いいえ | | |
| item-link-prefix | string | いいえ | | |
| headers | key (string) & value (string) | いいえ | | |

###### `limit`
その特定のフィードから表示する記事の最大数。頻繁に多くの記事を投稿するフィードがあり、他のフィードからの記事を過度に押し下げるのを防ぎたい場合に便利です。

###### `item-link-prefix`
RSSフィードがベースドメインを持つアイテムリンクを返さず、Glanceが正しいドメインを自動的に検出できなかった場合、このプロパティを使用して各リンクに手動でプレフィックスを追加できます。

###### `headers`
オプションで、リクエストと共に送信されるヘッダーを指定します。例：

```yaml
- type: rss
  feeds:
    - url: https://domain.com/rss
      headers:
        User-Agent: Custom User Agent
```

### 動画
特定のYouTubeチャンネルからの最新の動画のリストを表示します。

例：

```yaml
- type: videos
  channels:
    - UCXuqSBlHAE6Xw-yeJA0Tunw
    - UCBJycsmduvYEL83R_U4JriQ
    - UCHnyfMqiRRG1u-2MsSQLbXA
```

プレビュー：
![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/videos-widget-preview.png)

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| channels | array | はい | |
| playlists | array | いいえ | |
| limit | integer | いいえ | 25 |
| style | string | いいえ | horizontal-cards |
| collapse-after | integer | いいえ | 7 |
| collapse-after-rows | integer | いいえ | 4 |
| include-shorts | boolean | いいえ | false |
| video-url-template | string | いいえ | https://www.youtube.com/watch?v={VIDEO-ID} |

##### `channels`
チャンネルIDのリスト。

チャンネルのIDを取得する一つの方法は、チャンネルのページに行き、その説明をクリックすることです：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/videos-channel-description-example.png)

次に下にスクロールして「チャンネルを共有」をクリックし、「チャンネルIDをコピー」をクリックします：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/videos-copy-channel-id-example.png)

##### `playlists`

プレイリストIDのリスト：

```yaml
- type: videos
  playlists:
    - PL8mG-RkN2uTyZZ00ObwZxxoG_nJbs3qec
    - PL8mG-RkN2uTxTK4m_Vl2dYR9yE41kRdBg
```

##### `limit`
表示する動画の最大数。

##### `collapse-after`
`vertical-list`スタイルを使用する場合に「もっと見る」ボタンが表示される前に表示する動画の数を指定します。

##### `collapse-after-rows`
`grid-cards`スタイルを使用する場合に「もっと見る」ボタンが表示される前に表示する行の数を指定します。

##### `style`
ウィジェットの外観を変更するために使用されます。可能な値は`horizontal-cards`、`vertical-list`、`grid-cards`です。

`vertical-list`のプレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/videos-widget-vertical-list-preview.png)

`grid-cards`のプレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/videos-widget-grid-cards-preview.png)

##### `video-url-template`
動画のデフォルトリンクを置き換えるために使用されます。独自のYouTubeフロントエンドを実行している場合に便利です。例：

```yaml
video-url-template: https://invidious.your-domain.com/watch?v={VIDEO-ID}
```

プレースホルダー：

`{VIDEO-ID}` - 動画のID

### Hacker News
[Hacker News](https://news.ycombinator.com/)からの投稿のリストを表示します。

例：

```yaml
- type: hacker-news
  limit: 15
  collapse-after: 5
```

プレビュー：
![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/hacker-news-widget-preview.png)

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| limit | integer | いいえ | 15 |
| collapse-after | integer | いいえ | 5 |
| comments-url-template | string | いいえ | https://news.ycombinator.com/item?id={POST-ID} |
| sort-by | string | いいえ | top |
| extra-sort-by | string | いいえ | |

##### `comments-url-template`
投稿コメントのデフォルトリンクを置き換えるために使用されます。代替フロントエンドを使用したい場合に便利です。例：

```yaml
comments-url-template: https://www.hckrnws.com/stories/{POST-ID}
```

プレースホルダー：

`{POST-ID}` - 投稿のID

##### `sort-by`
投稿が返される順序を指定するために使用されます。可能な値は`top`、`new`、`best`です。

##### `extra-sort-by`
既にソートされた投稿の上に適用される追加のソートを指定するために使用できます。デフォルトでは追加のソートは適用されず、利用可能な唯一のオプションは`engagement`です。

`engagement`ソートは、最も多くのポイントとコメントを持つ投稿を上位に配置し、また古い投稿よりも最近の投稿を優先します。

### Lobsters
[Lobsters](https://lobste.rs)からの投稿のリストを表示します。

例：

```yaml
- type: lobsters
  sort-by: hot
  tags:
    - go
    - security
    - linux
  limit: 15
  collapse-after: 5
```

プレビュー：
![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/lobsters-widget-preview.png)

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| instance-url | string | いいえ | https://lobste.rs/ |
| custom-url | string | いいえ | |
| limit | integer | いいえ | 15 |
| collapse-after | integer | いいえ | 5 |
| sort-by | string | いいえ | hot |
| tags | array | いいえ | |

##### `instance-url`
lobste.rs以外でホストされているlobstersインスタンスのベースURL。例：

```yaml
instance-url: https://www.journalduhacker.net/
```

##### `custom-url`
lobsters投稿を取得するためのカスタムURL。これが指定されている場合、`instance-url`、`sort-by`、`tags`プロパティは無視されます。

##### `limit`
表示する投稿の最大数。

##### `collapse-after`
「もっと見る」ボタンが表示される前に表示される投稿の数。`-1`に設定すると、折りたたまれません。

##### `sort-by`
投稿が返される並べ替え順序。可能なオプションは`hot`と`new`です。

##### `tags`
指定されたタグのいずれかを含む投稿に限定します。**タグでフィルタリングする場合、並べ替え順序を指定することはできず、デフォルトで`hot`になります。**

### Reddit
特定のサブレディットからの投稿のリストを表示します。

> [!WARNING]
>
> RedditはVPS IPからの未承認APIアクセスを許可していないため、GlanceをVPSでホストしている場合は403レスポンスが返されます。回避策として、`request-url-template`プロパティを使用して、GlanceからのトラフィックをVPNまたは独自のHTTPプロキシを通じてルーティングできます。

例：

```yaml
- type: reddit
  subreddit: technology
```

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| subreddit | string | はい |  |
| style | string | いいえ | vertical-list |
| show-thumbnails | boolean | いいえ | false |
| show-flairs | boolean | いいえ | false |
| limit | integer | いいえ | 15 |
| collapse-after | integer | いいえ | 5 |
| comments-url-template | string | いいえ | https://www.reddit.com/{POST-PATH} |
| request-url-template | string | いいえ |  |
| proxy | string or multiple parameters | いいえ |  |
| sort-by | string | いいえ | hot |
| top-period | string | いいえ | day |
| search | string | いいえ | |
| extra-sort-by | string | いいえ | |

##### `subreddit`
投稿を取得するサブレディット。

##### `style`
ウィジェットの外観を変更するために使用されます。可能な値は`vertical-list`、`horizontal-cards`、`vertical-cards`です。最初の2つはfullカラム用に設計されており、最後のものはsmallカラム用です。

`vertical-list`

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/reddit-widget-preview.png)

`horizontal-cards`

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/reddit-widget-horizontal-cards-preview.png)

`vertical-cards`

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/reddit-widget-vertical-cards-preview.png)

##### `show-thumbnails`
投稿の横にサムネイルを表示または非表示にします。これは`style`が`vertical-list`の場合にのみ機能します。プレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/reddit-widget-vertical-list-thumbnails.png)

> [!NOTE]
>
> RedditのAPIがサムネイルURLを返さないため、一部のサブレディットではサムネイルが機能しません。これに対する回避策はまだありません。

##### `show-flairs`
`true`に設定すると、投稿のフレアを表示します。

##### `limit`
表示する投稿の最大数。

##### `collapse-after`
「もっと見る」ボタンが表示される前に表示される投稿の数。`-1`に設定すると、折りたたまれません。`vertical-cards`および`horizontal-cards`スタイルを使用する場合は利用できません。

##### `comments-url-template`
投稿コメントのデフォルトリンクを置き換えるために使用されます。古いRedditデザインや他のサードパーティフロントエンドを使用したい場合に便利です。例：

```yaml
comments-url-template: https://old.reddit.com/{POST-PATH}
```

プレースホルダー：

`{POST-PATH}` - 投稿への完全なパス、例：

```
r/selfhosted/comments/bsp01i/welcome_to_rselfhosted_please_read_this_first/
```

`{POST-ID}` - `/comments/`の後に来るID

`{SUBREDDIT}` - サブレディット名

##### `request-url-template`
データを取得するために使用されるカスタムリクエストURL。これは、RedditがリクエストをブロックしているVPSでGlanceをホストしていて、URLをパスの一部またはクエリパラメータとして受け入れるプロキシを通じてリクエストをルーティングしたい場合に便利です。

プレースホルダー：

`{REQUEST-URL}` - 展開されたリクエストURL（例：https://www.reddit.com/r/selfhosted/hot.json）でテンプレート化され、置き換えられます。例：

```
https://proxy/{REQUEST-URL}
https://your.proxy/?url={REQUEST-URL}
```

##### `proxy`
データを取得するために使用されるカスタムHTTP/HTTPSプロキシURL。これは、RedditがリクエストをブロックしているVPSでGlanceをホストしていて、プロキシを通じてリクエストをルーティングすることで制限を回避したい場合に便利です。例：

```yaml
proxy: http://user:pass@proxy.com:8080
proxy: https://user:pass@proxy.com:443
```

あるいは、複数のパラメータを使用してプロキシURLと追加のオプションを指定することもできます：

```yaml
proxy:
  url: http://proxy.com:8080
  allow-insecure: true
  timeout: 10s
```

###### `allow-insecure`
`true`に設定すると、プロキシが自己署名証明書を持つ場合など、安全でない接続の使用を許可します。

###### `timeout`
プロキシからの応答を待つ最大時間。値は文字列で、数字の後にs、m、h、dのいずれかが続く必要があります。例：`10s`は10秒、`1m`は1分など。

##### `sort-by`
投稿が返される順序を指定するために使用できます。可能な値は`hot`、`new`、`top`、`rising`です。

##### `top-period`
`sort-by`が`top`に設定されている場合にのみ利用可能です。可能な値は`hour`、`day`、`week`、`month`、`year`、`all`です。

##### `search`
検索するキーワード。特定のフィールド内での検索も可能ですが、**Redditがこれらのいずれかを使用する能力をいつでも削除する可能性があることに注意してください**：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/reddit-field-search.png)

##### `extra-sort-by`
既にソートされた投稿の上に適用される追加のソートを指定するために使用できます。デフォルトでは追加のソートは適用されず、利用可能な唯一のオプションは`engagement`です。

`engagement`ソートは、最も多くのポイントとコメントを持つ投稿を上位に配置し、また古い投稿よりも最近の投稿を優先します。

### 検索ウィジェット
様々な検索エンジンで特定の用語を検索するために使用できる検索バーを表示します。

例：

```yaml
- type: search
  search-engine: duckduckgo
  bangs:
    - title: YouTube
      shortcut: "!yt"
      url: https://www.youtube.com/results?search_query={QUERY}
```

プレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/search-widget-preview.png)

#### キーボードショートカット
| キー | アクション | 条件 |
| ---- | ------ | --------- |
| <kbd>S</kbd> | 検索バーにフォーカス | 他の入力フィールドにフォーカスしていない |
| <kbd>Enter</kbd> | 同じタブで検索を実行 | 検索入力にフォーカスがあり、空でない |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | 新しいタブで検索を実行 | 検索入力にフォーカスがあり、空でない |
| <kbd>Escape</kbd> | フォーカスを離れる | 検索入力にフォーカスがある |
| <kbd>Up</kbd> | ページが開かれてから最後の検索クエリを入力フィールドに挿入 | 検索入力にフォーカスがある |

> [!TIP]
>
> デフォルトで検索結果を新しいタブで表示したい場合は、`new-tab`プロパティを`true`の値で使用できます。<kbd>Ctrl</kbd> + <kbd>Enter</kbd>は同じタブに結果を表示します。

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| search-engine | string | いいえ | duckduckgo |
| new-tab | boolean | いいえ | false |
| autofocus | boolean | いいえ | false |
| placeholder | string | いいえ | Type here to search… |
| bangs | array | いいえ | |

##### `search-engine`
以下の表の値またはカスタム検索エンジンへのURLのいずれか。クエリ値が配置される場所を示すために`{QUERY}`を使用します。

| 名前 | URL |
| ---- | --- |
| duckduckgo | `https://duckduckgo.com/?q={QUERY}` |
| google | `https://www.google.com/search?q={QUERY}` |

##### `new-tab`
`true`に設定すると、同じタブまたは新しいタブに結果を表示するためのショートカットを入れ替え、デフォルトで結果を新しいタブに表示します。

##### `autofocus`
`true`に設定すると、ページ読み込み時に検索入力に自動的にフォーカスします。

##### `placeholder`
設定すると、入力フィールドに入力する前に表示されるテキストを変更します。

##### `bangs`
何でしょうか？[Bangs](https://duckduckgo.com/bangs)です。これらは、同じ検索ボックスを多くの異なるサイトに使用できるようにするショートカットです。設定されていると仮定すると、例えば検索入力を`!yt`で始めると、YouTubeで検索を実行できます：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/search-widget-bangs-preview.png)

##### 各bangのプロパティ
| 名前 | 型 | 必須 |
| ---- | ---- | -------- |
| title | string | いいえ |
| shortcut | string | はい |
| url | string | はい |

###### `title`
クエリが関連するショートカットで始まる場合に検索バーの右側に表示されるオプションのタイトル。

###### `shortcut`
検索エンジンのショートカットとして使用したい任意の値。`!`で始まる必要はありません。

> [!IMPORTANT]
>
> YAMLでは、値の先頭に配置されると特別な意味を持つ文字があります。ショートカットが`!`（および潜在的に他の特殊文字）で始まる場合は、値を引用符で囲む必要があります：
> ```yaml
> shortcut: "!yt"
>```

###### `url`
検索エンジンのURL。クエリ値が配置される場所を示すために`{QUERY}`を使用します。例：

```yaml
url: https://www.reddit.com/search?q={QUERY}
url: https://store.steampowered.com/search/?term={QUERY}
url: https://www.amazon.com/s?k={QUERY}
```

### グループ
タブを使用して複数のウィジェットを1つにグループ化します。ウィジェットは、ページカラムと同様に`widgets`プロパティを使用して定義されます。唯一の制限は、グループウィジェット内にグループウィジェットまたは分割カラムウィジェットを配置できないことです。

例：

```yaml
- type: group
  widgets:
    - type: reddit
      subreddit: gamingnews
      show-thumbnails: true
      collapse-after: 6
    - type: reddit
      subreddit: games
    - type: reddit
      subreddit: pcgaming
      show-thumbnails: true
```

プレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/group-widget-preview.png)

#### プロパティの共有

繰り返しを避けるために、[YAMLアンカー](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/)を使用してウィジェット間でプロパティを共有できます。

例：

```yaml
- type: group
  define: &shared-properties
      type: reddit
      show-thumbnails: true
      collapse-after: 6
  widgets:
    - subreddit: gamingnews
      <<: *shared-properties
    - subreddit: games
      <<: *shared-properties
    - subreddit: pcgaming
      <<: *shared-properties
```

### 分割カラム
フルサイズのカラムを半分に分割し、ウィジェットを水平方向に並べて配置できるようにします。これはモバイルデバイスや十分な幅がない場合、単一のカラムに変換されます。ウィジェットは、ページカラムと同様に`widgets`プロパティを使用して定義されます。

`full`カラムに2つのウィジェットを並べて配置：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/split-column-widget-preview.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
# ...
- size: full
  widgets:
    - type: split-column
      widgets:
        - type: hacker-news
          collapse-after: 3
        - type: lobsters
          collapse-after: 3

    - type: videos
# ...
```
</details>
<br>

このウィジェットだけを使用して、次のようなさまざまな全ページレイアウトを実現することもできます：

すべてのカラムが等しい幅を持つ3カラムレイアウト：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/split-column-widget-3-columns.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
pages:
  - name: Home
    columns:
      - size: full
        widgets:
          - type: split-column
            max-columns: 3
            widgets:
              - type: reddit
                subreddit: selfhosted
                collapse-after: 15
              - type: reddit
                subreddit: homelab
                collapse-after: 15
              - type: reddit
                subreddit: sysadmin
                collapse-after: 15
```
</details>
<br>

すべてのカラムが等しい幅を持つ4カラムレイアウト（ページが`width: wide`に設定されている場合）：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/split-column-widget-4-columns.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
pages:
  - name: Home
    width: wide
    columns:
      - size: full
        widgets:
          - type: split-column
            max-columns: 4
            widgets:
              - type: reddit
                subreddit: selfhosted
                collapse-after: 15
              - type: reddit
                subreddit: homelab
                collapse-after: 15
              - type: reddit
                subreddit: linux
                collapse-after: 15
              - type: reddit
                subreddit: sysadmin
                collapse-after: 15
```
</details>
<br>

すべてのカラムが等しい幅を持つ最大5カラムのメーソンリーレイアウト（ページが`width: wide`に設定されている場合）：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/split-column-widget-masonry.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
define:
  - &subreddit-settings
    type: reddit
    collapse-after: 5

pages:
  - name: Home
    width: wide
    columns:
      - size: full
        widgets:
          - type: split-column
            max-columns: 5
            widgets:
              - subreddit: selfhosted
                <<: *subreddit-settings
              - subreddit: homelab
                <<: *subreddit-settings
              - subreddit: linux
                <<: *subreddit-settings
              - subreddit: sysadmin
                <<: *subreddit-settings
              - subreddit: DevOps
                <<: *subreddit-settings
              - subreddit: Networking
                <<: *subreddit-settings
              - subreddit: DataHoarding
                <<: *subreddit-settings
              - subreddit: OpenSource
                <<: *subreddit-settings
              - subreddit: Privacy
                <<: *subreddit-settings
              - subreddit: FreeSoftware
                <<: *subreddit-settings
```
</details>
<br>

`group`ウィジェットと同様に、任意のウィジェットタイプを挿入できます。`split-column`ウィジェット内に`group`ウィジェットを挿入することもできますが、`group`ウィジェット内に`split-column`ウィジェットを挿入することはできません。

### カスタムAPI

カスタムテンプレートを使用してJSON APIからデータを表示します。

> [!NOTE]
>
> このウィジェットの設定には、プログラミング、HTML、CSS、Goテンプレート言語、およびGlance固有の概念に関する基本的な知識が必要です。

例：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/custom-api-preview-1.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
- type: custom-api
  title: Random Fact
  cache: 6h
  url: https://uselessfacts.jsph.pl/api/v2/facts/random
  template: |
    <p class="size-h4 color-paragraph">{{ .JSON.String "text" }}</p>
```
</details>
<br>

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/custom-api-preview-2.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
- type: custom-api
  title: Immich stats
  cache: 1d
  url: https://${IMMICH_URL}/api/server/statistics
  headers:
    x-api-key: ${IMMICH_API_KEY}
    Accept: application/json
  template: |
    <div class="flex justify-between text-center">
      <div>
          <div class="color-highlight size-h3">{{ .JSON.Int "photos" | formatNumber }}</div>
          <div class="size-h6">PHOTOS</div>
      </div>
      <div>
          <div class="color-highlight size-h3">{{ .JSON.Int "videos" | formatNumber }}</div>
          <div class="size-h6">VIDEOS</div>
      </div>
      <div>
          <div class="color-highlight size-h3">{{ div (.JSON.Int "usage" | toFloat) 1073741824 | toInt | formatNumber }}GB</div>
          <div class="size-h6">USAGE</div>
      </div>
    </div>
```
</details>
<br>

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/custom-api-preview-3.png)

<details>
<summary><code>glance.yml</code>を表示</summary>
<br>

```yaml
- type: custom-api
  title: Steam Specials
  cache: 12h
  url: https://store.steampowered.com/api/featuredcategories?cc=us
  template: |
    <ul class="list list-gap-10 collapsible-container" data-collapse-after="5">
    {{ range .JSON.Array "specials.items" }}
      <li
# Glanceの設定

- [事前設定されたページ](#事前設定されたページ)
- [設定ファイル](#設定ファイル)
  - [自動リロード](#自動リロード)
  - [環境変数](#環境変数)
  - [他の設定ファイルの取り込み](#他の設定ファイルの取り込み)
- [サーバー](#サーバー)
- [ドキュメント](#ドキュメント)
- [ブランディング](#ブランディング)
- [テーマ](#テーマ)
  - [利用可能なテーマ](#利用可能なテーマ)
- [ページとカラム](#ページとカラム)
- [ウィジェット](#ウィジェット)
  - [RSS](#rss)
  - [動画](#動画)
  - [Hacker News](#hacker-news)
  - [Lobsters](#lobsters)
  - [Reddit](#reddit)
  - [検索ウィジェット](#検索ウィジェット)
  - [グループ](#グループ)
  - [分割カラム](#分割カラム)
  - [カスタムAPI](#カスタムapi)
  - [拡張機能](#拡張機能)
  - [天気](#天気)
  - [モニター](#モニター)
  - [リリース](#リリース)
  - [Dockerコンテナ](#dockerコンテナ)
  - [DNSの統計](#dnsの統計)
  - [サーバーの統計](#サーバーの統計)
  - [リポジトリ](#リポジトリ)
  - [ブックマーク](#ブックマーク)
  - [カレンダー](#カレンダー)
  - [カレンダー（レガシー）](#カレンダーレガシー)
  - [ChangeDetection.io](#changedetectionio)
  - [時計](#時計)
  - [マーケット](#マーケット)
  - [Twitchチャンネル](#twitchチャンネル)
  - [Twitchトップゲーム](#twitchトップゲーム)
  - [iframe](#iframe)
  - [HTML](#html)


## 事前設定されたページ
すべての利用可能な設定オプションを読む時間を費やしたくなく、すぐに始めるための何かが欲しい場合は、[この`glance.yml`ファイル](glance.yml)を使用して、必要に応じて変更を加えることができます。これにより、以下のようなページが表示されます：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/preconfigured-page-preview.png)

ウィジェットを設定したり、さらに追加したり、追加のページを追加したりして、自分のものにしましょう！

## 設定ファイル

### 自動リロード
自動設定リロードがサポートされており、コンテナ/サービスを再起動することなく、設定ファイルに変更を加えて保存時に反映させることができます。環境変数への変更は再読み込みをトリガーせず、手動での再起動が必要です。設定ファイルを削除すると、そのファイルの監視が停止し、再作成されても監視されません。

> [!NOTE]
>
> 無効な設定でGlanceを起動しようとすると、エラーで終了します。有効な設定でGlanceを正常に起動した後、エラーを引き起こす変更を加えた場合、コンソールにそのエラーが表示され、Glanceは古い設定で実行を続けます。その後、変更を続けてエラーがなくなると、新しい設定が読み込まれます。

> [!CAUTION]
>
> 設定ファイルを再読み込みすると、キャッシュされたデータがクリアされ、再読み込みするたびにデータを新たに要求する必要があります。これを頻繁に行うと、一部のAPIでレート制限が発生する可能性があります。再読み込み間で永続するキャッシュは将来追加される予定です。

### 環境変数
設定のどこでも環境変数の挿入がサポートされています。これは`${ENV_VAR}`構文を通じて行われます。存在しない環境変数を使用しようとすると、エラーが発生し、Glanceは起動しないか、保存時に新しい設定を読み込みません。例：

```yaml
server:
  host: ${HOST}
  port: ${PORT}
```

文字列の途中でも使用できます：

```yaml
- type: rss
  title: ${RSS_TITLE}
  feeds:
    - url: http://domain.com/rss/${RSS_CATEGORY}.xml
```

文字列だけでなく、あらゆる種類の値で動作します：

```yaml
- type: rss
  limit: ${RSS_LIMIT}
```

環境変数として解釈されずに`${NAME}`構文を設定で使用する必要がある場合は、バックスラッシュ`\`を前に付けてエスケープできます：

```yaml
something: \${NOT_AN_ENV_VAR}
```

### 他の設定ファイルの取り込み
メイン設定ファイル内から他の設定ファイルを含めることがサポートされています。これは`!include`ディレクティブと、含めたいファイルへの相対または絶対パスを使用して行われます。パスが相対的な場合、メイン設定ファイルからの相対パスになります。さらに、含まれるファイル内で環境変数を使用でき、含まれるファイルへの変更は自動的に再読み込みをトリガーします。例：

```yaml
pages:
  !include: home.yml
  !include: videos.yml
  !include: homelab.yml
```

含めるファイルには追加のインデントがあってはならず、その値はトップレベルにあるべきで、ファイルが含まれる場所に応じて適切な量のインデントが自動的に追加されます。例：

`glance.yml`

```yaml
pages:
  - name: Home
    columns:
      - size: full
        widgets:
          !include: rss.yml
  - name: News
    columns:
      - size: full
        widgets:
          - type: group
            widgets:
              !include: rss.yml
              - type: reddit
                subreddit: news
```

`rss.yml`

```yaml
- type: rss
  title: News
  feeds:
    - url: ${RSS_URL}
```

`!include`ディレクティブは設定ファイルのどこでも使用できますが、独自の行にあり、適切なインデントを持っている必要があります。

`!include`ディレクティブを使用する際にYAMLの解析エラーが発生した場合、報告される行番号は正確でない可能性があります。これは、YAMLそのものがファイルの包含をサポートしていないため、ファイルの包含がYAMLの解析前に行われるためです。このような場合のデバッグを支援するために、`config:print`コマンドを使用して、包含が解決された完全な設定ファイルを行番号付きで表示できます：

```sh
glance --config /path/to/glance.yml config:print | less -N
```

Dockerコンテナ内でGlanceを実行している場合、これはもう少し複雑になります：

```sh
docker run --rm -v ./glance.yml:/app/config/glance.yml glanceapp/glance config:print | less -N
```

これは、印刷したい設定が現在の作業ディレクトリにあり、`glance.yml`という名前であることを前提としています。

## サーバー
サーバーの設定は、トップレベルの`server`プロパティを通じて行われます。例：

```yaml
server:
  port: 8080
  assets-path: /home/user/glance-assets
```

### プロパティ

| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| host | string | いいえ |  |
| port | number | いいえ | 8080 |
| base-url | string | いいえ | |
| assets-path | string | いいえ |  |

#### `host`
サーバーが待ち受けるアドレス。`localhost`に設定すると、サーバーが実行されているマシンのみがダッシュボードにアクセスできます。デフォルトではすべてのインターフェースで待ち受けます。

#### `port`
1から65,535の間の数値で、そのポートが他のものによって既に使用されていない限り。

#### `base-url`
Glanceがホストされる基本URL。リバースプロキシを使用していて、Glanceをディレクトリの下でホストしている場合を除いて、これを指定する必要はありません。その場合は、この値を`/glance`または何でもディレクトリが呼ばれているものに設定できます。完全なドメインとパスを指定しない限り、先頭のスラッシュ（`/`）が必要であることに注意してください。

> [!IMPORTANT]
> Glanceサーバーにリクエストを転送する前に、`base-url`プレフィックスを削除する必要があります。
> Caddyでは、[`handle_path`](https://caddyserver.com/docs/caddyfile/directives/handle_path)または[`uri strip_prefix`](https://caddyserver.com/docs/caddyfile/directives/uri)を使用してこれを行うことができます。

#### `assets-path`
サーバーが`/assets/`パスの下で提供するディレクトリへのパス。これは、Monitorウィジェットのようなウィジェットで、アイコンURLを指定する必要があり、外部ソースを指すのではなく、すべてのアイコンをセルフホストしたい場合に便利です。

> [!IMPORTANT]
>
> dockerを通じてインストールする場合、パスはコンテナ内のファイルを指します。アセットパスをコンテナ内の同じパスにマウントすることを忘れないでください。
> 例：
>
> アセットが以下にある場合：
> ```
> /home/user/glance-assets
> ```
>
> 以下をマウントする必要があります：
> ```
> /home/user/glance-assets:/app/assets
> ```
>
> そして、設定には以下を含める必要があります：
> ```
> assets-path: /app/assets
> ```

##### 例

`glance-assets`ディレクトリに`gitea-icon.png`ファイルがあり、以下のようにアセットパスを指定した場合：

```yaml
assets-path: /home/user/glance-assets
```

アセットパスからアセットを指すには、以下のように`/assets/`パスを使用します：

```yaml
icon: /assets/gitea-icon.png
```

## ドキュメント
すべてのページの`<head>`にカスタムHTMLを挿入したい場合は、`document`プロパティを使用して行うことができます。例：

```yaml
document:
  head: |
    <script src="/assets/custom.js"></script>
```

## ブランディング
トップレベルの`branding`プロパティを通じて、ブランディングのさまざまな部分を調整できます。例：

```yaml
branding:
  custom-footer: |
    <p>Powered by <a href="https://github.com/glanceapp/glance">Glance</a></p>
  logo-url: /assets/logo.png
  favicon-url: /assets/logo.png
```

### プロパティ

| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| hide-footer | bool | いいえ | false |
| custom-footer | string | いいえ |  |
| logo-text | string | いいえ | G |
| logo-url | string | いいえ | |
| favicon-url | string | いいえ | |

#### `hide-footer`
`true`に設定すると、フッターを非表示にします。

#### `custom-footer`
フッターに使用するカスタムHTMLを指定します。

#### `logo-text`
ナビゲーションにある「G」の代わりに使用するカスタムテキストを指定します。

#### `logo-url`
ナビゲーションにある「G」の代わりに使用するカスタム画像のURLを指定します。`logo-text`と`logo-url`の両方が設定されている場合、`logo-url`のみが使用されます。

#### `favicon-url`
ファビコンに使用するカスタム画像のURLを指定します。

## テーマ
テーマ設定はトップレベルの`theme`プロパティを通じて行われます。色の値は[HSL](https://giggster.com/guide/basics/hue-saturation-lightness/)（色相、彩度、明度）形式です。[このようなカラーピッカー](https://hslpicker.com/)を使用して、他の形式から色をHSLに変換できます。値はスペースで区切られ、どの数値にも`%`は必要ありません。

例：

```yaml
theme:
  background-color: 100 20 10
  primary-color: 40 90 40
  contrast-multiplier: 1.1
```

### 利用可能なテーマ
独自のテーマを設定する時間を費やしたくない場合は、[いくつかの利用可能なテーマ](themes.md)があり、その値を単にコピーできます。

### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| light | boolean | いいえ | false |
| background-color | HSL | いいえ | 240 8 9 |
| primary-color | HSL | いいえ | 43 50 70 |
| positive-color | HSL | いいえ | `primary-color`と同じ |
| negative-color | HSL | いいえ | 0 70 70 |
| contrast-multiplier | number | いいえ | 1 |
| text-saturation-multiplier | number | いいえ | 1 |
| custom-css-file | string | いいえ | |

#### `light`
スキームが明るいか暗いか。これは背景色を変更せず、テキストの色を反転させて明るい背景に適切に見えるようにします。

#### `background-color`
ページとウィジェットの色。

#### `primary-color`
ページ全体で使用される色で、主に未訪問のリンクを示します。

#### `positive-color`
株価が上昇している、Twitchチャンネルがライブである、または監視されているサイトがオンラインであるなど、何かが肯定的であることを示すために使用されます。設定されていない場合、`primary-color`の値が使用されます。

#### `negative-color`
`positive-color`の反対。

#### `contrast-multiplier`
テキストのコントラスト（つまり視認性）を増減するために使用されます。値が`1.3`の場合、テキストはスキームに応じて30％明るく/暗くなります。ページ上のテキストが暗すぎて読みにくいと思われる場合に使用してください。例：

![1と1.3のコントラストの違い](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/contrast-multiplier-example.png)

#### `text-saturation-multiplier`
テキストの彩度を増減するために使用され、高い彩度のカスタム背景色を使用し、テキストがより中立的な色を持つ必要がある場合に便利です。`0.5`は彩度が50％低くなり、`1.5`は50％高くなることを意味します。

#### `custom-css-file`
カスタムCSSファイルへのパス。外部またはサーバー設定のアセットパス内のものです。例：

```yaml
theme:
  custom-css-file: /assets/my-style.css
```

> [!TIP]
>
> Glanceは多くのユーティリティクラスを使用しているため、一部の要素をターゲットにするのが難しい場合があります。特定のウィジェットのスタイルを簡単にするために、各ウィジェットには`widget-type-{name}`クラスがあります。例えば、RSSウィジェット内のリンクだけを大きくしたい場合は、次のセレクタを使用できます：
>
> ```css
> .widget-type-rss a {
>     font-size: 1.5rem;
> }
> ```
>
> さらに、すべてのウィジェットで利用可能な`css-class`プロパティを使用して、個々のウィジェットにカスタムクラス名を設定することもできます。


## ページとカラム
![ページとカラムの図](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/pages-and-columns-illustration.png)

ページとカラムを使用することで、ウィジェットが整理されます。各ページには最大3つのカラムを含むことができ、各カラムには任意の数のウィジェットを持つことができます。

### ページ
ページはトップレベルの`pages`プロパティを通じて定義されます。最初に定義されたページがホームページになり、すべてのページは定義された順序でナビゲーションバーに自動的に追加されます。例：

```yaml
pages:
  - name: Home
    columns: ...

  - name: Videos
    columns: ...

  - name: Homelab
    columns: ...
```

### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| name | string | はい | |
| slug | string | いいえ | |
| width | string | いいえ | |
| center-vertically | boolean | いいえ | false |
| hide-desktop-navigation | boolean | いいえ | false |
| expand-mobile-page-navigation | boolean | いいえ | false |
| show-mobile-header | boolean | いいえ | false |
| columns | array | はい | |

#### `name`
ナビゲーションバーに表示されるページの名前。

#### `slug`
ページにアクセスするために使用されるURLフレンドリーなタイトルのバージョン。例えば、ページのタイトルが「RSS Feeds」の場合、slugを`feeds`に設定することで、`localhost:8080/feeds`を通じてページにアクセスできるようになります。定義されていない場合、タイトルから自動的に生成されます。

#### `width`
デスクトップでのページの最大幅。可能な値は`slim`と`wide`です。

* デフォルト：`1600px`（値が指定されていない場合）
* slim：`1100px`
* wide：`1920px`

> [!NOTE]
>
> `slim`を使用する場合、そのページに許可される最大カラム数は`2`です。

#### `center-vertically`
`true`に設定すると、ページ上のコンテンツを垂直方向に中央揃えにします。コンテンツがビューポートの高さより高い場合は効果がありません。

#### `hide-desktop-navigation`
デスクトップでページの上部にナビゲーションリンクを表示するかどうか。

#### `expand-mobile-page-navigation`
モバイルページナビゲーションをデフォルトで展開するかどうか。

#### `show-mobile-header`
モバイルでページの名前を表示するヘッダーを表示するかどうか。ヘッダーは意図的に多くの垂直方向の空白を持ち、コンテンツを下に押し下げて、背の高いデバイスでより簡単に到達できるようにします。

プレビュー：

![](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/mobile-header-preview.png)

### カラム
カラムは各ページの`columns`プロパティを使用して定義されます。カラムには`full`と`small`の2種類があり、これは幅を指します。smallカラムは固定量の幅（300px）を占め、fullカラムは残りの幅をすべて占めます。ページごとに最大3つのカラムを持つことができ、1つまたは2つのfullカラムを持つ必要があります。例：

```yaml
pages:
  - name: Home
    columns:
      - size: small
        widgets: ...
      - size: full
        widgets: ...
      - size: small
        widgets: ...
```

### プロパティ
| 名前 | 型 | 必須 |
| ---- | ---- | -------- |
| size | string | はい |
| widgets | array | いいえ |

以下は可能なカラム構成のいくつかです：

![カラム構成 small-full-small](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/column-configuration-1.png)

```yaml
columns:
  - size: small
    widgets: ...
  - size: full
    widgets: ...
  - size: small
    widgets: ...
```

![カラム構成 small-full-small](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/column-configuration-2.png)

```yaml
columns:
  - size: full
    widgets: ...
  - size: small
    widgets: ...
```

![カラム構成 small-full-small](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/column-configuration-3.png)

```yaml
columns:
  - size: full
    widgets: ...
  - size: full
    widgets: ...
```

## ウィジェット
ウィジェットは各カラムの`widgets`プロパティを使用して定義されます。例：

```yaml
pages:
  - name: Home
    columns:
      - size: small
        widgets:
          - type: weather
            location: London, United Kingdom
```

> [!NOTE]
>
> 現在、すべてのウィジェットがすべてのカラムサイズに適合するように設計されているわけではありませんが、一部のウィジェットはこの制限を緩和するのに役立つ異なる「スタイル」を提供しています。

### 共有プロパティ
| 名前 | 型 | 必須 |
| ---- | ---- | -------- |
| type | string | はい |
| title | string | いいえ |
| title-url | string | いいえ |
| cache | string | いいえ |
| css-class | string | いいえ |

#### `type`
ウィジェットを指定するために使用されます。

#### `title`
ウィジェットのタイトル。空白のままにすると、ウィジェットによって定義されます。

#### `title-url`
ウィジェットのタイトルをクリックしたときに移動するURL。空白のままにすると、ウィジェットによって定義されます（利用可能な場合）。

#### `cache`
取得したデータをメモリに保持する時間。値は文字列で、数字の後にs、m、h、dのいずれかが続く必要があります。例：

```yaml
cache: 30s # 30秒
cache: 5m  # 5分
cache: 2h  # 2時間
cache: 1d  # 1日
```

> [!NOTE]
>
> すべてのウィジェットがキャッシュ期間を変更できるわけではありません。カレンダーと天気ウィジェットは1時間ごとに更新され、これは変更できません。

#### `css-class`
特定のウィジェットインスタンスにカスタムCSSクラスを設定します。

### RSS
複数のRSSフィードからの記事のリストを表示します。

例：

```yaml
- type: rss
  title: News
  style: horizontal-cards
  feeds:
    - url: https://feeds.bloomberg.com/markets/news.rss
      title: Bloomberg
    - url: https://moxie.foxbusiness.com/google-publisher/markets.xml
      title: Fox Business
    - url: https://moxie.foxbusiness.com/google-publisher/technology.xml
      title: Fox Business
```

#### プロパティ
| 名前 | 型 | 必須 | デフォルト |
| ---- | ---- | -------- | ------- |
| style | string | いいえ | vertical-list |
| feeds | array | はい |
| thumbnail-height | float | いいえ | 10 |
| card-height | float | いいえ | 27 |
| limit | integer | いいえ | 25 |
| preserve-order | bool | いいえ | false |
| single-line-titles | boolean | いいえ | false |
| collapse-after | integer | いいえ | 5 |

##### `limit`
表示する記事の最大数。

##### `collapse-after`
「もっと見る」ボタンが表示される前に表示される記事の数。`-1`に設定すると、折りたたまれません。

##### `preserve-order`
`true`に設定すると、記事の順序はフィードにあるとおりに保持されます。フィードが記事の重要性を示す独自の並べ替え順序を使用している場合に便利です。多くのフィードを持ちながらこのプロパティを使用する場合、最初に定義されたフィードに15の記事がある場合、2番目のフィードからの記事はリストの15番目の記事の後に開始されるため、各個別のフィードに`limit`を設定することをお勧めします。

##### `single-line-titles`
`true`に設定すると、各投稿のタイトルが1行を超える場合に切り捨てられます。スタイルが`vertical-list`に設定されている場合にのみ適用されます。

##### `style`
ウィジェットの外観を変更するために使用されます。可能な値は以下の通りです：

* `vertical-list` - `full`および`small`カラムに適しています
* `detailed-list` - `full`カラムに適しています
* `horizontal-cards` - `full`カラムに適しています
* `horizontal-cards-2` - `full`カラムに適しています

以下は各スタイルのプレビューです：

`vertical-list`

![RSSウィジェットのvertical-listスタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-feed-vertical-list-preview.png)

`detailed-list`

![RSSウィジェットのdetailed-listスタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-widget-detailed-list-preview.png)

`horizontal-cards`

![RSSウィジェットのhorizontal-cardsスタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-feed-horizontal-cards-preview.png)

`horizontal-cards-2`

![RSSウィジェットのhorizontal-cards-2スタイルのプレビュー](https://raw.githubusercontent.com/glanceapp/glance/refs/heads/main/docs/images/rss-widget-horizontal-cards-2-preview.png)

##### `thumbnail-height`
サムネイルの高さを変更するために使用されます。スタイルが`horizontal-cards`に設定されている場合にのみ機能します。デフォルト値は`10`で、単位は`rem`です。例えば、サムネイルの高さを2倍にしたい場合は、`20`に設定できます。

##### `card-height`
`horizontal-cards-2`スタイルを使用する場合のカードの高さを変更するために使用されます。デフォルト値は`27`で、単位は`rem`です。

##### `feeds`
RSS/atom
