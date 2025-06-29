import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';

// Performance monitoring
const reportWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (paintMetrics.length > 0) {
          const fcp = paintMetrics.find(({ name }) => name === 'first-contentful-paint');
          if (fcp) {
            console.log('First Contentful Paint:', Math.round(fcp.startTime), 'ms');
          }
        }
        
        if (navigationTiming) {
          const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
          console.log('Total Page Load Time:', Math.round(pageLoadTime), 'ms');
          
          const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;
          console.log('DOM Content Loaded:', Math.round(domContentLoaded), 'ms');
        }
      }, 0);
    });
  }
};

// Create a root once and reuse it
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Render the app
root.render(
  <StrictMode>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
        },
      }}
    />
  </StrictMode>
);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

// Report web vitals
reportWebVitals();
