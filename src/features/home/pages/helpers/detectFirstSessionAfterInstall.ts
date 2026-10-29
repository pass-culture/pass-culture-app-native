import { COOKIES_CONSENT_KEY } from 'features/cookies/helpers/cookiesConsentKey'
import { spectacleVivantAdjustEventsStoreActions } from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import { storage } from 'libs/storage'

// The flag is saved at the first launch: without it, the app has never been launched on this device since its installation
export const detectFirstSessionAfterInstall = async () => {
  const hasLaunchedAppOnce = await storage.readObject<boolean>('has_launched_app_once')
  if (hasLaunchedAppOnce) return

  // Users updating from a version without the flag have a cookies choice, saved during their first session
  // (consent modal or login) and kept when the consent expires
  const cookiesChoice = await storage.readObject(COOKIES_CONSENT_KEY)
  spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(!cookiesChoice)
  await storage.saveObject('has_launched_app_once', true)
}
