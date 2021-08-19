# Node.js x WordPress用Docker環境構築

# 前提条件
- Docker desktopなどで何らかのDocker環境が利用可能であること。
  
# 構築

Dockerコンテナのオーケストレーションツール `Docker compose` を利用

- `.env` 内にdocker-compose.ymlの環境変数を定義

ディレクトリ構成は以下の通り

~~~bash
.
├── docker-compose.yml
├── mysql
│   ├── Dockerfile
│   ├── db_data
│   └── mysqld_charset.cnf
├── node
│   ├── Dockerfile
│   └── app
│       ├── LICENSE
│       ├── README.md
│       ├── ...node_projects
├── php
│   ├── Dockerfile
│   ├── config
│   │   └── php.ini
│   ├── src
│   │   ├── gulpfile.babel.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   └── webpack.config.js
│   └── wp-setup.sh
├── phpmyadmin
│   └── phpmyadmin-misc.ini
├── readme.md
└── wp
    ├── Dockerfile
    ├── config
    │   └── php.ini
    ├── docker-entrypoint.sh
    ├── gulpfile.babel.js
    ├── package.json
    ├── webpack.config.js
    ├── wp-content
    │   ├── themes
    │   └── uploads
    └── wp-setup.sh
~~~
# 説明
- `php/` : `WordPress`や`PHP`のみで動く環境の場合に使用するボリューム`php/src/`で`git clone`を行う。
- `wp/` : `WordPress`をHeadlessCMSとして使用する場合のボリューム。何も置かなくていい。
- `mysql/` : データベースの設定ファイルなどを入れるボリューム
- `mysql/db_data/` : データベースの永続化のためのデータ格納用ボリューム
- `.env` : **作成する環境毎に変更** 環境変数, `docker-compose up`などのコマンド事項の際に読みに行きます。
- `node/` : `Node.js`ベースのフレームワーク(e.g. `React.js`, `Vue.js`)を使用する際に使います. `node/app`直下にプロジェクトを配置します。

- `Dockerコンテナ`内のパスワードは`node/`の場合`node`, `root`ユーザーは`root`
- `php/`と`wp/`の方は常にコンテナ内に`webadmin`で入るようになっています(`passwd`同じ).


# 使い方
## `Node.js`を使わない`WordPress`プロジェクトの場合,

プロジェクトディレクトリを予め`new-project`などと作成しておく。

その後`php/src`に移動し,

```bash
$ cd php/src
```

目的のプロジェクトを`git clone`

```bash
$ git clone git@github.com:$github_username/$new_project.git
```

そうすると
`new-project/php/src/new-project.com/htdocs/...`
となる.


`phpMyAdmin`に入るか、`MySQL`のコンテナに入ってDBをインポート.

データベースの環境変数として以下に設定してあるので

```yml:title=docker-compose.yml
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
```


後程、これに合うように`wp-config.php`が自動で作成されるShell Scriptを回します。

## build, daemon起動

`docker-compose.yml`のあるディレクトリ(Dockerプロジェクトルート)に戻って

```bash
$ docker-compose up -d
```

を行う
初回で`docker image`がない場合や`Dockerfile`に変更があった場合は`docker-compose up --build`が同時に走って`docker image`とキャッシュが作成される。

`build cache`が存在する場合は差分のみ`build`実施されます。

## コンテナ内のSSHにログイン

下記でコンテナ内へアクセス。

```bash
$ docker exec -it $container_name bash
```

コンテナ名は`docker-compose.yml`のあるディレクトリの`.env`に書くようにしています。

`WordPress`の場合は、初回のみ、
コンテナにログインした後

```bash
$ bash wp-setup.sh
```

を回してください.
`wp-cli`で自動で`WordPress`環境を構築してくれます。


## `Node.js`プロジェクトの場合


`docker-compose.yml`の`node`コンテナの部分のコメントアウトを外す。

`Node.js`のみ必要な場合は適宜不要なコンテナをコメントアウト

`node/app`以下にプロジェクトを配置
`node/app/package.json` となるような配置を想定しています。

### WordPressコンテナ

`WordPress`をヘッドレスCMSとして`Node.js`のプロジェクトを立てる場合は
`wp/`以下は特に何もコピーしなくていいですが、
コンテナ内で`wp-setup.sh`を回す事を忘れないようにしてください。

また`wp-setup.sh`の下記の部分を適宜変更する。
- 変更箇所
  - --url=任意の`localhost`のポート
  - --title=サイトのタイトル

```bash:title=wp-setup.sh
wp core install --path='/var/www/html/' --url='http://localhost' --title='site title' --admin_user='admin' --admin_password='admin' --admin_email='somebody@gmail.com' --allow-root
```

```bash
$ docker-compose up -d
$ docker exec -it wpコンテナ名 bash
```

でコンテナ内にログインして

```bash
$ bash wp-wetup.sh
```

でプラグインなどをインストール。

### PHPコンテナ内のDB環境変数

`WordPress`の場合は以下の通り設定。
`Dockerfile`内で設定している。

```Dockerfile:title=php/Dockerfile
ENV WORDPRESS_DB_HOST=db:3306
ENV WORDPRESS_DB_NAME=wordpress
ENV WORDPRESS_DB_USER=wordpress
ENV WORDPRESS_DB_PASSWORD=wordpress
ENV WORDPRESS_DEBUG=0
ENV WORDPRESS_TABLE_PREFIX=wp_
```

### Node.jsコンテナ

このコンテナには予め`yarn`と`npm`がインストールされている。
どちらを使っても良い。

`node/app`に配置されたプロジェクト上でローカルサーバーを回す場合は

```bash
$ docker exec -it node.jsコンテナ名 bash
```

でコンテナにログインして任意のコマンドを実行。

ここで、`Node.js`コンテナ内で動かす開発サーバー(dev server)は
`host`として`0.0.0.0` を指定する。

例えば`create-react-app`の場合は`package.json`の`npm scripts`を参照しつつ下記のように実行

```bash
HOST=0.0.0.0 PORT=3000 yarn run start
```


`Gatsby`の場合は以下のように開発サーバーを立ち上げる。

```bash
gatsby develop --port=ポート番号 --host=0.0.0.0
```


これでコンテナ外からブラウザでコンテナ内の開発サーバーにアクセスできる。

# Notice
**This repository is outside of work, which I upload out of kindness.**

**Please understand.**
