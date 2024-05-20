import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { VenuesModule } from 'features/home/types'
import { adaptAppV2VenuesModule } from 'libs/contentful/adapters/modules/adaptAppV2VenuesModule'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import { VenuesFields, isVenuesContentModel } from 'libs/contentful/types'

describe('adaptAppV2VenuesModule', () => {
  it('should adapt a venues module app v2', () => {
    const rawVenuesModule = venuesNatifModuleFixture

    const formattedVenuesModuleWithoutSubtitle: VenuesModule = {
      ...formattedVenuesModule,
      displayParameters: {
        ...formattedVenuesModule.displayParameters,
        subtitle: undefined,
      },
    }

    expect(isVenuesContentModel(rawVenuesModule)).toBe(true)
    expect(adaptAppV2VenuesModule(rawVenuesModule)).toEqual(formattedVenuesModuleWithoutSubtitle)
  })

  it('should return null when the module is not provided', () => {
    const rawVenuesModule = { ...venuesNatifModuleFixture, fields: undefined }

    expect(adaptAppV2VenuesModule(rawVenuesModule)).toEqual(null)
  })

  it('should return null when the Display Parameters module is not provided', () => {
    const rawVenuesModule = {
      ...venuesNatifModuleFixture,
      fields: {
        ...(venuesNatifModuleFixture.fields as VenuesFields),
        displayParameters: {
          ...(venuesNatifModuleFixture.fields as VenuesFields).displayParameters,
          fields: undefined,
        },
      },
    }

    expect(adaptAppV2VenuesModule(rawVenuesModule)).toEqual(null)
  })
})
