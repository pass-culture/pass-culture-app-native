import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { eventMonitoring } from 'libs/monitoring'
import { buildSuggestedAddresses } from 'libs/place'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { fireEvent, render, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('react-query')
const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ dispatch: mockDispatch }),
}))

const QUERY_ADDRESS = '1 rue Poissonnière'
let mockIsError = false
let mockAddresses: string[] = []
let mockIsLoading = false
const mockRemove = jest.fn()

jest.mock('libs/place/useAddresses', () => ({
  useAddresses: () => ({
    data: mockAddresses,
    isError: mockIsError,
    isLoading: mockIsLoading,
    refetch: jest.fn(() =>
      Promise.resolve({
        data: mockAddresses,
      })
    ),
    remove: mockRemove,
  }),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<SetAddress/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetAddress />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display a list of addresses when user add an address', async () => {
    mockAddresses = buildSuggestedAddresses(mockedSuggestedPlaces)
    const { getByText, getByPlaceholderText } = render(<SetAddress />)

    const input = getByPlaceholderText("Ex : 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      getByText(mockAddresses[0])
      getByText(mockAddresses[1])
      getByText(mockAddresses[2])
    })
  })

  it('should display a spinner if the results are still loading', () => {
    mockIsLoading = true
    const { queryByTestId } = render(<SetAddress />)
    queryByTestId('spinner')
  })

  it('should switch input label and remove list of addresses when user pick an address', async () => {
    mockAddresses = buildSuggestedAddresses(mockedSuggestedPlaces)
    const { getByText, queryByText, getByPlaceholderText } = render(<SetAddress />)

    const input = getByPlaceholderText("Ex : 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)

    queryByText('Recherche et sélectionne ton adresse')
    expect(queryByText('Adresse sélectionnée')).toBeFalsy()
    fireEvent.press(getByText(mockAddresses[0]))

    await waitFor(() => {
      expect(queryByText('Recherche et sélectionne ton adresse')).toBeFalsy()
      queryByText('Adresse sélectionnée')
      expect(mockRemove).toHaveBeenCalled()
    })
  })

  it('should save address when clicking on "Continuer"', async () => {
    mockAddresses = buildSuggestedAddresses(mockedSuggestedPlaces)
    const { getByText, getByPlaceholderText } = render(<SetAddress />)

    const input = getByPlaceholderText("Ex : 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)
    fireEvent.press(getByText(mockAddresses[0]))
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_ADDRESS',
        payload: mockAddresses[0],
      })
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('IdentityCheckStatus')
    })
  })

  it('should show the generic error message if the API call returns error', async () => {
    mockIsError = true
    const { getByPlaceholderText } = render(<SetAddress />)

    const input = getByPlaceholderText("Ex : 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`,
        timeout: 5000,
      })
      expect(eventMonitoring.captureException).toBeCalledWith(
        new IdentityCheckError(
          'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'
        )
      )
    })
  })
})
