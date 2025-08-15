### Беклог задач (UI)

## High priority
1) Додати `BrowserRouter` в `src/main.tsx`; видалити `src/main.jsx` і мертві поліфіли.
2) Створити `shared/api/http.ts` та клієнти `shared/api/services/{token,airdrop,liquidity}.ts` з типами.
3) Перевести `TokenCreator`, `Airdrop`, `Liquidity` на unsigned-транзакції з бекенду.
4) Об’єднати дублікати `TokenCreator` → одна фіча з варіантами під блокчейни.
5) Виправити `config/reown.ts` (без throw на імпорті; дружній UI fallback).
6) Централізувати `siteConfig`, прибрати копії у `utils.ts`.
7) Вкладка Airdrop: Devnet чекбокс + кнопка faucet для SOL (тільки Devnet; ліміт ≤2 SOL/запит; приховати на Mainnet).

## Medium
7) Типізувати форми (zod + RHF), прибрати `@ts-ignore`.
8) Уніфікувати `NetworkProvider` і використання мережі в API-викликах.
9) Перенести спільні UI до `shared/ui`, впорядкувати `widgets/`.
10) Додати e2e smoke-тест (Playwright) для ключових сценаріїв.
11) Додати e2e тести Devnet faucet (видимість, успіх/фейл, межі суми).

## Low
11) Оптимізація бандла (видалити зайві поліфіли, lazy-load фіч).
12) Storybook для ключових компонентів.
13) Документація для контриб’юторів у `docs/CONTRIBUTING.md`.


