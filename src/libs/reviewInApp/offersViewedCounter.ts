import { storage } from 'libs/storage'

export const OFFERS_VIEWED_COUNT_STORAGE_KEY = 'offers_viewed_count'

export const readOffersViewedCount = async (): Promise<number> => {
  const raw = await storage.readObject<number>(OFFERS_VIEWED_COUNT_STORAGE_KEY)
  return typeof raw === 'number' && raw >= 0 ? raw : 0
}

export const incrementOffersViewedCount = async (): Promise<number> => {
  const next = (await readOffersViewedCount()) + 1
  await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, next)
  return next
}

export const resetOffersViewedCount = async (): Promise<void> => {
  await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, 0)
}
