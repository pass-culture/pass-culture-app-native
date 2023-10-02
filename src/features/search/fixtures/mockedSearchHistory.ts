import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { HistoryItem } from 'features/search/types'

export const mockedSearchHistory: HistoryItem[] = [
  {
    createdAt: new Date('2023-09-25T09:01:00.000Z').getTime(),
    query: 'manga',
    label: 'manga',
  },
  {
    createdAt: new Date('2023-09-25T09:02:00.000Z').getTime(),
    query: 'vinyle',
    label: 'vinyle',
  },
  {
    createdAt: new Date('2023-09-25T09:03:00.000Z').getTime(),
    query: 'cd',
    label: 'cd',
  },
  {
    createdAt: new Date('2023-09-25T09:04:00.000Z').getTime(),
    query: 'livres',
    label: 'livres',
  },
  {
    createdAt: new Date('2023-09-25T09:05:00.000Z').getTime(),
    query: 'droit',
    label: 'droit',
  },
  {
    createdAt: new Date('2023-09-24T09:06:00.000Z').getTime(),
    query: 'tolkien',
    category: SearchGroupNameEnumv2.LIVRES,
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES,
    label: 'tolkien dans Livres audio physiques',
  },
  {
    createdAt: new Date('2023-09-24T09:07:00.000Z').getTime(),
    query: 'rap',
    label: 'rap',
  },
  {
    createdAt: new Date('2023-09-24T09:08:00.000Z').getTime(),
    query: 'rnb',
    label: 'rnb',
  },
  {
    createdAt: new Date('2023-09-24T09:09:00.000Z').getTime(),
    query: 'escape game',
    label: 'escape game',
  },
  {
    createdAt: new Date('2023-09-24T09:10:00.000Z').getTime(),
    query: 'tour eiffel',
    category: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    label: 'tour eiffel dans Musées, visites culturelles',
  },
  {
    createdAt: new Date('2023-09-23T09:11:00.000Z').getTime(),
    query: 'louvre',
    category: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    label: 'louvre dans Musées, visites culturelles',
  },
  {
    createdAt: new Date('2023-09-23T09:12:00.000Z').getTime(),
    query: 'orsay',
    category: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    label: 'orsay dans Musées, visites culturelles',
  },
  {
    createdAt: new Date('2023-09-23T09:13:00.000Z').getTime(),
    query: 'grévin',
    category: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    label: 'grévin dans Musées, visites culturelles',
  },
  {
    createdAt: new Date('2023-09-23T00:00:00.000Z').getTime(),
    query: 'théâtre',
    category: SearchGroupNameEnumv2.SPECTACLES,
    label: 'théâtre dans Spectacles',
  },
  {
    createdAt: new Date('2023-09-23T09:14:00.000Z').getTime(),
    query: 'stand up',
    category: SearchGroupNameEnumv2.SPECTACLES,
    label: 'stand up dans Spectacles',
  },
  {
    createdAt: new Date('2023-09-23T09:15:00.000Z').getTime(),
    query: 'foresti',
    category: SearchGroupNameEnumv2.SPECTACLES,
    label: 'foresti dans Spectacles',
  },
  {
    createdAt: new Date('2023-09-23T09:16:00.000Z').getTime(),
    query: 'comédie musicale',
    category: SearchGroupNameEnumv2.SPECTACLES,
    label: 'comédie musicale dans Spectacles',
  },
  {
    createdAt: new Date('2023-09-20T09:17:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    query: 'mélissa da costa',
    label: 'mélissa da costa dans Livres papier',
  },
  {
    createdAt: new Date('2023-09-20T09:18:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    query: 'one piece',
    label: 'one piece dans Livres',
  },
  {
    createdAt: new Date('2023-09-15T09:19:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    query: 'harry potter',
    label: 'harry potter dans Livres papier',
  },
  {
    createdAt: new Date('2023-09-15T09:20:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    query: 'gounelle',
    label: 'gounelle dans Livres papier',
  },
  {
    createdAt: new Date('2023-09-15T09:21:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    query: 'grimaldi',
    label: 'grimaldi dans Livres papier',
  },
  {
    createdAt: new Date('2023-08-25T09:22:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    query: 'pack lastman',
    label: 'pack lastman dans Livres',
  },
]
