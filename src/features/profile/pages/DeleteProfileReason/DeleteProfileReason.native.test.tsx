import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { setSettings } from 'features/auth/tests/setSettings'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const signOutMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(signOutMock)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('features/auth/context/AuthContext')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<DeleteProfileReason />', () => {
  beforeEach(() => {
    jest.setSystemTime(new Date('2020-01-01'))
    setSettings()
  })

  it('should match snapshot', () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<DeleteProfileReason />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to ChangeEmail page with correct params when clicking on change email button', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<DeleteProfileReason />)

    await user.press(
      screen.getByText('J’aimerais créer un compte avec une adresse e-mail différente')
    )

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: {
        showModal: true,
      },
      screen: 'ChangeEmail',
    })
  })

  it('should redirect to Home page when clicking on "Autre" button', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<DeleteProfileReason />)

    await user.press(screen.getByText('Autre'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'DeleteProfileContactSupport',
    })
  })

  it('should log analytics when clicking on reasonButton', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<DeleteProfileReason />)

    await user.press(screen.getByText('Autre'))

    expect(analytics.logSelectDeletionReason).toHaveBeenNthCalledWith(1, 'other')
  })

  it.each`
    reason
    ${'Je n’utilise plus l’application'}
    ${'Je n’ai plus de crédit ou très peu de crédit restant'}
    ${'Je souhaite supprimer mes données personnelles'}
  `(
    'should redirect to DeleteProfileConfirmation page when clicking on $reason',
    async ({ reason }) => {
      mockAuthContextWithUser(nonBeneficiaryUser)
      render(<DeleteProfileReason />)

      await user.press(screen.getByText(reason))

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'DeleteProfileConfirmation',
      })
    }
  )

  describe('User is beneficiary', () => {
    it.each`
      reason
      ${'Je n’utilise plus l’application'}
      ${'Je n’ai plus de crédit ou très peu de crédit restant'}
      ${'Je souhaite supprimer mes données personnelles'}
    `(
      'should redirect to deleteprofileaccountnotdeletable page when clicking on $reason',
      async ({ reason }) => {
        mockAuthContextWithUser(beneficiaryUser)
        render(<DeleteProfileReason />)

        await user.press(screen.getByText(reason))

        expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
          params: undefined,
          screen: 'DeleteProfileAccountNotDeletable',
        })
      }
    )

    describe('User is more than 21 year old', () => {
      it.each`
        birthDate       | expectedRedirect
        ${'2002-02-02'} | ${'DeleteProfileConfirmation'}
        ${'2002-03-02'} | ${'DeleteProfileAccountNotDeletable'}
        ${'2002-02-05'} | ${'DeleteProfileAccountNotDeletable'}
        ${'2002-05-05'} | ${'DeleteProfileAccountNotDeletable'}
        ${'1999-01-01'} | ${'DeleteProfileConfirmation'}
      `(
        'should redirect to $expectedRedirect when user is born on $birthDate',
        async ({ birthDate, expectedRedirect }) => {
          jest.setSystemTime(new Date('2023-02-02'))
          mockAuthContextWithUser({ ...beneficiaryUser, birthDate })
          render(<DeleteProfileReason />)

          await user.press(screen.getByText('Je n’utilise plus l’application'))

          expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
            params: undefined,
            screen: expectedRedirect,
          })
        }
      )
    })
  })
})
