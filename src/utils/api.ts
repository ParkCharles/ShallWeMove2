// API 응답 타입
export interface SponsoredTransactionResponse {
  bytes: string;
  digest: string;
}

export interface TransactionResult {
  digest: string;
  status: 'success' | 'failure';
  effects?: any; // Sui 트랜잭션 효과 타입 정의
}

// API 에러 타입
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async createSponsoredTransaction(address: string, data: { transactionKindBytes: string }) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sponsored-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: address, txData: data })
    });

    if (!response.ok) {
      throw new ApiError('Failed to create sponsored transaction');
    }

    return response.json();
  },

  async executeTransaction(digest: string, signature: string) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/execute-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ digest, signature })
    });

    if (!response.ok) {
      throw new ApiError('Failed to execute transaction');
    }

    return response.json();
  }
}; 