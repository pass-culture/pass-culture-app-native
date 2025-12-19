import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  user: undefined,
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
})

describe('<ProfileTutorialAgeInformationCredit />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should render correctly', () => {
    render(<ProfileTutorialAgeInformationCredit />)

    expect(screen).toMatchSnapshot()
  })

  it("should log to analytics when pressing 'Plus d’infos dans notre FAQ'", async () => {
    render(<ProfileTutorialAgeInformationCredit />)

    const link = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(link)

    expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledTimes(1)
  })

  describe('bonification step', () => {
    beforeEach(() => {
      setFeatureFlags([
        RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY,
        RemoteStoreFeatureFlags.ENABLE_BONIFICATION,
      ])
    })

    it('should show step to connected users', () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.eligible },
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const title = screen.getByText('Droit à l’aide')

      expect(title).toBeOnTheScreen()
    })

    it("should show link if user is eligible and hasn't made a request for bonus credit", async () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.eligible },
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.getByText('Tester mon éligibilité')

      expect(link).toBeOnTheScreen()
      expect(link).toBeEnabled()
    })

    it("should not show link if user isn't eligible", async () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.not_eligible },
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.queryByText('Tester mon éligibilité')

      expect(link).not.toBeOnTheScreen()
    })

    it('should show step to disconnected users', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: undefined,
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const title = screen.queryByText('Droit à l’aide')

      expect(title).toBeOnTheScreen()
    })

    it('should not show link if user is disconnected', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: undefined,
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.queryByText('Tester mon éligibilité')

      expect(link).not.toBeOnTheScreen()
    })

    it('should not show link if bonus credit was already obtained', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.granted },
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.queryByText('Tester mon éligibilité')

      expect(link).not.toBeOnTheScreen()
    })

    it('should disable link if user currently has request for bonus credit', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.started },
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        isUserLoading: false,
        refetchUser: jest.fn(),
      })
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.queryByText('En cours de traitement')

      expect(link).toBeOnTheScreen()
      expect(link).toBeDisabled()
    })
  })
})
