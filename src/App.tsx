import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { base } from 'wagmi/chains';
import React from 'react';

// BACKEND URL
const BACKEND_URL = "http://localhost:3001/check";

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const { address, isConnected, chainId } = useAccount();

  // Estado del backend
  const [backendResult, setBackendResult] = React.useState<{
    ok: boolean;
    eligible: boolean;
    message: string;
  } | null>(null);

  const [backendLoading, setBackendLoading] = React.useState(false);

  // Hook para llamar al backend apenas conecte wallet
  const checkBackendEligibility = async (addr: string) => {
    try {
      setBackendLoading(true);
      setBackendResult(null);

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr })
      });

      const data = await res.json();
      setBackendResult(data);
    } catch (err) {
      setBackendResult({
        ok: false,
        eligible: false,
        message: "Error comunicando con el backend."
      });
    } finally {
      setBackendLoading(false);
    }
  };

  // Dispara la verificación cuando conecte la wallet
  React.useEffect(() => {
    if (isConnected && address && chainId === base.id) {
      checkBackendEligibility(address);
    }
  }, [isConnected, address, chainId]);

  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';
  const isBaseChain = chainId === base.id;

  // --- TEXTO DE ESTADO ---
  let statusText = "";
  let statusColor = "";

  if (!isConnected) {
    statusText = "Conecta tu Wallet para verificar la elegibilidad.";
    statusColor = "bg-gray-200 text-gray-700";
  } else if (!isBaseChain) {
    statusText = "⚠️ Por favor, cambia a la red Base para verificar.";
    statusColor = "bg-yellow-200 text-yellow-800 border-l-4 border-yellow-500";
  } else if (backendLoading) {
    statusText = "Consultando el backend...";
    statusColor = "bg-blue-100 text-blue-800 animate-pulse border-l-4 border-blue-500";
  } else if (backendResult) {
    if (backendResult.eligible) {
      statusText = "🎉 " + backendResult.message;
      statusColor = "bg-green-100 text-green-800 border-l-4 border-green-500";
    } else {
      statusText = "❌ " + backendResult.message;
      statusColor = "bg-red-100 text-red-800 border-l-4 border-red-500";
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform hover:scale-[1.02] transition-transform duration-300 border border-blue-500/20">

        <h1 className="text-3xl font-extrabold text-blue-600 dark:text-sky-400 mb-6 tracking-tight">
          BASE <span className="text-gray-900 dark:text-gray-100">Airdrop Checker</span>
        </h1>

        <div className="mb-8">
          <ConnectKitButton />
        </div>

        {isConnected && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 rounded-lg text-sm text-blue-800 dark:text-blue-200 font-medium">
            <p>Wallet Conectada:</p>
            <p className="font-mono break-all text-blue-700 dark:text-sky-300">{displayAddress}</p>
          </div>
        )}

        <div className={`p-4 rounded-lg font-bold text-lg transition-all duration-300 ${statusColor}`}>
          {statusText}
        </div>

        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          Verificador no oficial. Backend conectado.
        </p>
      </div>
    </div>
  );
}
