import { HighlightOfferModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { buildLocalization } from 'libs/contentful/adapters/modules/helpers/buildLocalization'
import { HighlightOfferContentModel } from 'libs/contentful/types'

export const adaptHighlightOfferModule = (
  module: HighlightOfferContentModel
): HighlightOfferModule | null => {
  if (module.fields === undefined) return null

  const offerImage = buildImageUrl(module.fields.offerImage.fields?.file.url)
  if (offerImage === undefined) return null

  const { offerId, offerTag, offerEan } = module.fields
  if (!offerId && !offerTag && !offerEan) return null

  const localizationArea = buildLocalization(
    module.fields.latitude,
    module.fields.longitude,
    module.fields.radius
  )

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
    displayBookingAllowedDatetime: module.fields.displayBookingAllowedDatetime,
    localizationArea,
  }
}
