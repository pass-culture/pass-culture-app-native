import { storage } from 'libs/storage'

export const getCookiesConsent = async () =>
  await storage.readObject<boolean>('has_accepted_cookie')

export const setCookiesConsent = (hasAcceptedCookie: boolean) =>
  storage.saveObject('has_accepted_cookie', hasAcceptedCookie)
