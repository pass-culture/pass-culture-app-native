import { formattedAppV2VenuesModule } from 'features/home/fixtures/homepage.fixture'
import { AppV2VenuesModule } from 'features/home/types'
import { adaptAppV2VenuesModule } from 'libs/contentful/adapters/modules/adaptAppV2VenuesModule'
import { appV2VenuesNatifModuleFixture } from 'libs/contentful/fixtures/appV2VenuesModule.fixture'
import { VenuesFields } from 'libs/contentful/types'

describe('adaptAppV2VenuesModule', () => {
  it('should adapt a venues module app v2', () => {
    const rawVenuesModule = appV2VenuesNatifModuleFixture

    const formattedVenuesModuleWithoutSubtitle: AppV2VenuesModule = {
      ...formattedAppV2VenuesModule,
      displayParameters: {
        ...formattedAppV2VenuesModule.displayParameters,
        subtitle: undefined,
      },
    }

    expect(adaptAppV2VenuesModule(rawVenuesModule)).toEqual(formattedVenuesModuleWithoutSubtitle)
  })

  it('should return null when the module is not provided', () => {
    const rawVenuesModule = { ...appV2VenuesNatifModuleFixture, fields: undefined }

    expect(adaptAppV2VenuesModule(rawVenuesModule)).toEqual(null)
  })

  it('should return null when the Display Parameters module is not provided', () => {
    const rawVenuesModule = {
      ...appV2VenuesNatifModuleFixture,
      fields: {
        ...(appV2VenuesNatifModuleFixture.fields as VenuesFields),
        displayParameters: {
          ...(appV2VenuesNatifModuleFixture.fields as VenuesFields).displayParameters,
          fields: undefined,
        },
        homeEntryId: '70xmxMWxWSq94gnRYh1uDi',
      },
    }

    expect(adaptAppV2VenuesModule(rawVenuesModule)).toEqual(null)
  })
})
