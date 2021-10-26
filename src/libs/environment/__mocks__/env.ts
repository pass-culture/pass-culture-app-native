import { env as envFixtures } from './envFixtures'

export const env = envFixtures
export const EMAIL_PROVIDER_CUSTOM_URL = `https://${env.EMAIL_PROVIDER_CUSTOM_DOMAIN}`
