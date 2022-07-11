import waitForExpect from 'wait-for-expect'

import { openGoogleMapsItinerary } from 'libs/itinerary/openGoogleMapsItinerary'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { renderHook, superFlushWithAct } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/itinerary/openGoogleMapsItinerary')
jest.mock('libs/itinerary/useItinerary', () => jest.requireActual('libs/itinerary/useItinerary'))

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

const address = '48.85837, 2.294481'

describe('useItinerary', () => {
  it('should open itinerary in google maps web', async () => {
    const { result } = renderHook(useItinerary)
    await superFlushWithAct()
    result.current.navigateTo(address)
    await waitForExpect(() => {
      expect(openGoogleMapsItinerary).toBeCalledWith(address)
    })
  })
})
