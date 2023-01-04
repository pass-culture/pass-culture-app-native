import { Homepage } from 'features/home/types'
import { adaptHomepageNatifModules } from 'libs/contentful/adapters/adaptHomepageModules'
import { HomepageNatifEntry } from 'libs/contentful/types'

export const adaptHomepageNatifEntries = (
  homepageNatifEntries: HomepageNatifEntry[]
): Homepage[] => {
  return homepageNatifEntries.map((entry) => ({
    tags: entry.metadata.tags,
    id: entry.sys.id,
    modules: adaptHomepageNatifModules(entry.fields.modules),
    thematicHeader: {
      title: entry.fields.thematicHeaderTitle,
      subtitle: entry.fields.thematicHeaderSubtitle,
    },
  }))
}
