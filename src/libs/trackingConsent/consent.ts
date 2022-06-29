import { storage } from 'libs/storage'

export const getCookiesConsent = async () =>
  await storage.readObject<boolean>('has_accepted_cookie')

