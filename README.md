# Начинаем создавать систему сборки.

**Требования:** На компьютере должны стоять:
    * nodeJS
    * Git

## Последовательность работы

1. Инициализируем Git
    ```
    $ git init
    ```

1. Инициализируем проект
    ```
    $ npm init
    ```

    Проверяем, что в директории появился файлик `package.json`

1. Мы хотим создать локальный сервер для разработки

    Для этого нам понадобится [browsersync](https://www.browsersync.io/)

    Установим его:
    ```
    $ npm i -D browser-sync
    ```

    У нас обновился файлик `package.json` тут появилась первая зависимость.

    У нас появилась папочка `node_modules`

    Но она нам в git-е не нужна. Мы легко получим ее копию выполнив комманду
    ```
    $ npm i
    ```

    Поэтому создаем файлик `.gitignore`

1. Для того, что бы протестировать файлик создадим какой-то `index.html`

1. Запустим локальный сервер
    ```
    $ npx browser-sync start --server --tunnel --watch
    ```

1. Научимся делать тоже самое через опции
    ```
    $ npx browser-sync init
    ```

    У нас появился файлик `bs-config.js`

    Давайте немного его поправим
    ```
        "watch": true,
        "server": 'public',
        "port": 9000
    ```

    Перенесем файлик `index.html` в директорию `public`
    и запустим сервер
    ```
    $ npx browser-sync start --config bs-config.js
    ```

    Для удобства сохраним комманду в `package.json/scripts`

1. Выполним тоже самое, с помощью `gulp`
    ```
    $ npm i -D gulp
    ```

    создаем `gulpfile.js`

    ```js
    "use strict"

    const gulp = require('gulp'),
        fs = require('fs'),
        browserSync = require('browser-sync').create(),
        browserSyncOptions = require('./bs-config.js');

    gulp.task('server', function() {
        browserSync.init(browserSyncOptions);
    });
    ```

    Проверяем
    ```
    $ npx gulp server
    ```

1. Добавим `proxy`
    ```
    $ npm i -D proxy-middleware url
    ```

    ```js
    const proxy = require('proxy-middleware');

    browserSyncOptions.server.middleware.push(proxy(weatherProxyOptions));
    ```

1. Добавим `pug`
    ```
    $ npm i -D gulp-pug
    ```

    ```js
    const pug = require('gulp-pug');

    gulp.task('pug', function() {
        return gulp.src('src/pages/*.pug')
            .pipe(pug({
                pretty: true
            }))
            .pipe(gulp.dest('build'));
    });
    ```

1. Альтернативное подключение плагинов `gulp-load-plugins`
    ```
    $ npm i -D gulp-load-plugins
    ```

    ```js
    const gulpLoadPlugins = require('gulp-load-plugins'),
        plugins = gulpLoadPlugins();

    // pug === plugins.pug
    ```

1. Подключим сборщик стилей
    ```
    $ npm i -D node-sass gulp-sass
    ```

1. Обьединяем файлы в один
    ```
    $ npm i -D gulp-concat
    ```

1. Другой способ обьединения файлов @import... Но есть [особенности](https://webcomplex.com.ua/sass/scss-import-mixin-extend.html)

    ```scss
    /* All is equal! */
    @import "index"
    @import "_index"
    @import "index.scss"
    @import "_index.scss"
    ```

1. Возможны любые дополнительные задачи. Например, оптимизация CSS файла или аутопрефиксер
    ```
    $ npm i -D gulp-csso gulp-autoprefixer gulp-rename
    ```

1. Научимся удалять файлы с помощью задач
    ```
    $ npm i -D del
    ```

1. [Выполняем задачи последовательно](https://gulpjs.com/docs/en/api/series)

1. [Настроим слежку за файлами](https://gulpjs.com/docs/en/api/watch)

1. Запускаем вместе сервер и слежку за файлами

1. Обсуждаем возможности реакции на изображения
    ```
    $ npm i -D gulp-srcset imagemin imagemin-zopfli imagemin-svgo imagemin-webp imagemin-mozjpeg
    ```

## Дополнительная информация:
* [11 простых npm трюков](https://medium.com/@echobrain/11-%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%8B%D1%85-npm-%D1%82%D1%80%D1%8E%D0%BA%D0%BE%D0%B2-%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B5-%D0%B2%D0%B0%D1%81-%D1%83%D0%B4%D0%B8%D0%B2%D1%8F%D1%82-d00510587ec)
* [Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json)
* [Browsersync Documentation](https://www.browsersync.io/docs)
* [gulp](http://learn.javascript.ru/screencast/gulp#gulp-plugins-eslint)
* [gulp PUG](https://www.npmjs.com/package/gulp-pug)
* [PUG API docs](https://pugjs.org/api/reference.html)
* [html to pug online converter](https://html-to-pug.com/)
* [pug to html online converter](https://pughtml.com/)
* [gulp SASS](https://github.com/dlmanning/gulp-sass#basic-usage)
* [gulp LESS](https://github.com/gulp-community/gulp-less)
* [gulp Stylus](https://github.com/stevelacy/gulp-stylus)
* [css to sass online converter](http://css2sass.herokuapp.com/)
* [SCSS @import, @mixin, @extend](https://webcomplex.com.ua/sass/scss-import-mixin-extend.html)
* [Gulp srcset](https://www.npmjs.com/package/gulp-srcset)
* [Gulp Responsive](https://github.com/mahnunchik/gulp-responsive/tree/6100fdb196009166931da8a9bf98a5c823c8b320)
* [Auto srcset](http://designerofstuff.com/auto-srcset/)
* [Building a simple responsive images pipeline with Gulp](https://www.webstoemp.com/blog/responsive-images-pipeline-with-gulp)
