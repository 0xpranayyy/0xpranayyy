import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { WalletConnect } from './components/WalletConnect';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { ArciumComputeJob } from './utils/arciumMock';

const queryClient = new QueryClient();

type ActiveView = 'home' | 'game' | 'leaderboard';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [gameResults, setGameResults] = useState<ArciumComputeJob[]>([]);

  // Load game results from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem('arcium_game_results');
    if (stored) {
      try {
        setGameResults(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load game results from localStorage:', error);
      }
    }
  }, []);

  // Save game results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('arcium_game_results', JSON.stringify(gameResults));
  }, [gameResults]);

  const handleWalletConnected = (address: string) => {
    setWalletConnected(true);
    console.log('Wallet connected:', address);
  };

  const handleWalletDisconnected = () => {
    setWalletConnected(false);
    setActiveView('home');
  };

  const handleGameComplete = (result: ArciumComputeJob) => {
    setGameResults(prev => [result, ...prev]);
  };

  const navigationItems = [
    { id: 'home' as ActiveView, label: 'Home', icon: '🏠' },
    { id: 'game' as ActiveView, label: 'Play Game', icon: '🎮' },
    { id: 'leaderboard' as ActiveView, label: 'Leaderboard', icon: '🏆' },
  ];

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
          {/* Header */}
          <header className="border-b border-white/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-arcium-primary to-arcium-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Arcium Game Station</h1>
                    <p className="text-white/60 text-sm">Privacy-Preserving Gaming Hub</p>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeView === item.id
                          ? 'bg-arcium-primary text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Wallet Status */}
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    walletConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      walletConnected ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span>{walletConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Navigation */}
          <div className="md:hidden border-b border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-around py-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-arcium-primary text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center">
              {activeView === 'home' && (
                <div className="max-w-4xl w-full space-y-8">
                  {/* Welcome Section */}
                  <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                      Welcome to{' '}
                      <span className="bg-gradient-to-r from-arcium-primary to-arcium-secondary bg-clip-text text-transparent">
                        Arcium Game Station
                      </span>
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                      Experience the future of gaming with privacy-preserving gameplay powered by Arcium's 
                      secure multi-party computation network. Play games where your moves stay encrypted, 
                      but results are always fair and verifiable.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="card p-6 text-center">
                      <div className="text-4xl mb-4">🔒</div>
                      <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
                      <p className="text-white/80">Your moves are encrypted client-side and processed securely via MPC</p>
                    </div>
                    <div className="card p-6 text-center">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-xl font-bold text-white mb-2">Instant Verification</h3>
                      <p className="text-white/80">ZK proofs ensure fair gameplay without revealing sensitive data</p>
                    </div>
                    <div className="card p-6 text-center">
                      <div className="text-4xl mb-4">🌐</div>
                      <h3 className="text-xl font-bold text-white mb-2">Decentralized</h3>
                      <p className="text-white/80">Connect your wallet and play on a trustless, decentralized platform</p>
                    </div>
                  </div>

                  {/* Wallet Connection */}
                  <div className="flex justify-center">
                    <WalletConnect 
                      onWalletConnected={handleWalletConnected}
                      onWalletDisconnected={handleWalletDisconnected}
                    />
                  </div>

                  {/* Quick Stats */}
                  {walletConnected && gameResults.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-xl font-bold text-white mb-4 text-center">Your Recent Activity</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-arcium-primary">{gameResults.length}</div>
                          <div className="text-white/80 text-sm">Games Played</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {gameResults.filter(g => g.result.player1Result === 'win').length}
                          </div>
                          <div className="text-white/80 text-sm">Wins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {gameResults.filter(g => g.result.player1Result === 'tie').length}
                          </div>
                          <div className="text-white/80 text-sm">Ties</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{gameResults.length}</div>
                          <div className="text-white/80 text-sm">ZK Proofs</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'game' && (
                <GameBoard onGameComplete={handleGameComplete} />
              )}

              {activeView === 'leaderboard' && (
                <Leaderboard gameResults={gameResults} />
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white/60 text-sm">
                  © 2024 Arcium Game Station. Privacy-preserving gaming powered by MPC.
                </div>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-white/60 hover:text-white text-sm">Documentation</a>
                  <a href="#" className="text-white/60 hover:text-white text-sm">Privacy Policy</a>
                  <a href="#" className="text-white/60 hover:text-white text-sm">About Arcium</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;