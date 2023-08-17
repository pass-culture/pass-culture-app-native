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

const adaptDefaultHeader = (homepageEntry: HomepageNatifEntry): DefaultThematicHeader => ({
  type: ThematicHeaderType.Default,
  title: homepageEntry.fields.thematicHeaderTitle,
  subtitle: homepageEntry.fields.thematicHeaderSubtitle,
})

const adaptThematicHeader = (homepageEntry: HomepageNatifEntry) => {
  const thematicHeader = homepageEntry.fields.thematicHeader

  if (isThematicHighlightInfo(thematicHeader)) {
    const thematicHeaderFields = thematicHeader.fields
    // if a mandatory module is unpublished/deleted, we can't handle the header, so we return the default one
    if (thematicHeaderFields?.image.fields === undefined) return adaptDefaultHeader(homepageEntry)

    const highlightThematicHeader: HighlightThematicHeader = {
      type: ThematicHeaderType.Highlight,
      title: thematicHeaderFields.displayedTitle,
      subtitle: thematicHeaderFields.displayedSubtitle,
      imageUrl: buildImageUrl(thematicHeaderFields.image.fields.file.url),
      beginningDate: new Date(thematicHeaderFields.beginningDatetime),
      endingDate: new Date(thematicHeaderFields.endingDatetime),
      introductionTitle: thematicHeaderFields.introductionTitle,
      introductionParagraph: thematicHeaderFields.introductionParagraph,
    }
    return highlightThematicHeader
  }

  if (isThematicCategoryInfo(thematicHeader)) {
    const thematicHeaderFields = thematicHeader.fields
    // if a mandatory module is unpublished/deleted, we can't handle the header, so we return the default one
    if (thematicHeaderFields?.image.fields === undefined) return adaptDefaultHeader(homepageEntry)

    const categoryThematicHeader: CategoryThematicHeader = {
      type: ThematicHeaderType.Category,
      title: thematicHeaderFields.displayedTitle,
      subtitle: thematicHeaderFields.displayedSubtitle,
      imageUrl: buildImageUrl(thematicHeaderFields.image.fields.file.url),
    }
    return categoryThematicHeader
  }

  return adaptDefaultHeader(homepageEntry)
}

export const adaptHomepageEntries = (homepageNatifEntries: HomepageNatifEntry[]): Homepage[] => {
  return homepageNatifEntries.map((entry) => ({
    tags: entry.metadata.tags.map((tag) => tag.sys.id),
    id: entry.sys.id,
    modules: adaptHomepageNatifModules(entry.fields.modules),
    thematicHeader: adaptThematicHeader(entry),
  }))
}
