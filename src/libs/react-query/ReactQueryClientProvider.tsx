import {
  QueryClientProvider,
  onlineManager,
  focusManager as reactQueryFocusManager,
} from '@tanstack/react-query'
import React from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { queryClient } from 'libs/react-query/queryClient'
import { usePrefetchQueries } from 'libs/react-query/usePrefetchQueries'

// By default, on the web, if a user leaves the app and returns to stale data,
// React Query automatically requests fresh data in the background.
// To have the equivalent behaviour for React-Native, we provide focus information through
// the AppState module :
reactQueryFocusManager.setEventListener((handleFocus) => {
  function triggerReactQueryFocusOnBecomeActive(appState: AppStateStatus) {
    if (appState === 'active') {
      // When we open the app that was in the background, for logged in user, we refresh the access_token
      // if it is expired. /refresh_access_token takes 300ms in average, so we delay the
      // refetching of all cached queries by a slightly larger time
      setTimeout(handleFocus, 500)
    }
  }
  const subscription = AppState.addEventListener('change', triggerReactQueryFocusOnBecomeActive)
  return () => {
    subscription.remove()
  }
})

onlineManager.setOnline(false)

export const ReactQueryClientProvider = ({ children }: { children: React.JSX.Element }) => {
  usePrefetchQueries()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
