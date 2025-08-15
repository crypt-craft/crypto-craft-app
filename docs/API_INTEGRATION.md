### Інтеграція з API (узгодження з crypto-craft-api)

## Базові принципи
- Бекенд формує unsigned транзакції і повертає base64/serialized дані + метадані (TTL, recent blockhash).
- Фронт підписує локальним гаманцем і надсилає в мережу.
- Усі запити йдуть через `shared/api/http.ts` (axios) з `VITE_API_URI`.

## Клієнти сервісів (приклад контрактів)

Token:
- POST `/api/tokens/build` → { unsignedTxBase64, mintPubkey, metadata }
- POST `/api/tokens/submit` → { signature }

Airdrop:
- POST `/api/airdrops/build` → { unsignedTxBase64 }
- POST `/api/airdrops/submit` → { signature }

Liquidity:
- POST `/api/liquidity/build` → { txs: string[] } // одна чи кілька базових транзакцій
- POST `/api/liquidity/submit` → { signatures: string[] }

## Помилки та обробка
- Інтерцептор відповіді перетворює помилки у єдиний формат { message, code }.
- Ретрай логіка лише для idempotent GET.


