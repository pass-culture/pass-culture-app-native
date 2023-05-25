import { ExclusivityModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { parseStringToNumber } from 'libs/contentful/adapters/helpers/parseStringToNumber'
import { ExclusivityContentModel } from 'libs/contentful/types'

export const adaptExclusivityModule = (
  modules: ExclusivityContentModel
): ExclusivityModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (modules.fields === undefined) return null

  const image = buildImageUrl(modules.fields.image.fields?.file.url)
  if (image === undefined) return null

  return {
    type: HomepageModuleType.ExclusivityModule,
    id: modules.sys.id,
    title: modules.fields.title,
    alt: modules.fields.alt,
    image,
    url: modules.fields.url,
    displayParameters: modules.fields.displayParameters?.fields
      ? {
          aroundRadius: modules.fields.displayParameters?.fields.aroundRadius,
          isGeolocated: modules.fields.displayParameters?.fields.isGeolocated,
        }
      : undefined,
    offerId: parseStringToNumber(modules.fields.offerId),
  }
}
