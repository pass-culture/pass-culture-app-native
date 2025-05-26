import { useMemo } from 'react'

import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { Homepage } from 'features/home/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'

import { useGetHomepageListQuery } from '../queries/useGetHomepageListQuery'

const emptyHomepage: Homepage = {
  id: '-1',
  modules: [],
  tags: [],
}

export const useHomepageData = (paramsHomepageEntryId?: string): Homepage => {
  const selectHomepageEntry = useSelectHomepageEntry(paramsHomepageEntryId)
  const { logType } = useLogTypeFromRemoteConfig()

  // this fetches all homepages available in contentful
  const { data: homepages } = useGetHomepageListQuery(logType)

  const homepage = selectHomepageEntry(homepages ?? []) ?? emptyHomepage

  return useMemo(() => homepage, [homepage])
}
