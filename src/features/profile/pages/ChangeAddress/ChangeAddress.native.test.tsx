import { FeatureCollection, Point } from 'geojson'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { cityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { ChangeAddress } from 'features/profile/pages/ChangeAddress/ChangeAddress'
import { UserProfile } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { Properties } from 'libs/place/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('libs/network/NetInfoWrapper')

const patchProfileSpy = jest.spyOn(API.api, 'patchNativeV1Profile')

const QUERY_ADDRESS = '1 rue Poissonnière'
const city = {
  name: 'New city',
  code: '00001',
  postalCode: '00001',
  departementCode: '01',
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ChangeAddress/>', () => {
  beforeEach(() => {
    mockServer.patchApi<UserProfile>('/v1/profile', beneficiaryUser)
    mockServer.universalGet<FeatureCollection<Point, Properties>>(
      'https://data.geopf.fr/geocodage/search',
      mockedSuggestedPlaces
    )
  })

  describe.each([
    {
      type: PersonalDataTypes.PROFIL_PERSONAL_DATA,
      buttonWording: 'Valider mon adresse',
    },
    {
      type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA,
      buttonWording: 'Continuer',
    },
  ])('with change city as previous screen for $type', ({ type, buttonWording }) => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { type, city },
      })
    })

    it('should not update the city store before submitting the address', async () => {
      const setCitySpy = jest.spyOn(cityActions, 'setCity')

      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)
      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))

      expect(setCitySpy).not.toHaveBeenCalled()
    })

    it('should update store with the new city when submitting the address', async () => {
      const setCitySpy = jest.spyOn(cityActions, 'setCity')

      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)
      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText(buttonWording))

      expect(setCitySpy).toHaveBeenCalledWith(city)
    })

    it('should call patchProfile with address and city informations', async () => {
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)
      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText(buttonWording))

      expect(patchProfileSpy).toHaveBeenCalledWith({
        address: mockedSuggestedPlaces.features[1].properties.name,
        city: city.name,
        postalCode: city.postalCode,
      })
    })

    it('should send city analytics on success when submitting the address', async () => {
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)
      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText(buttonWording))

      expect(analytics.logUpdatePostalCode).toHaveBeenCalledWith({
        oldPostalCode: '',
        oldCity: '',
        newPostalCode: city.postalCode,
        newCity: city.name,
      })
    })

    it('should show snackbar on error when submitting the address', async () => {
      mockServer.patchApi<UserProfile>('/v1/profile', {
        responseOptions: { statusCode: 400 },
      })
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)
      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText(buttonWording))

      expect(await screen.findByTestId('snackbar-error')).toBeOnTheScreen()
      expect(screen.getByText('Une erreur est survenue')).toBeOnTheScreen()
      expect(screen.queryByTestId('snackbar-success')).toBeNull()
      expect(analytics.logUpdatePostalCode).not.toHaveBeenCalled()
    })
  })

  describe('from profile personal data via change city', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { type: PersonalDataTypes.PROFIL_PERSONAL_DATA, city } })
    })

    it('should render correctly', async () => {
      renderChangeAddress()
      await screen.findByText('Modifier mon adresse')
      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      expect(screen).toMatchSnapshot()
    })

    it('should display a list of addresses when user add an address', async () => {
      renderChangeAddress()

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
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(patchProfileSpy).toHaveBeenNthCalledWith(1, {
        address: mockedSuggestedPlaces.features[1].properties.name,
        city: city.name,
        postalCode: city.postalCode,
      })
    })

    it('should navigate to PersonalData when clicking on "Valider mon adresse"', async () => {
      renderChangeAddress()

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
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(screen.getByTestId('snackbar-success')).toBeOnTheScreen()
      expect(
        screen.getByText('Ton adresse de résidence a bien été modifiée\u00a0!')
      ).toBeOnTheScreen()
    })

    it('should send analytics when success', async () => {
      renderChangeAddress()

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

  describe('from mandatory update personal data via change city', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA, city },
      })
    })

    it('should render correctly', async () => {
      renderChangeAddress()
      await screen.findByText('Modifier mon adresse')
      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      expect(screen).toMatchSnapshot()
    })

    it('should not show snackbar on success when clicking on "Continuer"', async () => {
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Continuer'))

      expect(screen.queryByTestId('snackbar-success')).toBeNull()
    })

    it('should navigate to ChangeStatus when clicking on "Continuer"', async () => {
      renderChangeAddress()

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

  describe('from check address screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { type: PersonalDataTypes.CHECK_ADDRESS },
      })
    })

    it('should navigate back to CheckAddress with the change address origin', async () => {
      renderChangeAddress()

      const input = screen.getByTestId('Entrée pour l’adresse')
      fireEvent.changeText(input, QUERY_ADDRESS)

      await user.press(await screen.findByText(mockedSuggestedPlaces.features[1].properties.name))
      await user.press(screen.getByText('Valider mon adresse'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'SubscriptionStackNavigator', {
        params: { fromChangeAddress: true },
        screen: 'CheckAddress',
      })
    })
  })
})

const renderChangeAddress = () => {
  return render(reactQueryProviderHOC(<ChangeAddress />))
}
