import { lazy } from 'react'

export const AppNavigationContainer = lazy(async () => {
  const module = await import('./NavigationContainer')
  return { default: module.AppNavigationContainer }
})
