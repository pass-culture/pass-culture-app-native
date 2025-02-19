import { UseQueryResult } from 'react-query'

import * as useVenuesInRegionQuery from 'features/venueMap/useVenuesInRegionQuery'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useGetVenuesInRegion } from './useGetVenuesInRegion'

jest
  .spyOn(useVenuesInRegionQuery, 'useVenuesInRegionQuery')
  .mockReturnValue({ data: venuesFixture } as UseQueryResult)

const mockRegion = {
  latitude: 48.8566,
  latitudeDelta: 0.07799560849023598,
  longitude: 2.3522,
  longitudeDelta: 0.06773949313991143,
}

describe('useGetVenuesInRegion', () => {
  it('should return venues in region when no venue is selected', async () => {
    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current).toStrictEqual(venuesFixture))
  })
})
