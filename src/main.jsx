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
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider defaultMode='system' theme={theme}>
      <ConfirmProvider
        defaultOptions={{
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { variant: 'contained' },
          cancellationButtonProps: { color: 'inherit' },

          //* Only close in 2 buttons
          allowClose: false,

          buttonOrder: ['confirm', 'cancel'],
        }}
      >
        <CssBaseline />
        <App />
        <ToastContainer position='bottom-left' theme='colored' />
      </ConfirmProvider>
    </ThemeProvider>
  </Provider>
);
