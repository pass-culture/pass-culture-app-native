import { formattedExclusivityModule } from 'features/home/fixtures/homepage.fixture'
import { adaptExclusivityModule } from 'libs/contentful/adapters/modules/adaptExclusivityModule'
import { exclusivityNatifModuleFixture } from 'libs/contentful/fixtures/exclusivityModule.fixture'

describe('adaptExclusivityModule', () => {
  it('should adapt an exclusivity module', () => {
    const rawExclusivityNatifModule = exclusivityNatifModuleFixture

    expect(adaptExclusivityModule(rawExclusivityNatifModule)).toEqual(formattedExclusivityModule)
  })

  it('should return null when the module is not provided', () => {
    const rawExclusivityNatifModule = { ...exclusivityNatifModuleFixture, fields: undefined }

    expect(adaptExclusivityModule(rawExclusivityNatifModule)).toEqual(null)
  })
})
