import { buildFreeDigitalOffersModule } from 'features/generalPublicHome/helpers/buildFreeDigitalOffersModule'
import { HomepageModuleType } from 'features/home/types'

describe('buildFreeDigitalOffersModule', () => {
  it('should build an offers module of free podcasts', () => {
    const module = buildFreeDigitalOffersModule('podcasts')

    expect(module).toEqual({
      type: HomepageModuleType.OffersModule,
      id: 'generalPublicHome-podcasts',
      title: 'À écouter',
      displayParameters: {
        title: 'À écouter',
        subtitle: 'Des podcasts gratuits',
        layout: 'three-items',
        minOffers: 1,
      },
      offersModuleParameters: [
        {
          title: 'À écouter',
          priceMin: 0,
          priceMax: 0,
          subcategories: ['Podcast'],
          hitsPerPage: 20,
        },
      ],
    })
  })

  it('should filter the videos on the online audiovisual subcategories', () => {
    const module = buildFreeDigitalOffersModule('videos')

    expect(module.id).toBe('generalPublicHome-videos')
    expect(module.displayParameters.title).toBe('À regarder')
    expect(module.offersModuleParameters[0]?.subcategories).toEqual([
      'Vidéo à la demande',
      'Visite virtuelle',
      'Captation musicale',
    ])
  })

  it('should neither constrain the dates nor the location', () => {
    const [parameters] = buildFreeDigitalOffersModule('podcasts').offersModuleParameters

    expect(parameters).not.toHaveProperty('beginningDatetime')
    expect(parameters).not.toHaveProperty('endingDatetime')
    expect(parameters).not.toHaveProperty('isGeolocated')
  })
})
