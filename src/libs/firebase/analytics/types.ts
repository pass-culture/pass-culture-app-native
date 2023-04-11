import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export type LoginRoutineMethod = 'fromLogin' | 'fromSignup' | 'fromSetEmail'

export interface AnalyticsProvider {
  disableCollection: () => Promise<void> | void
  enableCollection: () => Promise<void> | void
  getAppInstanceId: () => Promise<string | null>
  setDefaultEventParameters: (params: Record<string, unknown> | undefined) => Promise<void> | void
  setUserId: (userId: number) => Promise<void> | void
  logScreenView: (screenName: string) => Promise<void> | void
  logLogin: ({ method }: { method: LoginRoutineMethod }) => Promise<void> | void
  logEvent: (name: AnalyticsEvent, params?: Record<string, unknown>) => Promise<void> | void
}
