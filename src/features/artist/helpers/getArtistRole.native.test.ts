import { ArtistType, CategoryIdEnum } from 'api/gen'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'

describe('getArtistRole', () => {
  describe('Independent roles of the category', () => {
    it('should return singular role by default', () => {
      expect(getArtistRole(ArtistType.film_actor)).toEqual('Acteur')
    })

    it('should return plural role if specified', () => {
      expect(getArtistRole(ArtistType.film_actor, undefined, true)).toEqual('Acteurs')
    })
  })

  describe('Roles dependent on the category', () => {
    describe('Singular role', () => {
      it('should return "Interprète" for a SPECTACLE performer', () => {
        expect(getArtistRole(ArtistType.performer, CategoryIdEnum.SPECTACLE)).toEqual('Interprète')
      })

      it('should return "Artiste" for a MUSIQUE_LIVE performer', () => {
        expect(getArtistRole(ArtistType.performer, CategoryIdEnum.MUSIQUE_LIVE)).toEqual('Artiste')
      })

      it('should return "Artiste" for a MUSIQUE_ENREGISTREE performer', () => {
        expect(getArtistRole(ArtistType.performer, CategoryIdEnum.MUSIQUE_ENREGISTREE)).toEqual(
          'Artiste'
        )
      })
    })

    describe('Plural role', () => {
      it('should return "Interprètes" for a SPECTACLE performer', () => {
        expect(getArtistRole(ArtistType.performer, CategoryIdEnum.SPECTACLE, true)).toEqual(
          'Interprètes'
        )
      })

      it('should return "Artistes" for a MUSIQUE_LIVE performer', () => {
        expect(getArtistRole(ArtistType.performer, CategoryIdEnum.MUSIQUE_LIVE, true)).toEqual(
          'Artistes'
        )
      })

      it('should return "Artistes" for a MUSIQUE_ENREGISTREE performer', () => {
        expect(
          getArtistRole(ArtistType.performer, CategoryIdEnum.MUSIQUE_ENREGISTREE, true)
        ).toEqual('Artistes')
      })
    })
  })

  it('should return "Artiste(s)" for a category not linked to a role', () => {
    expect(getArtistRole(ArtistType.performer, CategoryIdEnum.CINEMA)).toBe('Artiste')
    expect(getArtistRole(ArtistType.performer, CategoryIdEnum.CINEMA, true)).toBe('Artistes')
  })

  it('should return "Artiste(s)" for a category linked to a role but not specified', () => {
    expect(getArtistRole(ArtistType.performer, undefined)).toBe('Artiste')
    expect(getArtistRole(ArtistType.performer, undefined, true)).toBe('Artistes')
  })
})
