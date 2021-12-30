import { renderHook } from '@testing-library/react-hooks'
import shuffle from 'lodash.shuffle'

import { UserProfileResponse, UserRole } from 'api/gen'
import { HomepageEntry, Tag } from 'features/home/contentful'
import { useSelectPlaylist } from 'features/home/selectPlaylist'
import { adaptedHomepageEntry as entry } from 'tests/fixtures/homepageEntries'

const defaultUser: Partial<UserProfileResponse> = { roles: [UserRole.BENEFICIARY] }
const underageUser = { ...defaultUser, roles: [UserRole.UNDERAGE_BENEFICIARY] }

let mockedUser = defaultUser
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: mockedUser })),
}))

const masterTag: Tag = { sys: { id: 'master', linkType: 'Tag', type: 'Link' } }
const grandpublicTag: Tag = { sys: { id: 'usergrandpublic', linkType: 'Tag', type: 'Link' } }
const underageTag: Tag = { sys: { id: 'userunderage', linkType: 'Tag', type: 'Link' } }

const entryId = 'entryId'

const entryOther: HomepageEntry = entry
const entryWithId: HomepageEntry = { ...entry, sys: { ...entry.sys, id: entryId } }
const entryUnderage: HomepageEntry = { ...entry, metadata: { tags: [underageTag] } }
const entryUnderageMaster: HomepageEntry = {
  ...entry,
  metadata: { tags: [masterTag, underageTag] },
}
const entryAll: HomepageEntry = { ...entry, metadata: { tags: [grandpublicTag] } }
const entryAllMaster: HomepageEntry = { ...entry, metadata: { tags: [masterTag, grandpublicTag] } }
const entryMaster: HomepageEntry = { ...entry, metadata: { tags: [masterTag] } }

const allPlaylists = [
  entryUnderageMaster,
  entryUnderage,
  entryAll,
  entryAllMaster,
  entryMaster,
  entryOther,
  entryWithId,
]

describe('useSelectPlaylist', () => {
  describe('underage users', () => {
    beforeEach(() => {
      mockedUser = underageUser
    })

    it('should retrieve the playlist with the entryId', () => {
      const { result } = renderHook(() => useSelectPlaylist(entryId))
      const playlist = result.current(shuffle(allPlaylists))
      expect(playlist).toStrictEqual(entryWithId)
    })

    it('should retrieve the playlist tagged master+userunderage if available', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlist = result.current(shuffle(allPlaylists))
      expect(playlist).toStrictEqual(entryUnderageMaster)
    })

    it('should retrieve the playlist tagged master and no usergrandpublic if no tag userunderage available', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = [entryAll, entryAllMaster, entryMaster, entryOther, entryWithId]
      expect(result.current(shuffle(playlists))).toStrictEqual(entryMaster)
    })

    it('should retrieve the only playlist tagged master if no tag userunderage available', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = [entryAll, entryMaster, entryOther, entryWithId]
      expect(result.current(shuffle(playlists))).toStrictEqual(entryMaster)
    })

    it('should retrieve the first userunderage playlist even if no playlist tagged master', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = [entryUnderage, entryAll, entryOther, entryWithId]
      expect(result.current(shuffle(playlists))).toStrictEqual(entryUnderage)
    })

    it('should retrieve the first playlist if no playlist tagged master or userunderage', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = shuffle([entryAll, entryOther, entryWithId])
      expect(result.current(playlists)).toStrictEqual(playlists[0])
    })
  })

  describe('all users', () => {
    beforeEach(() => {
      mockedUser = defaultUser
    })

    it('should retrieve the playlist with the entryId', () => {
      const { result } = renderHook(() => useSelectPlaylist(entryId))
      const playlist = result.current(shuffle(allPlaylists))
      expect(playlist).toStrictEqual(entryWithId)
    })

    it('should retrieve the playlist tagged master+usergrandpublic if available', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlist = result.current(shuffle(allPlaylists))
      expect(playlist).toStrictEqual(entryAllMaster)
    })

    it('should retrieve the playlist tagged only master if playlist tagged usergrandpublic does not exist', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = [
        entryUnderageMaster,
        entryUnderage,
        entryAll,
        entryMaster,
        entryOther,
        entryWithId,
      ]
      expect(result.current(shuffle(playlists))).toStrictEqual(entryMaster)
    })

    it('should retrieve the playlist tagged usergrandpublic if available and no playlist tagged master', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = shuffle([entryUnderage, entryAll, entryOther, entryWithId])
      expect(result.current(playlists)).toStrictEqual(entryAll)
    })

    it('should retrieve the first playlist if no playlist tagged master or usergrandpublic', () => {
      const { result } = renderHook(useSelectPlaylist)
      const playlists = shuffle([entryUnderage, entryOther, entryWithId])
      expect(result.current(playlists)).toStrictEqual(playlists[0])
    })
  })
})
