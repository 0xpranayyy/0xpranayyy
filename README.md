# 🎮 Arcium Game Station

A privacy-preserving decentralized gaming hub powered by Arcium's secure multi-party computation (MPC) network. Experience gaming where your moves stay encrypted, but results are always fair and verifiable.

![Arcium Game Station](https://img.shields.io/badge/Arcium-Game%20Station-6366f1?style=for-the-badge&logo=ethereum)
![Privacy First](https://img.shields.io/badge/Privacy-First-8b5cf6?style=for-the-badge&logo=shield)
![ZK Verified](https://img.shields.io/badge/ZK-Verified-10b981?style=for-the-badge&logo=check)

## 🌟 Features

### 🔒 Privacy-Preserving Gameplay
- **Client-side encryption**: Your moves are encrypted before leaving your device
- **Secure MPC computation**: Game logic runs on Arcium's encrypted network
- **Zero-knowledge proofs**: Verify fair play without revealing game data

### 🎯 Current Games
- **Rock Paper Scissors**: Classic game with encrypted moves and ZK-verified results
- *More games coming soon!*

### 🏆 Privacy Leaderboard
- **Anonymized rankings**: Compete without revealing personal data
- **ZK-verified scores**: All statistics backed by cryptographic proofs
- **Anonymous tiers**: Diamond, Platinum, Gold, Silver, Bronze rankings

### 🔗 Web3 Integration
- **Wallet connectivity**: MetaMask and WalletConnect support
- **Decentralized identity**: Your wallet is your gaming identity
- **Cross-chain ready**: Built for multi-chain deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Arcium MPC     │    │   Storage       │
│   React + Web3  │◄──►│   Network       │◄──►│   IPFS/Local    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
   ┌────▼────┐            ┌─────▼──────┐         ┌─────▼──────┐
   │ Wallet  │            │ Encryption │         │ Game       │
   │ Connect │            │ & ZK Proof │         │ Results    │
   └─────────┘            └────────────┘         └────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd arcium-game-station

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### Using the Application

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Play Games**: Navigate to "Play Game" and choose Rock Paper Scissors
3. **Encrypted Gameplay**: Your moves are encrypted client-side
4. **View Results**: See ZK-verified results and leaderboard stats

## 🛠️ Technical Implementation

### Encryption Layer (`src/utils/encryption.ts`)
```typescript
// AES-256-GCM encryption with PBKDF2 key derivation
const encryptedMove = encryptMove('rock', playerKey);
const gameHash = createMoveHash(encryptedMove);
```

### Arcium Integration (`src/utils/arciumMock.ts`)
```typescript
// Mock SDK simulating secure MPC computation
const jobId = await arciumSDK.submitEncryptedJob({
  player1Move: encryptedMove1,
  player2Move: encryptedMove2,
  player1Key: key1,
  player2Key: key2
});
```

### Privacy Features
- **Client-side encryption**: AES-256-GCM with random IV/salt
- **Key derivation**: PBKDF2 with 10,000 iterations
- **Move hashing**: SHA-256 for integrity verification
- **ZK proofs**: Simulated cryptographic proof generation

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── WalletConnect.tsx # Web3 wallet integration
│   ├── GameBoard.tsx     # Rock Paper Scissors game
│   └── Leaderboard.tsx   # Privacy-preserving rankings
├── utils/               # Core utilities
│   ├── encryption.ts    # Client-side encryption
│   └── arciumMock.ts    # Mock Arcium SDK
├── config/              # Configuration
│   └── wagmi.ts         # Web3 wallet config
└── App.tsx              # Main application
```

## 🎨 UI/UX Features

- **Modern Design**: Glassmorphism with gradient backgrounds
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant with keyboard navigation
- **Animations**: Smooth transitions and micro-interactions
- **Dark Theme**: Privacy-focused dark theme by default

## 🔐 Security & Privacy

### Encryption Standards
- **Algorithm**: AES-256-GCM
- **Key Derivation**: PBKDF2 (10k iterations)
- **Randomness**: Cryptographically secure random IV/salt
- **Integrity**: SHA-256 hashing for verification

### Privacy Guarantees
- ✅ Moves never transmitted in plaintext
- ✅ Game computation happens in encrypted domain
- ✅ Only results are revealed, not intermediate steps
- ✅ ZK proofs verify computation without revealing data
- ✅ Wallet addresses are anonymized in UI

## 🚧 Development Roadmap

### Phase 1: MVP (Current)
- [x] Rock Paper Scissors with encryption
- [x] Mock Arcium MPC integration
- [x] Privacy leaderboard
- [x] Web3 wallet connectivity

### Phase 2: Enhanced Gaming
- [ ] Additional games (Word Guess, Coin Flip)
- [ ] Real Arcium SDK integration
- [ ] IPFS/Web3.Storage for results
- [ ] Smart contract leaderboard anchoring

### Phase 3: Platform Features
- [ ] Player matchmaking
- [ ] Tournament system
- [ ] NFT achievements
- [ ] Cross-chain deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Install dependencies
npm install --legacy-peer-deps

# Run tests
npm test

# Build for production
npm run build

# Start development server
npm start
```

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **Arcium Network**: [arcium.com](https://arcium.com)
- **Documentation**: [docs.arcium.com](https://docs.arcium.com)
- **Discord**: [discord.gg/arcium](https://discord.gg/arcium)

## ⚠️ Disclaimer

This is an MVP demonstration of privacy-preserving gaming concepts. The current implementation uses mock encryption and simulated MPC for demonstration purposes. For production use, integrate with the real Arcium network and implement additional security measures.

---

**Built with ❤️ for the future of privacy-preserving gaming**
