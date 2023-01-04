import { ThematicHighlightModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { ThematicHighlightContentModel } from 'libs/contentful/types'

export const adaptThematicHighlightModule = (
  module: ThematicHighlightContentModel
): ThematicHighlightModule => {
  const imageUrl = buildImageUrl(module.fields.image?.fields.file.url)
  return {
    id: module.sys.id,
    type: HomepageModuleType.ThematicHighlightModule,
    title: module.fields.displayedTitle,
    subtitle: module.fields.displayedSubtitle,
    imageUrl,
    beginningDate: new Date(module.fields.beginningDatetime),
    endingDate: new Date(module.fields.endingDatetime),
    thematicHomeEntryId: module.fields.thematicHomeEntryId,
  }
}
