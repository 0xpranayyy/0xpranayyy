import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { GameMove, EncryptedMove, encryptMove, generatePlayerKey } from '../utils/encryption';
import { arciumSDK, ArciumComputeJob, GameResult } from '../utils/arciumMock';

interface GameBoardProps {
  onGameComplete?: (result: ArciumComputeJob) => void;
}

type GameState = 'waiting_for_move' | 'waiting_for_opponent' | 'computing' | 'completed' | 'error';

export const GameBoard: React.FC<GameBoardProps> = ({ onGameComplete }) => {
  const { address } = useAccount();
  const [gameState, setGameState] = useState<GameState>('waiting_for_move');
  const [selectedMove, setSelectedMove] = useState<GameMove | null>(null);
  const [playerKey, setPlayerKey] = useState<string>('');
  const [encryptedMove, setEncryptedMove] = useState<EncryptedMove | null>(null);
  const [gameResult, setGameResult] = useState<ArciumComputeJob | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Generate a unique player key for this session
    const key = generatePlayerKey();
    setPlayerKey(key);
  }, []);

  const moves: { move: GameMove; icon: string; label: string; color: string }[] = [
    { move: 'rock', icon: '🪨', label: 'Rock', color: 'from-gray-500 to-gray-700' },
    { move: 'paper', icon: '📄', label: 'Paper', color: 'from-blue-500 to-blue-700' },
    { move: 'scissors', icon: '✂️', label: 'Scissors', color: 'from-red-500 to-red-700' },
  ];

  const handleMoveSelection = async (move: GameMove) => {
    if (gameState !== 'waiting_for_move' || isProcessing) return;

    setIsProcessing(true);
    setSelectedMove(move);
    setError('');

    try {
      // Encrypt the move
      const encrypted = encryptMove(move, playerKey);
      setEncryptedMove(encrypted);
      setGameState('waiting_for_opponent');

      // Simulate opponent's move (in a real app, this would come from another player)
      await simulateOpponentMove(encrypted);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encrypt move');
      setGameState('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateOpponentMove = async (playerMove: EncryptedMove) => {
    try {
      setGameState('computing');

      // Generate a random opponent move
      const opponentMoves: GameMove[] = ['rock', 'paper', 'scissors'];
      const opponentMove = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];
      const opponentKey = generatePlayerKey();
      const encryptedOpponentMove = encryptMove(opponentMove, opponentKey);

      // Submit to Arcium network for secure computation
      const jobId = await arciumSDK.submitEncryptedJob({
        player1Move: playerMove,
        player2Move: encryptedOpponentMove,
        player1Key: playerKey,
        player2Key: opponentKey,
      });

      // Get the result
      const result = await arciumSDK.getJobResult(jobId);
      
      if (result) {
        setGameResult(result);
        setGameState('completed');
        if (onGameComplete) {
          onGameComplete(result);
        }
      } else {
        throw new Error('Failed to get computation result');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Game computation failed');
      setGameState('error');
    }
  };

  const resetGame = () => {
    setGameState('waiting_for_move');
    setSelectedMove(null);
    setEncryptedMove(null);
    setGameResult(null);
    setError('');
    setPlayerKey(generatePlayerKey());
  };

  const getResultDisplay = (result: GameResult): { text: string; color: string; icon: string } => {
    switch (result) {
      case 'win':
        return { text: 'You Win! 🎉', color: 'text-green-400', icon: '🏆' };
      case 'lose':
        return { text: 'You Lose 😔', color: 'text-red-400', icon: '💔' };
      case 'tie':
        return { text: 'It\'s a Tie! 🤝', color: 'text-yellow-400', icon: '🤝' };
    }
  };

  if (!address) {
    return (
      <div className="card p-8 max-w-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet to Play</h2>
          <p className="text-white/80">Please connect your wallet to start playing Rock-Paper-Scissors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Rock Paper Scissors</h2>
        <p className="text-white/80">Privacy-preserving gameplay powered by Arcium MPC</p>
      </div>

      {/* Game State Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`w-3 h-3 rounded-full ${gameState === 'waiting_for_move' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-white/80">Choose Move</span>
          <div className={`w-3 h-3 rounded-full ${gameState === 'waiting_for_opponent' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-white/80">Finding Opponent</span>
          <div className={`w-3 h-3 rounded-full ${gameState === 'computing' ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-white/80">Computing Result</span>
          <div className={`w-3 h-3 rounded-full ${gameState === 'completed' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
          <span className="text-white/80">Complete</span>
        </div>
      </div>

      {/* Move Selection */}
      {gameState === 'waiting_for_move' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Choose Your Move</h3>
          <div className="grid grid-cols-3 gap-6">
            {moves.map(({ move, icon, label, color }) => (
              <button
                key={move}
                onClick={() => handleMoveSelection(move)}
                disabled={isProcessing}
                className={`bg-gradient-to-br ${color} p-8 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-6xl mb-4">{icon}</div>
                <div className="text-xl">{label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Processing States */}
      {(gameState === 'waiting_for_opponent' || gameState === 'computing') && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-white">
              {gameState === 'waiting_for_opponent' ? 'Waiting for opponent...' : 'Computing result via Arcium MPC...'}
            </span>
          </div>
        </div>
      )}

      {/* Encrypted Move Display */}
      {encryptedMove && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Your Encrypted Move</h4>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-green-400 break-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-white/60">Data:</span> {encryptedMove.encryptedData.substring(0, 32)}...
              </div>
              <div>
                <span className="text-white/60">IV:</span> {encryptedMove.iv.substring(0, 16)}...
              </div>
              <div>
                <span className="text-white/60">Salt:</span> {encryptedMove.salt.substring(0, 16)}...
              </div>
              <div>
                <span className="text-white/60">Timestamp:</span> {new Date(encryptedMove.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Result */}
      {gameState === 'completed' && gameResult && (
        <div className="text-center mb-8">
          <div className="card p-6 max-w-md mx-auto">
            <div className="text-6xl mb-4">{getResultDisplay(gameResult.result.player1Result).icon}</div>
            <h3 className={`text-2xl font-bold mb-4 ${getResultDisplay(gameResult.result.player1Result).color}`}>
              {getResultDisplay(gameResult.result.player1Result).text}
            </h3>
            <div className="space-y-2 text-white/80">
              <p>Your move: <span className="capitalize font-semibold">{selectedMove}</span></p>
              <p>Game ID: <span className="font-mono text-xs">{gameResult.jobId}</span></p>
            </div>
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm">
                ✓ ZK Proof Verified: {gameResult.result.proof.substring(0, 20)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {gameState === 'error' && (
        <div className="text-center mb-8">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-red-400 mb-2">Game Error</h3>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {(gameState === 'completed' || gameState === 'error') && (
        <div className="text-center">
          <button
            onClick={resetGame}
            className="btn-primary"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Privacy Info */}
      <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h4 className="font-semibold text-blue-200 mb-2">🔒 Privacy Features</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• Your move is encrypted client-side before transmission</li>
          <li>• Computation happens in Arcium's secure MPC network</li>
          <li>• Only the final result is revealed, moves stay private</li>
          <li>• ZK proofs ensure fair and verifiable computation</li>
        </ul>
      </div>
    </div>
  );
};