### Wallet connection architecture (Phantom + Trust Wallet)

This app implements lightweight, robust connectors for local development and a production-ready path.

- Phantom (Solana): `@features/wallet/SolanaWalletConnector.tsx`
  - Detect provider via `window.phantom?.solana ?? window.solana` and require `isPhantom`.
  - Enforce secure context: HTTPS or localhost; otherwise show actionable error.
  - Autoconnect on mount with `{ onlyIfTrusted: true }`, attach `connect`/`disconnect` listeners.
  - Connect button uses `provider.connect()` or `provider.request({ method: 'connect' })` fallback.
  - Handles providers that emit events without returning payload; reads `provider.publicKey` as fallback.
  - Resets `isConnecting` on all paths to avoid stuck UI.
  - Balance/token reads via `@solana/web3.js` and `@solana/spl-token`.
  - Auth flow decoupled via `useAuth` (signMessage, backend JWT).

- Trust Wallet (EVM): `@features/wallet/TrustWalletConnector.tsx`
  - Detect injected provider: `window.ethereum.providers.find(p.isTrust)` or `window.ethereum.isTrust`.
  - Request accounts via `eth_requestAccounts` and chain via `eth_chainId`.
  - Listen to `accountsChanged`, `chainChanged`, `disconnect` and update local state.
  - Enforce secure context and provide clear UX errors.

Best practices applied
- Secure context checks (HTTPS/localhost), clear toasts for common failures.
- Idempotent connect button (debounced by `isConnecting` and `isConnected`).
- Event-driven state; handle both payload-returning and event-only providers.
- Separation of concerns: signing/auth isolated in `useAuth`.

Production path (recommended)
- Solana: Prefer `@solana/wallet-adapter-react` with Wallet Standard enabled and curated wallet list (Phantom, Solflare, Backpack). Keep direct injection fallback for minimal demos.
- EVM: Use `wagmi` + `@walletconnect/ethereum-provider` or `web3modal` for Trust Wallet, MetaMask, Coinbase. Maintain QR fallback for mobile.
- Mobile: WalletConnect v2 for both ecosystems.

Local setup notes
- Install Phantom and Trust Wallet browser extensions.
- Serve over HTTPS or use `localhost` to allow wallet injection.
- If Vite HMR shows WS issues behind reverse proxy, disable HMR or proxy WS correctly; wallet injection is separate but dev UX degrades.


