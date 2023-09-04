import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { thematicHighlightModuleFixture } from 'libs/contentful/fixtures/thematicHighlightModule.fixture'
import { ThematicHighlightFields, isThematicHighlightContentModel } from 'libs/contentful/types'

import { adaptThematicHighlightModule } from './adaptThematicHighlightModule'

describe('adaptThematicHighlightModule', () => {
  it('should adapt an thematic highlight module', () => {
    const rawThematicHighlightModule = thematicHighlightModuleFixture

    expect(isThematicHighlightContentModel(rawThematicHighlightModule)).toBe(true)
    expect(adaptThematicHighlightModule(rawThematicHighlightModule)).toEqual(
      formattedThematicHighlightModule
    )
  })
  it('should return null when the module is not published', () => {
    const rawThematicHighlightModule = {
      ...thematicHighlightModuleFixture,
      fields: undefined,
    }

    expect(adaptThematicHighlightModule(rawThematicHighlightModule)).toEqual(null)
  })

  it('should return null when the Thematic Highlight Info module is not published', () => {
    const rawThematicHighlightModule = {
      ...thematicHighlightModuleFixture,
      fields: {
        ...(thematicHighlightModuleFixture.fields as ThematicHighlightFields),
        thematicHighlightInfo: {
          ...(thematicHighlightModuleFixture.fields as ThematicHighlightFields)
            .thematicHighlightInfo,
          fields: undefined,
        },
      },
    }

    expect(adaptThematicHighlightModule(rawThematicHighlightModule)).toEqual(null)
  })
})
