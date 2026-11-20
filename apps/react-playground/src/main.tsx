import './index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element cannot be found, app cannot be renderered');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
