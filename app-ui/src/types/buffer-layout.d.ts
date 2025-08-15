declare module '@solana/buffer-layout' {
  // Re-export from our adapter
  export * from '../buffer-layout-adapter';
  const defaultExport: any;
  export default defaultExport;
}

declare module '@solana/buffer-layout/lib/Layout.js' {
  // Re-export from our adapter
  export * from '../buffer-layout-adapter';
  const defaultExport: any;
  export default defaultExport;
} 