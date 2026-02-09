import { FeatureCollection, Point } from 'geojson'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { ChangeAddress } from 'features/profile/pages/ChangeAddress/ChangeAddress'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { Properties } from 'libs/place/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('libs/jwt/jwt')
jest.mock('libs/network/NetInfoWrapper')

const patchProfileSpy = jest.spyOn(API.api, 'patchNativeV1Profile')

const QUERY_ADDRESS = '1 rue Poissonnière'

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SetAddress/>', () => {
  beforeEach(() => {
    mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', beneficiaryUser)
    mockServer.universalGet<FeatureCollection<Point, Properties>>(
      'https://data.geopf.fr/geocodage/search',
      mockedSuggestedPlaces
    )
  })

  describe('without previous screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { type: undefined } })
    })

    it('should render correctly', async () => {
      renderSetAddress()
      await screen.findByText('Modifier mon adresse')
      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      expect(screen).toMatchSnapshot()
    })

    it('should display a list of addresses when user add an address', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await waitFor(() => {
        expect(
          screen.getByText(mockedSuggestedPlaces.features[0].properties.name)
        ).toBeOnTheScreen()
        expect(
          screen.getByText(mockedSuggestedPlaces.features[1].properties.name)
        ).toBeOnTheScreen()
        expect(
          screen.getByText(mockedSuggestedPlaces.features[2].properties.name)
        ).toBeOnTheScreen()
      })
    })

    it('should update profile when clicking on "Valider mon adresse"', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(patchProfileSpy).toHaveBeenNthCalledWith(1, {
        address: mockedSuggestedPlaces.features[1].properties.name,
      })
    })

    it('should navigate to PersonalData when clicking on "Valider mon adresse"', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'ProfileStackNavigator', {
        params: undefined,
        screen: 'PersonalData',
      })
    })

    it('should show snackbar on success when clicking on "Valider mon adresse"', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Ton adresse de résidence a bien été modifiée\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should send analytics when success', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(analytics.logUpdateAddress).toHaveBeenCalledWith({
        newAddress: mockedSuggestedPlaces.features[1].properties.name,
        oldAddress: '',
      })
    })
  })

  describe('from mandatory udpate personal data screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
      })
    })

    it('should render correctly', async () => {
      renderSetAddress()
      await screen.findByText('Modifier mon adresse')
      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      expect(screen).toMatchSnapshot()
    })

    it('should not show snackbar on success when clicking on "Continuer"', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Continuer'))

      expect(mockShowSuccessSnackBar).not.toHaveBeenCalled()
    })

    it('should navigate to ChangeStatus when clicking on "Continuer"', async () => {
      renderSetAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Continuer'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'ProfileStackNavigator', {
        params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
        screen: 'ChangeStatus',
      })
    })
  })
})

const renderSetAddress = () => {
  return render(reactQueryProviderHOC(<ChangeAddress />))
}
