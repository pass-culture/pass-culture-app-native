import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { SearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { GeoCoordinates } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'

export const useParseSearchParameters = () => {
  const availableCategories = useAvailableCategories()

  return useCallback(
    ({
      geolocation,
      parameters,
    }: {
      geolocation: GeoCoordinates | null
      parameters: SearchParametersFields
    }): Partial<SearchState> | undefined =>
      parseSearchParameters({ geolocation, parameters }, availableCategories),
    [availableCategories]
  )
}
