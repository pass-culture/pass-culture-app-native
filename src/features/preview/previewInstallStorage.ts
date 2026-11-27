import { storage } from 'libs/storage'

const STORAGE_KEY = 'preview_install'

export type PreviewInstall = {
  channel: string
  fingerprint: string
  downloadUrl: string | null
}

export const savePreviewInstall = (previewInstall: PreviewInstall) =>
  storage.saveObject(STORAGE_KEY, previewInstall)

export const getPreviewInstall = () => storage.readObject<PreviewInstall>(STORAGE_KEY)

export const clearPreviewInstall = () => storage.clear(STORAGE_KEY)
