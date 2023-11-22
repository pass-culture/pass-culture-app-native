import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Offer } from 'shared/offer/types'

export const gtlPlaylistAlgoliaSnapshot: GTLPlaylistResponse = [
  {
    title: 'GTL playlist',
    offers: {
      hits: [
        {
          offer: {
            name: 'Mon abonnement bibliothèque',
            subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
          },
          venue: venueResponseSnap,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '12',
        },
        {
          offer: {
            name: 'Mon abonnement médiathèque',
            subcategoryId: SubcategoryIdEnum.ABO_MEDIATHEQUE,
          },
          venue: venueResponseSnap,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '13',
        },
        {
          offer: {
            name: 'Mon abonnement livres numériques',
            subcategoryId: SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE,
          },
          venue: venueResponseSnap,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '14',
        },
        {
          offer: {
            name: 'Mon abonnement ludothèque',
            subcategoryId: SubcategoryIdEnum.ABO_LUDOTHEQUE,
          },
          venue: venueResponseSnap,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '15',
        },
        {
          offer: {
            name: 'Mon abonnement concert',
            subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
          },
          venue: venueResponseSnap,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '16',
        },
        {
          offer: {
            name: 'Mon abonnement jeu vidéo',
            subcategoryId: SubcategoryIdEnum.ABO_JEU_VIDEO,
          },
          venue: venueResponseSnap,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '17',
        },
      ],
      page: 0,
      nbPages: 1,
      nbHits: 1,
      hitsPerPage: 25,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
  },
]
