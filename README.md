# Лучший выкуп

Лендинг срочного выкупа автомобилей в Минске и по всей Беларуси на React и Vite. Сборка создаёт статическую страницу с метаданными, каноническим URL и структурированными данными. Поисковикам доступны текст страницы, `robots.txt` и `sitemap.xml`.

## Локальный запуск

Для сборки используйте Node.js 22.12 или новее.

```sh
npm ci
npm run dev
```

Лендинг для разработки доступен на [localhost:5173](http://localhost:5173).

Чтобы проверить сборку перед публикацией, выполните следующие команды.

```sh
npm run typecheck
npm run build
npm run preview
```

Предпросмотр статической сборки доступен на [localhost:4173](http://localhost:4173).

## Доставка заявок

Форма оценки и форма обратного звонка отправляют заявки через отдельную функцию Cloudflare Workers. Разверните её по инструкции из README отдельного проекта `telegram-relay`. Укажите в секретах функции ID прежнего канала и обновлённый токен бота из BotFather. Токен предыдущей версии был доступен в браузерном коде.

Заполните `.env.local` во фронтенде по образцу `.env.example` перед сборкой.

- `VITE_LEAD_ENDPOINT` — публичный URL функции, например `https://<worker>.workers.dev/api/lead`.
- `VITE_SITE_URL` — адрес сайта для поисковых метаданных. По умолчанию используется текущий домен.

Во фронтенде хранится только публичный URL отправки. Доступ к Telegram настраивается в секретах функции.

## Публикация на GitHub Pages

Workflow `.github/workflows/pages.yml` проверяет типы, собирает страницу и публикует содержимое `dist/` при обновлении `main`. Его также можно запустить вручную из вкладки Actions.

В настройках репозитория откройте Pages и выберите источник GitHub Actions. При первой публикации сайт получит адрес `https://horbach-dev.github.io/<имя-репозитория>/`. Сборка автоматически использует этот адрес для путей ресурсов и поисковых метаданных.

В Settings → Secrets and variables → Actions → Variables можно задать два значения.

- `VITE_LEAD_ENDPOINT` — публичный адрес развёрнутой функции доставки заявок.
- `VITE_SITE_URL` — полный публичный URL с завершающим `/`, если нужно подключить собственный домен. Для стандартного адреса GitHub Pages переменная заполняется автоматически в workflow.

Для собственного домена укажите его также в Pages → Custom domain и настройте DNS. Сборка создаёт CNAME для выбранного собственного домена. [Документация GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

До настройки `VITE_LEAD_ENDPOINT` форма предлагает посетителю связаться по телефону. Для включения онлайн-заявок настройте функцию Telegram, добавьте адрес в Variables и запустите публикацию снова.

## Главное изображение

Файл `public/images/hero.webp` создан встроенным ImageGen по следующему описанию.

> Use case: ads-marketing. Asset type: premium automotive buyback website hero, landscape 3:2. Photoreal editorial car photography, an understated contemporary metallic graphite grey executive sports sedan (generic, unbranded, believable production car) angled front three-quarters, nose facing left, shown fully from tires to roof, parked in a minimal dark brutalist indoor parking structure with diagonal structural beams and subtle fog. Camera low near ground, car filling right-central part of the image, abundant charcoal shadows around edges, cool overcast bluish grey light and one soft, large overhead rectangular strip light catching crisp reflections on hood, bright white headlamp DRLs. Clean ground and mild reflected light. High-end luxury automotive campaign with realistic tire and body geometry, softly textured concrete and subtle film grain, subdued slate blue and charcoal palette. Leftmost fifth is darker and spare, car well separated from the backdrop. Black shadow in all corners for seamless integration into a dark website. No logos, no typography, no watermarks, no license plate text, no people, no neon.
