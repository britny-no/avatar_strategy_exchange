import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import theme from './styled/theme';
import './index.css'
import App from '@/App'
import { store } from '@/states/store';
import "./locales";

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
)
