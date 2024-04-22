import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import App from './App';

function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWrapper;
