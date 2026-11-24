import { handlePreviewInstallFromDeeplink } from 'features/preview/handlePreviewInstallFromDeeplink'

type ResolvePreviewInstallForModalParams = {
  channel?: string
  fingerprint?: string
  downloadUrl?: string
  onReloaded: () => void
  onMismatch: () => void
  onReport: (detail: string) => void
}

export const resolvePreviewInstallForModal = async ({
  channel,
  fingerprint,
  downloadUrl,
  onReloaded,
  onMismatch,
  onReport,
}: ResolvePreviewInstallForModalParams) => {
  const result = await handlePreviewInstallFromDeeplink({
    channel,
    fingerprint,
    downloadUrl,
  })

  if (result.status === 'mismatch') {
    onMismatch()
    return
  }

  if (result.status === 'reloaded') {
    onReloaded()
    return
  }

  onReport(result.detail)
}
