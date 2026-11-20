import { handlePreviewInstallFromDeeplink } from 'features/preview/handlePreviewInstallFromDeeplink'
import { showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type ResolvePreviewInstallForModalParams = {
  channel?: string
  fingerprint?: string
  downloadUrl?: string
  onMatched: () => void
  onMismatch: () => void
}

export const getPreviewChannelLoadedMessage = (channel: string) =>
  `Channel preview «\u00a0${channel}\u00a0» chargé`

export const resolvePreviewInstallForModal = async ({
  channel,
  fingerprint,
  downloadUrl,
  onMatched,
  onMismatch,
}: ResolvePreviewInstallForModalParams) => {
  const result = await handlePreviewInstallFromDeeplink({
    channel,
    fingerprint,
    downloadUrl,
  })

  if (result === 'matched') {
    if (channel) showSuccessSnackBar(getPreviewChannelLoadedMessage(channel))
    onMatched()
    return
  }

  onMismatch()
}
