import { ThematicHighlightModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { ThematicHighlightContentModel } from 'libs/contentful/types'

export const adaptThematicHighlightModule = (
  module: ThematicHighlightContentModel
): ThematicHighlightModule => {
  const thematicHighlightInfo = module.fields.thematicHighlightInfo.fields
  const imageUrl = buildImageUrl(thematicHighlightInfo.image?.fields.file.url)

  return {
    id: module.sys.id,
    type: HomepageModuleType.ThematicHighlightModule,
    title: thematicHighlightInfo.displayedTitle,
    subtitle: thematicHighlightInfo.displayedSubtitle,
    imageUrl,
    beginningDate: new Date(thematicHighlightInfo.beginningDatetime),
    endingDate: new Date(thematicHighlightInfo.endingDatetime),
    thematicHomeEntryId: module.fields.thematicHomeEntryId,
  }
}
