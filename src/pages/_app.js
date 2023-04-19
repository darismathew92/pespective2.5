import { Toaster } from 'react-hot-toast';
import GlobalContextProvider from '../state/context/GlobalContext';
import '../styles/globals.css';
import { ThirdwebProvider } from "@thirdweb-dev/react";


function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain="mumbai">
    <GlobalContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </GlobalContextProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
