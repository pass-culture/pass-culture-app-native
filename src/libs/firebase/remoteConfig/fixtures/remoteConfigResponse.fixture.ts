import { UseQueryResult } from '@tanstack/react-query'

import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'

export const remoteConfigResponseFixture = {
  data: DEFAULT_REMOTE_CONFIG,
  error: null,
  isError: false,
  isLoading: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  status: 'success',
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  failureCount: 0,
  isFetched: true,
  isFetchedAfterMount: true,
  isFetching: false,
  isPending: false,
  isEnabled: false,
  isPaused: false,
  isPlaceholderData: false,
  isStale: false,
  refetch: jest.fn(),
  fetchStatus: 'idle',
  failureReason: '',
  errorUpdateCount: 0,
  isInitialLoading: false,
  isRefetching: false,
  promise: Promise.resolve(DEFAULT_REMOTE_CONFIG),
} satisfies UseQueryResult<CustomRemoteConfig, unknown>
