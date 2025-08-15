import { useState } from 'react';
import { LiquidityApi } from '@/shared/api/services/liquidity';
import { AirdropApi } from '@/shared/api/services/airdrop';
import { gql, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { api_uri } from '@/utils';

export function useTokenApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Якщо API прокинуте під тим самим доменом через nginx, можна вказати відносний шлях
  const graphUri = api_uri && api_uri !== '' ? `${api_uri}/graphql` : '/graphql';
  const httpLink = new HttpLink({ uri: graphUri, fetch });
  const authLink = setContext((_, { headers }) => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cc_jwt') : null;
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });
  const graph = new ApolloClient({ link: authLink.concat(httpLink), cache: new InMemoryCache() });

  const CREATE_TOKEN_TX = gql`
    mutation CreateToken($input: CreateTokenInput!) {
      createTokenTransaction(input: $input) {
        transaction
        metadata { mintAddress tokenAccountAddress estimatedFee instructions network }
        signingInstructions
      }
    }
  `;
  const CREATE_UPDATE_METADATA_TX = gql`
    mutation UpdateMeta($input: UpdateMetadataInput!) {
      createUpdateMetadataTransaction(input: $input) {
        transaction
        metadata { mintAddress metadataAddress estimatedFee instructions network }
        signingInstructions
      }
    }
  `;
  const SUBMIT_SIGNED = gql`
    mutation Submit($signedTransaction: String!, $metadata: JSON) {
      submitSignedTransaction(signedTransaction: $signedTransaction, metadata: $metadata) {
        success
        signature
        explorerUrl
        error
      }
    }
  `;
  const SAVE_METADATA = gql`
    mutation Save($mintAddress: String!, $transactionSignature: String!, $tokenData: CreateTokenInput!) {
      saveTokenMetadata(mintAddress: $mintAddress, transactionSignature: $transactionSignature, tokenData: $tokenData) {
        id
        mintAddress
        name
        symbol
        decimals
        supply
      }
    }
  `;
  
  const createToken = async (input: { name: string; symbol: string; decimals: number; initialSupply: number; description?: string; imageUrl?: string; }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await graph.mutate({ mutation: CREATE_TOKEN_TX, variables: { input } });
      const base64Unsigned = data?.createTokenTransaction?.transaction as string;
      if (!base64Unsigned) throw new Error('No transaction returned');
      // Prefer Phantom if available
      const txBuf = Buffer.from(base64Unsigned, 'base64');
      const { Transaction } = await import('@solana/web3.js');
      const unsignedTx = Transaction.from(txBuf);
      let signedBase64: string;
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        const signed = await (window as any).solana.signTransaction(unsignedTx);
        signedBase64 = Buffer.from(signed.serialize()).toString('base64');
      } else {
        throw new Error('Phantom not available. Please use Phantom wallet for secure signing.');
      }

      const submitRes = await graph.mutate({ mutation: SUBMIT_SIGNED, variables: { signedTransaction: signedBase64, metadata: data?.createTokenTransaction?.metadata } });
      const ok = submitRes.data?.submitSignedTransaction?.success;
      const signature = submitRes.data?.submitSignedTransaction?.signature as string | undefined;
      const explorerUrl = submitRes.data?.submitSignedTransaction?.explorerUrl as string | undefined;
      if (!ok || !signature) {
        throw new Error(submitRes.data?.submitSignedTransaction?.error || 'Submit failed');
      }

      const saved = await graph.mutate({ mutation: SAVE_METADATA, variables: {
        mintAddress: data?.createTokenTransaction?.metadata?.mintAddress,
        transactionSignature: signature,
        tokenData: input,
      }});

      setLoading(false);
      return { signature, explorerUrl, token: saved.data?.saveTokenMetadata };
    } catch (err: any) {
      setError(err?.message || 'Error creating token');
      setLoading(false);
      throw err;
    }
  };

  const createUpdateMetadataTx = async (input: { mintAddress: string; name?: string; symbol?: string; uri: string; }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await graph.mutate({ mutation: CREATE_UPDATE_METADATA_TX, variables: { input } });
      setLoading(false);
      return data.createUpdateMetadataTransaction as { transaction: string; metadata: any; signingInstructions: string[] };
    } catch (err: any) {
      setError(err?.message || 'Error creating update metadata transaction');
      setLoading(false);
      throw err;
    }
  };

  const submitSigned = async (signedTransaction: string, metadata?: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await graph.mutate({ mutation: SUBMIT_SIGNED, variables: { signedTransaction, metadata } });
      setLoading(false);
      return data.submitSignedTransaction as { success: boolean; signature?: string; explorerUrl?: string; error?: string };
    } catch (err: any) {
      setError(err?.message || 'Error submitting transaction');
      setLoading(false);
      throw err;
    }
  };
  
  return { createToken, createUpdateMetadataTx, submitSigned, loading, error };
}

export function useLiquidityApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addLiquidity = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LiquidityApi.add(data);
      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error adding liquidity');
      setLoading(false);
      throw err;
    }
  };
  
  const removeLiquidity = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LiquidityApi.add(data);
      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error removing liquidity');
      setLoading(false);
      throw err;
    }
  };
  
  return { addLiquidity, removeLiquidity, loading, error };
}

export function useAirdropApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createAirdrop = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AirdropApi.preview(data);
      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating airdrop');
      setLoading(false);
      throw err;
    }
  };
  
  return { createAirdrop, loading, error };
}

// Pools не реалізовано у бекенді — тимчасово видалено
