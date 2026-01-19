export const mockArtist = {
  id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
  name: 'Avril Lavigne',
  image: 'http://commons.wikimedia.org/wiki/Special:FilePath/Virginie%20Despentes%202012.jpg',
  description:
    'Il s’agit d’une chanteuse canadienne qui a connu un grand succès au début des années 2000. Son style musical mélange le pop punk et le rock alternatif, ce qui lui a permis de se démarquer dans l’industrie musicale. Avec des tubes comme "Complicated" et "Sk8er Boi", elle a su captiver un large public et devenir une icône pour de nombreux jeunes. En plus de sa carrière musicale, Avril Lavigne est également reconnue pour son engagement dans diverses causes humanitaires, notamment la sensibilisation à la maladie de Lyme, qu’elle a elle-même combattue. Son influence s’étend au-delà de la musique, faisant d’elle une figure importante de la culture pop contemporaine.',
  descriptionCredit: '© Contenu généré par IA',
  descriptionSource: 'https://fr.wikipedia.org/wiki/Avril_Lavigne',
}

export const mockArtistLadyGaga = {
  id: 'f7a2b9e4-3d12-4b5c-a81f-67d4e32b901a',
  name: 'Lady Gaga',
  image: 'https://fr.wikipedia.org/wiki/Lady_Gaga#/media/Fichier:Lady_Gaga-65189.jpg',
  description:
    'Lady Gaga, de son vrai nom Stefani Joanne Angelina Germanotta, née le 28 mars 1986 à New York, est une auteure-compositrice-interprète, productrice, actrice et philanthrope américaine. Elle fait ses débuts sur la scène musicale rock indépendante du Lower East Side, avant de se faire connaitre avec son premier album, The Fame (2008), qui est un immense succès commercial à travers le monde avec les numéros-un Just Dance et Poker Face.',
}

export const mockArtists = [mockArtist, mockArtistLadyGaga]

// Artist without ID (no dedicated page on Pass Culture)
export const mockArtistWithoutId = {
  name: 'Mika',
  image: 'http://example.com/mika.jpg',
}

// Mixed artists list (with and without IDs)
export const mockMixedArtists = [mockArtist, mockArtistWithoutId, mockArtistLadyGaga]

// Artists without IDs only
export const mockArtistsWithoutIds = [
  { name: 'Artiste Sans Page 1' },
  { name: 'Artiste Sans Page 2' },
]
