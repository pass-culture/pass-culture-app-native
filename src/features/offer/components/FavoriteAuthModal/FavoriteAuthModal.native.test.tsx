import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

import { FavoriteAuthModal } from './FavoriteAuthModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

const OFFER_ID = 123
const ARTIST_ID = 'artist-456'
const VENUE_ID = 789
const dismissModal = jest.fn()

const user = userEvent.setup()

describe('FavoriteAuthModal', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should match previous snapshot', () => {
    renderFavoriteAuthModal()

    expect(screen).toMatchSnapshot()
  })

  describe('sign in', () => {
    describe('from a favorite offer', () => {
      it('should navigate to sign in page with offerId in params', async () => {
        renderFavoriteAuthModal({ offerId: OFFER_ID })

        const button = screen.getByText('Se connecter')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('LoginMethods', {
          from: StepperOrigin.FAVORITE,
          offerId: OFFER_ID,
        })
      })

      it('should send `logLoginClicked` event with offerId in params', async () => {
        renderFavoriteAuthModal({ offerId: OFFER_ID })

        const button = screen.getByText('Se connecter')
        await user.press(button)

        expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, {
          from: 'offer_favorite',
          itemType: 'offer',
          offerId: OFFER_ID,
        })
      })
    })

    describe('from a favorite artist', () => {
      it('should navigate to sign in page with artistId in params', async () => {
        renderFavoriteAuthModal({ artistId: ARTIST_ID })

        const button = screen.getByText('Se connecter')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('LoginMethods', {
          from: StepperOrigin.FAVORITE,
          artistId: ARTIST_ID,
        })
      })

      it('should send `logLoginClicked` event with artistId in params', async () => {
        renderFavoriteAuthModal({ artistId: ARTIST_ID })

        const button = screen.getByText('Se connecter')
        await user.press(button)

        expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, {
          from: 'artist_favorite',
          itemType: 'artist',
          artistId: ARTIST_ID,
        })
      })
    })

    describe('from a favorite venue', () => {
      it('should navigate to sign in page with venueId in params', async () => {
        renderFavoriteAuthModal({ venueId: VENUE_ID })

        const button = screen.getByText('Se connecter')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('LoginMethods', {
          from: StepperOrigin.FAVORITE,
          venueId: VENUE_ID,
        })
      })

      it('should send `logLoginClicked` event with venueId in params', async () => {
        renderFavoriteAuthModal({ venueId: VENUE_ID })

        const button = screen.getByText('Se connecter')
        await user.press(button)

        expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, {
          from: 'venue_favorite',
          itemType: 'venue',
          venueId: VENUE_ID,
        })
      })
    })
  })

  describe('sign up', () => {
    describe('from a favorite offer', () => {
      it('should navigate to signup page with offerId in params', async () => {
        renderFavoriteAuthModal({ offerId: OFFER_ID })

        const button = screen.getByText('Créer un compte')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('SignupMethods', {
          from: StepperOrigin.FAVORITE,
          offerId: OFFER_ID,
        })
      })

      it('should send `logSignUpClicked` event with offerId in params', async () => {
        renderFavoriteAuthModal({ offerId: OFFER_ID })

        const button = screen.getByText('Créer un compte')
        await user.press(button)

        expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
          from: 'offer_favorite',
          itemType: 'offer',
          offerId: OFFER_ID,
        })
      })
    })

    describe('from a favorite artist', () => {
      it('should navigate to signup page with artistId in params', async () => {
        renderFavoriteAuthModal({ artistId: ARTIST_ID })

        const button = screen.getByText('Créer un compte')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('SignupMethods', {
          from: StepperOrigin.FAVORITE,
          artistId: ARTIST_ID,
        })
      })

      it('should send `logSignUpClicked` event with artistId in params', async () => {
        renderFavoriteAuthModal({ artistId: ARTIST_ID })

        const button = screen.getByText('Créer un compte')
        await user.press(button)

        expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
          from: 'artist_favorite',
          itemType: 'artist',
          artistId: ARTIST_ID,
        })
      })
    })

    describe('from a favorite venue', () => {
      it('should navigate to signup page with venueId in params', async () => {
        renderFavoriteAuthModal({ venueId: VENUE_ID })

        const button = screen.getByText('Créer un compte')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('SignupMethods', {
          from: StepperOrigin.FAVORITE,
          venueId: VENUE_ID,
        })
      })

      it('should send `logSignUpClicked` event with venueId in params', async () => {
        renderFavoriteAuthModal({ venueId: VENUE_ID })

        const button = screen.getByText('Créer un compte')
        await user.press(button)

        expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
          from: 'venue_favorite',
          itemType: 'venue',
          venueId: VENUE_ID,
        })
      })
    })
  })

  describe('close modal', () => {
    it('should send `logQuitFavoriteModalForSignIn` when closing modal from an offer', async () => {
      renderFavoriteAuthModal({ offerId: OFFER_ID })

      const closeButton = screen.getByTestId('Fermer la modale')
      await user.press(closeButton)

      expect(dismissModal).toHaveBeenCalledTimes(1)
      expect(analytics.logQuitFavoriteModalForSignIn).toHaveBeenNthCalledWith(1, OFFER_ID)
    })

    it('should dismiss modal without calling `logQuitFavoriteModalForSignIn` when closing from an artist', async () => {
      renderFavoriteAuthModal({ artistId: ARTIST_ID })

      const closeButton = screen.getByTestId('Fermer la modale')
      await user.press(closeButton)

      expect(dismissModal).toHaveBeenCalledTimes(1)
      expect(analytics.logQuitFavoriteModalForSignIn).not.toHaveBeenCalled()
    })

    it('should dismiss modal without calling `logQuitFavoriteModalForSignIn` when closing from a venue', async () => {
      renderFavoriteAuthModal({ venueId: VENUE_ID })

      const closeButton = screen.getByTestId('Fermer la modale')
      await user.press(closeButton)

      expect(dismissModal).toHaveBeenCalledTimes(1)
      expect(analytics.logQuitFavoriteModalForSignIn).not.toHaveBeenCalled()
    })
  })
})

const renderFavoriteAuthModal = (
  props: Partial<React.ComponentProps<typeof FavoriteAuthModal>> = {}
) => {
  return render(<FavoriteAuthModal visible dismissModal={dismissModal} {...props} />)
}
