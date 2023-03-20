import { Alert, Platform } from 'react-native'

import { getAvailableApps, navigate } from '__mocks__/react-native-launch-navigator'
import { openGoogleMapsItinerary } from 'libs/itinerary/openGoogleMapsItinerary'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { renderHook, waitFor, flushAllPromises } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const alertMock = jest.spyOn(Alert, 'alert')

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
  it('navigates with the right app if there is only one available app', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({ sygic: true, google_maps: false, waze: false, citymapper: false })
    )
    const { result } = renderHook(useItinerary)

    await waitFor(() => {
      result.current.navigateTo(address)

      expect(navigate).toHaveBeenCalledWith(address, { app: 'sygic' })
    })
  })

  it('displays a modal with all the available apps if their count is geater than 1', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({ sygic: true, google_maps: false, waze: true, citymapper: false })
    )
    Platform.OS = 'android'
    const { result } = renderHook(useItinerary)

    await waitFor(() => {
      result.current.navigateTo(address)

      expect(alertMock).toHaveBeenCalledWith(
        'Voir l’itinéraire',
        'Choisissez l’application pour vous rendre sur le lieu de l’offre\u00a0:',
        [
          { text: 'Sygic', onPress: expect.any(Function) },
          { text: 'Waze', onPress: expect.any(Function) },
        ],
        { cancelable: true }
      )
    })

    // @ts-expect-error: precedent expect garanties what follows
    const wazeAlertButton = alertMock.mock.calls[0][2][1]
    expect(wazeAlertButton.text).toBe('Waze')

    // @ts-expect-error: same reason
    wazeAlertButton.onPress()
    expect(navigate).toHaveBeenCalledWith('48.85837, 2.294481', { app: 'waze' })
  })

  it('should add a cancel button for iOS devices', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({ sygic: true, google_maps: false, waze: true, citymapper: false })
    )
    Platform.OS = 'ios'
    const { result } = renderHook(useItinerary)

    await waitFor(() => {
      result.current.navigateTo(address)
      expect(alertMock).toHaveBeenCalledWith(
        'Voir l’itinéraire',
        'Choisissez l’application pour vous rendre sur le lieu de l’offre\u00a0:',
        [
          { text: 'Sygic', onPress: expect.any(Function) },
          { text: 'Waze', onPress: expect.any(Function) },
          { text: 'Annuler', style: 'cancel' },
        ],
        { cancelable: true }
      )
    })
  })

  it('should open google maps web if no app is available', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({
        sygic: false,
        google_maps: false,
        waze: false,
        citymapper: false,
      })
    )
    const { result } = renderHook(useItinerary)

    await waitFor(() => {
      result.current.navigateTo(address)

      expect(openGoogleMapsItinerary).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate with google maps web if the lib failed and only one application was available', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({
        sygic: true,
        google_maps: false,
        waze: false,
        citymapper: false,
      })
    )
    navigate.mockImplementationOnce(() => Promise.reject(new Error('dummyError')))
    const { result } = renderHook(useItinerary)

    await waitFor(() => {
      result.current.navigateTo(address)

      expect(openGoogleMapsItinerary).toHaveBeenCalledTimes(1)
    })
  })

  it('should display an information snackbar if the lib failed and to open the chosen navigation app', async () => {
    getAvailableApps.mockImplementationOnce(() =>
      Promise.resolve({
        sygic: true,
        google_maps: false,
        waze: true,
        citymapper: false,
      })
    )
    navigate.mockImplementationOnce(() => Promise.reject(new Error('dummyError')))
    Platform.OS = 'android'
    const { result } = renderHook(useItinerary)

    await waitFor(() => {
      result.current.navigateTo(address)
      expect(alertMock).toHaveBeenCalledWith(
        'Voir l’itinéraire',
        'Choisissez l’application pour vous rendre sur le lieu de l’offre\u00a0:',
        [
          { text: 'Sygic', onPress: expect.any(Function) },
          { text: 'Waze', onPress: expect.any(Function) },
        ],
        { cancelable: true }
      )
    })

    // @ts-expect-error: precedent assertion garanties next line
    const { onPress: onWazePress } = alertMock.mock.calls[0][2][1]
    // @ts-expect-error: same reason
    onWazePress()

    await flushAllPromises()

    expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
      message:
        'Une erreur s’est produite, veuillez passer par une autre application de géolocalisation pour trouver l’itinéraire vers ce lieu.',
      timeout: 10000,
    })
  })
})
