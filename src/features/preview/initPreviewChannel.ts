import { HotUpdater } from '@hot-updater/react-native'

import { isMatchingPreviewFingerprint } from 'features/preview/helpers/isMatchingPreviewFingerprint'
import { loadPreviewChannel } from 'features/preview/loadPreviewChannel'
import { getPreviewInstall } from 'features/preview/previewInstallStorage'

/**
 * Cold-start hook: if a preview channel was previously scanned and the binary
 * fingerprint still matches, load that channel. No UI.
 */
export const initPreviewChannel = async () => {
  const previewInstall = await getPreviewInstall()
  if (!previewInstall) return

  const { channel, fingerprint } = previewInstall
  if (!isMatchingPreviewFingerprint(HotUpdater.getFingerprintHash(), fingerprint)) return

  await loadPreviewChannel(channel)
}
