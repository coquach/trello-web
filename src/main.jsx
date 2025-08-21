import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmProvider } from 'material-ui-confirm';
import theme from '~/theme';
import App from '~/App';
import { store } from '~/redux/store';
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { injectStore } from './utils/authorizeAxios';
import { GlobalStyles } from '@mui/material';

const persistor = persistStore(store);

injectStore(store);

createRoot(document.getElementById('root')).render(
  <BrowserRouter
    basename='/'
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider defaultMode='system' theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: { variant: 'contained' },
              cancellationButtonProps: { color: 'inherit' },
              cancellationText: 'Cancel',
              allowClose: true,

              buttonOrder: ['confirm', 'cancel'],
            }}
          >
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored' />
          </ConfirmProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
