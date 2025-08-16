import React from 'react'
import ReactDOM from 'react-dom/client'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { PetraWalletAdapter } from 'petra-plugin-wallet-adapter'
import App from './App.jsx'
import './index.css'

// Initialize wallet adapters
const wallets = [new PetraWalletAdapter()]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>,
)
