import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Offer } from 'shared/offer/types'

export const filmsPlaylistAlgoliaSnapshot: ThematicSearchPlaylistData[] = [
  {
    title: 'Vidéos et documentaires',
    offers: {
      hits: [
        {
          offer: {
            name: 'Harry potter à l’école des sorciers',
            subcategoryId: SubcategoryIdEnum.VOD,
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
            subcategoryId: SubcategoryIdEnum.VOD,
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
    title: 'DVD et Blu-ray',
    offers: {
      hits: [
        {
          offer: {
            name: 'Harry potter et la coupe de feu',
            subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM,
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
            subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM,
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
    title: 'Abonnements streaming',
    offers: {
      hits: [
        {
          offer: {
            name: 'CANAL+',
            subcategoryId: SubcategoryIdEnum.ABO_PLATEFORME_VIDEO,
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
            name: 'Netflix',
            subcategoryId: SubcategoryIdEnum.ABO_PLATEFORME_VIDEO,
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
      hitsPerPage: 20,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
  },
]

export const filmsPlaylistAlgoliaSnapshotWithoutHits: ThematicSearchPlaylistData[] = [
  {
    title: 'Vidéos et documentaires',
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
    title: 'DVD et Blu-ray',
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
    title: 'Abonnements streaming',
    offers: {
      hits: [],
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
]
