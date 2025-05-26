import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'
import { VenueThematicSection } from 'features/venue/components/VenueThematicSection/VenueThematicSection'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const venueFixture = { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE }

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const alreadySubscribedUser = {
  ...beneficiaryUser,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
    subscribedThemes: [SubscriptionTheme.CINEMA],
  },
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueThematicSection/>', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
  })

  it('should render null if venue has no thematic', async () => {
    const venue = { ...venueFixture, venueTypeCode: VenueTypeCodeKey.ADMINISTRATIVE }
    render(reactQueryProviderHOC(<VenueThematicSection venue={venue} />))

    await waitFor(() => {
      expect(screen.toJSON()).toBeNull()
    })
  })

  it('should render null if user is not eligible', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

    await waitFor(() => {
      expect(screen.toJSON()).toBeNull()
    })
  })

  it('should render cinema block when venue is a movie theater', async () => {
    render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

    expect(await screen.findByText('Fan de cinéma ?')).toBeOnTheScreen()
  })

  describe('when the user presses SubscribeButton', () => {
    it('should notify when subscription succeeds', async () => {
      mockServer.patchApi('/v1/profile', {})

      render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

      await user.press(screen.getByText('Suivre le thème'))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Tu suis le thème “Cinéma”\u00a0! Tu peux gérer tes alertes depuis ton profil.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should notify when subscription fails', async () => {
      mockServer.patchApi('/v1/profile', {
        responseOptions: { statusCode: 400, data: {} },
      })

      render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

      await user.press(screen.getByText('Suivre le thème'))

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Une erreur est survenue, veuillez réessayer',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should show logged out modal when user is not logged in', async () => {
      mockAuthContextWithoutUser()
      render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(screen.getByText('Suivre le thème'))

      expect(await screen.findByText('Identifie-toi pour t’abonner à un thème')).toBeOnTheScreen()
    })

    it('should show notifications modal when user has no notifications activated', async () => {
      const userWithNoNotifications = {
        ...beneficiaryUser,
        subscriptions: { marketingEmail: false, marketingPush: false, subscribedThemes: [] },
      }
      mockAuthContextWithUser(userWithNoNotifications)
      render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(screen.getByText('Suivre le thème'))

      expect(await screen.findByText('Autoriser l’envoi d’e-mails')).toBeOnTheScreen()
    })

    it('should show unsubscribing confirmation modal when user subscribed and unsubscribe', async () => {
      mockServer.patchApi('/v1/profile', {})

      render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

      // Due to too many re-renders, we need to mock the auth context globally
      // eslint-disable-next-line local-rules/independent-mocks
      mockAuthContextWithUser(alreadySubscribedUser, { persist: true })

      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(screen.getByText('Suivre le thème'))
      await user.press(screen.getByText('Thème suivi'))

      expect(
        await screen.findByText('Es-tu sûr de ne plus vouloir suivre ce thème ?')
      ).toBeOnTheScreen()
    })
  })

  it('should log when user login from logged out modal', async () => {
    mockAuthContextWithoutUser()

    render(reactQueryProviderHOC(<VenueThematicSection venue={venueFixture} />))

    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(screen.getByText('Suivre le thème'))

    await user.press(screen.getByText('Se connecter'))

    expect(analytics.logLoginClicked).toHaveBeenCalledWith({ from: 'venue' })
  })
})
