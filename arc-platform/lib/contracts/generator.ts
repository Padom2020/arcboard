/**
 * Smart Contract Code Generator
 * Generates Solidity code based on OpenZeppelin patterns
 */

interface ContractParams {
  [key: string]: any;
}

interface GeneratedContract {
  code: string;
  language: 'solidity';
  template: string;
  parameters: ContractParams;
}

/**
 * Generate ERC20 token contract
 */
function generateERC20(params: ContractParams): string {
  const { name, symbol, premint, mintable, burnable, pausable, permit } = params;
  
  const imports: string[] = ['@openzeppelin/contracts/token/ERC20/ERC20.sol'];
  const inheritance: string[] = ['ERC20'];
  const constructorBody: string[] = [];
  const additionalFunctions: string[] = [];
  
  if (mintable) {
    imports.push('@openzeppelin/contracts/access/Ownable.sol');
    inheritance.push('Ownable');
    additionalFunctions.push(`
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }`);
  }
  
  if (burnable) {
    imports.push('@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol');
    inheritance.push('ERC20Burnable');
  }
  
  if (pausable) {
    imports.push('@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol');
    imports.push('@openzeppelin/contracts/access/Ownable.sol');
    if (!inheritance.includes('Ownable')) inheritance.push('Ownable');
    inheritance.push('ERC20Pausable');
    additionalFunctions.push(`
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }`);
  }
  
  if (permit) {
    imports.push('@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol');
    inheritance.push('ERC20Permit');
  }
  
  if (premint && premint > 0) {
    constructorBody.push(`_mint(msg.sender, ${premint} * 10 ** decimals());`);
  }
  
  const ownerableConstructor = inheritance.includes('Ownable') ? 'Ownable(msg.sender)' : '';
  const permitConstructor = permit ? `ERC20Permit("${name}")` : '';
  const constructorInits = [ownerableConstructor, permitConstructor].filter(Boolean).join(' ');
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.map(imp => `import "${imp}";`).join('\n')}

contract ${symbol} is ${inheritance.join(', ')} {
    constructor()
        ERC20("${name}", "${symbol}")
        ${constructorInits}
    {
        ${constructorBody.join('\n        ')}
    }
${additionalFunctions.join('\n')}
}`;
}

/**
 * Generate ERC721 NFT contract
 */
function generateERC721(params: ContractParams): string {
  const { name, symbol, baseUri, mintable, autoIncrement, burnable, pausable, enumerable } = params;
  
  const imports: string[] = ['@openzeppelin/contracts/token/ERC721/ERC721.sol'];
  const inheritance: string[] = ['ERC721'];
  const stateVariables: string[] = [];
  const constructorBody: string[] = [];
  const additionalFunctions: string[] = [];
  
  if (autoIncrement) {
    stateVariables.push('uint256 private _nextTokenId;');
  }
  
  if (baseUri) {
    stateVariables.push(`string private _baseTokenURI = "${baseUri}";`);
    additionalFunctions.push(`
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }`);
  }
  
  if (mintable) {
    imports.push('@openzeppelin/contracts/access/Ownable.sol');
    inheritance.push('Ownable');
    
    if (autoIncrement) {
      additionalFunctions.push(`
    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }`);
    } else {
      additionalFunctions.push(`
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }`);
    }
  }
  
  if (burnable) {
    imports.push('@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol');
    inheritance.push('ERC721Burnable');
  }
  
  if (pausable) {
    imports.push('@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol');
    imports.push('@openzeppelin/contracts/access/Ownable.sol');
    if (!inheritance.includes('Ownable')) inheritance.push('Ownable');
    inheritance.push('ERC721Pausable');
    additionalFunctions.push(`
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }`);
  }
  
  if (enumerable) {
    imports.push('@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol');
    inheritance.push('ERC721Enumerable');
  }
  
  const ownerableConstructor = inheritance.includes('Ownable') ? 'Ownable(msg.sender)' : '';
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.map(imp => `import "${imp}";`).join('\n')}

contract ${symbol} is ${inheritance.join(', ')} {
    ${stateVariables.join('\n    ')}

    constructor()
        ERC721("${name}", "${symbol}")
        ${ownerableConstructor}
    {}
${additionalFunctions.join('\n')}
}`;
}

/**
 * Generate ERC1155 multi-token contract
 */
function generateERC1155(params: ContractParams): string {
  const { uri, mintable, burnable, pausable, supply } = params;
  
  const imports: string[] = ['@openzeppelin/contracts/token/ERC1155/ERC1155.sol'];
  const inheritance: string[] = ['ERC1155'];
  const additionalFunctions: string[] = [];
  
  if (mintable) {
    imports.push('@openzeppelin/contracts/access/Ownable.sol');
    inheritance.push('Ownable');
    additionalFunctions.push(`
    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }`);
  }
  
  if (burnable) {
    imports.push('@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol');
    inheritance.push('ERC1155Burnable');
  }
  
  if (pausable) {
    imports.push('@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol');
    imports.push('@openzeppelin/contracts/access/Ownable.sol');
    if (!inheritance.includes('Ownable')) inheritance.push('Ownable');
    inheritance.push('ERC1155Pausable');
    additionalFunctions.push(`
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }`);
  }
  
  if (supply) {
    imports.push('@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol');
    inheritance.push('ERC1155Supply');
  }
  
  additionalFunctions.push(`
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }`);
  
  const ownerableConstructor = inheritance.includes('Ownable') ? 'Ownable(msg.sender)' : '';
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.map(imp => `import "${imp}";`).join('\n')}

contract MyToken is ${inheritance.join(', ')} {
    constructor() ERC1155("${uri}") ${ownerableConstructor} {}
${additionalFunctions.join('\n')}
}`;
}

/**
 * Generate contract code based on template and parameters
 */
export function generateContract(templateId: string, params: ContractParams): GeneratedContract {
  let code: string;
  
  switch (templateId) {
    case 'erc20':
      code = generateERC20(params);
      break;
    case 'erc721':
      code = generateERC721(params);
      break;
    case 'erc1155':
      code = generateERC1155(params);
      break;
    default:
      throw new Error(`Unknown template: ${templateId}`);
  }
  
  return {
    code,
    language: 'solidity',
    template: templateId,
    parameters: params,
  };
}

/**
 * Validate contract parameters against template requirements
 */
export function validateParameters(templateId: string, params: ContractParams): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Common validations
  if (templateId === 'erc20' || templateId === 'erc721') {
    if (!params.name || typeof params.name !== 'string' || params.name.trim() === '') {
      errors.push('Name is required and must be a non-empty string');
    }
    if (!params.symbol || typeof params.symbol !== 'string' || params.symbol.trim() === '') {
      errors.push('Symbol is required and must be a non-empty string');
    }
  }
  
  if (templateId === 'erc1155') {
    if (!params.uri || typeof params.uri !== 'string' || params.uri.trim() === '') {
      errors.push('URI is required and must be a non-empty string');
    }
  }
  
  // Validate premint for ERC20
  if (templateId === 'erc20' && params.premint !== undefined) {
    if (typeof params.premint !== 'number' || params.premint < 0) {
      errors.push('Premint must be a non-negative number');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
