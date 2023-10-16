import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { nonBeneficiaryUser } from 'fixtures/user'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { EighteenBirthday } from './EighteenBirthday'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

afterEach(() => {
  storage.clear('has_seen_eligible_card')
})

describe('<EighteenBirthday />', () => {
  it('should render eighteen birthday', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<EighteenBirthday />))
    expect(screen).toMatchSnapshot()
  })

  it('should set `has_seen_eligible_card` to true in storage', async () => {
    expect(await storage.readObject('has_seen_eligible_card')).toBe(null)

    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(await storage.readObject('has_seen_eligible_card')).toBe(true)
  })

  it('should navigate to Stepper on button press', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<EighteenBirthday />))

    fireEvent.press(screen.getByText('Confirmer mes informations'))
    expect(navigate).toHaveBeenCalledWith('Stepper', undefined)
  })

  it('should render right wording when user require IdCheck', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      user: { ...nonBeneficiaryUser, requiresIdCheck: true },
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(screen.getByText('Vérifie ton identité pour débloquer tes 300 €.')).toBeOnTheScreen()
    expect(screen.getByText('Vérifier mon identité')).toBeOnTheScreen()
  })
})
