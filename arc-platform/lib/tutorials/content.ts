export interface TutorialStep {
  id: string;
  title: string;
  content: string; // Markdown content
  estimatedTime: number; // minutes
  prerequisites: string[]; // step IDs
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: 'beginner' | 'intermediate' | 'advanced';
}

export const tutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with ARC Blockchain',
    description: 'Learn the basics of ARC blockchain and set up your development environment',
    category: 'beginner',
    steps: [
      {
        id: 'getting-started-1',
        title: 'Welcome to ARC Blockchain',
        content: `# Welcome to ARC Blockchain

ARC Blockchain is a next-generation blockchain platform designed for scalability, security, and developer-friendliness.

## What You'll Learn

In this tutorial, you'll discover:

- What makes ARC blockchain unique
- Key features and capabilities
- The ARC ecosystem and community
- How to get started building

## Why Choose ARC?

**Fast Transactions**: ARC processes transactions in seconds, not minutes.

**Low Fees**: Transaction costs are minimal, making it ideal for DApps.

**Developer-Friendly**: Comprehensive tools and documentation to help you build.

**Secure**: Built with security best practices and audited smart contracts.

## Next Steps

Continue to the next step to learn about setting up your wallet.`,
        estimatedTime: 5,
        prerequisites: [],
      },
      {
        id: 'getting-started-2',
        title: 'Setting Up Your Wallet',
        content: `# Setting Up Your Wallet

A wallet is essential for interacting with the ARC blockchain. It stores your private keys and allows you to send and receive tokens.

## Recommended Wallets

### MetaMask
The most popular browser extension wallet. Compatible with ARC blockchain.

**Installation Steps:**
1. Visit [metamask.io](https://metamask.io)
2. Download the browser extension
3. Create a new wallet or import existing one
4. Save your seed phrase securely

### ARC Wallet
The official ARC blockchain wallet with native support.

**Features:**
- Native ARC integration
- Built-in DApp browser
- Staking support
- Mobile and desktop versions

## Connecting to ARC Network

After installing your wallet, you'll need to add the ARC network:

**Network Details:**
- Network Name: ARC Mainnet
- RPC URL: https://rpc.arc.network
- Chain ID: 1234
- Currency Symbol: ARC
- Block Explorer: https://explorer.arc.network

## Security Best Practices

⚠️ **Never share your seed phrase or private keys**

✅ Use a hardware wallet for large amounts

✅ Enable two-factor authentication when available

✅ Keep your wallet software updated`,
        estimatedTime: 10,
        prerequisites: ['getting-started-1'],
      },
      {
        id: 'getting-started-3',
        title: 'Understanding ARC Tokens',
        content: `# Understanding ARC Tokens

Tokens are the lifeblood of the ARC ecosystem. Let's explore the different types and their uses.

## Native Token: ARC

The ARC token is used for:
- **Gas Fees**: Pay for transaction execution
- **Staking**: Secure the network and earn rewards
- **Governance**: Vote on protocol upgrades

## Token Standards

### ARC-20 (ERC-20 Compatible)
Fungible tokens - each token is identical and interchangeable.

**Use Cases:**
- Cryptocurrencies
- Utility tokens
- Governance tokens

### ARC-721 (ERC-721 Compatible)
Non-fungible tokens (NFTs) - each token is unique.

**Use Cases:**
- Digital art
- Collectibles
- Gaming items
- Real estate tokens

### ARC-1155 (ERC-1155 Compatible)
Multi-token standard supporting both fungible and non-fungible tokens.

**Use Cases:**
- Gaming (items + currency)
- Hybrid applications
- Efficient batch transfers

## Getting Test Tokens

For development, use the ARC testnet faucet:

1. Visit [faucet.arc.network](https://faucet.arc.network)
2. Connect your wallet
3. Request test ARC tokens
4. Wait for confirmation (usually < 1 minute)

You'll receive test tokens to experiment with DApps and smart contracts.`,
        estimatedTime: 8,
        prerequisites: ['getting-started-2'],
      },
      {
        id: 'getting-started-4',
        title: 'Exploring the DApp Directory',
        content: `# Exploring the DApp Directory

The ARC ecosystem has a growing collection of decentralized applications (DApps). Let's learn how to discover and use them.

## What is a DApp?

A DApp (Decentralized Application) is an application that runs on a blockchain network rather than centralized servers.

**Key Characteristics:**
- Open source code
- Decentralized data storage
- Cryptographic tokens
- Consensus mechanism

## Using the DApp Directory

Navigate to the **DApp Directory** to browse available applications.

### Search and Filter

- **Search**: Find DApps by name or description
- **Categories**: Filter by type (DeFi, NFT, Gaming, etc.)
- **Status**: View active and upcoming DApps

### DApp Categories

**DeFi (Decentralized Finance)**
- Lending and borrowing platforms
- Decentralized exchanges
- Yield farming protocols

**NFT Marketplaces**
- Buy, sell, and trade NFTs
- Create your own collections
- Discover digital art

**Gaming**
- Play-to-earn games
- Virtual worlds
- Gaming item marketplaces

**Infrastructure**
- Developer tools
- Oracles and data feeds
- Cross-chain bridges

## Connecting to a DApp

1. Click on a DApp from the directory
2. Review the DApp details and features
3. Click "Visit DApp" to open in new tab
4. Connect your wallet when prompted
5. Approve the connection request

## Safety Tips

✅ Only connect to verified DApps

✅ Review permissions before approving

✅ Start with small amounts when testing

⚠️ Be cautious of phishing sites`,
        estimatedTime: 10,
        prerequisites: ['getting-started-3'],
      },
    ],
  },
  {
    id: 'smart-contract-basics',
    title: 'Smart Contract Development Basics',
    description: 'Learn how to write, deploy, and interact with smart contracts on ARC',
    category: 'intermediate',
    steps: [
      {
        id: 'smart-contract-1',
        title: 'Introduction to Smart Contracts',
        content: `# Introduction to Smart Contracts

Smart contracts are self-executing programs that run on the blockchain. They enable trustless, automated transactions.

## What is a Smart Contract?

A smart contract is code that:
- Runs on the blockchain
- Executes automatically when conditions are met
- Cannot be altered once deployed
- Is transparent and verifiable

## Solidity Programming Language

ARC smart contracts are written in Solidity, a language similar to JavaScript.

**Basic Example:**

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}
\`\`\`

## Smart Contract Use Cases

**Financial Applications**
- Token creation and management
- Automated payments
- Escrow services

**Supply Chain**
- Product tracking
- Authenticity verification
- Automated logistics

**Gaming**
- In-game assets
- Reward distribution
- Tournament management

**Governance**
- Voting systems
- DAO management
- Proposal execution

## Development Tools

- **Remix IDE**: Browser-based Solidity IDE
- **Hardhat**: Development environment for professionals
- **Truffle**: Popular smart contract framework
- **OpenZeppelin**: Secure contract libraries`,
        estimatedTime: 12,
        prerequisites: [],
      },
      {
        id: 'smart-contract-2',
        title: 'Using the Contract Generator',
        content: `# Using the Contract Generator

The ARC Platform includes a smart contract generator powered by OpenZeppelin templates. This tool helps you create secure contracts without writing code from scratch.

## Available Templates

### ERC-20 Token
Create your own fungible token.

**Parameters:**
- Token Name (e.g., "My Token")
- Token Symbol (e.g., "MTK")
- Initial Supply
- Features: Mintable, Burnable, Pausable

### ERC-721 NFT
Create a non-fungible token collection.

**Parameters:**
- Collection Name
- Collection Symbol
- Base URI for metadata
- Features: Auto-increment IDs, Burnable, Enumerable

### ERC-1155 Multi-Token
Create a multi-token contract.

**Parameters:**
- Contract Name
- URI for metadata
- Features: Mintable, Burnable, Supply tracking

## Step-by-Step Guide

1. **Navigate to Contract Generator**
   Go to the Smart Contracts section

2. **Select a Template**
   Choose the contract type you want to create

3. **Configure Parameters**
   Fill in the required fields:
   - Name and symbol
   - Initial settings
   - Optional features

4. **Generate Contract**
   Click "Generate" to create your contract

5. **Review the Code**
   Examine the generated Solidity code
   - Check imports
   - Review functions
   - Verify settings

6. **Download or Copy**
   Save the contract file (.sol) or copy to clipboard

## Next Steps

After generating your contract:
- Test in Remix IDE
- Deploy to testnet
- Verify on block explorer
- Interact with your contract`,
        estimatedTime: 15,
        prerequisites: ['smart-contract-1'],
      },
      {
        id: 'smart-contract-3',
        title: 'Deploying Your First Contract',
        content: `# Deploying Your First Contract

Learn how to deploy a smart contract to the ARC blockchain.

## Prerequisites

Before deploying, ensure you have:
- ✅ A wallet with test ARC tokens
- ✅ Your compiled smart contract
- ✅ Remix IDE or Hardhat setup

## Deployment with Remix IDE

### Step 1: Compile Your Contract

1. Open Remix IDE at [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file (e.g., MyToken.sol)
3. Paste your contract code
4. Click the "Solidity Compiler" tab
5. Select compiler version (0.8.0+)
6. Click "Compile"

### Step 2: Connect Your Wallet

1. Click "Deploy & Run Transactions" tab
2. Select "Injected Provider - MetaMask"
3. Approve the connection in your wallet
4. Verify you're on ARC Testnet

### Step 3: Deploy

1. Select your contract from the dropdown
2. Enter constructor parameters if required
3. Click "Deploy"
4. Confirm the transaction in your wallet
5. Wait for confirmation

### Step 4: Verify Deployment

After deployment, you'll see:
- Contract address
- Transaction hash
- Deployed contract interface

Copy the contract address - you'll need it to interact with your contract!

## Deployment Costs

Deployment requires gas fees:
- **Testnet**: Free (use faucet tokens)
- **Mainnet**: Varies by contract size (typically 0.01-0.1 ARC)

## Common Issues

**"Out of Gas" Error**
- Increase gas limit in deployment settings

**"Nonce Too Low"**
- Reset your wallet account in MetaMask settings

**"Insufficient Funds"**
- Get more test tokens from the faucet

## Verifying Your Contract

After deployment, verify your contract on the block explorer:

1. Visit [explorer.arc.network](https://explorer.arc.network)
2. Search for your contract address
3. Click "Verify and Publish"
4. Upload your source code
5. Match compiler settings

Verification makes your contract code publicly readable and trustworthy.`,
        estimatedTime: 20,
        prerequisites: ['smart-contract-2'],
      },
    ],
  },
  {
    id: 'advanced-development',
    title: 'Advanced DApp Development',
    description: 'Build complex decentralized applications with advanced features',
    category: 'advanced',
    steps: [
      {
        id: 'advanced-1',
        title: 'Building a Full-Stack DApp',
        content: `# Building a Full-Stack DApp

Learn how to create a complete decentralized application with a frontend interface.

## Architecture Overview

A full-stack DApp consists of:

**Smart Contracts (Backend)**
- Business logic on blockchain
- Data storage
- Token management

**Frontend (User Interface)**
- Web3 integration
- Wallet connection
- Contract interaction

**Off-Chain Components**
- IPFS for file storage
- Backend APIs for indexing
- Database for caching

## Technology Stack

### Frontend
- **React** or **Next.js**: UI framework
- **ethers.js** or **web3.js**: Blockchain interaction
- **wagmi**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI

### Smart Contracts
- **Solidity**: Contract language
- **Hardhat**: Development environment
- **OpenZeppelin**: Security libraries

### Storage
- **IPFS**: Decentralized file storage
- **Arweave**: Permanent storage
- **The Graph**: Blockchain indexing

## Project Structure

\`\`\`
my-dapp/
├── contracts/          # Smart contracts
│   ├── MyToken.sol
│   └── MyNFT.sol
├── scripts/           # Deployment scripts
│   └── deploy.js
├── test/              # Contract tests
│   └── MyToken.test.js
├── frontend/          # React app
│   ├── src/
│   ├── public/
│   └── package.json
└── hardhat.config.js  # Hardhat configuration
\`\`\`

## Development Workflow

1. **Design**: Plan your DApp features and architecture
2. **Smart Contracts**: Write and test contracts
3. **Deploy**: Deploy to testnet
4. **Frontend**: Build user interface
5. **Integration**: Connect frontend to contracts
6. **Testing**: Test end-to-end functionality
7. **Audit**: Security review
8. **Mainnet**: Deploy to production

## Best Practices

✅ **Security First**
- Audit your contracts
- Use established libraries
- Implement access controls

✅ **Gas Optimization**
- Minimize storage operations
- Batch transactions
- Use events for logging

✅ **User Experience**
- Clear error messages
- Loading states
- Transaction confirmations

✅ **Testing**
- Unit tests for contracts
- Integration tests
- Frontend testing`,
        estimatedTime: 25,
        prerequisites: [],
      },
      {
        id: 'advanced-2',
        title: 'Integrating with Web3 Libraries',
        content: `# Integrating with Web3 Libraries

Learn how to connect your frontend to the ARC blockchain using Web3 libraries.

## ethers.js Setup

ethers.js is a lightweight library for interacting with Ethereum-compatible blockchains.

### Installation

\`\`\`bash
npm install ethers
\`\`\`

### Connecting to ARC

\`\`\`javascript
import { ethers } from 'ethers';

// Connect to ARC network
const provider = new ethers.JsonRpcProvider('https://rpc.arc.network');

// Connect to user's wallet
const browserProvider = new ethers.BrowserProvider(window.ethereum);
const signer = await browserProvider.getSigner();
\`\`\`

### Reading Contract Data

\`\`\`javascript
// Contract ABI and address
const contractABI = [...];
const contractAddress = '0x...';

// Create contract instance
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

// Read data (no gas required)
const balance = await contract.balanceOf(userAddress);
const name = await contract.name();
\`\`\`

### Writing to Contracts

\`\`\`javascript
// Connect with signer for transactions
const contractWithSigner = contract.connect(signer);

// Send transaction (requires gas)
const tx = await contractWithSigner.transfer(
  recipientAddress,
  ethers.parseEther('1.0')
);

// Wait for confirmation
await tx.wait();
console.log('Transaction confirmed!');
\`\`\`

## Handling Events

Smart contracts emit events that you can listen to:

\`\`\`javascript
// Listen for Transfer events
contract.on('Transfer', (from, to, amount) => {
  console.log(\`Transfer: \${from} -> \${to}: \${amount}\`);
});

// Query past events
const filter = contract.filters.Transfer(userAddress);
const events = await contract.queryFilter(filter);
\`\`\`

## Error Handling

\`\`\`javascript
try {
  const tx = await contract.someFunction();
  await tx.wait();
} catch (error) {
  if (error.code === 'ACTION_REJECTED') {
    console.log('User rejected transaction');
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    console.log('Insufficient balance');
  } else {
    console.error('Transaction failed:', error);
  }
}
\`\`\`

## React Integration

\`\`\`javascript
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function MyComponent() {
  const [balance, setBalance] = useState('0');
  
  useEffect(() => {
    async function loadBalance() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    }
    
    loadBalance();
  }, []);
  
  return <div>Balance: {balance} ARC</div>;
}
\`\`\``,
        estimatedTime: 30,
        prerequisites: ['advanced-1'],
      },
      {
        id: 'advanced-3',
        title: 'Security Best Practices',
        content: `# Security Best Practices

Security is paramount in blockchain development. Learn how to protect your DApp and users.

## Common Vulnerabilities

### Reentrancy Attacks

**Problem**: External calls can call back into your contract before state updates.

**Solution**: Use the Checks-Effects-Interactions pattern

\`\`\`solidity
// ❌ Vulnerable
function withdraw() public {
    uint amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] = 0;
}

// ✅ Secure
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;  // Update state first
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
\`\`\`

### Integer Overflow/Underflow

**Problem**: Arithmetic operations can wrap around.

**Solution**: Use Solidity 0.8+ (built-in checks) or SafeMath

\`\`\`solidity
// Solidity 0.8+ automatically checks
function add(uint a, uint b) public pure returns (uint) {
    return a + b;  // Reverts on overflow
}
\`\`\`

### Access Control

**Problem**: Unauthorized users can call sensitive functions.

**Solution**: Implement proper access controls

\`\`\`solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function sensitiveFunction() public onlyOwner {
        // Only owner can call this
    }
}
\`\`\`

## Security Checklist

### Smart Contract Security

✅ **Use Established Libraries**
- OpenZeppelin for standard implementations
- Audited code over custom solutions

✅ **Input Validation**
- Check all parameters
- Validate addresses (not zero address)
- Verify amounts and ranges

✅ **Access Controls**
- Implement role-based permissions
- Use modifiers for restrictions
- Principle of least privilege

✅ **External Calls**
- Assume external calls can fail
- Use pull over push for payments
- Limit gas for external calls

✅ **Testing**
- 100% code coverage
- Test edge cases
- Fuzz testing
- Integration tests

### Frontend Security

✅ **Wallet Connection**
- Verify network before transactions
- Display transaction details clearly
- Confirm user actions

✅ **Input Sanitization**
- Validate all user inputs
- Prevent injection attacks
- Check address formats

✅ **Error Handling**
- Never expose sensitive errors
- Log errors securely
- Provide user-friendly messages

## Audit Process

Before mainnet deployment:

1. **Self Audit**: Review your own code
2. **Peer Review**: Have other developers review
3. **Automated Tools**: Use Slither, Mythril
4. **Professional Audit**: Hire security firm
5. **Bug Bounty**: Offer rewards for finding bugs

## Emergency Procedures

Implement emergency controls:

\`\`\`solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyContract is Pausable, Ownable {
    function emergencyPause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function criticalFunction() public whenNotPaused {
        // Function logic
    }
}
\`\`\`

## Resources

- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/security)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)`,
        estimatedTime: 35,
        prerequisites: ['advanced-2'],
      },
    ],
  },
];

// Helper function to get all steps across all tutorials
export function getAllSteps(): TutorialStep[] {
  return tutorials.flatMap((tutorial) => tutorial.steps);
}

// Helper function to get a specific tutorial by ID
export function getTutorialById(id: string): Tutorial | undefined {
  return tutorials.find((tutorial) => tutorial.id === id);
}

// Helper function to get a specific step by ID
export function getStepById(stepId: string): TutorialStep | undefined {
  return getAllSteps().find((step) => step.id === stepId);
}

// Helper function to get tutorials by category
export function getTutorialsByCategory(
  category: 'beginner' | 'intermediate' | 'advanced'
): Tutorial[] {
  return tutorials.filter((tutorial) => tutorial.category === category);
}

// Helper function to calculate total estimated time for a tutorial
export function getTutorialDuration(tutorialId: string): number {
  const tutorial = getTutorialById(tutorialId);
  if (!tutorial) return 0;
  return tutorial.steps.reduce((total, step) => total + step.estimatedTime, 0);
}
