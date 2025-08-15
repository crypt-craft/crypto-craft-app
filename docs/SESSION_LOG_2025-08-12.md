# Session Log — UI — 2025-08-12

- Start: Аналіз структури `app-ui`, провайдерів, роутингу, інтеграції з API.
- Findings: дублікати фіч, відсутній Router, зламаний `useApi` (немає `@/services/api`), конфлікт бізнес-логіки з бекенд-моделлю unsigned tx.
- Created docs: `ARCHITECTURE_ANALYSIS.md`, `PROJECT_STRUCTURE.md`, `API_INTEGRATION.md`, `LOCAL_SETUP.md`, `BACKLOG.md`.
- Next: імплементація `shared/api/http.ts`, клієнтів сервісів, рефакторинг `main.tsx` з `BrowserRouter`, уніфікація `TokenCreator`.

- [2025-08-12T16:30:00Z] Початок дебагінгу Solana UI + підключення до API: додаю GraphQL клієнт, auth-хук (Phantom signMessage), і переводжу `SolanaTokenCreator` на бекенд-потік (unsigned → sign → submit → saveMetadata).
 - [2025-08-12T16:50:00Z] Ч1 виконано: оновлено `src/shared/api/http.ts` (JWT header), додано GraphQL клієнт у `src/hooks/useApi.ts`, перероблено `@features/token/SolanaTokenCreator.tsx` на бекенд-флоу з пріоритетом Phantom. Pending: додати `useAuth` (GET /auth/message → sign → POST /auth/login) та UI-кнопку Sign In перед створенням токену.
 - [2025-08-12T17:05:00Z] Оптимізовано перезапуск: у кореневому `Makefile` додано цілі `up-fast`, `api-build`, `ui-up-fast` для уникнення зайвих білдів та повторної інсталяції. `npm ci` замінено на `(npm ci || npm install)`.
 - [2025-08-12T17:20:00Z] Зупиняю середовище (`make down`) і запускаю повний ребілд з чисткою образів та міграціями (`make build`) для локального тестування на Node 24.

[2025-08-12T19:12:00Z] START: Виправлення TS IDE-помилок у монорепо
- Додано кореневий `tsconfig.json` з проектними референсами.
- Увімкнено `composite` у `app-ui/tsconfig.json`.
- Виправлено попередження у `@features/token/SolanaTokenCreator.tsx` (невикористані `networkType`, `error`, `formatNumber`).
[2025-08-12T19:20:00Z] END: Виправлення TS IDE-помилок у монорепо (UI)


[START] 2025-08-12T18:01:38+0300 — Початок аудиту структури та документації репозиторію
[END] 2025-08-12T18:04:48+0300 — Аудит завершено, сформовано звіт і роадмап
[START] 2025-08-12T19:38:54+0300 — Початок впровадження кореневих файлів, CI/CD та сервісного шару
[END] 2025-08-12T19:43:05+0300 — Створено кореневі файли, CI/CD, шаблони; додано UI shared/api та API каркас. Перевірка білда далі.
[BUILD] 2025-08-12T19:47:33+0300 — Старт білду UI та API
 
[2025-08-12T20:15:00+0300] UI: Прибрано явний `PhantomWalletAdapter` з `src/components/providers.tsx` (використовуємо стандартні гаманці; список порожній), щоб усунути попередження "Phantom was registered as a Standard Wallet".
[2025-08-12T20:15:10+0300] UI: Додано future flags до `BrowserRouter` у `src/main.tsx` — `{ v7_startTransition: true, v7_relativeSplatPath: true }` для усунення попереджень React Router v7.
[2025-08-12T20:28:00+0300] UI: Увімкнено фічі — підключено `@features/CryptoCraftFeatures` у `src/App.tsx` замість плейсхолдера.
[2025-08-12T20:29:00+0300] UI: Дороблено `@features/token/SolanaTokenCreator.tsx`: ініціалізація Phantom (autoconnect + listeners), валідації форми, використання IPFS-лінка при створенні. Усунено лінт-попередження.
[2025-08-12T20:42:00+0300] UI: Автологін після конекту гаманця — у `@features/wallet/SolanaWalletConnector.tsx` автозапуск `authenticate(address)` при `isConnected=true`.
[2025-08-12T20:42:20+0300] UI: GraphQL клієнт переведено на динамічний `Authorization` через `setContext` (JWT з `localStorage`) у `src/hooks/useApi.ts`.
[2025-08-12T20:42:40+0300] UI: Pinata — покращено обробку помилок і 401 у `components/connect_to_ipfs.tsx`; якщо `VITE_PINATA_JWT` відсутній — явне повідомлення. Логотип тепер необов’язковий для створення токена.
[2025-08-12T20:55:00+0300] API: Виправлено автентифікацію — додано повний `middleware/auth.ts`, замінено logout-хендлер у `api/routes/authRoutes.ts`, додано auto-register при першому логіні, спрощено валідацію підпису в dev-режимі.
[2025-08-12T20:55:20+0300] API: Додано робочий SolanaAdapter та сумісні інтерфейси, сервіс стартує; health OK на `http://localhost:4000/health`.

[2025-08-12T22:30:00+0300] NOTE: Тимчасовий обхід 401 — бекенд у stateless/Redis режимі при збоях БД. Для локальних тестів виставити `AUTH_STATELESS_MODE=true` і (за бажанням) `REDIS_URL=redis://localhost:6379`.
 
 [2025-08-13T09:10:00+0300] DEBUG: Phantom connect не спрацьовує; у браузерній консолі — Vite WS помилки через реверс-проксі.
 - Додано WebSocket upgrade у `nginx/dev.conf` (`Upgrade`/`Connection`, `proxy_http_version 1.1`).
 - Перезапущено `nginx` та `frontend` у dev-стеку.
 - Next: перевірити HMR клієнт/WS конект і повторно протестувати кнопку `Connect Phantom`.

[2025-08-13T13:32:00Z] CHECK: Frontend Vite dev-сервер активний (http://localhost:5173, контейнер `cc-frontend`). Nginx -> upstream тепер дає 200 OK для `Host: app.crypto-craft.local`. Попередній 502 був під час старту Vite.

[2025-08-13T14:20:00Z] Phantom Connect UX + Toasts
- Кнопка Phantom: виправлено визначення провайдера (`window.phantom?.solana ?? window.solana`), додано state `isConnecting`, відключено повторні кліки, додано fallback `provider.request({ method: 'connect' })`.
- Сповіщення: уніфіковано через `sonner` (`toast.success/error`) + `<Toaster richColors position="top-center"/>` у `components/providers.tsx`.
- Видалено кастомний inline-banner у `App.tsx`; `setNotification` тепер делегує у `sonner`.