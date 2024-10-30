import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { CinemaPlaylistData } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/useCinemaOffers'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Offer } from 'shared/offer/types'

export const cinemaPlaylistAlgoliaSnapshot: CinemaPlaylistData[] = [
  {
    title: 'Films à l’affiche',
    offers: {
      hits: [
        {
          offer: {
            name: 'Harry potter à l’école des sorciers',
            subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
          },
          venue: venueDataTest,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '1',
        },
        {
          offer: {
            name: 'Harry potter et le prisonnier d’Azkhaban',
            subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
          },
          venue: venueDataTest,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '2',
        },
      ],
      page: 0,
      nbPages: 1,
      nbHits: 2,
      hitsPerPage: 20,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
  {
    title: 'Films de la semaine',
    offers: {
      hits: [
        {
          offer: {
            name: 'Harry potter et la coupe de feu',
            subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
            releaseDate: '2005-11-30',
          },
          venue: venueDataTest,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '3',
        },
        {
          offer: {
            name: 'Harry potter et le prince de sang-mêlé',
            subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
            releaseDate: '2009-07-15',
          },
          venue: venueDataTest,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '4',
        },
      ],
      page: 0,
      nbPages: 1,
      nbHits: 2,
      hitsPerPage: 30,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
  {
    title: 'Carté ciné',
    offers: {
      hits: [
        {
          offer: {
            name: 'Carte ciné - distance',
            subcategoryId: SubcategoryIdEnum.CINE_VENTE_DISTANCE,
          },
          venue: venueDataTest,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '5',
        },
        {
          offer: {
            name: 'Carte ciné - multi',
            subcategoryId: SubcategoryIdEnum.CARTE_CINE_MULTISEANCES,
            releaseDate: '2009-07-15',
          },
          venue: venueDataTest,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '6',
        },
      ],
      page: 0,
      nbPages: 1,
      nbHits: 2,
      hitsPerPage: 30,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
]

export const cinemaPlaylistAlgoliaSnapshotWithoutHits: CinemaPlaylistData[] = [
  {
    title: 'Films à l’affiche',
    offers: {
      hits: [],
      page: 0,
      nbPages: 1,
      nbHits: 0,
      hitsPerPage: 20,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
  {
    title: 'Films de la semaine',
    offers: {
      hits: [],
      page: 0,
      nbPages: 1,
      nbHits: 0,
      hitsPerPage: 30,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
  {
    title: 'Carté ciné',
    offers: {
      hits: [],
      page: 0,
      nbPages: 1,
      nbHits: 2,
      hitsPerPage: 30,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
]
