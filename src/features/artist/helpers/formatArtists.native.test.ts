import { CategoryIdEnum } from 'api/gen'
import { mockArtists, mockMixedArtists } from 'features/artist/fixtures/mockArtist'
import { formatArtists } from 'features/artist/helpers/formatArtists'

describe('formatArtists', () => {
  it('should format a valid offer artist correctly', () => {
    const result = formatArtists(mockArtists, CategoryIdEnum.SPECTACLE)

    expect(result).toEqual([
      {
        id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
        image: 'http://commons.wikimedia.org/wiki/Special:FilePath/Virginie%20Despentes%202012.jpg',
        name: 'Avril Lavigne',
        role: 'Artiste',
        accessibilityLabel: 'Accéder à la page artiste de Avril Lavigne',
      },
      {
        id: 'f7a2b9e4-3d12-4b5c-a81f-67d4e32b901a',
        image: 'https://fr.wikipedia.org/wiki/Lady_Gaga#/media/Fichier:Lady_Gaga-65189.jpg',
        name: 'Lady Gaga',
        role: 'Artiste',
        accessibilityLabel: 'Accéder à la page artiste de Lady Gaga',
      },
    ])
  })

  it('should format only offer artist with id and exclude those without id', () => {
    const result = formatArtists(mockMixedArtists, CategoryIdEnum.SPECTACLE)

    expect(result).toEqual([
      {
        id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
        image: 'http://commons.wikimedia.org/wiki/Special:FilePath/Virginie%20Despentes%202012.jpg',
        name: 'Avril Lavigne',
        role: 'Artiste',
        accessibilityLabel: 'Accéder à la page artiste de Avril Lavigne',
      },
      {
        id: 'f7a2b9e4-3d12-4b5c-a81f-67d4e32b901a',
        image: 'https://fr.wikipedia.org/wiki/Lady_Gaga#/media/Fichier:Lady_Gaga-65189.jpg',
        name: 'Lady Gaga',
        role: 'Artiste',
        accessibilityLabel: 'Accéder à la page artiste de Lady Gaga',
      },
    ])
  })
})
