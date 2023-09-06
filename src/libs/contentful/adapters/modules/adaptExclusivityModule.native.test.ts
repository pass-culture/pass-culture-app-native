import { formattedExclusivityModule } from 'features/home/fixtures/homepage.fixture'
import { adaptExclusivityModule } from 'libs/contentful/adapters/modules/adaptExclusivityModule'
import { exclusivityNatifModuleFixture } from 'libs/contentful/fixtures/exclusivityModule.fixture'
import { isExclusivityContentModel } from 'libs/contentful/types'

describe('adaptExclusivityModule', () => {
  it('should adapt an exclusivity module', () => {
    const rawExclusivityNatifModule = exclusivityNatifModuleFixture

    expect(isExclusivityContentModel(rawExclusivityNatifModule)).toBe(true)
    expect(adaptExclusivityModule(rawExclusivityNatifModule)).toEqual(formattedExclusivityModule)
  })

  it('should return null when the module is not provided', () => {
    const rawExclusivityNatifModule = { ...exclusivityNatifModuleFixture, fields: undefined }

    expect(adaptExclusivityModule(rawExclusivityNatifModule)).toEqual(null)
  })
})
