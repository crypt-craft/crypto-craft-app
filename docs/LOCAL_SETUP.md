### Локальний запуск і перевірка

## Передумови
- Node 20 або 22
- pnpm або npm
- Наявний бекенд `crypto-craft-api` на `http://localhost:4000`

## Env
Створіть `app-ui/.env.local`:
```
VITE_API_URI=http://localhost:4000
VITE_REOWN_PROJECT_ID=your_reown_project_id
```

## Інсталяція та запуск
```
cd crypto-craft-ui/app-ui
npm ci
npm run dev
```
Відкрийте `http://localhost:5173` (або порт Vite).

## Smoke-тест
- Підключіть гаманець через Reown AppKit (`<appkit-button/>`).
- Відкрийте створення токена: заповніть форму, завантажте логотип, натисніть Create.
- Перевірте мережеві запити до бекенду і підпис у гаманці.

## Типові помилки
- Відсутній `VITE_REOWN_PROJECT_ID`: кнопка гаманця неактивна або помилка ініціалізації → перевірте `.env.local`.
- `VITE_API_URI` невірний → 404/ECONNREFUSED у запитах → виправити URI.
- Помилки CORS → увімкнути CORS на бекенді або проксі в Vite.


