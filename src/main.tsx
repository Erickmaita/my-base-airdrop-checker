import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. REACT QUERY (Para manejar el estado asíncrono)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. WAGMI, CONNECTKIT Y CADENAS
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
// IMPORTACIÓN CORREGIDA: Eliminamos la dependencia externa obsoleta @wagmi/connectors.
// Ahora importamos los conectores directamente desde 'wagmi'.
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'; 
import { ConnectKitProvider } from "connectkit";

// CLAVE API Y CADENAS
const ALCHEMY_API_KEY = 'hlfwI4md1342bU14tYU0l'; 
const chains = [mainnet, base];

// CREACIÓN DE LA CONFIGURACIÓN DE WAGMI
const config = createConfig({
  chains: chains,
  // CORRECCIÓN: 'shimDisconnect: true' ayuda a la detección correcta de la extensión MetaMask.
  connectors: [
    metaMask(),
    injected({ chains, shimDisconnect: true }), 
    // Añadir Connectors adicionales para robustez (ej. WalletConnect, Coinbase)
    walletConnect({ projectId: import.meta.env.VITE_PROJECT_ID as any }),
    coinbaseWallet({ appName: 'Base Nexus App', appIcon: 'https://placehold.co/1200x630/16284a/ffffff' }),
  ],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  },
});

// INSTANCIA DEL CLIENTE DE REACT QUERY
const queryClient = new QueryClient(); 

// RENDERIZADO (El punto de entrada de la aplicación, usando todos los proveedores)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <App />
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
);
