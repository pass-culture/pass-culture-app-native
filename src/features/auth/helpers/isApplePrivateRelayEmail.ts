const APPLE_PRIVATE_RELAY_DOMAIN = '@privaterelay.appleid.com'

export const isApplePrivateRelayEmail = (email: string): boolean =>
  email.trim().toLowerCase().endsWith(APPLE_PRIVATE_RELAY_DOMAIN)
