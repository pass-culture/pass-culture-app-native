import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'

export const gtlPlaylistRequestSnap: GtlPlaylistRequest[] = [
  {
    id: '5fThoWkm590x6drqnHe0Jl',
    displayParameters: {
      title: 'Romance',
      layout: 'two-items',
      minOffers: 1,
    },
    offersModuleParameters: {
      title: 'Romance',
      isGeolocated: false,
      minBookingsThreshold: 1,
      hitsPerPage: 35,
      gtlLevel: 1,
      gtlLabel: 'Romance',
      categories: ['Livres'],
    },
  },
  {
    id: '5cPRtP6Fd9MFFzefxTxd3h',
    displayParameters: {
      title: 'Mangas',
      layout: 'two-items',
      minOffers: 1,
    },
    offersModuleParameters: {
      title: 'GTL2 Manga',
      isGeolocated: false,
      hitsPerPage: 35,
      gtlLevel: 4,
      gtlLabel: 'Manga / Manhwa / Man Hua',
      categories: ['Livres'],
    },
  },
  {
    id: '48mz4oSfDYnko21cHCS4Ue',
    displayParameters: {
      title: 'Bandes dessinées',
      layout: 'two-items',
      minOffers: 1,
    },
    offersModuleParameters: {
      title: 'GTL2 Bandes dessinées',
      isGeolocated: false,
      hitsPerPage: 30,
      gtlLevel: 2,
      gtlLabel: 'Bandes dessinées',
      categories: ['Livres'],
    },
  },
  {
    id: '2CPVJDfSYgJpIiIXy40Fb7',
    displayParameters: {
      title: 'Romans',
      layout: 'two-items',
      minOffers: 1,
    },
    offersModuleParameters: {
      title: 'GTL2 Romans',
      hitsPerPage: 30,
      gtlLevel: 2,
      gtlLabel: 'Romans & Nouvelles',
      categories: ['Livres'],
    },
  },
]
