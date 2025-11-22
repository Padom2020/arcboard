# API Documentation

Complete reference for all API endpoints in the ARC Blockchain Platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [DApp API](#dapp-api)
- [Chat API](#chat-api)
- [Contracts API](#contracts-api)
- [Debug API](#debug-api)
- [Progress API](#progress-api)
- [Search API](#search-api)

## Overview

All API endpoints are located under `/api/*` and return JSON responses. The API follows RESTful conventions where applicable.

**Base URL (Development):** `http://localhost:3000/api`  
**Base URL (Production):** `https://your-domain.com/api`

### Response Format

Successful responses return data directly:

```json
{
  "data": { ... }
}
```

Error responses follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

**Future Enhancement:** User authentication will be added for features like:
- Saving chat history
- Tracking onboarding progress across devices
- DApp submission management

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `404` | Not Found |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |
| `503` | Service Unavailable - External API failure |

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `OPENAI_API_ERROR` | OpenAI API failure |
| `DATABASE_ERROR` | Database operation failed |
| `OPENZEPPELIN_API_ERROR` | OpenZeppelin API failure |

## Rate Limiting

To prevent abuse, API endpoints have rate limits:

- **AI Endpoints** (chat, debug): 10 requests per minute per IP
- **DApp Submission**: 5 requests per hour per IP
- **Other Endpoints**: 60 requests per minute per IP

When rate limit is exceeded, the API returns:

```json
{
  "error": {
    "message": "Rate limit exceeded. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retryAfter": 60
    }
  }
}
```

---

## DApp API

### Get All DApps

Retrieve a list of all approved DApps with optional filtering.

**Endpoint:** `GET /api/dapps`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by name or description |
| `category` | string | No | Filter by category |
| `limit` | number | No | Number of results (default: 50, max: 100) |
| `offset` | number | No | Pagination offset (default: 0) |

**Example Request:**

```bash
GET /api/dapps?search=defi&category=DeFi&limit=10&offset=0
```

**Example Response:**

```json
{
  "dapps": [
    {
      "id": "clx123abc",
      "name": "ARC DeFi Exchange",
      "description": "Decentralized exchange for ARC tokens",
      "category": "DeFi",
      "websiteUrl": "https://arcdefi.example.com",
      "logoUrl": "https://example.com/logo.png",
      "features": [
        "Token swapping",
        "Liquidity pools",
        "Yield farming"
      ],
      "status": "approved",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Get Single DApp

Retrieve detailed information about a specific DApp.

**Endpoint:** `GET /api/dapps/[id]`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | DApp ID |

**Example Request:**

```bash
GET /api/dapps/clx123abc
```

**Example Response:**

```json
{
  "id": "clx123abc",
  "name": "ARC DeFi Exchange",
  "description": "Decentralized exchange for ARC tokens with advanced features",
  "category": "DeFi",
  "websiteUrl": "https://arcdefi.example.com",
  "logoUrl": "https://example.com/logo.png",
  "contactEmail": "contact@arcdefi.example.com",
  "features": [
    "Token swapping with low fees",
    "Liquidity pools with rewards",
    "Yield farming opportunities"
  ],
  "status": "approved",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Response (404):**

```json
{
  "error": {
    "message": "DApp not found",
    "code": "NOT_FOUND"
  }
}
```

### Submit DApp

Submit a new DApp for review and approval.

**Endpoint:** `POST /api/dapps`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | DApp name (max 100 chars) |
| `description` | string | Yes | DApp description (max 500 chars) |
| `category` | string | Yes | Category (DeFi, NFT, Gaming, Infrastructure, Social, Other) |
| `websiteUrl` | string | Yes | Valid URL to DApp website |
| `contactEmail` | string | Yes | Valid email address |
| `logoUrl` | string | No | URL to DApp logo image |
| `features` | string[] | No | Array of feature descriptions |

**Example Request:**

```bash
POST /api/dapps
Content-Type: application/json

{
  "name": "My ARC DApp",
  "description": "An innovative DApp built on ARC blockchain",
  "category": "DeFi",
  "websiteUrl": "https://mydapp.example.com",
  "contactEmail": "contact@mydapp.example.com",
  "logoUrl": "https://mydapp.example.com/logo.png",
  "features": [
    "Feature 1",
    "Feature 2"
  ]
}
```

**Example Response (201):**

```json
{
  "id": "clx456def",
  "message": "DApp submitted successfully. It will be reviewed before appearing in the directory.",
  "status": "pending"
}
```

**Error Response (400):**

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "name": "Name is required",
      "websiteUrl": "Invalid URL format"
    }
  }
}
```

### Get DApp Categories

Retrieve list of available DApp categories.

**Endpoint:** `GET /api/dapps/categories`

**Example Response:**

```json
{
  "categories": [
    "DeFi",
    "NFT",
    "Gaming",
    "Infrastructure",
    "Social",
    "Other"
  ]
}
```

---

## Chat API

### Send Chat Message

Send a message to the AI assistant and receive a response.

**Endpoint:** `POST /api/chat`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User's message (max 2000 chars) |
| `conversationHistory` | array | No | Previous messages for context |

**Example Request:**

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "What is ARC blockchain?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you with ARC blockchain today?"
    }
  ]
}
```

**Example Response:**

```json
{
  "response": "ARC blockchain is a decentralized platform designed for...",
  "conversationId": "conv_123abc"
}
```

**Streaming Response:**

The API supports streaming responses using Server-Sent Events (SSE). Set `Accept: text/event-stream` header to receive streaming responses.

**Error Response (400):**

```json
{
  "error": {
    "message": "Message is required",
    "code": "VALIDATION_ERROR"
  }
}
```

**Error Response (503):**

```json
{
  "error": {
    "message": "AI service temporarily unavailable",
    "code": "OPENAI_API_ERROR",
    "details": {
      "retryAfter": 30
    }
  }
}
```

---

## Contracts API

### Get Contract Templates

Retrieve available OpenZeppelin contract templates.

**Endpoint:** `GET /api/contracts/templates`

**Example Response:**

```json
{
  "templates": [
    {
      "id": "erc20",
      "name": "ERC20 Token",
      "description": "Standard fungible token",
      "category": "Token",
      "parameters": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "description": "Token name",
          "defaultValue": "MyToken"
        },
        {
          "name": "symbol",
          "type": "string",
          "required": true,
          "description": "Token symbol",
          "defaultValue": "MTK"
        },
        {
          "name": "premint",
          "type": "number",
          "required": false,
          "description": "Initial supply to mint",
          "defaultValue": 0
        }
      ]
    },
    {
      "id": "erc721",
      "name": "ERC721 NFT",
      "description": "Non-fungible token (NFT)",
      "category": "NFT",
      "parameters": [...]
    }
  ]
}
```

### Generate Contract

Generate a smart contract from a template with specified parameters.

**Endpoint:** `POST /api/contracts/generate`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `templateId` | string | Yes | Template ID (e.g., "erc20", "erc721") |
| `parameters` | object | Yes | Template-specific parameters |

**Example Request:**

```bash
POST /api/contracts/generate
Content-Type: application/json

{
  "templateId": "erc20",
  "parameters": {
    "name": "MyToken",
    "symbol": "MTK",
    "premint": "1000000",
    "mintable": true,
    "burnable": true,
    "pausable": false
  }
}
```

**Example Response:**

```json
{
  "code": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport \"@openzeppelin/contracts/token/ERC20/ERC20.sol\";\n...",
  "language": "solidity",
  "template": "erc20",
  "parameters": {
    "name": "MyToken",
    "symbol": "MTK",
    "premint": "1000000"
  }
}
```

**Error Response (400):**

```json
{
  "error": {
    "message": "Invalid template parameters",
    "code": "VALIDATION_ERROR",
    "details": {
      "name": "Name is required",
      "symbol": "Symbol must be 2-5 characters"
    }
  }
}
```

---

## Debug API

### Submit Debug Request

Submit code and error message for AI-powered debugging assistance.

**Endpoint:** `POST /api/debug`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `errorMessage` | string | Yes | Error message or description |
| `codeSnippet` | string | No | Relevant code snippet |
| `context` | string | No | Additional context |

**Example Request:**

```bash
POST /api/debug
Content-Type: application/json

{
  "errorMessage": "Transaction reverted: insufficient balance",
  "codeSnippet": "function transfer(address to, uint256 amount) public {\n  balances[msg.sender] -= amount;\n  balances[to] += amount;\n}",
  "context": "ERC20 token transfer function"
}
```

**Example Response:**

```json
{
  "suggestions": [
    {
      "title": "Add Balance Check",
      "description": "The function doesn't check if the sender has sufficient balance before transferring",
      "codeExample": "function transfer(address to, uint256 amount) public {\n  require(balances[msg.sender] >= amount, \"Insufficient balance\");\n  balances[msg.sender] -= amount;\n  balances[to] += amount;\n}",
      "references": [
        "https://docs.openzeppelin.com/contracts/erc20"
      ]
    },
    {
      "title": "Use SafeMath or Solidity 0.8+",
      "description": "Consider using SafeMath library or Solidity 0.8+ for automatic overflow protection",
      "codeExample": "// Solidity 0.8+ has built-in overflow protection\npragma solidity ^0.8.0;",
      "references": []
    }
  ],
  "sessionId": "debug_789xyz"
}
```

---

## Progress API

### Get User Progress

Retrieve user's onboarding progress.

**Endpoint:** `GET /api/progress`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No | User ID (uses session if not provided) |

**Example Response:**

```json
{
  "userId": "user_123",
  "completedSteps": [
    "intro-welcome",
    "intro-what-is-arc",
    "wallet-setup"
  ],
  "currentStep": "wallet-connect",
  "totalSteps": 15,
  "completionPercentage": 20
}
```

### Update User Progress

Mark a tutorial step as complete.

**Endpoint:** `POST /api/progress`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stepId` | string | Yes | Tutorial step ID |
| `userId` | string | No | User ID (uses session if not provided) |

**Example Request:**

```bash
POST /api/progress
Content-Type: application/json

{
  "stepId": "wallet-connect",
  "userId": "user_123"
}
```

**Example Response:**

```json
{
  "success": true,
  "completedSteps": [
    "intro-welcome",
    "intro-what-is-arc",
    "wallet-setup",
    "wallet-connect"
  ],
  "nextStep": "first-transaction",
  "completionPercentage": 27
}
```

---

## Search API

### Global Search

Search across DApps, tutorials, and documentation.

**Endpoint:** `GET /api/search`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 chars) |
| `type` | string | No | Filter by type (dapps, tutorials, all) |
| `limit` | number | No | Results per type (default: 5, max: 20) |

**Example Request:**

```bash
GET /api/search?q=wallet&type=all&limit=5
```

**Example Response:**

```json
{
  "query": "wallet",
  "results": {
    "dapps": [
      {
        "id": "clx123",
        "name": "ARC Wallet",
        "description": "Secure wallet for ARC blockchain",
        "type": "dapp",
        "url": "/dapps/clx123"
      }
    ],
    "tutorials": [
      {
        "id": "wallet-setup",
        "title": "Setting Up Your Wallet",
        "description": "Learn how to create and secure your ARC wallet",
        "type": "tutorial",
        "url": "/onboarding#wallet-setup"
      }
    ]
  },
  "totalResults": 2
}
```

**Error Response (400):**

```json
{
  "error": {
    "message": "Search query must be at least 2 characters",
    "code": "VALIDATION_ERROR"
  }
}
```

---

## API Client Examples

### JavaScript/TypeScript

```typescript
// Fetch DApps
async function getDApps(search?: string, category?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  
  const response = await fetch(`/api/dapps?${params}`);
  if (!response.ok) throw new Error('Failed to fetch DApps');
  return response.json();
}

// Send chat message
async function sendChatMessage(message: string, history: any[]) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory: history })
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
}

// Generate contract
async function generateContract(templateId: string, parameters: any) {
  const response = await fetch('/api/contracts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId, parameters })
  });
  if (!response.ok) throw new Error('Failed to generate contract');
  return response.json();
}
```

### cURL

```bash
# Get DApps
curl "http://localhost:3000/api/dapps?category=DeFi"

# Submit DApp
curl -X POST "http://localhost:3000/api/dapps" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My DApp",
    "description": "Description",
    "category": "DeFi",
    "websiteUrl": "https://example.com",
    "contactEmail": "contact@example.com"
  }'

# Send chat message
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is ARC blockchain?"
  }'

# Generate contract
curl -X POST "http://localhost:3000/api/contracts/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "erc20",
    "parameters": {
      "name": "MyToken",
      "symbol": "MTK"
    }
  }'
```

---

## Webhooks (Future)

Webhook support for DApp approval notifications will be added in a future release.

---

## API Versioning

Currently, the API is unversioned. Future versions will use URL versioning:

- `/api/v1/dapps`
- `/api/v2/dapps`

---

## Support

For API issues or questions:
- Check the [SETUP.md](./SETUP.md) for local development
- Review [ERROR_HANDLING.md](./lib/ERROR_HANDLING.md) for error patterns
- Open an issue on GitHub

---

**Last Updated:** November 2024  
**API Version:** 1.0.0
