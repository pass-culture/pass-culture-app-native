// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type NotificationData = {
  type: 'info' | 'success' | 'error'
  message: string
}

type State = {
  isNetworkAvailable: boolean | null
  isAppReady: boolean
  notificationData?: NotificationData
}

export const useAppStore = create<State>()(
  subscribeWithSelector<State>(() => ({
    isNetworkAvailable: false,
    isAppReady: false,
    notificationData: undefined,
  }))
)

export const setNetworkAvailable = (value: boolean | null) =>
  useAppStore.setState({ isNetworkAvailable: value })

export const setAppReady = (value: boolean) => useAppStore.setState({ isAppReady: value })
export const setNotification = (value: NotificationData) =>
  useAppStore.setState({ notificationData: value })
export const clearNotification = () => useAppStore.setState({ notificationData: undefined })
