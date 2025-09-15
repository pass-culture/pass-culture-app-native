import React from 'react'

import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { storage } from 'libs/storage'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { SubscribeButtonWithModals } from './SubscribeButtonWithModals'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
  }),
}))

jest
  .spyOn(useMapSubscriptionHomeIdsToThematic, 'useMapSubscriptionHomeIdsToThematic')
  .mockReturnValue(SubscriptionTheme.CINEMA)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('SubscribeButtonWithModals', () => {
  beforeEach(() => {
    storage.clear('times_user_subscribed_to_a_theme')
  })

  it('should open logged out modal when user is not logged in', async () => {
    mockAuthContextWithoutUser()

    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    // userEvent.press is not working correctly (MSW warning)
    // eslint-disable-next-line local-rules/no-fireEvent
    await act(async () => fireEvent.press(screen.getByText('Suivre')))

    expect(screen.getByText('Identifie-toi pour t’abonner à un thème')).toBeOnTheScreen()
  })

  it('should show inactive SubscribeButton when user is logged in and not subscribed yet', async () => {
    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    expect(await screen.findByText('Suivre')).toBeOnTheScreen()
  })

  it('should show active SubscribeButton when user is logged in and already subscribed', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.CINEMA],
      },
    })

    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    expect(await screen.findByText('Déjà suivi')).toBeOnTheScreen()
  })

  it('should show notifications settings modal when user has no notifications activated and click on subscribe button', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: false,
        marketingPush: false,
        subscribedThemes: [],
      },
    })

    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    // userEvent.press is not working correctly (MSW warning)
    // eslint-disable-next-line local-rules/no-fireEvent
    await act(async () => fireEvent.press(screen.getByText('Suivre')))

    expect(screen.getByText('Autoriser l’envoi d’e-mails')).toBeOnTheScreen()
  })

  it('should show unsubscribe modal when user is already subscribed and click on subscribe button', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.CINEMA],
      },
    })

    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    // userEvent.press is not working correctly (MSW warning)
    // eslint-disable-next-line local-rules/no-fireEvent
    await act(async () => fireEvent.press(screen.getByText('Déjà suivi')))

    expect(
      screen.getByText('Es-tu sûr de ne plus vouloir suivre ce thème\u00a0?')
    ).toBeOnTheScreen()
  })

  it('should show subscription success modal when user subscribe to a thematic for the second time', async () => {
    mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', {})

    await storage.saveObject('times_user_subscribed_to_a_theme', 1)
    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    // userEvent.press is not working correctly (MSW warning)
    // eslint-disable-next-line local-rules/no-fireEvent
    await act(async () => fireEvent.press(screen.getByText('Suivre')))

    expect(screen.getByText('Tu suis le thème "Cinéma"')).toBeOnTheScreen()
    expect(screen.getByText('Voir mes préférences')).toBeOnTheScreen()
  })

  it('should show snackbar when user subscribe to a thematic home for more than 3 times', async () => {
    mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', {})

    await storage.saveObject('times_user_subscribed_to_a_theme', 3)
    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    // userEvent.press is not working correctly (MSW warning)
    // eslint-disable-next-line local-rules/no-fireEvent
    await act(async () => fireEvent.press(screen.getByText('Suivre')))

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Tu suis le thème “Cinéma”\u00a0! Tu peux gérer tes alertes depuis ton profil.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it.skip('should not show anything when user is not eligible', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)

    render(reactQueryProviderHOC(<SubscribeButtonWithModals homeId="fakeEntryId" />))

    await waitFor(() => {
      expect(screen.queryByText('Suivre')).toBeNull()
    })
  })
})
