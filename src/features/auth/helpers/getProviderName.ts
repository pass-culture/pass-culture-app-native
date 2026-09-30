import { Provider } from 'features/auth/types'

export const getProviderName = (provider?: Provider.GOOGLE | Provider.APPLE): string => {
  if (provider === Provider.APPLE) return 'Apple'
  if (provider === Provider.GOOGLE) return 'Google'
  return 'Google ou Apple'
}
