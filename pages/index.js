import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initWalletConnect = async () => {
      // Import WalletConnect provider
      const { EthereumProvider } = await import('@walletconnect/ethereum-provider');

      // Initialize provider
      const wcProvider = new EthereumProvider({
        projectId: '962425907914a3e80a7d8e7288b23f62',
        chains: [1, 11155111], // mainnet and sepolia
        showQrModal: true,
      });

      // Connect to wallet
      wcProvider.connect();

      // Listen for connection
      wcProvider.on('connect', async (accounts, chainId) => {
        // Import ethers
        const { BrowserProvider } = await import('ethers');
        const ethersProvider = new BrowserProvider(wcProvider);
        const signer = await ethersProvider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
        setIsConnected(true);
        setStatus(`✔ Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`);
      });

      // Listen for disconnection
      wcProvider.on('disconnect', () => {
        setAddress(null);
        setIsConnected(false);
        setStatus('Connection failed');
      });

      setProvider(wcProvider);
    };

    initWalletConnect();
  }, []);

  const connectWallet = () => {
    if (!provider) return;
    provider.connect();
  };

  const disconnectWallet = () => {
    if (!provider) return;
    provider.disconnect();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] text-white">
      <div className="card p-8 rounded-2xl bg-[#020617] border border-[#1e293b] max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">WalletConnect v2</h2>
        <div className="mb-4">
          <button
            onClick={connectWallet}
            className="w-full py-3 px-4 bg-[#22c55e] text-[#020617] font-semibold rounded-lg hover:bg-[#16a34a] transition-colors"
          >
            Connect Wallet
          </button>
        </div>
        {isConnected && (
          <button
            onClick={disconnectWallet}
            className="w-full py-3 px-4 bg-[#ef4444] text-white font-semibold rounded-lg hover:bg-[#dc2626] transition-colors"
          >
            Disconnect
          </button>
        )}
        <div className="mt-4 text-sm text-[#94a3b8]">
          {status}
        </div>
      </div>
    </div>
  );
}
