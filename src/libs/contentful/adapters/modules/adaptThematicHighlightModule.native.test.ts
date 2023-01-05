import { formattedThematicHighlightModule } from 'features/home/fixtures/homepage.fixture'
import { thematicHighlightModuleFixture } from 'libs/contentful/fixtures/thematicHighlightModule.fixture'
import { isThematicHighlightContentModel } from 'libs/contentful/types'

import { adaptThematicHighlightModule } from './adaptThematicHighlightModule'

describe('adaptThematicHighlightModule', () => {
  it('should adapt an thematic highlight module', () => {
    const rawThematicHighlightModule = thematicHighlightModuleFixture

    expect(isThematicHighlightContentModel(rawThematicHighlightModule)).toBeTruthy()
    expect(adaptThematicHighlightModule(rawThematicHighlightModule)).toEqual(
      formattedThematicHighlightModule
    )
  })
})
