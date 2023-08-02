import { highlightOfferModuleFixture } from 'features/home/fixtures/highlightOfferModule.fixture'
import { adaptHighlightOfferModule } from 'libs/contentful/adapters/modules/adaptHighlightOfferModule'
import { highlightOfferContentModelFixture } from 'libs/contentful/fixtures/highlightOfferContentModel.fixture'
import { HighlightOfferContentModel } from 'libs/contentful/types'

describe('adaptHighlightOfferModule', () => {
  it('should adapt from Contentful data', () => {
    expect(adaptHighlightOfferModule(highlightOfferContentModelFixture)).toEqual(
      highlightOfferModuleFixture
    )
  })

  it('should return null when no offer ID, offer tag or offer ean is provided', () => {
    const fixtureWithoutIDTagEAN = {
      ...highlightOfferContentModelFixture,
      fields: {
        ...highlightOfferContentModelFixture.fields,
        offerEan: undefined,
        offerId: undefined,
        offerTag: undefined,
      },
    } as HighlightOfferContentModel

    expect(adaptHighlightOfferModule(fixtureWithoutIDTagEAN)).toBeNull()
  })
})
