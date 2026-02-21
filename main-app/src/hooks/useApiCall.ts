import { useState, useCallback } from 'react';
import { apiClient } from '../lib/axios-client';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { Logger } from '../utils/logger';

interface UseApiResponse<T> {
    payload: T | null;
    isLoading: boolean;
    errorMsg: string | undefined;
    fetchData: (config: AxiosRequestConfig) => Promise<void>;
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
  const [errorMsg, setErrorMessage] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async (config: AxiosRequestConfig) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    
    logger.debug('Sending API Request... ', config);

    try {
        const response = await apiClient.request<T>(config);
        setPayload(response.data);
        logger.info('Request successful. ', { url: config.url, status: response.status });

    } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown Error';
        setErrorMessage(errorMessage);
        setPayload(null);
        logger.error('Request failed! ', { url: config.url, error: errorMessage });

    } finally {
        setIsLoading(false);
    }
  }, []);

  const resetStates = useCallback(() => {
    setPayload(null);
    setErrorMessage(undefined);
    setIsLoading(false);
    logger.debug('API call state has been reset.');
  }, []);

  return { payload, isLoading, errorMsg, fetchData, resetStates };
};
