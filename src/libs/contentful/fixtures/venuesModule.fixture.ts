import { ContentTypes, VenuesNatifModule } from 'libs/contentful/types'

// This fixture reflects the contentful data after the resolveResponse formatting
export const venuesNatifModuleFixture: VenuesNatifModule = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '105MMz59tftcxXJICXt7ja',
    type: 'Entry',
    createdAt: '2021-09-15T09:47:05.723Z',
    updatedAt: '2022-11-28T15:18:57.290Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 9,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'venuesPlaylist' } },
    locale: 'en-US',
  },
  fields: {
    title: 'Exemple de playlist de lieu',
    venuesSearchParameters: [
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '349gyyDhI60dqYrmQ9kUMC',
          type: 'Entry',
          createdAt: '2021-09-10T16:31:54.507Z',
          updatedAt: '2022-09-09T14:48:20.043Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          revision: 29,
          contentType: {
            sys: {
              type: 'Link',
              linkType: 'ContentType',
              id: ContentTypes.VENUES_PARAMETERS,
            },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Exemple de playlist de lieux',
          isGeolocated: false,
          venueTypes: [
            'Bibliothèque ou médiathèque',
            'Arts visuels, arts plastiques et galeries',
            'Centre culturel',
            'Cinéma - Salle de projections',
            'Cours et pratique artistiques',
            'Culture scientifique',
            'Festival',
            'Jeux / Jeux vidéos',
            'Librairie',
            'Magasin arts créatifs',
            'Musique - Disquaire',
            'Musique - Magasin d’instruments',
            'Musique - Salle de concerts',
            'Musée',
            'Offre numérique',
            'Patrimoine et tourisme',
            'Spectacle vivant',
            'Cinéma itinérant',
            'Autre type de lieu',
          ],
          hitsPerPage: 15,
        },
      },
    ],
    displayParameters: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: '2fqphBLJADhOYkkzPHvzcT',
        type: 'Entry',
        createdAt: '2020-07-28T14:19:35.878Z',
        updatedAt: '2022-07-26T06:58:31.177Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 41,
        contentType: {
          sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.DISPLAY_PARAMETERS },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Exemple de playlist de lieux',
        subtitle: "Ceci n'est pas une playlist de lieux",
        layout: 'one-item-medium',
        minOffers: 1,
      },
    },
  },
}
