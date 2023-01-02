import { BusinessNatifModule } from 'libs/contentful/types'

export const businessNatifModuleFixture: BusinessNatifModule = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '20SId61p6EFTG7kgBTFrOa',
    type: 'Entry',
    createdAt: '2022-06-08T12:41:09.558Z',
    updatedAt: '2022-10-05T15:07:48.551Z',
    environment: {
      sys: {
        id: 'testing',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 3,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'business',
      },
    },
    locale: 'en-US',
  },
  fields: {
    title:
      'Crée un compte\u00a0! 15-18 [A MAINTENIR EN BLOC 2 et paramétré pour être visible seulement pour les non connectés]',
    firstLine: 'Débloque ton crédit\u00a0! ',
    secondLine: 'Termine ton inscription',
    image: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: '1uTePwMo6qxJo7bMM7VLeX',
        type: 'Asset',
        createdAt: '2022-11-10T17:15:29.312Z',
        updatedAt: '2022-11-10T17:19:54.202Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        revision: 3,
        locale: 'en-US',
      },
      fields: {
        title: 'wefrac',
        description: '',
        file: {
          url: '//images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
          details: {
            size: 100095,
            image: {
              width: 560,
              height: 800,
            },
          },
          fileName: '17-insta-1080x1350_560x800.jpg',
          contentType: 'image/jpeg',
        },
      },
    },
    url: 'https://passculture.app/creation-compte',
    targetNotConnectedUsersOnly: true,
  },
}
