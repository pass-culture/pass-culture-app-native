import { Homepage, ThematicHeaderType } from 'features/home/types'
import { adaptHomepageNatifModules } from 'libs/contentful/adapters/adaptHomepageModules'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { HomepageNatifEntry } from 'libs/contentful/types'

const adaptThematicHeader = (homepageEntry: HomepageNatifEntry) => {
  const thematicHighlightInfo = homepageEntry.fields.thematicHeader?.fields

  if (thematicHighlightInfo) {
    return {
      type: ThematicHeaderType.Highlight,
      title: thematicHighlightInfo.displayedTitle,
      subtitle: thematicHighlightInfo.displayedSubtitle,
      imageUrl: buildImageUrl(thematicHighlightInfo.image.fields.file.url),
      beginningDate: new Date(thematicHighlightInfo.beginningDatetime),
      endingDate: new Date(thematicHighlightInfo.endingDatetime),
    }
  }

  return {
    type: ThematicHeaderType.Default,
    title: homepageEntry.fields.thematicHeaderTitle,
    subtitle: homepageEntry.fields.thematicHeaderSubtitle,
  }
}

export const adaptHomepageEntries = (homepageNatifEntries: HomepageNatifEntry[]): Homepage[] => {
  return homepageNatifEntries.map((entry) => ({
    tags: entry.metadata.tags.map((tag) => tag.sys.id),
    id: entry.sys.id,
    modules: adaptHomepageNatifModules(entry.fields.modules),
    thematicHeader: adaptThematicHeader(entry),
  }))
}
