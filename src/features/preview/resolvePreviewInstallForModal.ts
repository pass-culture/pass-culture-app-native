import { handlePreviewInstallFromDeeplink } from 'features/preview/handlePreviewInstallFromDeeplink'

type ResolvePreviewInstallForModalParams = {
  channel?: string
  fingerprint?: string
  downloadUrl?: string
  onMatched: () => void
  onMismatch: () => void
}

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
    onMatched()
    return
  }

  onMismatch()
}
