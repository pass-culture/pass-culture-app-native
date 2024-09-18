import { GetHomeData } from 'features/home/api/useHomepageData'
import { Homepage } from 'features/home/types'
import { createAdaptHomepageEntries } from 'libs/contentful/adapters/adaptHomepageEntries'
import { ContentTypes, HomepageNatifEntry } from 'libs/contentful/types'

import { ContentfulAdapterFactory } from './adapters/ContentfulAdapterFactory'
import { Contentful } from './contentful'

export type ContentfulGetHomeData = ReturnType<typeof createContentfulGetHomeData>

export const createContentfulGetHomeData =
  (adapterFactory: ContentfulAdapterFactory, contentful: Contentful): GetHomeData =>
  async (): Promise<Homepage[]> => {
    const homepageNatifList = await contentful.getEntries<HomepageNatifEntry[]>({
      contentType: ContentTypes.HOMEPAGE_NATIF,
      depthLevel: 3,
    })
    return createAdaptHomepageEntries(adapterFactory)(homepageNatifList)
  }
