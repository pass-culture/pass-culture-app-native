import { BusinessModule, HomepageModuleType } from 'features/home/types'
import { adaptBusinessModule } from 'libs/contentful/adapters/modules/adaptBusinessModule'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/businessModule.fixture'

describe('adaptBusinessModule', () => {
  it('should adapt a business module', () => {
    const formattedBusinessModule: BusinessModule = {
      type: HomepageModuleType.BusinessModule,
      id: '20SId61p6EFTG7kgBTFrOa',
      analyticsTitle:
        'Crée un compte\u00a0! 15-18 [A MAINTENIR EN BLOC 2 et paramétré pour être visible seulement pour les non connectés]',
      title: 'Débloque ton crédit\u00a0! ',
      subtitle: 'Termine ton inscription',
      shouldTargetNotConnectedUsers: true,
      url: 'https://passculture.app/creation-compte',
      image:
        'https://images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
      imageWeb:
        'https://images.ctfassets.net/2bg01iqy0isv/1jedJLjdDiypJqBtO1sjH0/185ee9e6428229a15d4c047b862a95f8/image_web.jpeg',
      localizationArea: { latitude: 2, longitude: 40, radius: 20 },
    }
    const rawBusinessModule = businessNatifModuleFixture

    expect(adaptBusinessModule(rawBusinessModule)).toEqual(formattedBusinessModule)
  })

  it('should return null when the module is not provided', () => {
    const rawBusinessModule = { ...businessNatifModuleFixture, fields: undefined }

    expect(adaptBusinessModule(rawBusinessModule)).toEqual(null)
  })
})
