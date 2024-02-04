import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { MyListProvider } from './context/MyListContext';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MyListProvider>
      <Provider store={store}>
        <App />
      </Provider>
      </MyListProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


