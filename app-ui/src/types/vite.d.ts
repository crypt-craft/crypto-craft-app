/**
 * Vite Type Definitions
 * 
 * This file provides type definitions for Vite.
 * It's used to fix the TypeScript error about missing vite/client type definitions.
 */

declare module 'vite/client' {
  // Add any Vite-specific types here if needed
  export interface ImportMetaEnv {
    readonly VITE_WEB3AUTH_CLIENT_ID: string;
    readonly VITE_CONNECTOR_PID: string;
    // Add other environment variables as needed
  }

  export interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
} 