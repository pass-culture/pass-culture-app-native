import { ArtistType, OfferArtist } from 'api/gen'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { getArtistsButtonLabel, getArtistsLines } from 'features/offerRefacto/helpers/offerArtists'

describe('offerArtists', () => {
  describe('getArtistsLabel', () => {
    it('should return the correct label when there are more than 2 artists', () => {
      const artistsNames = ['Angèle', 'Stromae', 'Damso', 'Theodora']
      const result = getArtistsButtonLabel(artistsNames)

      expect(result).toEqual('Angèle, Stromae et 2 autres')
    })

    it('should return the correct label when there are 3 artists', () => {
      const artistsNames = ['Angèle', 'Stromae', 'Damso']
      const result = getArtistsButtonLabel(artistsNames)

      expect(result).toEqual('Angèle, Stromae et 1 autre')
    })

    it('should return the correct label when there are exactly 2 artists', () => {
      const artistsNames = ['Angèle', 'Stromae']
      const result = getArtistsButtonLabel(artistsNames)

      expect(result).toEqual('Angèle, Stromae')
    })

    it('should return the correct label when there is only 1 artist', () => {
      const artistsNames = ['Angèle']
      const result = getArtistsButtonLabel(artistsNames)

      expect(result).toEqual('Angèle')
    })
  })

  describe('getArtistsLines', () => {
    const mockStageDirector: OfferArtist = {
      name: 'Bong Joon Ho',
      role: ArtistType.stage_director,
      id: '1',
    }
    const mockPerformer1: OfferArtist = {
      name: 'Robert Pattinson',
      role: ArtistType.performer,
      id: '2',
    }
    const mockPerformer2: OfferArtist = {
      name: 'Anamaria Vartolomei',
      role: ArtistType.performer,
      id: '3',
    }
    const mockAuthor: OfferArtist = {
      name: 'Mélissa Da Costa',
      role: ArtistType.author,
      id: '4',
    }

    it('should return empty array when no artists', () => {
      expect(getArtistsLines([])).toEqual([])
    })

    it('should group artist without role with of prefix', () => {
      const artists = [mockArtist]
      const result = getArtistsLines(artists)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        prefix: 'de',
        artists: [mockArtist],
      })
    })

    it('should group author with "de" prefix', () => {
      const artists = [mockAuthor]
      const result = getArtistsLines(artists)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        prefix: 'de',
        artists: [mockAuthor],
      })
    })

    it('should separate performers and stage director with matching prefix', () => {
      const artists = [mockStageDirector, mockPerformer1, mockPerformer2]
      const result = getArtistsLines(artists)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        prefix: 'de',
        artists: [mockStageDirector],
      })
      expect(result[1]).toEqual({
        prefix: 'avec',
        artists: [mockPerformer1, mockPerformer2],
      })
    })

    it('should group performers with "avec" prefix', () => {
      const artists = [mockPerformer1, mockPerformer2]
      const result = getArtistsLines(artists)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        prefix: 'avec',
        artists: [mockPerformer1, mockPerformer2],
      })
    })
  })
})
