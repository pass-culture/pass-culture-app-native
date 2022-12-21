export interface AmplitudeClient {
  logEvent(eventType: string, eventProperties?: Record<string, unknown>): void
  enableCollection(): void
  disableCollection(): void
  setUserProperties(properties: Record<string, unknown>): void
}
