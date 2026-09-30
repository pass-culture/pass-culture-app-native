import {
  ArtistEditorialModule as ArtistEditorialModuleType,
  ArtistPlaylistModule as ArtistPlaylistModuleType,
} from 'features/home/types'

import { getArtistModuleDataByIndex } from './getArtistModuleDataByIndex'

const mockPlaylistModule = { id: 'playlist-1' } as ArtistPlaylistModuleType
const mockEditorialModule = { id: 'editorial-1' } as ArtistEditorialModuleType
const mockUnusedModule = { id: 'unused-1' } as ArtistEditorialModuleType

const mockDataList = [
  { moduleId: 'playlist-1', playlistItems: [] },
  { moduleId: 'editorialData', playlistItems: [] },
]

describe('getArtistModuleDataByIndex', () => {
  it('should return undefined when targetModule is undefined', () => {
    const modules = [mockPlaylistModule, mockEditorialModule]

    const result = getArtistModuleDataByIndex(modules, mockDataList, undefined)

    expect(result).toBeUndefined()
  })

  it('should return the correct data item when targetModule is found at index 0', () => {
    const modules = [mockPlaylistModule, mockEditorialModule]

    const result = getArtistModuleDataByIndex(modules, mockDataList, mockPlaylistModule)

    expect(result).toEqual({ moduleId: 'playlist-1', playlistItems: [] })
  })

  it('should return the correct data item when targetModule is found at index 1', () => {
    const modules = [mockPlaylistModule, mockEditorialModule]

    const result = getArtistModuleDataByIndex(modules, mockDataList, mockEditorialModule)

    expect(result).toEqual({ moduleId: 'editorialData', playlistItems: [] })
  })

  it('should return the correct data item when targetModule is the only item in the array', () => {
    const modules = [mockEditorialModule]

    const singleItemDataList = [{ moduleId: 'editorialData', playlistItems: [] }]

    const result = getArtistModuleDataByIndex(modules, singleItemDataList, mockEditorialModule)

    expect(result).toEqual({ moduleId: 'editorialData', playlistItems: [] })
  })

  it('should return undefined when targetModule is not present in the modules array', () => {
    const modules = [mockPlaylistModule]

    const result = getArtistModuleDataByIndex(modules, mockDataList, mockUnusedModule)

    expect(result).toBeUndefined()
  })
})
