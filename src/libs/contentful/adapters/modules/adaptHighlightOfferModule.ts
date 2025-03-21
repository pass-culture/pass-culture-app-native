import { HighlightOfferModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { HighlightOfferContentModel } from 'libs/contentful/types'

import { ContentfulAdapter } from '../contentfulAdapters'

export const adaptHighlightOfferModule: ContentfulAdapter<
  HighlightOfferContentModel,
  HighlightOfferModule
> = (module) => {
  if (module.fields === undefined) return null

  const offerImage = buildImageUrl(module.fields.offerImage.fields?.file.url)
  if (offerImage === undefined) return null

  const { offerId, offerTag, offerEan } = module.fields
  if (!offerId && !offerTag && !offerEan) return null

  return {
    type: HomepageModuleType.HighlightOfferModule,
    id: module.sys.id,
    highlightTitle: module.fields.highlightTitle,
    offerTitle: module.fields.offerTitle,
    offerId,
    offerTag,
    offerEan,
    image: offerImage,
    color: module.fields.color,
    isGeolocated: module.fields.isGeolocated,
    aroundRadius: module.fields.aroundRadius,
    displayPublicationDate: module.fields.displayPublicationDate,
  }
}
