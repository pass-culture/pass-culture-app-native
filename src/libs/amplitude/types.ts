export interface AmplitudeClient {
  logEvent(eventType: string, eventProperties?: Record<string, unknown>): Promise<void>
}
