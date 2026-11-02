import { SubcategoryIdEnum } from 'api/gen'
import { getDisplayableArtistPlaylists } from 'features/artist/helpers/getDisplayableArtistPlaylists'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'

describe('getDisplayableArtistPlaylists', () => {
  it('should expose displayable playlists in artist category mapping order', () => {
    const playlists = getDisplayableArtistPlaylists([
      buildArtistOffer({
        objectID: '1',
        name: 'Festival livre',
        subcategoryId: SubcategoryIdEnum.FESTIVAL_LIVRE,
      }),
      buildArtistOffer({
        objectID: '2',
        name: 'Livre papier',
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      }),
      buildArtistOffer({
        objectID: '3',
        name: 'Concert',
        subcategoryId: SubcategoryIdEnum.CONCERT,
      }),
      buildArtistOffer({
        objectID: '4',
        name: 'Festival cinéma',
        subcategoryId: SubcategoryIdEnum.FESTIVAL_CINE,
      }),
    ])

    expect(playlists.map(({ title }) => title)).toEqual([
      'Prochains concerts et festivals',
      'Livres',
      'Prochains festivals et salons du livre',
      'Prochains évènements de cinéma',
    ])
  })

  it('should ignore offers excluded from artist category mapping', () => {
    const playlists = getDisplayableArtistPlaylists([
      buildArtistOffer({
        objectID: '1',
        name: 'Jeu vidéo',
        subcategoryId: SubcategoryIdEnum.JEU_SUPPORT_PHYSIQUE,
      }),
    ])

    expect(playlists).toEqual([])
  })

  it('should expose distinct entry ids and playlist indexes', () => {
    const playlists = getDisplayableArtistPlaylists([
      buildArtistOffer({
        objectID: '1',
        name: 'Concert',
        subcategoryId: SubcategoryIdEnum.CONCERT,
      }),
      buildArtistOffer({
        objectID: '2',
        name: 'Livre papier',
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      }),
    ])

    expect(playlists.map(({ entryId, playlistIndex }) => ({ entryId, playlistIndex }))).toEqual([
      { entryId: 'artist_offers_0_concerts_festivals', playlistIndex: 0 },
      { entryId: 'artist_offers_1_livres', playlistIndex: 1 },
    ])
  })
})

const buildArtistOffer = ({
  name,
  objectID,
  subcategoryId,
}: {
  name: string
  objectID: string
  subcategoryId: SubcategoryIdEnum
}): AlgoliaOfferWithArtistAndEan => ({
  ...mockedAlgoliaOffersWithSameArtistResponse[0],
  objectID,
  offer: {
    ...mockedAlgoliaOffersWithSameArtistResponse[0].offer,
    bookFormat: undefined,
    name,
    subcategoryId,
  },
})
