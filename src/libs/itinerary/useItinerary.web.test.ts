import { openGoogleMapsItinerary } from 'libs/itinerary/openGoogleMapsItinerary'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { renderHook, waitFor } from 'tests/utils/web'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/itinerary/openGoogleMapsItinerary')

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
    result.current.navigateTo(address)
    await waitFor(() => {
      expect(openGoogleMapsItinerary).toHaveBeenCalledWith(address)
    })
  })
})
