- [Time.now] Wallet auth/balance flow fix session started. Enforced devnet locally, removed auto-login on connect, ensured CORS/trust-proxy and public /api/auth/login. Adjusted RPC selection to avoid mainnet 403 in dev.
## 2025-08-14 — Wallet connectors worklog

- Start: Investigating Phantom connect hang and adding Trust Wallet connector for local dev.
- Scope: Review `app-ui` wallet flows, fix Phantom connect state/UX, add EVM Trust Wallet connector and tabs, document secure-context requirements.

- Changes:
  - Fix: `SolanaWalletConnector` now resets `isConnecting` on early return when Phantom is missing; avoids stuck "Connecting…" UI and adds `publicKey` fallback.
  - Add: `@features/wallet/TrustWalletConnector.tsx` (EVM, detects `window.ethereum.isTrust`), wired into `CryptoCraftFeatures`.
  - Docs: `docs/ARCHITECTURE_WALLETS.md` with best practices and prod path (Wallet Adapter/Wagmi + WalletConnect).
  - Build: Fixed TS window type for `__CC_API_URI__`; removed top-level await from `utils.ts`. Build is green.

- Next:
  - Optional: integrate WalletConnect v2 for EVM and Solana mobile flows.
  - Optional: reintroduce Solana Wallet Adapter list (Phantom, Solflare) behind feature flag.


[2025-08-14T11:09:29Z] Start: Fix Solana wallet connect->auth flow, devnet default locally, CORS/trust proxy, public /api/auth/login
[2025-08-14T11:11:12Z] End: Wallet flow/CORS/devnet fixes applied
