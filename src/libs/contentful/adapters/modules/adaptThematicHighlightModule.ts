import { ThematicHighlightModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { ThematicHighlightContentModel } from 'libs/contentful/types'

import { ContentfulAdapter } from '../contentfulAdapters'

export const adaptThematicHighlightModule: ContentfulAdapter<
  ThematicHighlightContentModel,
  ThematicHighlightModule
> = (module) => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields === undefined) return null

  const thematicHighlightInfo = module.fields.thematicHighlightInfo.fields
  if (thematicHighlightInfo === undefined) return null

  const imageUrl = buildImageUrl(thematicHighlightInfo.image.fields?.file.url)
  if (imageUrl === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.ThematicHighlightModule,
    title: thematicHighlightInfo.displayedTitle,
    subtitle: thematicHighlightInfo.displayedSubtitle,
    imageUrl,
    beginningDate: new Date(thematicHighlightInfo.beginningDatetime),
    endingDate: new Date(thematicHighlightInfo.endingDatetime),
    toThematicHomeEntryId: module.fields.thematicHomeEntryId,
  }
}
