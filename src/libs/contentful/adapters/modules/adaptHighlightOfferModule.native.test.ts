import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { adaptHighlightOfferModule } from 'libs/contentful/adapters/modules/adaptHighlightOfferModule'
import { highlightOfferContentModelFixture } from 'libs/contentful/fixtures/highlightOfferContentModel.fixture'

describe('adaptHighlightOfferModule', () => {
  it('should adapt from Contentful data', () => {
    expect(adaptHighlightOfferModule(highlightOfferContentModelFixture)).toEqual(
      highlightOfferModuleFixture
    )
  })
})
