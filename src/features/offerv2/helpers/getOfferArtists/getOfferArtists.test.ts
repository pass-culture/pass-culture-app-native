import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { getOfferArtists } from 'features/offerv2/helpers/getOfferArtists/getOfferArtists'

describe('getOfferArtists', () => {
  it('should return undefined when offer has not artists', () => {
    const artists = getOfferArtists(CategoryIdEnum.CINEMA, offerResponseSnap)

    expect(artists).toBeUndefined()
  })

  it('should return undefined when artists not associated at the category', () => {
    const artists = getOfferArtists(CategoryIdEnum.BEAUX_ARTS, offerResponseSnap)

    expect(artists).toBeUndefined()
  })

  it('should return undefined when offer category is Livre and author is not informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.LIVRE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
    })

    expect(artists).toBeUndefined()
  })

  it('should return author when offer category is Livre and author is informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.LIVRE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'JK Rowling' },
    })

    expect(artists).toEqual('JK Rowling')
  })

  it('should return undefined when offer category is Musique enregistrée and performer is not informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.MUSIQUE_ENREGISTREE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
    })

    expect(artists).toBeUndefined()
  })

  it('should return performer when offer category is Musique enregistrée and performer is informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.MUSIQUE_ENREGISTREE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      extraData: { performer: 'Edith Piaf' },
    })

    expect(artists).toEqual('Edith Piaf')
  })

  it('should return undefined when offer category is Musique live and performer is not informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.MUSIQUE_LIVE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.CONCERT,
    })

    expect(artists).toBeUndefined()
  })

  it('should return performer when offer category is Musique live and performer is informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.MUSIQUE_LIVE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.CONCERT,
      extraData: { performer: 'Jul' },
    })

    expect(artists).toEqual('Jul')
  })

  it('should return undefined when offer category is Spectacle and stage director is not informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.SPECTACLE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
    })

    expect(artists).toBeUndefined()
  })

  it('should return stage director when offer category is Spectacle and stage director is informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.SPECTACLE, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
      extraData: { stageDirector: 'Thierry Suc' },
    })

    expect(artists).toEqual('Thierry Suc')
  })

  it('should return undefined when offer category is Cinéma and stage director is not informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.CINEMA, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
    })

    expect(artists).toBeUndefined()
  })

  it('should return stage director when offer category is Cinéma and stage director is not informed', () => {
    const artists = getOfferArtists(CategoryIdEnum.CINEMA, {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      extraData: { stageDirector: 'Luc Besson' },
    })

    expect(artists).toEqual('Luc Besson')
  })
})
