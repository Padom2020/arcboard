/**
 * Smart Contract Templates Configuration
 * Defines available OpenZeppelin templates with their parameters
 */

export interface ContractParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'address';
  required: boolean;
  description: string;
  defaultValue?: any;
  placeholder?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: ContractParameter[];
  icon?: string;
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'erc20',
    name: 'ERC20 Token',
    description: 'Standard fungible token contract with optional features like minting, burning, and pausable functionality.',
    category: 'Token',
    icon: '🪙',
    parameters: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'The name of your token (e.g., "My Token")',
        placeholder: 'My Token',
      },
      {
        name: 'symbol',
        type: 'string',
        required: true,
        description: 'The symbol of your token (e.g., "MTK")',
        placeholder: 'MTK',
      },
      {
        name: 'premint',
        type: 'number',
        required: false,
        description: 'Initial supply to mint to deployer address',
        defaultValue: 0,
        placeholder: '1000000',
      },
      {
        name: 'mintable',
        type: 'boolean',
        required: false,
        description: 'Allow creating new tokens after deployment',
        defaultValue: false,
      },
      {
        name: 'burnable',
        type: 'boolean',
        required: false,
        description: 'Allow token holders to destroy their tokens',
        defaultValue: false,
      },
      {
        name: 'pausable',
        type: 'boolean',
        required: false,
        description: 'Allow pausing all token transfers',
        defaultValue: false,
      },
      {
        name: 'permit',
        type: 'boolean',
        required: false,
        description: 'Enable gasless approvals with EIP-2612',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'erc721',
    name: 'ERC721 NFT',
    description: 'Non-fungible token (NFT) contract for unique digital assets with optional features.',
    category: 'NFT',
    icon: '🖼️',
    parameters: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'The name of your NFT collection',
        placeholder: 'My NFT Collection',
      },
      {
        name: 'symbol',
        type: 'string',
        required: true,
        description: 'The symbol of your NFT collection',
        placeholder: 'MNFT',
      },
      {
        name: 'baseUri',
        type: 'string',
        required: false,
        description: 'Base URI for token metadata',
        placeholder: 'https://api.example.com/metadata/',
      },
      {
        name: 'mintable',
        type: 'boolean',
        required: false,
        description: 'Allow minting new NFTs',
        defaultValue: true,
      },
      {
        name: 'autoIncrement',
        type: 'boolean',
        required: false,
        description: 'Use auto-incrementing token IDs',
        defaultValue: true,
      },
      {
        name: 'burnable',
        type: 'boolean',
        required: false,
        description: 'Allow NFT holders to burn their tokens',
        defaultValue: false,
      },
      {
        name: 'pausable',
        type: 'boolean',
        required: false,
        description: 'Allow pausing all token transfers',
        defaultValue: false,
      },
      {
        name: 'enumerable',
        type: 'boolean',
        required: false,
        description: 'Enable on-chain token enumeration',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'erc1155',
    name: 'ERC1155 Multi-Token',
    description: 'Multi-token contract supporting both fungible and non-fungible tokens in a single contract.',
    category: 'Token',
    icon: '🎨',
    parameters: [
      {
        name: 'uri',
        type: 'string',
        required: true,
        description: 'Base URI for all token metadata',
        placeholder: 'https://api.example.com/metadata/{id}.json',
      },
      {
        name: 'mintable',
        type: 'boolean',
        required: false,
        description: 'Allow minting new tokens',
        defaultValue: true,
      },
      {
        name: 'burnable',
        type: 'boolean',
        required: false,
        description: 'Allow token holders to burn their tokens',
        defaultValue: false,
      },
      {
        name: 'pausable',
        type: 'boolean',
        required: false,
        description: 'Allow pausing all token transfers',
        defaultValue: false,
      },
      {
        name: 'supply',
        type: 'boolean',
        required: false,
        description: 'Track total supply for each token ID',
        defaultValue: false,
      },
    ],
  },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get all available templates
 */
export function getAllTemplates(): ContractTemplate[] {
  return CONTRACT_TEMPLATES;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ContractTemplate[] {
  return CONTRACT_TEMPLATES.filter((template) => template.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(CONTRACT_TEMPLATES.map((t) => t.category)));
}
