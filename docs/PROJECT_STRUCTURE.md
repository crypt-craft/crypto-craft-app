### Рекомендована структура директорій (узгоджена з API)

```
app-ui/
  src/
    app/
      providers/
        Providers.tsx          // Theme, Network, Wallet(AppKit), Toaster
      router/
        index.tsx              // BrowserRouter, route config
      index.tsx                // App entry composition

    shared/
      api/
        http.ts                // axios instance, interceptors, baseURL
        services/
          token.ts             // Token API client (typed)
          airdrop.ts           // Airdrop API client (typed)
          liquidity.ts         // Liquidity API client (typed)
      config/
        env.ts                 // VITE_* reads with safe fallbacks
        reown.ts               // Safe AppKit config
        site.ts                // siteConfig
      lib/
        utils.ts               // cn, helpers
      ui/                      // shadcn/radix components

    entities/
      wallet/
        model.ts               // types, selectors
        ui/
          WalletConnector.tsx
      token/
        model.ts
      airdrop/
        model.ts

    features/
      token-creator/
        index.tsx              // orchestrates per-chain creators
        solana.tsx             // calls backend unsigned build; uses wallet to sign
      airdrop-claim/
        index.tsx
      liquidity-manage/
        index.tsx

    widgets/
      header/
        Header.tsx
      layout/
        MainLayout.tsx

    pages/
      home.tsx
      solana.tsx
      ton.tsx
      tron.tsx

    index.css
    main.tsx
```

Примітки:
- Всі звернення до API лише через `shared/api`.
- Всі середовищні змінні — через `shared/config/env.ts`.
- Вцілілі компоненти з нинішнього `components/` переносяться у `shared/ui` або `widgets/*`.


