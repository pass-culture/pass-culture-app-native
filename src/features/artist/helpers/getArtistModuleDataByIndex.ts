import {
  ArtistEditorialModule as ArtistEditorialModuleType,
  ArtistPlaylistModule as ArtistPlaylistModuleType,
  ModuleData,
} from 'features/home/types'

export type ArtistModuleItem = ArtistPlaylistModuleType | ArtistEditorialModuleType

export function getArtistModuleDataByIndex(
  modules: ArtistModuleItem[],
  dataList: ModuleData[],
  targetModule?: ArtistModuleItem
): ModuleData | undefined {
  if (!targetModule) return undefined
  const index = modules.indexOf(targetModule)
  return index >= 0 ? dataList[index] : undefined
}
