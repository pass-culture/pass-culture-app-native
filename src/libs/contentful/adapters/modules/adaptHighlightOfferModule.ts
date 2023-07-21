import { HighlightOfferModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { HighlightOfferContentModel } from 'libs/contentful/types'

export const adaptHighlightOfferModule = (
  module: HighlightOfferContentModel
): HighlightOfferModule | null => {
  if (module.fields === undefined) return null

  const offerImage = buildImageUrl(module.fields.offerImage.fields?.file.url)
  if (offerImage === undefined) return null

  return {
    type: HomepageModuleType.HighlightOfferModule,
    id: module.sys.id,
    highlightTitle: module.fields.highlightTitle,
    offerTitle: module.fields.offerTitle,
    offerId: module.fields.offerId,
    image: offerImage,
    color: module.fields.color,
  }
}
