import { ArtistType, CategoryIdEnum } from 'api/gen'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'

describe('getArtistRole', () => {
  describe('when role config is a simple string', () => {
    it('should return "Auteur" for author artist type', () => {
      expect(getArtistRole(ArtistType.author)).toEqual('Auteur')
    })

    it('should return "Acteur" for film actor artist type even if a category is provided', () => {
      expect(getArtistRole(ArtistType.film_actor, CategoryIdEnum.SPECTACLE)).toEqual('Acteur')
    })

    it('should return "Metteur en scène" for stage director artist type', () => {
      expect(getArtistRole(ArtistType.stage_director)).toEqual('Metteur en scène')
    })
  })

  describe('when role config depends on the category (performer)', () => {
    it('should return "Interprète" when category is SPECTACLE', () => {
      const result = getArtistRole(ArtistType.performer, CategoryIdEnum.SPECTACLE)

      expect(result).toEqual('Interprète')
    })

    it('should return "Artiste" when category is MUSIQUE_LIVE', () => {
      const result = getArtistRole(ArtistType.performer, CategoryIdEnum.MUSIQUE_LIVE)

      expect(result).toEqual('Artiste')
    })

    it('should return "Artiste" when category is MUSIQUE_ENREGISTREE', () => {
      const result = getArtistRole(ArtistType.performer, CategoryIdEnum.MUSIQUE_ENREGISTREE)

      expect(result).toEqual('Artiste')
    })

    it('should return the fallback "Artiste" if the category is not defined in the mapping', () => {
      const result = getArtistRole(ArtistType.performer, CategoryIdEnum.CONFERENCE)

      expect(result).toEqual('Artiste')
    })

    it('should return the fallback "Artiste" if no category is provided', () => {
      const result = getArtistRole(ArtistType.performer)

      expect(result).toEqual('Artiste')
    })
  })
})
