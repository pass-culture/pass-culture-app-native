import { renderHook } from '@testing-library/react-hooks'
import { Alert } from 'react-native'

import { getAvailableApps, navigate } from '__mocks__/react-native-launch-navigator'

import { useItinerary } from '../useItinerary'

const alertMock = jest.spyOn(Alert, 'alert')

describe('useItinerary', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns availableApps', async () => {
    const { result, waitFor } = renderHook(useItinerary)
    await waitFor(() => !!result.current.availableApps)
    expect(JSON.stringify(result.current.availableApps)).toBe(
      JSON.stringify(['google_maps', 'waze'])
    )
  })
  it('returns default availableApps in case of an error', async () => {
    getAvailableApps.mockImplementationOnce(() => Promise.reject(new Error('dummyError')))
    const { result, waitFor } = renderHook(useItinerary)
    await waitFor(() => !!result.current.availableApps)
    expect(JSON.stringify(result.current.availableApps)).toBe(JSON.stringify([]))
  })
  it('navigates with the right app if there is only one available app', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({ sygic: true, google_maps: false, waze: false, citymapper: false })
    )
    const { result, waitFor } = renderHook(useItinerary)
    await waitFor(() => !!result.current.availableApps)
    result.current.navigateTo({ latitude: 48.85837, longitude: 2.294481 })
    expect(navigate).toHaveBeenCalledWith([48.85837, 2.294481], { app: 'sygic' })
  })
  it('displays a modal with all the available apps if their count is geater than 1', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({ sygic: true, google_maps: false, waze: true, citymapper: false })
    )
    const { result, waitFor } = renderHook(useItinerary)
    await waitFor(() => !!result.current.availableApps)
    result.current.navigateTo({ latitude: 48.85837, longitude: 2.294481 })
    expect(alertMock).toHaveBeenCalledWith(
      "Voir l'itinéraire",
      "Choisissez l'application pour vous rendre sur le lieu de l'offre :",
      [
        { text: 'Sygic', onPress: expect.any(Function) },
        { text: 'Waze', onPress: expect.any(Function) },
      ]
    )

    // @ts-ignore: precedent expect garanties what follows
    const wazeAlertButton = alertMock.mock.calls[0][2][1]
    expect(wazeAlertButton.text).toBe('Waze')

    // @ts-ignore: same reason
    wazeAlertButton.onPress()
    expect(navigate).toHaveBeenCalledWith([48.85837, 2.294481], { app: 'waze' })
  })
})
