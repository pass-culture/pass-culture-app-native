import { shuffle } from 'lodash'

import { SubcategoryIdEnum } from 'api/gen'
import { getVenueOffersArtists } from 'features/venue/helpers/getVenueOffersArtists'
import { Offer } from 'shared/offer/types'

describe('getVenueOffersArtists', () => {
  it('should return empty artists array when venueOffers is undefined', () => {
    const result = getVenueOffersArtists([SubcategoryIdEnum.LIVRE_PAPIER])

    expect(result.data).toEqual({ artists: [] })
  })

  it('should return empty artists array when there are no offers', () => {
    const result = getVenueOffersArtists([SubcategoryIdEnum.LIVRE_PAPIER], [])

    expect(result.data).toEqual({ artists: [] })
  })

  it('should return artists when there are offers', () => {
    const result = getVenueOffersArtists(
      [SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE],
      [
        {
          offer: {
            dates: [],
            isDigital: false,
            isDuo: false,
            name: 'I want something more',
            prices: [28.0],
            subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
            thumbUrl:
              'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
            artist: 'Céline Dion',
          },
          _geoloc: { lat: 4.90339, lng: -52.31663 },
          objectID: '102310',
          venue: {
            id: 4,
            name: 'Lieu 4',
            publicName: 'Lieu 4',
            address: '4 rue de la paix',
            postalCode: '75000',
            city: 'Paris',
          },
          artists: [
            {
              id: '1',
              name: 'Céline Dion',
              image:
                'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
            },
          ],
        },
        {
          offer: {
            dates: [],
            isDigital: false,
            isDuo: false,
            name: 'I want something more',
            prices: [28.0],
            subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
            thumbUrl:
              'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
            artist: 'Céline Dion',
          },
          _geoloc: { lat: 4.90339, lng: -52.31663 },
          objectID: '102310',
          venue: {
            id: 4,
            name: 'Lieu 4',
            publicName: 'Lieu 4',
            address: '4 rue de la paix',
            postalCode: '75000',
            city: 'Paris',
          },
          artists: [
            {
              id: '1',
              name: 'Céline Dion',
              image:
                'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
            },
          ],
        },
      ]
    )

    expect(result.data).toEqual({
      artists: [
        {
          id: '1',
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: 'Céline Dion',
        },
      ],
    })
  })

  it('should return 30 artists max / unique by id / ordered by number of offers / ordered by names', () => {
    // We have 2 times Artist 1 to 15 and 1 time Artist 16 to 30
    const mockedArtistList: Offer[] = Array.from({ length: 45 }, (_, index) => ({
      objectID: ((index % 30) + 1).toString(),
      offer: {
        artist: `Artist ${(index % 30) + 1}`,
        thumbUrl:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      venue: {
        id: 4,
        name: 'Lieu 4',
        publicName: 'Lieu 4',
        address: '4 rue de la paix',
        postalCode: '75000',
        city: 'Paris',
      },
      artists: [
        {
          id: `${(index % 30) + 1}`,
          name: `Artist ${(index % 30) + 1}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        },
      ],
    }))

    const result = getVenueOffersArtists(
      [SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE],
      shuffle(mockedArtistList)
    )

    const expectedArtistsList =
      // Artiste 1
      Array.from({ length: 1 }, (_, index) => ({
        id: `${index + 1}`,
        image:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        name: `Artist ${index + 1}`,
      })).concat(
        // Artiste 10 to 15
        Array.from({ length: 6 }, (_, index) => ({
          id: `${index + 10}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 10}`,
        })),
        // Artiste 2 to 9
        Array.from({ length: 8 }, (_, index) => ({
          id: `${index + 2}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 2}`,
        })),
        // Artiste 16 to 30
        Array.from({ length: 15 }, (_, index) => ({
          id: `${index + 16}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 16}`,
        }))
      )

    expect(result.data).toEqual({
      artists: expectedArtistsList,
    })
  })
})
