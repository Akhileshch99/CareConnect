import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import reportWebVitals from './reportWebVitals';

if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {},
    nextTick: (cb) => Promise.resolve().then(cb),
  };
}

const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
