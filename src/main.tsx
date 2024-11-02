import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import TestApp1 from './TestApp1';
// import './index.css';
// import TestApp2 from './TestApp2';
// import TestApp3 from './TestApp3';

// createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <TestApp3 />
//   </React.StrictMode>
// );
