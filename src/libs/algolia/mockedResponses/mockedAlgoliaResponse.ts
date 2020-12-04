import { SearchResponse } from '@algolia/client-search'

import { AlgoliaHit } from '../algolia'
import { AlgoliaCategory } from '../algolia.d'

/**
 * _highlightResult(s) are commented due to
 * a mismatch between algoliasearch declared types
 * and actual received data
 *
 * this part is commented so we still have the snapshot of it
 */

export const mockedAlgoliaResponse: SearchResponse<AlgoliaHit> = {
  hits: [
    {
      offer: {
        author: null,
        category: AlgoliaCategory.MUSIQUE,
        dateCreated: 1604358109.991316,
        dates: [],
        description:
          "Bel astre voyageur, hôte qui nous arrives, Des profondeurs du ciel et qu'on n'attendait pas, Où vas-tu ? Quel dessein pousse vers nous tes pas ? Toi qui vogues au large en cette mer sans rives",
        id: 'AGHYQ',
        isbn: null,
        isDigital: false,
        isDuo: false,
        isEvent: false,
        isThing: true,
        label: 'Abonnements concerts',
        musicSubType: '914',
        musicType: '900',
        name: 'Mensch ! Où sont les Hommes ?',
        performer: null,
        prices: [28.0],
        priceMin: 28.0,
        priceMax: 28.0,
        showSubType: null,
        showType: null,
        speaker: null,
        stageDirector: null,
        stocksDateCreated: [1604358115.556418],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
        tags: [],
        times: [],
        type: 'Écouter',
        visa: null,
        withdrawalDetails: null,
      },
      offerer: { name: 'Danse Jazz Dans Tes Bottes' },
      venue: {
        city: 'Aulnay-sous-Bois',
        departementCode: '93',
        name: 'Michel et son accordéon',
        publicName: null,
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
      objectID: 'AGHYQ',
      /* _highlightResult: {
        offer: {
          description: {
            value:
              "Bel astre voyageur, hôte qui nous arrives, Des profondeurs du ciel et qu'on n'attendait pas, Où vas-tu ? Quel dessein pousse vers nous tes pas ? Toi qui vogues au large en cette mer sans rives",
            matchLevel: 'none',
            matchedWords: [],
          },
          id: { value: 'AGHYQ', matchLevel: 'none', matchedWords: [] },
          label: { value: 'Abonnements concerts', matchLevel: 'none', matchedWords: [] },
          musicSubType: { value: '914', matchLevel: 'none', matchedWords: [] },
          musicType: { value: '900', matchLevel: 'none', matchedWords: [] },
          name: {
            value: 'Mensch ! Où sont les Hommes ?',
            matchLevel: 'none',
            matchedWords: [],
          },
          type: { value: 'Écouter', matchLevel: 'none', matchedWords: [] },
        },
        offerer: {
          name: {
            value: 'Danse Jazz Dans Tes Bottes',
            matchLevel: 'none',
            matchedWords: [],
          },
        },
        venue: {
          city: { value: 'Aulnay-sous-Bois', matchLevel: 'none', matchedWords: [] },
          name: { value: 'Michel et son accordéon', matchLevel: 'none', matchedWords: [] },
        },
      }, */
    },
    {
      offer: {
        author: 'Catherine Mater',
        category: AlgoliaCategory.MUSIQUE,
        dateCreated: 1604358109.991316,
        dates: [],
        description:
          "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
        id: 'AGHYA',
        isbn: null,
        isDigital: false,
        isDuo: false,
        isEvent: false,
        isThing: true,
        label: 'Musique',
        musicSubType: '914',
        musicType: '900',
        name: 'I want something more',
        performer: 'Frank Despacito',
        prices: [23.0],
        priceMin: 23.0,
        priceMax: 23.0,
        showSubType: null,
        showType: null,
        speaker: null,
        stageDirector: null,
        stocksDateCreated: [1604358115.524528],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
        tags: [],
        times: [],
        type: 'Écouter',
        visa: null,
        withdrawalDetails: null,
      },
      offerer: { name: 'Club Dorothy' },
      venue: {
        city: 'Drancy',
        departementCode: '93',
        name: 'Maison de la Brique',
        publicName: null,
      },
      _geoloc: { lat: 48.91265, lng: 2.4513 },
      objectID: 'AGHYA',
      /* _highlightResult: {
        offer: {
          author: { value: 'Catherine Mater', matchLevel: 'none', matchedWords: [] },
          description: {
            value:
              "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
            matchLevel: 'none',
            matchedWords: [],
          },
          id: { value: 'AGHYA', matchLevel: 'none', matchedWords: [] },
          label: { value: 'Musique', matchLevel: 'none', matchedWords: [] },
          musicSubType: { value: '914', matchLevel: 'none', matchedWords: [] },
          musicType: { value: '900', matchLevel: 'none', matchedWords: [] },
          name: { value: 'I want something more', matchLevel: 'none', matchedWords: [] },
          performer: { value: 'Frank Despacito', matchLevel: 'none', matchedWords: [] },
          type: { value: 'Écouter', matchLevel: 'none', matchedWords: [] },
        },
        offerer: {
          name: { value: 'Club Dorothy', matchLevel: 'none', matchedWords: [] },
        },
        venue: {
          city: { value: 'Drancy', matchLevel: 'none', matchedWords: [] },
          name: { value: 'Maison de la Brique', matchLevel: 'none', matchedWords: [] },
        },
      }, */
    },
    {
      offer: {
        author: null,
        category: AlgoliaCategory.MUSIQUE,
        dateCreated: 1604358109.991255,
        dates: [1605643200.0],
        description: null,
        id: 'AGHWS',
        isbn: null,
        isDigital: false,
        isDuo: true,
        isEvent: true,
        isThing: false,
        label: 'Concert ou festival',
        musicSubType: null,
        musicType: null,
        name: 'Un lit sous une rivière',
        performer: null,
        prices: [34.0],
        priceMin: 34.0,
        priceMax: 34.0,
        showSubType: null,
        showType: null,
        speaker: null,
        stageDirector: null,
        stocksDateCreated: [1604358115.242088],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
        tags: [],
        times: [72000],
        type: 'Écouter',
        visa: null,
        withdrawalDetails: null,
      },
      offerer: { name: 'Théâtre Balboa' },
      venue: {
        city: 'Cayenne',
        departementCode: '973',
        name: 'Espace des Gnoux',
        publicName: null,
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: 'AGHWS',
      /* _highlightResult: {
        offer: {
          id: { value: 'AGHWS', matchLevel: 'none', matchedWords: [] },
          label: { value: 'Concert ou festival', matchLevel: 'none', matchedWords: [] },
          name: { value: 'Un lit sous une rivière', matchLevel: 'none', matchedWords: [] },
          type: { value: 'Écouter', matchLevel: 'none', matchedWords: [] },
        },
        offerer: {
          name: { value: 'Théâtre Balboa', matchLevel: 'none', matchedWords: [] },
        },
        venue: {
          city: { value: 'Cayenne', matchLevel: 'none', matchedWords: [] },
          name: { value: 'Espace des Gnoux', matchLevel: 'none', matchedWords: [] },
        },
      }, */
    },
    {
      offer: {
        author: null,
        category: AlgoliaCategory.MUSIQUE,
        dateCreated: 1604358109.991316,
        dates: [],
        description:
          "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
        id: 'AGH2M',
        isbn: null,
        isDigital: false,
        isDuo: false,
        isEvent: false,
        isThing: true,
        label: 'Abonnements concerts',
        musicSubType: '892',
        musicType: '880',
        name: 'I want something more',
        performer: null,
        prices: [28.0],
        priceMin: 28.0,
        priceMax: 28.0,
        showSubType: null,
        showType: null,
        speaker: null,
        stageDirector: null,
        stocksDateCreated: [1604358115.646641],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
        tags: [],
        times: [],
        type: 'Écouter',
        visa: null,
        withdrawalDetails: null,
      },
      offerer: { name: 'Théâtre Balboa' },
      venue: {
        city: 'Cayenne',
        departementCode: '973',
        name: 'Espace des Gnoux',
        publicName: null,
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: 'AGH2M',
      /* _highlightResult: {
        offer: {
          description: {
            value:
              "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
            matchLevel: 'none',
            matchedWords: [],
          },
          id: { value: 'AGH2M', matchLevel: 'none', matchedWords: [] },
          label: { value: 'Abonnements concerts', matchLevel: 'none', matchedWords: [] },
          musicSubType: { value: '892', matchLevel: 'none', matchedWords: [] },
          musicType: { value: '880', matchLevel: 'none', matchedWords: [] },
          name: { value: 'I want something more', matchLevel: 'none', matchedWords: [] },
          type: { value: 'Écouter', matchLevel: 'none', matchedWords: [] },
        },
        offerer: {
          name: { value: 'Théâtre Balboa', matchLevel: 'none', matchedWords: [] },
        },
        venue: {
          city: { value: 'Cayenne', matchLevel: 'none', matchedWords: [] },
          name: { value: 'Espace des Gnoux', matchLevel: 'none', matchedWords: [] },
        },
      }, */
    },
  ],
  nbHits: 4,
  page: 0,
  nbPages: 1,
  hitsPerPage: 6,
  exhaustiveNbHits: true,
  query: '',
  params:
    'page=0&facetFilters=%5B%5B%22offer.category%3AMUSIQUE%22%2C%22offer.category%3AINSTRUMENT%22%5D%5D&numericFilters=%5B%5B%22offer.prices%3A+0+TO+500%22%5D%5D&hitsPerPage=6',
  processingTimeMS: 1,
}

export const physicalAlgoliaOffer = {
  offer: {
    author: 'Collectif MAD & Galapiat Cirque',
    category: AlgoliaCategory.SPECTACLE,
    dateCreated: 1600175450.867247,
    dates: [1612465203, 1612551603, 1612638003],
    description:
      'Le regard drôle et décalé de sept circassiennes de haut vol sur leur Finlande natale.\n\nIl y a dix ans, un groupe de copines, soudées par des années communes de formation en cirque, exilées et éloignées, décide de raconter en un spectacle leur Finlande natale. Mad in Finland est né lors du festival costarmoricain Tant qu’il y aura des Mouettes, nourri par le bonheur des sept acrobates de se retrouver. Depuis, la Finlande a élu une femme Premier ministre, les extrêmes ont gagné du terrain, Nokia – fierté nationale – n’est plus la marque de téléphone le plus vendu. Mais les sept sœurs de piste ont toujours la joie communicative, l’autodérision, la tendresse et l’énergie pour partager leur pays : la nuit polaire, les championnats en tout genre, le saut à ski, les forêts grouillantes de bûcherons, la passion finlandaise pour le sauna… Trapèzes, fil, tissu, rola bola, main à main et musique en direct composent ce récit en V.O. joyeux et généreux.',
    id: 'GVZ64',
    isbn: null,
    isDigital: false,
    isDuo: true,
    isEvent: true,
    isThing: false,
    label: 'Spectacle',
    musicSubType: null,
    musicType: null,
    name: 'Mad in Finland',
    performer: null,
    prices: [9, 9, 9],
    priceMin: 9,
    priceMax: 9,
    showSubType: null,
    showType: '200',
    speaker: null,
    stageDirector: null,
    stocksDateCreated: [1600175509.165714, 1600175520.270227, 1600175534.358003],
    thumbUrl:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/ZEWA',
    tags: [],
    times: [68403],
    type: 'Applaudir',
    visa: null,
    withdrawalDetails: null,
  },
  offerer: { name: 'La Passerelle, Scène Nationale' },
  venue: {
    city: 'SAINT BRIEUC',
    departementCode: '22',
    name: 'LA PASSERELLE SCENE NATIONALE DE SAINT BRIEUC',
    publicName: 'La Passerelle scène nationale de Saint-Brieuc',
  },
  _geoloc: { lat: 48.51381, lng: -2.76138 },
  objectID: 'GVZ64',
  _highlightResult: {
    offer: {
      author: { value: 'Collectif MAD & Galapiat Cirque', matchLevel: 'none', matchedWords: [] },
      description: {
        value:
          'Le regard drôle et décalé de sept circassiennes de haut vol sur leur Finlande natale.\n\nIl y a dix ans, un groupe de copines, soudées par des années communes de formation en cirque, exilées et éloignées, décide de raconter en un spectacle leur Finlande natale. Mad in Finland est né lors du festival costarmoricain Tant qu’il y aura des Mouettes, nourri par le bonheur des sept acrobates de se retrouver. Depuis, la Finlande a élu une femme Premier ministre, les extrêmes ont gagné du terrain, Nokia – fierté nationale – n’est plus la marque de téléphone le plus vendu. Mais les sept sœurs de piste ont toujours la joie communicative, l’autodérision, la tendresse et l’énergie pour partager leur pays : la nuit polaire, les championnats en tout genre, le saut à ski, les forêts grouillantes de bûcherons, la passion finlandaise pour le sauna… Trapèzes, fil, tissu, rola bola, main à main et musique en direct composent ce récit en V.O. joyeux et généreux.',
        matchLevel: 'none',
        matchedWords: [],
      },
      id: { value: 'GVZ64', matchLevel: 'none', matchedWords: [] },
      label: { value: 'Spectacle', matchLevel: 'none', matchedWords: [] },
      name: { value: 'Mad in Finland', matchLevel: 'none', matchedWords: [] },
      showType: { value: '200', matchLevel: 'none', matchedWords: [] },
      type: { value: 'Applaudir', matchLevel: 'none', matchedWords: [] },
    },
    offerer: {
      name: { value: 'La Passerelle, Scène Nationale', matchLevel: 'none', matchedWords: [] },
    },
    venue: {
      city: { value: 'SAINT BRIEUC', matchLevel: 'none', matchedWords: [] },
      name: {
        value: 'LA PASSERELLE SCENE NATIONALE DE SAINT BRIEUC',
        matchLevel: 'none',
        matchedWords: [],
      },
    },
  },
}

export const digitalAlgoliaOffer = {
  offer: {
    author: null,
    category: AlgoliaCategory.FILM,
    dateCreated: 1605790850.352651,
    dates: [],
    description:
      'Depuis, cinq ans, dans le cerveau de Bahia, tout bugge. Mobilité, élocution, coordination, en gros, « c’est la merde ». Du coup Bahia est obligée de faire équipe avec Simone. Ensemble, elles découvrent les joies du handicap ! Le parcours du combattant face à l’administration, les rendez-vous systématiquement ratés pour cause de retards intempestifs, les « dates » au 5ème sans ascenseur, et la merveilleuse ville de Paris où rien n’est fait, ou presque pour l’accessibilité des personnes « à mobilité réduite ». Heureusement, Bahia est épaulée par Tom, son coloc, et son très séduisant kiné…',
    id: 'L972Q',
    isbn: null,
    isDigital: true,
    isDuo: false,
    isEvent: false,
    isThing: true,
    label: 'Film',
    musicSubType: null,
    musicType: null,
    name: 'Web série : Simone et moi',
    performer: null,
    prices: [0],
    priceMin: 0,
    priceMax: 0,
    showSubType: null,
    showType: null,
    speaker: null,
    stageDirector: null,
    stocksDateCreated: [1605790853.14518],
    thumbUrl:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/5AZQ',
    tags: ['Confinement2'],
    times: [],
    type: 'Regarder',
    visa: null,
    withdrawalDetails: null,
  },
  offerer: { name: 'FRANCE TELEVISIONS' },
  venue: { city: null, departementCode: null, name: 'Offre numérique', publicName: null },
  _geoloc: { lat: 47.158459, lng: 2.409289 },
  objectID: 'L972Q',
  _highlightResult: {
    offer: {
      description: {
        value:
          'Depuis, cinq ans, dans le cerveau de Bahia, tout bugge. Mobilité, élocution, coordination, en gros, « c’est la merde ». Du coup Bahia est obligée de faire équipe avec Simone. Ensemble, elles découvrent les joies du handicap ! Le parcours du combattant face à l’administration, les rendez-vous systématiquement ratés pour cause de retards intempestifs, les « dates » au 5ème sans ascenseur, et la merveilleuse ville de Paris où rien n’est fait, ou presque pour l’accessibilité des personnes « à mobilité réduite ». Heureusement, Bahia est épaulée par Tom, son coloc, et son très séduisant kiné…',
        matchLevel: 'none',
        matchedWords: [],
      },
      id: { value: 'L972Q', matchLevel: 'none', matchedWords: [] },
      label: { value: 'Film', matchLevel: 'none', matchedWords: [] },
      name: { value: 'Web série : Simone et moi', matchLevel: 'none', matchedWords: [] },
      type: { value: 'Regarder', matchLevel: 'none', matchedWords: [] },
    },
    offerer: { name: { value: 'FRANCE TELEVISIONS', matchLevel: 'none', matchedWords: [] } },
    venue: { name: { value: 'Offre numérique', matchLevel: 'none', matchedWords: [] } },
  },
}
