import { SearchResponse } from '@algolia/client-search'

import { CategoryNameEnum } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'

export const mockedAlgoliaResponse: SearchResponse<AlgoliaHit> = {
  hits: [
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [],
        description:
          "Bel astre voyageur, hôte qui nous arrives, Des profondeurs du ciel et qu'on n'attendait pas, Où vas-tu ? Quel dessein pousse vers nous tes pas ? Toi qui vogues au large en cette mer sans rives",
        isDigital: false,
        isDuo: false,
        name: 'Mensch ! Où sont les Hommes ?',
        prices: [28.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
      objectID: '102280',
    },
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [],
        description:
          "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [23.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
      },
      _geoloc: { lat: 48.91265, lng: 2.4513 },
      objectID: '102272',
    },
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [1605643200.0],
        description: null,
        isDigital: false,
        isDuo: true,
        name: 'Un lit sous une rivière',
        prices: [34.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: '102249',
    },
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [],
        description:
          "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [28.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: '102310',
    },
  ],
  nbHits: 4,
  page: 0,
  nbPages: 1,
  hitsPerPage: 6,
  exhaustiveNbHits: true,
  query: '',
  params:
    'page=0&facetFilters=%5B%5B%22offer.category%3AMUSIQUE%22%2C%22offer.category%3AINSTRUMENT%22%5D%5D&numericFilters=%5B%5B%22offer.prices%3A+0+TO+300%22%5D%5D&hitsPerPage=6',
  processingTimeMS: 1,
}

export const physicalAlgoliaOffer: AlgoliaHit = {
  offer: {
    category: CategoryNameEnum.SPECTACLE,
    dates: [1612465203, 1612551603, 1612638003],
    description:
      'Le regard drôle et décalé de sept circassiennes de haut vol sur leur Finlande natale.\n\nIl y a dix ans, un groupe de copines, soudées par des années communes de formation en cirque, exilées et éloignées, décide de raconter en un spectacle leur Finlande natale. Mad in Finland est né lors du festival costarmoricain Tant qu’il y aura des Mouettes, nourri par le bonheur des sept acrobates de se retrouver. Depuis, la Finlande a élu une femme Premier ministre, les extrêmes ont gagné du terrain, Nokia – fierté nationale – n’est plus la marque de téléphone le plus vendu. Mais les sept sœurs de piste ont toujours la joie communicative, l’autodérision, la tendresse et l’énergie pour partager leur pays : la nuit polaire, les championnats en tout genre, le saut à ski, les forêts grouillantes de bûcherons, la passion finlandaise pour le sauna… Trapèzes, fil, tissu, rola bola, main à main et musique en direct composent ce récit en V.O. joyeux et généreux.',
    isDigital: false,
    isDuo: true,
    name: 'Mad in Finland',
    prices: [9, 9, 9],
    thumbUrl:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/ZEWA',
  },
  _geoloc: { lat: 48.51381, lng: -2.76138 },
  objectID: '3503086',
}

export const digitalAlgoliaOffer: AlgoliaHit = {
  offer: {
    category: CategoryNameEnum.FILM,
    dates: [],
    description:
      'Depuis, cinq ans, dans le cerveau de Bahia, tout bugge. Mobilité, élocution, coordination, en gros, « c’est la merde ». Du coup Bahia est obligée de faire équipe avec Simone. Ensemble, elles découvrent les joies du handicap ! Le parcours du combattant face à l’administration, les rendez-vous systématiquement ratés pour cause de retards intempestifs, les « dates » au 5ème sans ascenseur, et la merveilleuse ville de Paris où rien n’est fait, ou presque pour l’accessibilité des personnes « à mobilité réduite ». Heureusement, Bahia est épaulée par Tom, son coloc, et son très séduisant kiné…',
    isDigital: true,
    isDuo: false,
    name: 'Web série : Simone et moi',
    prices: [0],
    thumbUrl:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/5AZQ',
  },
  _geoloc: { lat: 47.158459, lng: 2.409289 },
  objectID: '5914536',
}

export const freeNotDuoAlgoliaOffer: AlgoliaHit = digitalAlgoliaOffer

export const noPriceNotDuoAlgoliaOffer: AlgoliaHit = {
  ...freeNotDuoAlgoliaOffer,
  offer: {
    ...freeNotDuoAlgoliaOffer.offer,
    prices: [],
  },
}

export const sevenEuroNotDuoAlgoliaOffer: AlgoliaHit = {
  ...freeNotDuoAlgoliaOffer,
  offer: {
    ...freeNotDuoAlgoliaOffer.offer,
    prices: [7],
  },
}
