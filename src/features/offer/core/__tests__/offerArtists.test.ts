import { getArtistsButtonLabel } from 'features/offer/core/offerArtists'

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
})
