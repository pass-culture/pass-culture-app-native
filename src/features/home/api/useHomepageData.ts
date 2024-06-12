import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { NoContentError } from 'features/home/pages/NoContentError'
import { Homepage } from 'features/home/types'
import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { ScreenError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CONTENTFUL = 5 * 60 * 1000

const getHomepageNatifContent = async () => {
  try {
    return await fetchHomepageNatifContent()
  } catch (e) {
    const error = e as Error
    throw new ScreenError(error.message, { Screen: NoContentError })
  }
}
const useGetHomepageList = () => {
  const { data: homepages } = useQuery<Homepage[]>(
    [QueryKeys.HOMEPAGE_MODULES],
    getHomepageNatifContent,
    {
      staleTime: STALE_TIME_CONTENTFUL,
    }
  )
  return homepages
}

const emptyHomepage: Homepage = {
  id: '-1',
  modules: [],
  tags: [],
}
export const useHomepageData = (paramsHomepageEntryId?: string): Homepage => {
  const selectHomepageEntry = useSelectHomepageEntry(paramsHomepageEntryId)
  // this fetches all homepages available in contentful
  const homepages = useGetHomepageList()

  const homepage = selectHomepageEntry(homepages ?? []) ?? emptyHomepage

  return useMemo(() => homepage, [homepage])
}
