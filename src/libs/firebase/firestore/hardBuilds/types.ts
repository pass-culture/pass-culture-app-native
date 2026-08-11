export const HARD_BUILDS_COLLECTION = 'hardBuilds'

export type HardBuildPlatform = 'ios' | 'android'

export type HardBuild = {
  fingerprint: string
  platform: HardBuildPlatform
  env: string
  version: string | null
  buildNumber: number | null
  testingUri: string
  firebaseConsoleUri: string | null
}

export const getHardBuildDocId = (platform: HardBuildPlatform, fingerprint: string) =>
  `${platform}_${fingerprint}`
