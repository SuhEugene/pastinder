import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/normalize.css';
import './assets/index.css';
import '@fontsource/inter';
import { ThemeProvider } from '@emotion/react';

const darkTheme = {
  colors: {
    primary: '#9147ff',
    secondary: '#53535f60',
    success: '#00f593',
    danger: '#ff4f4d'
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  //</React.StrictMode>
);
