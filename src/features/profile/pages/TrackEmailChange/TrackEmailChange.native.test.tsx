import React from 'react'

import { EmailHistoryEventTypeEnum, EmailUpdateStatusResponse } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { nonBeneficiaryUser } from 'fixtures/user'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
const mockUseAuthContext = jest.fn().mockReturnValue({ user: nonBeneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('TrackEmailChange', () => {
  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      hasRecentlyResetPassword: false,
    })
    render(reactQueryProviderHOC(<TrackEmailChange />))

    await user.press(await screen.findByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  describe('v2', () => {
    describe('account with password', () => {
      it('should render correctly when confirmation step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Confirme ta demande')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when choose new email step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.CONFIRMATION,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Choisis ta nouvelle adresse e-mail')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when validate new email step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: 'johndoe@gmail.com',
          status: EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Valide ta nouvelle adresse')

        expect(screen).toMatchSnapshot()
      })
    })

    describe('account without password (sso)', () => {
      beforeEach(() =>
        mockUseAuthContext.mockReturnValue({ user: { ...nonBeneficiaryUser, hasPassword: false } })
      )

      afterAll(() => mockUseAuthContext.mockReturnValue({ user: nonBeneficiaryUser }))

      it('should render correctly when confirmation step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Confirme ta demande')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when new password step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.CONFIRMATION,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Crée ton mot de passe')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when choose new email step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.CONFIRMATION,
          hasRecentlyResetPassword: true,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Choisis ta nouvelle adresse e-mail')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when validate new email step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: 'johndoe@gmail.com',
          status: EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION,
          hasRecentlyResetPassword: true,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Valide ta nouvelle adresse')

        expect(screen).toMatchSnapshot()
      })
    })
  })
})
