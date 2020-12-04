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
