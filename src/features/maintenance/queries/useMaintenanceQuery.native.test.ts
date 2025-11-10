import { useMaintenanceQuery } from 'features/maintenance/queries/useMaintenanceQuery'
import { getMaintenance } from 'libs/firebase/firestore/getMaintenance/getMaintenance'
import { MAINTENANCE } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/getMaintenance/getMaintenance')
const mockGetMaintenance = getMaintenance as jest.Mock

describe('useMaintenance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return unknown status when no data from firestore', async () => {
    mockGetMaintenance.mockReturnValueOnce({})

    const { result } = renderUseMaintenance()

    await act(() => {})

    await waitFor(() => {
      expect(result.current).toEqual({ message: undefined, status: MAINTENANCE.UNKNOWN })
    })
  })

  it('should return maintenance on status from firestore with default message', async () => {
    mockGetMaintenance.mockReturnValueOnce({ maintenanceIsOn: true })

    const { result } = renderUseMaintenance()

    await waitFor(() => {
      expect(result.current).toEqual({
        message:
          'L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!',
        status: MAINTENANCE.ON,
      })
    })
  })

  it('should return maintenance on status from firestore with firestore message', async () => {
    mockGetMaintenance.mockReturnValueOnce({
      maintenanceIsOn: true,
      message: 'Firestore maintenance message',
    })

    const { result } = renderUseMaintenance()

    await waitFor(() => {
      expect(result.current).toEqual({
        message: 'Firestore maintenance message',
        status: MAINTENANCE.ON,
      })
    })
  })

  it('should return maintenance off status from firestore with firestore message', async () => {
    mockGetMaintenance.mockReturnValueOnce({
      maintenanceIsOn: false,
    })

    const { result } = renderUseMaintenance()

    await waitFor(() => {
      expect(result.current).toEqual({
        status: MAINTENANCE.OFF,
      })
    })
  })
})

const renderUseMaintenance = () =>
  renderHook(useMaintenanceQuery, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
