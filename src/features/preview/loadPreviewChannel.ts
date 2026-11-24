import { HotUpdater } from '@hot-updater/react-native'

const CHECK_TIMEOUT_MS = 20_000

export type PreviewChannelLoadResult =
  | { status: 'reloaded' }
  | { status: 'up_to_date'; detail: string }
  | { status: 'download_failed'; detail: string }
  | { status: 'error'; detail: string }

const describeRuntime = (channel: string) =>
  [
    `channel demandé ${channel}`,
    `channel actif ${HotUpdater.getChannel()}`,
    `switched ${HotUpdater.isChannelSwitched() ? 'oui' : 'non'}`,
    `fingerprint ${HotUpdater.getFingerprintHash() ?? 'absent'}`,
    `bundle ${HotUpdater.getBundleId()}`,
  ].join(' · ')

export const loadPreviewChannel = async (channel: string): Promise<PreviewChannelLoadResult> => {
  const runtime = () => describeRuntime(channel)

  try {
    if (HotUpdater.isChannelSwitched() && HotUpdater.getChannel() !== channel) {
      const reset = await HotUpdater.resetChannel()
      if (!reset) {
        return {
          status: 'error',
          detail: `Impossible de quitter le channel ${HotUpdater.getChannel()}. ${runtime()}`,
        }
      }
    }

    const checkError: { message: string | null } = { message: null }
    const updateInfo = await HotUpdater.checkForUpdate({
      channel,
      updateStrategy: 'fingerprint',
      requestTimeout: CHECK_TIMEOUT_MS,
      onError: (error) => {
        checkError.message = error.message
      },
    })

    if (checkError.message) {
      return { status: 'error', detail: `${checkError.message}. ${runtime()}` }
    }

    // null covers three library cases: UP_TO_DATE, no bundle, and a ROLLBACK
    // ignored on the first runtime channel switch.
    if (!updateInfo) {
      return {
        status: 'up_to_date',
        detail: `Aucun bundle téléchargé. Hot Updater n’a rien renvoyé (déjà à jour, bundle absent pour ce fingerprint, ou rollback ignoré). ${runtime()}`,
      }
    }

    const updated = await updateInfo.updateBundle()
    if (!updated) {
      return {
        status: 'download_failed',
        detail: `Le bundle a été trouvé mais le téléchargement a échoué. ${runtime()}`,
      }
    }

    await HotUpdater.reload()
    return { status: 'reloaded' }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { status: 'error', detail: `${message}. ${runtime()}` }
  }
}
