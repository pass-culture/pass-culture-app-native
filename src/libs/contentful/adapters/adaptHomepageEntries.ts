import {
  CategoryThematicHeader,
  DefaultThematicHeader,
  HighlightThematicHeader,
  Homepage,
  ThematicHeaderType,
} from 'features/home/types'
import { adaptHomepageNatifModules } from 'libs/contentful/adapters/adaptHomepageModules'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import {
  HomepageNatifEntry,
  isThematicCategoryInfo,
  isThematicHighlightInfo,
} from 'libs/contentful/types'

const adaptThematicHeader = (homepageEntry: HomepageNatifEntry) => {
  const thematicHeader = homepageEntry.fields.thematicHeader

  if (isThematicHighlightInfo(thematicHeader)) {
    const thematicHeaderFields = thematicHeader.fields
    return {
      type: ThematicHeaderType.Highlight,
      title: thematicHeaderFields.displayedTitle,
      subtitle: thematicHeaderFields.displayedSubtitle,
      imageUrl: buildImageUrl(thematicHeaderFields.image.fields.file.url),
      beginningDate: new Date(thematicHeaderFields.beginningDatetime),
      endingDate: new Date(thematicHeaderFields.endingDatetime),
      introductionTitle: thematicHeaderFields.introductionTitle,
      introductionParagraph: thematicHeaderFields.introductionParagraph,
    } as HighlightThematicHeader
  }

  if (isThematicCategoryInfo(thematicHeader)) {
    const thematicHeaderFields = thematicHeader.fields
    return {
      type: ThematicHeaderType.Category,
      title: thematicHeaderFields.displayedTitle,
      subtitle: thematicHeaderFields.displayedSubtitle,
      imageUrl: buildImageUrl(thematicHeaderFields.image.fields.file.url),
    } as CategoryThematicHeader
  }

  return {
    type: ThematicHeaderType.Default,
    title: homepageEntry.fields.thematicHeaderTitle,
    subtitle: homepageEntry.fields.thematicHeaderSubtitle,
  } as DefaultThematicHeader
}

export const adaptHomepageEntries = (homepageNatifEntries: HomepageNatifEntry[]): Homepage[] => {
  return homepageNatifEntries.map((entry) => ({
    tags: entry.metadata.tags.map((tag) => tag.sys.id),
    id: entry.sys.id,
    modules: adaptHomepageNatifModules(entry.fields.modules),
    thematicHeader: adaptThematicHeader(entry),
  }))
}
