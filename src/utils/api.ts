// API 응답 타입
export interface SponsoredTransactionResponse {
  bytes: string;
  digest: string;
}

export interface TransactionResult {
  digest: string;
  status: 'success' | 'failure';
  effects?: Record<string, unknown>; // 정확한 타입 지정
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
      body: JSON.stringify({ userId: address, txData: data }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // JSON이 아닐 수도 있으니 텍스트로 받기
      console.error('API Error:', errorText);
      throw new ApiError(`Failed to create sponsored transaction: ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      throw new ApiError('Invalid JSON response from server');
    }
  },

  async executeTransaction(digest: string, signature: string) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/execute-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ digest, signature }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new ApiError(`Failed to execute transaction: ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      throw new ApiError('Invalid JSON response from server');
    }
  }
};