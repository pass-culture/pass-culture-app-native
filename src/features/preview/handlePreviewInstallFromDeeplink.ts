import { HotUpdater } from '@hot-updater/react-native'

import { isMatchingPreviewFingerprint } from 'features/preview/helpers/isMatchingPreviewFingerprint'
import { loadPreviewChannel } from 'features/preview/loadPreviewChannel'
import { savePreviewInstall } from 'features/preview/previewInstallStorage'

type PreviewInstallDeeplinkParams = {
  channel?: string
  fingerprint?: string
  downloadUrl?: string
}

/**
 * Deeplink / QR flow: persist install metadata, then either signal a binary
 * mismatch (App Distribution CTA) or load the Hot Updater channel.
 */
export const handlePreviewInstallFromDeeplink = async ({
  channel,
  fingerprint,
  downloadUrl,
}: PreviewInstallDeeplinkParams): Promise<'mismatch' | 'matched'> => {
  if (!channel || !fingerprint) return 'mismatch'

  await savePreviewInstall({
    channel,
    fingerprint,
    downloadUrl: downloadUrl ?? null,
  })

  if (!isMatchingPreviewFingerprint(HotUpdater.getFingerprintHash(), fingerprint)) {
    return 'mismatch'
  }

  await loadPreviewChannel(channel)
  return 'matched'
}
