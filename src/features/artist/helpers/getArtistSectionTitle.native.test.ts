import { SubcategoryIdEnum } from 'api/gen'
import { ARTIST_SECTION_TITLES } from 'features/artist/constants'
import { getArtistSectionTitle } from 'features/artist/helpers/getArtistSectionTitle'

describe('getArtistSectionTitle', () => {
  describe('should return distribution title', () => {
    it('When the subcategory id is CINE_PLEIN_AIR', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.CINE_PLEIN_AIR)

      expect(result).toEqual(ARTIST_SECTION_TITLES.distribution)
    })

    it('When the subcategory id is SEANCE_CINE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.SEANCE_CINE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.distribution)
    })

    it('When the subcategory id is SUPPORT_PHYSIQUE_FILM', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM)

      expect(result).toEqual(ARTIST_SECTION_TITLES.distribution)
    })

    it('When the subcategory id is VOD', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.VOD)

      expect(result).toEqual(ARTIST_SECTION_TITLES.distribution)
    })
  })

  describe('should return programming title', () => {
    it('When the subcategory id is CONCERT', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.CONCERT)

      expect(result).toEqual(ARTIST_SECTION_TITLES.programming)
    })

    it('When the subcategory id is EVENEMENT_MUSIQUE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.EVENEMENT_MUSIQUE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.programming)
    })

    it('When the subcategory id is FESTIVAL_MUSIQUE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.FESTIVAL_MUSIQUE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.programming)
    })
  })

  describe('should return speaker title', () => {
    it('When the subcategory id is CONCOURS', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.CONCOURS)

      expect(result).toEqual(ARTIST_SECTION_TITLES.speaker)
    })

    it('When the subcategory id is CONFERENCE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.CONFERENCE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.speaker)
    })

    it('When the subcategory id is DECOUVERTE_METIERS', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.DECOUVERTE_METIERS)

      expect(result).toEqual(ARTIST_SECTION_TITLES.speaker)
    })

    it('When the subcategory id is RENCONTRE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.RENCONTRE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.speaker)
    })

    it('When the subcategory id is RENCONTRE_JEU', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.RENCONTRE_JEU)

      expect(result).toEqual(ARTIST_SECTION_TITLES.speaker)
    })

    it('When the subcategory id is SALON', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.SALON)

      expect(result).toEqual(ARTIST_SECTION_TITLES.speaker)
    })
  })

  describe('should return writer title', () => {
    it('When the subcategory id is FESTIVAL_LIVRE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.FESTIVAL_LIVRE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.writer)
    })

    it('When the subcategory id is LIVRE_AUDIO_PHYSIQUE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.writer)
    })

    it('When the subcategory id is LIVRE_NUMERIQUE', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.LIVRE_NUMERIQUE)

      expect(result).toEqual(ARTIST_SECTION_TITLES.writer)
    })

    it('When the subcategory id is LIVRE_PAPIER', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.LIVRE_PAPIER)

      expect(result).toEqual(ARTIST_SECTION_TITLES.writer)
    })

    it('When the subcategory id is TELECHARGEMENT_LIVRE_AUDIO', () => {
      const result = getArtistSectionTitle(SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO)

      expect(result).toEqual(ARTIST_SECTION_TITLES.writer)
    })
  })

  it('should return the default artist title when the subcategoryId is not mapped', () => {
    const result = getArtistSectionTitle(SubcategoryIdEnum.PODCAST)

    expect(result).toEqual(ARTIST_SECTION_TITLES.artist)
  })
})
