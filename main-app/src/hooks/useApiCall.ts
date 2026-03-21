import { useState, useCallback, useRef, RefObject } from 'react';
import { apiClient } from '../lib/axios-client';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { Logger } from '../utils/logger';

interface UseApiResponse<T> {
    payload: T | null;
    isLoading: boolean;
    errorMsg: RefObject<{ code?: number; message: string } | undefined>;
    fetchData: (config: AxiosRequestConfig) => Promise<T | null>;
    resetStates: () => void;
}

const logger = new Logger('useApiCall');

/**
 * Generische Hook für API-Anfragen.
 * 
 * @example
 * const { fetchData, isLoading } = useApiCall<User>();
 * const loadUser = async (requestBody) => {
 *   const user = await fetchData({ method: 'GET', url: '/user/1', data: requestBody });
 * }
 */
export function useApiCall<T = unknown>(): UseApiResponse<T> {
  const [payload, setPayload] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const errorMsg = useRef<{ code?: number; message: string } | undefined>(undefined);

  const fetchData = useCallback(async (config: AxiosRequestConfig) => {
    setIsLoading(true);
    
    logger.debug('Sending API Request... ', config);

    try {
        const response = await apiClient.request<T>(config);
        setPayload(response.data);
        logger.info('Request successful. ', { url: config.url, status: response.status });
        return response.data;

    } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message ?? axiosError.message ?? 'Unknown Error';
        errorMsg.current = { 
          code: axiosError.response?.status, 
          message: axiosError.response?.data?.message ?? axiosError.message ?? 'Unknown Error' 
        };
        
        setPayload(null);
        logger.error('Request failed! ', { url: config.url, error: errorMessage });
        return null;

    } finally {
        setIsLoading(false);
    }
  }, []);

  const resetStates = useCallback(() => {
    setPayload(null);
    errorMsg.current = undefined;
    setIsLoading(false);
    logger.debug('API call state has been reset.');
  }, []);

  return { payload, isLoading, errorMsg: errorMsg, fetchData, resetStates };
};
