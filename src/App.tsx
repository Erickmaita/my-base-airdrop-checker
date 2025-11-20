import { useAccount, useReadContract } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { base } from 'wagmi/chains';
import { formatUnits } from 'viem';
import React from 'react';

// --- CONFIGURACIÓN DE MODO DE PRUEBA Y CONTRATO ---
const TEST_MODE = true; // Activa el modo de simulación basado en Arbitrum
const AirdropContractAddress = '0x1234567890123456789012345678901234567890'; // Dirección de ejemplo

// ABI MINIMALISTA (Solo se usa si TEST_MODE es false)
const airdropAbi = [
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'isEligible',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// --- HOOK PARA SIMULAR DATOS DE PRUEBA (BASADO EN CRITERIOS DE ARBITRUM) ---
const useTestData = (address: `0x${string}` | undefined, isConnected: boolean) => {
  // Simulación: Cumplir con 3 de los 8 criterios de Arbitrum (al azar)
  // 60% de chance de ser elegible (simulando que la mayoría cumplió los criterios mínimos)
  const [isEligibleSimulated] = React.useState(Math.random() > 0.4); 

  // Simulación: Si es elegible, asigna una cantidad al azar (simulando diferentes niveles de airdrop de 1k a 10k)
  const amountSimulated = isEligibleSimulated 
    ? BigInt(Math.floor(Math.random() * (10000 - 1000 + 1) + 1000) * 10**18) 
    : BigInt(0); 

  // Simula un tiempo de carga breve
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
    }
  }, [isConnected, address]);

  return {
    isEligible: isEligibleSimulated,
    rawAmount: amountSimulated,
    isLoading: isLoading,
  };
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  // Hook para obtener la dirección conectada
  const { address, isConnected, chainId } = useAccount();

  // --- LÓGICA DE LECTURA REAL DE CONTRATO (si TEST_MODE es false) ---
  const { data: isEligibleReal, isLoading: isLoadingEligibleReal } = useReadContract({
    abi: airdropAbi,
    address: AirdropContractAddress,
    functionName: 'isEligible',
    args: [address!],
    chainId: base.id,
    query: {
      enabled: !TEST_MODE && isConnected && !!address && chainId === base.id,
      staleTime: 1000 * 60,
    },
  });

  const { data: rawAmountReal, isLoading: isLoadingAmountReal } = useReadContract({
    abi: airdropAbi,
    address: AirdropContractAddress,
    functionName: 'getAmount',
    args: [address!],
    chainId: base.id,
    query: {
      enabled: !TEST_MODE && isEligibleReal && !!address && chainId === base.id,
      staleTime: 1000 * 60,
    },
  });

  // --- LÓGICA DE SIMULACIÓN (si TEST_MODE es true) ---
  const { isEligible: isEligibleSim, rawAmount: rawAmountSim, isLoading: isLoadingSim } = useTestData(address, isConnected);

  // --- SELECCIÓN FINAL DE DATOS ---
  const isEligible = TEST_MODE ? isEligibleSim : isEligibleReal;
  const rawAmount = TEST_MODE ? rawAmountSim : rawAmountReal;
  const isLoading = TEST_MODE ? isLoadingSim : (isLoadingEligibleReal || isLoadingAmountReal);
  
  // --- FORMATO DE DATOS Y ESTADOS ---
  const amountToReceive = rawAmount ? parseFloat(formatUnits(rawAmount, 18)).toFixed(2) : '0.00';
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';
  const isBaseChain = chainId === base.id;

  // --- LÓGICA DE VISUALIZACIÓN ---
  let statusText = '';
  let statusColor = '';

  if (!isConnected) {
    statusText = 'Conecta tu Wallet para verificar la elegibilidad.';
    statusColor = 'bg-gray-200 text-gray-700';
  } else if (!isBaseChain) {
    statusText = '⚠️ Por favor, cambia a la red Base para verificar.';
    statusColor = 'bg-yellow-200 text-yellow-800 border-l-4 border-yellow-500';
  } else if (isLoading) {
    statusText = 'Verificando elegibilidad con los criterios simulados...';
    statusColor = 'bg-blue-100 text-blue-800 animate-pulse border-l-4 border-blue-500';
  } else if (isEligible) {
    statusText = `🎉 Eres elegible para recibir ${amountToReceive} TOKENS.`;
    statusColor = 'bg-green-100 text-green-800 border-l-4 border-green-500';
  } else {
    // isConnected && isBaseChain && !isEligible
    statusText = '❌ Lo sentimos, esta dirección NO es elegible (según simulación).';
    statusColor = 'bg-red-100 text-red-800 border-l-4 border-red-500';
  }
  
  return (
    // 1. Fondo con degradado azul/gris para un estilo moderno (como Base)
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      
      {/* 2. Tarjeta principal con sombra y bordes redondeados */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform hover:scale-[1.02] transition-transform duration-300 border border-blue-500/20">
        
        {/* Título y Branding */}
        <h1 className="text-3xl font-extrabold text-blue-600 dark:text-sky-400 mb-6 tracking-tight">
          BASE <span className="text-gray-900 dark:text-gray-100">Airdrop Checker</span>
        </h1>

        {/* 3. Botón ConnectKit (se deja el estilo por defecto de ConnectKit, que ya es atractivo) */}
        <div className="mb-8">
          <ConnectKitButton />
        </div>

        {isConnected && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 rounded-lg text-sm text-blue-800 dark:text-blue-200 font-medium">
            <p>Wallet Conectada:</p>
            <p className="font-mono break-all text-blue-700 dark:text-sky-300">{displayAddress}</p>
          </div>
        )}
        
        {/* 4. Mostrar el resultado de la verificación */}
        <div className={`p-4 rounded-lg font-bold text-lg transition-all duration-300 ${statusColor}`}>
          {statusText}
        </div>

        {TEST_MODE && isConnected && (
            <p className="mt-4 text-sm text-purple-600 dark:text-purple-300 italic">
                (MODO PRUEBA ACTIVO: Simulación ARB)
            </p>
        )}

        {/* Mensaje de aviso */}
        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          Verificador no oficial. {AirdropContractAddress}
        </p>
      </div>
    </div>
  );
}