import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/styles/globals.css';
import Providers from '@/components/providers.tsx';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';

// Suppress sourcemap warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Sourcemap for')) {
        return;
    }
    originalConsoleWarn(...args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Providers>
          <main className="min-h-screen">
            <App />
          </main>
        </Providers>
      </BrowserRouter>
    </React.StrictMode>
  </RecoilRoot>
);