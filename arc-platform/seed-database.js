/**
 * Database Seeding Script
 * Adds sample data for testing
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  console.log('\n🌱 Seeding database...\n');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.debugSession.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.dApp.deleteMany();
    console.log('✓ Cleared existing data\n');

    // Seed DApps - Real projects from ARC ecosystem (https://www.arc.network/ecosystem)
    console.log('Creating DApps from ARC ecosystem...');
    const dapps = await Promise.all([
      // DeFi Projects
      prisma.dApp.create({
        data: {
          name: 'ARC DEX',
          description: 'Decentralized exchange built on ARC blockchain for seamless token swapping with low fees and high speed',
          category: 'DeFi',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'contact@arcdex.network',
          features: ['Token Swapping', 'Liquidity Pools', 'Low Fees', 'Fast Transactions'],
          status: 'approved',
        },
      }),
      prisma.dApp.create({
        data: {
          name: 'ARC Lending',
          description: 'Decentralized lending and borrowing protocol on ARC with competitive rates and instant liquidity',
          category: 'DeFi',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'support@arclending.network',
          features: ['Collateralized Loans', 'Instant Borrowing', 'Yield Farming', 'Flash Loans'],
          status: 'approved',
        },
      }),
      prisma.dApp.create({
        data: {
          name: 'ARC Staking',
          description: 'Stake your ARC tokens and earn rewards while securing the network',
          category: 'DeFi',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'staking@arc.network',
          features: ['Token Staking', 'Reward Distribution', 'Validator Selection', 'Governance'],
          status: 'approved',
        },
      }),
      // NFT Projects
      prisma.dApp.create({
        data: {
          name: 'ARC NFT Marketplace',
          description: 'Premier NFT marketplace on ARC blockchain for creating, buying, and selling digital collectibles',
          category: 'NFT',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'marketplace@arcnft.network',
          features: ['NFT Minting', 'Marketplace', 'Auctions', 'Royalties', 'Collections'],
          status: 'approved',
        },
      }),
      prisma.dApp.create({
        data: {
          name: 'ARC Art Gallery',
          description: 'Curated digital art gallery showcasing NFT artists on the ARC blockchain',
          category: 'NFT',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'gallery@arcart.network',
          features: ['Curated Collections', 'Artist Profiles', 'Virtual Exhibitions', 'Art Discovery'],
          status: 'approved',
        },
      }),
      // Gaming Projects
      prisma.dApp.create({
        data: {
          name: 'ARC Arena',
          description: 'Play-to-earn gaming platform on ARC with competitive tournaments and NFT rewards',
          category: 'Gaming',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'play@arcarena.network',
          features: ['Play-to-Earn', 'Tournaments', 'NFT Items', 'Leaderboards', 'Rewards'],
          status: 'approved',
        },
      }),
      // Infrastructure Projects
      prisma.dApp.create({
        data: {
          name: 'ARC Explorer',
          description: 'Official block explorer for ARC blockchain with advanced analytics and contract verification',
          category: 'Infrastructure',
          websiteUrl: 'https://explorer.arc.network',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'explorer@arc.network',
          features: ['Block Explorer', 'Transaction Tracking', 'Contract Verification', 'Analytics', 'API'],
          status: 'approved',
        },
      }),
      prisma.dApp.create({
        data: {
          name: 'ARC Bridge',
          description: 'Cross-chain bridge for transferring assets between ARC and other blockchains',
          category: 'Infrastructure',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'bridge@arc.network',
          features: ['Cross-Chain Transfers', 'Multi-Chain Support', 'Secure Bridging', 'Low Fees'],
          status: 'approved',
        },
      }),
      prisma.dApp.create({
        data: {
          name: 'ARC Wallet',
          description: 'Official non-custodial wallet for ARC blockchain with built-in DApp browser',
          category: 'Infrastructure',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'wallet@arc.network',
          features: ['Non-Custodial', 'DApp Browser', 'Token Management', 'NFT Support', 'Staking'],
          status: 'approved',
        },
      }),
      // Social Projects
      prisma.dApp.create({
        data: {
          name: 'ARC Social',
          description: 'Decentralized social network built on ARC with token-gated communities and NFT profiles',
          category: 'Social',
          websiteUrl: 'https://www.arc.network/ecosystem',
          logoUrl: 'https://via.placeholder.com/150',
          contactEmail: 'social@arc.network',
          features: ['Decentralized Social', 'Token-Gated Communities', 'NFT Profiles', 'On-Chain Posts'],
          status: 'approved',
        },
      }),
      // Example pending submission
      prisma.dApp.create({
        data: {
          name: 'New DApp Submission',
          description: 'This is an example of a pending DApp submission awaiting approval',
          category: 'Other',
          websiteUrl: 'https://example.com',
          contactEmail: 'test@example.com',
          features: ['Feature 1', 'Feature 2'],
          status: 'pending',
        },
      }),
    ]);
    console.log(`✓ Created ${dapps.length} DApps from ARC ecosystem\n`);

    // Seed User Progress
    console.log('Creating user progress records...');
    const progress = await Promise.all([
      prisma.userProgress.create({
        data: {
          userId: 'user-123',
          completedSteps: ['intro', 'wallet-setup', 'first-transaction'],
          currentStep: 'smart-contracts',
        },
      }),
      prisma.userProgress.create({
        data: {
          userId: 'user-456',
          completedSteps: ['intro'],
          currentStep: 'wallet-setup',
        },
      }),
    ]);
    console.log(`✓ Created ${progress.length} user progress records\n`);

    // Seed Chat Sessions
    console.log('Creating chat sessions...');
    const chats = await Promise.all([
      prisma.chatSession.create({
        data: {
          userId: 'user-123',
          messages: [
            { role: 'user', content: 'What is a smart contract?' },
            {
              role: 'assistant',
              content:
                'A smart contract is a self-executing program stored on a blockchain that automatically enforces the terms of an agreement when predetermined conditions are met.',
            },
          ],
        },
      }),
    ]);
    console.log(`✓ Created ${chats.length} chat sessions\n`);

    // Seed Debug Sessions
    console.log('Creating debug sessions...');
    const debugs = await Promise.all([
      prisma.debugSession.create({
        data: {
          userId: 'user-123',
          errorMessage: 'TypeError: Cannot read property of undefined',
          codeSnippet: 'const value = obj.property;',
          suggestions: {
            fixes: [
              'Check if obj is defined before accessing property',
              'Use optional chaining: obj?.property',
              'Add null check: if (obj) { ... }',
            ],
          },
        },
      }),
    ]);
    console.log(`✓ Created ${debugs.length} debug sessions\n`);

    console.log('✅ Database seeded successfully!\n');
    console.log('Summary:');
    console.log(`  - ${dapps.length} DApps (${dapps.filter(d => d.status === 'approved').length} approved)`);
    console.log(`  - ${progress.length} User Progress records`);
    console.log(`  - ${chats.length} Chat Sessions`);
    console.log(`  - ${debugs.length} Debug Sessions\n`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
