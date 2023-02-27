import { Types } from '@amplitude/analytics-react-native'

export interface AmplitudeClient {
  logEvent(eventType: string, eventProperties?: Record<string, unknown>): void
  enableCollection(): void
  disableCollection(): void
  setUserProperties(properties: Record<string, Types.ValidPropertyType | null>): void
}
