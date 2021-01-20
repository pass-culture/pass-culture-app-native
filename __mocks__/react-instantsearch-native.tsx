import React from 'react'

const mockReactInstantSearch = jest.genMockFromModule('react-instantsearch-native')

const fakeHits = [
  {
    offer: {
      author: null,
      category: 'MUSIQUE',
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
  },
  {
    offer: {
      author: 'Catherine Mater',
      category: 'MUSIQUE',
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
  },
]

const connectStats = (Component) => () => <Component nbHits={fakeHits.length} />
const InstantSearch = ({ children }) => <React.Fragment>{children}</React.Fragment>
const Configure = () => <React.Fragment />

module.exports = {
  // @ts-ignore : the error is "Spread types may only be created from object types". Well the mock works anyway.
  ...mockReactInstantSearch,
  connectStats,
  InstantSearch,
  Configure,
}
