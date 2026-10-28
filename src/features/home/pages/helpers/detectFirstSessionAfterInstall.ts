import { COOKIES_CONSENT_KEY } from 'features/cookies/helpers/cookiesConsentKey'
import { spectacleVivantAdjustEventsStoreActions } from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import { storage } from 'libs/storage'

// The cookies choice is saved during the first session (consent modal or login) and only emptied when the consent expires.
// Without it at launch, the app has never been used on this device, even when it was just updated from an older version.
export const detectFirstSessionAfterInstall = async () => {
  const cookiesChoice = await storage.readObject(COOKIES_CONSENT_KEY)
  spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(!cookiesChoice)
}
