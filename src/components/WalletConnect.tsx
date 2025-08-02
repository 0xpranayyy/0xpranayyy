import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface WalletConnectProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onWalletConnected,
  onWalletDisconnected,
}) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    if (isConnected && address && onWalletConnected) {
      onWalletConnected(address);
    }
  }, [isConnected, address, onWalletConnected]);

  const handleDisconnect = () => {
    disconnect();
    if (onWalletDisconnected) {
      onWalletDisconnected();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="card p-6 max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Wallet Connected</h3>
          <p className="text-white/80 mb-4">{formatAddress(address!)}</p>
          <button
            onClick={handleDisconnect}
            className="btn-secondary w-full"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 max-w-md">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-arcium-primary to-arcium-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-white/80 mb-8">
          Connect your wallet to start playing privacy-preserving games on Arcium Game Station
        </p>
        
        <div className="space-y-4">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="btn-primary w-full flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connector.name === 'MetaMask' && (
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwLjU0IDEyLjM2TDI4LjE5IDkuOTNDMjcuNzQgOS40NyAyNy4wNCA5LjQ3IDI2LjU5IDkuOTNMMjMuNzYgMTIuNzZDMjMuMzEgMTMuMjIgMjMuMzEgMTMuOTIgMjMuNzYgMTQuMzdMMjYuMTEgMTYuNzJDMjYuNTYgMTcuMTggMjcuMjYgMTcuMTggMjcuNzEgMTYuNzJMMzAuNTQgMTMuODlDMzEgMTMuNDQgMzEgMTIuODEgMzAuNTQgMTIuMzZaIiBmaWxsPSIjRjY2NTFBIi8+CjxwYXRoIGQ9Ik0yMy43NiAyMC40OEwyMS40MSAyMi44M0MyMC45NiAyMy4yOSAyMC4yNiAyMy4yOSAxOS44MSAyMi44M0wxNi45OCAyMEMxNi41MyAxOS41NCAxNi41MyAxOC44NCAxNi45OCAxOC4zOUwxOS4zMyAxNi4wNEMxOS43OCAxNS41OSAyMC40OCAxNS41OSAyMC45MyAxNi4wNEwyMy43NiAxOC44N0MyNC4yMSAxOS4zMiAyNC4yMSAyMC4wMyAyMy43NiAyMC40OFoiIGZpbGw9IiNGNjY1MUEiLz4KPHBhdGggZD0iTTE2Ljk4IDEyLjc2TDE0LjYzIDEwLjQxQzE0LjE4IDkuOTYgMTMuNDggOS45NiAxMy4wMyAxMC40MUwxMC4yIDEzLjI0QzkuNzUgMTMuNjkgOS43NSAxNC4zOSAxMC4yIDE0Ljg0TDEyLjU1IDE3LjE5QzEzIDE3LjY0IDEzLjcgMTcuNjQgMTQuMTUgMTcuMTlMMTYuOTggMTQuMzZDMTcuNDMgMTMuOTEgMTcuNDMgMTMuMjEgMTYuOTggMTIuNzZaIiBmaWxsPSIjRjY2NTFBIi8+Cjwvc3ZnPgo="
                  alt="MetaMask"
                  className="w-6 h-6"
                />
              )}
              <span>{isPending ? 'Connecting...' : `Connect ${connector.name}`}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-200 text-sm">
            <strong>Privacy Note:</strong> Your wallet address will be used for game authentication. 
            All game moves are encrypted before being processed by Arcium's secure computation network.
          </p>
        </div>
      </div>
    </div>
  );
};