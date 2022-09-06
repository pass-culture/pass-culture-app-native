export interface AmplitudeClient {
  logEvent(eventType: string, eventProperties?: Record<string, unknown>): Promise<void> | void
  enableCollection(): Promise<void> | void
  disableCollection(): Promise<void> | void
}
