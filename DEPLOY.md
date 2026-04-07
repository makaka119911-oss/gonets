# Как залить на GitHub и получить ссылку

## 1. Создайте репозиторий на GitHub

1. Откройте [github.com/new](https://github.com/new).
2. Название, например: `gonets-delivery` (латиница, без пробелов).
3. Репозиторий **Public** (для бесплатного GitHub Pages удобнее).
4. **Не** добавляйте README/.gitignore с сайта — мы уже всё подготовили локально.

## 2. Залейте код с компьютера

В папке проекта «Доставка Гонец» выполните в терминале (подставьте свой URL репозитория):

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: Гонец landing + platform starter"
git remote add origin https://github.com/ВАШ_НИК/gonets-delivery.git
git push -u origin main
```

Если GitHub просит вход — используйте [Personal Access Token](https://github.com/settings/tokens) вместо пароля или [GitHub CLI](https://cli.github.com/) (`gh auth login`).

## 3. Включите GitHub Pages

1. Репозиторий → **Settings** → **Pages**.
2. **Build and deployment** → **Source**: выберите **GitHub Actions**.
3. После следующего push (или вручную: вкладка **Actions** → workflow **Deploy GitHub Pages** → **Run workflow**) сайт соберётся.

## 4. Ссылка на сайт

Обычно это:

`https://ВАШ_НИК.github.io/ИМЯ_РЕПО/`

Пример: `https://ivanov.github.io/gonets-delivery/`

Первый деплой может занять 1–3 минуты. Точный URL виден в **Settings → Pages** и в завершённом job **deploy** (environment `github-pages`).

## Что именно деплоится

- Статический лендинг: `index.html`, страницы `calculate/`, `tracking/`, `history/`, `login/`, `css/`, `js/`, `assets/`, `mocks/`.
- Папка **`platform/`** (Next.js + NestJS) в архиве есть, но **на GitHub Pages не запускается** — это код для сервера. Его деплой: отдельно (Vercel, Railway, VPS и т.д.), см. `platform/README.md`.

## Если картинки или переходы «ломаются» по пути

Репозиторий с именем не в корне домена иногда требует относительных путей — у нас ссылки вида `css/...` и `../` для подстраниц; это совместимо с адресом `https://user.github.io/repo/`.
