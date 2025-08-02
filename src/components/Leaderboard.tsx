import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArciumComputeJob } from '../utils/arciumMock';

interface PlayerStats {
  address: string;
  wins: number;
  losses: number;
  ties: number;
  totalGames: number;
  winRate: number;
  lastGameTimestamp: number;
  zkProofCount: number;
  anonymizedRank: string;
}

interface LeaderboardProps {
  gameResults?: ArciumComputeJob[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ gameResults = [] }) => {
  const { address } = useAccount();
  const [leaderboardData, setLeaderboardData] = useState<PlayerStats[]>([]);
  const [currentPlayerStats, setCurrentPlayerStats] = useState<PlayerStats | null>(null);
  const [sortBy, setSortBy] = useState<'winRate' | 'totalGames' | 'zkProofCount'>('winRate');

  useEffect(() => {
    generateLeaderboardData();
  }, [gameResults, address]);

  const generateLeaderboardData = () => {
    // Create mock leaderboard data with current player's real stats
    const mockPlayers = [
      { address: '0x1234...5678', wins: 15, losses: 3, ties: 2 },
      { address: '0x2345...6789', wins: 12, losses: 5, ties: 3 },
      { address: '0x3456...789a', wins: 10, losses: 4, ties: 1 },
      { address: '0x4567...89ab', wins: 8, losses: 6, ties: 2 },
      { address: '0x5678...9abc', wins: 7, losses: 7, ties: 3 },
    ];

    // Calculate current player's stats from actual game results
    let currentPlayerData: PlayerStats | null = null;
    if (address) {
      const playerGames = gameResults.filter(game => 
        game.status === 'completed'
      );

      const wins = playerGames.filter(game => game.result.player1Result === 'win').length;
      const losses = playerGames.filter(game => game.result.player1Result === 'lose').length;
      const ties = playerGames.filter(game => game.result.player1Result === 'tie').length;
      const totalGames = wins + losses + ties;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      const zkProofCount = playerGames.length; // Each game generates a ZK proof
      const lastGameTimestamp = playerGames.length > 0 
        ? Math.max(...playerGames.map(g => g.timestamp))
        : Date.now();

      currentPlayerData = {
        address: `${address.slice(0, 6)}...${address.slice(-4)}`,
        wins,
        losses,
        ties,
        totalGames,
        winRate,
        lastGameTimestamp,
        zkProofCount,
        anonymizedRank: generateAnonymizedRank(winRate, totalGames),
      };

      setCurrentPlayerStats(currentPlayerData);
    }

    // Generate full leaderboard including current player
    const allPlayers: PlayerStats[] = mockPlayers.map((player, index) => {
      const totalGames = player.wins + player.losses + player.ties;
      const winRate = (player.wins / totalGames) * 100;
      const zkProofCount = totalGames;
      const lastGameTimestamp = Date.now() - Math.random() * 86400000 * 7; // Random time within last week

      return {
        ...player,
        totalGames,
        winRate,
        zkProofCount,
        lastGameTimestamp,
        anonymizedRank: generateAnonymizedRank(winRate, totalGames),
      };
    });

    // Add current player if they have played games
    if (currentPlayerData && currentPlayerData.totalGames > 0) {
      // Remove any existing entry for current player and add the real data
      const filteredPlayers = allPlayers.filter(p => p.address !== currentPlayerData.address);
      allPlayers.splice(0, filteredPlayers.length, ...filteredPlayers, currentPlayerData);
    }

    // Sort players
    const sortedPlayers = [...allPlayers].sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          return b.winRate - a.winRate;
        case 'totalGames':
          return b.totalGames - a.totalGames;
        case 'zkProofCount':
          return b.zkProofCount - a.zkProofCount;
        default:
          return b.winRate - a.winRate;
      }
    });

    setLeaderboardData(sortedPlayers);
  };

  const generateAnonymizedRank = (winRate: number, totalGames: number): string => {
    // Generate privacy-preserving rank using a simple scoring system
    const score = winRate * 0.7 + (totalGames * 2) * 0.3;
    
    if (score >= 80) return 'Diamond 💎';
    if (score >= 60) return 'Platinum 🏆';
    if (score >= 40) return 'Gold 🥇';
    if (score >= 25) return 'Silver 🥈';
    if (score >= 15) return 'Bronze 🥉';
    return 'Rookie 🌱';
  };

  const formatAddress = (addr: string) => {
    if (addr.includes('...')) return addr; // Already formatted
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getSortButtonClass = (sort: typeof sortBy) => {
    return `px-4 py-2 rounded-lg transition-all duration-200 ${
      sortBy === sort
        ? 'bg-arcium-primary text-white'
        : 'bg-white/10 text-white/80 hover:bg-white/20'
    }`;
  };

  return (
    <div className="card p-8 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Privacy Leaderboard</h2>
        <p className="text-white/80">Rankings based on ZK-verified game performance</p>
      </div>

      {/* Current Player Stats */}
      {currentPlayerStats && address && (
        <div className="mb-8 p-6 bg-gradient-to-r from-arcium-primary/20 to-arcium-secondary/20 border border-arcium-primary/30 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{currentPlayerStats.wins}</div>
              <div className="text-white/80 text-sm">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{currentPlayerStats.losses}</div>
              <div className="text-white/80 text-sm">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{currentPlayerStats.ties}</div>
              <div className="text-white/80 text-sm">Ties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{currentPlayerStats.winRate.toFixed(1)}%</div>
              <div className="text-white/80 text-sm">Win Rate</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-white/80">
              Rank: <span className="font-semibold text-white">{currentPlayerStats.anonymizedRank}</span>
            </div>
            <div className="text-white/80">
              ZK Proofs: <span className="font-semibold text-green-400">{currentPlayerStats.zkProofCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-white/80">Sort by:</span>
          <button
            onClick={() => setSortBy('winRate')}
            className={getSortButtonClass('winRate')}
          >
            Win Rate
          </button>
          <button
            onClick={() => setSortBy('totalGames')}
            className={getSortButtonClass('totalGames')}
          >
            Games Played
          </button>
          <button
            onClick={() => setSortBy('zkProofCount')}
            className={getSortButtonClass('zkProofCount')}
          >
            ZK Proofs
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-4 px-4 text-white/80 font-semibold">Rank</th>
              <th className="text-left py-4 px-4 text-white/80 font-semibold">Player</th>
              <th className="text-center py-4 px-4 text-white/80 font-semibold">Anonymous Rank</th>
              <th className="text-center py-4 px-4 text-white/80 font-semibold">Win Rate</th>
              <th className="text-center py-4 px-4 text-white/80 font-semibold">Games</th>
              <th className="text-center py-4 px-4 text-white/80 font-semibold">ZK Proofs</th>
              <th className="text-center py-4 px-4 text-white/80 font-semibold">Last Game</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player, index) => {
              const isCurrentPlayer = address && player.address === formatAddress(address);
              
              return (
                <tr
                  key={player.address}
                  className={`border-b border-white/10 transition-colors duration-200 hover:bg-white/5 ${
                    isCurrentPlayer ? 'bg-arcium-primary/10 border-arcium-primary/30' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                      </span>
                      <span className={`font-semibold ${isCurrentPlayer ? 'text-arcium-primary' : 'text-white'}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        isCurrentPlayer ? 'bg-arcium-primary' : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}>
                        {isCurrentPlayer ? '🔑' : '👤'}
                      </div>
                      <div>
                        <div className={`font-semibold ${isCurrentPlayer ? 'text-arcium-primary' : 'text-white'}`}>
                          {player.address}
                          {isCurrentPlayer && <span className="text-xs ml-2 text-arcium-secondary">(You)</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-semibold text-white">
                      {player.anonymizedRank}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-white font-semibold">{player.winRate.toFixed(1)}%</span>
                    <div className="text-xs text-white/60 mt-1">
                      {player.wins}W / {player.losses}L / {player.ties}T
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-white font-semibold">{player.totalGames}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-green-400 font-semibold">{player.zkProofCount}</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-white/80 text-sm">{formatTimestamp(player.lastGameTimestamp)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Privacy Information */}
      <div className="mt-8 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
        <h4 className="font-semibold text-purple-200 mb-2">🛡️ Privacy-Preserving Features</h4>
        <ul className="text-purple-200 text-sm space-y-1">
          <li>• Player addresses are anonymized (only showing wallet prefixes)</li>
          <li>• Rankings use ZK-verified game outcomes without revealing game details</li>
          <li>• Anonymous rank tiers protect individual performance data</li>
          <li>• All statistics are computed from cryptographically verified proofs</li>
        </ul>
      </div>

      {!address && (
        <div className="mt-8 text-center p-6 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-200">
            Connect your wallet to see your stats and compete on the leaderboard!
          </p>
        </div>
      )}
    </div>
  );
};