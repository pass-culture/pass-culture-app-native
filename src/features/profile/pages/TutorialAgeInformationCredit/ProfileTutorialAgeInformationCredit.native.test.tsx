import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { QFBonificationStatus } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { useBonificationBannerVisibility } from 'features/bonification/hooks/useBonificationBannerVisibility'
import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, renderHook, screen, userEvent, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

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
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY]))

  describe('with bonification disabled', () => {
    it('should render correctly', () => {
      render(<ProfileTutorialAgeInformationCredit />)

      expect(screen).toMatchSnapshot()
    })

    it('should open FAQ link when pressing "Plus d’infos dans notre FAQ"', async () => {
      render(<ProfileTutorialAgeInformationCredit />)

      const faqButton = screen.getByText('Plus d’infos dans notre FAQ')
      await userEvent.press(faqButton)

      expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_CREDIT_V3, undefined, true)
    })

    it("should log to analytics when pressing 'Plus d’infos dans notre FAQ'", async () => {
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.getByText('Plus d’infos dans notre FAQ')
      await userEvent.press(link)

      expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledWith({
        type: 'FAQ_LINK_CREDIT_V3',
      })
    })
  })

  describe('with bonification enabled', () => {
    beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BONIFICATION]))

    it('should render correctly', () => {
      render(<ProfileTutorialAgeInformationCredit />)

      expect(screen).toMatchSnapshot()
    })

    it('should open FAQ link when pressing "Plus d’infos sur ton crédit"', async () => {
      render(<ProfileTutorialAgeInformationCredit />)

      const faqButton = screen.getByText('Plus d’infos sur ton crédit')
      await userEvent.press(faqButton)

      expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_PASS_CULTURE, undefined, true)
    })

    it("should log to analytics when pressing 'Plus d’infos sur ton crédit'", async () => {
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.getByText('Plus d’infos sur ton crédit')
      await userEvent.press(link)

      expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledWith({
        type: 'FAQ_LINK_PASS_CULTURE',
      })
    })

    it('should open FAQ link when pressing "Plus d’infos sur les bonus sous conditions"', async () => {
      render(<ProfileTutorialAgeInformationCredit />)

      const faqButton = screen.getByText('Plus d’infos sur les bonus sous conditions')
      await userEvent.press(faqButton)

      expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_BONIFICATION_GENERIC, undefined, true)
    })

    it("should log to analytics when pressing 'Plus d’infos sur les bonus sous conditions'", async () => {
      render(<ProfileTutorialAgeInformationCredit />)

      const link = screen.getByText('Plus d’infos sur les bonus sous conditions')
      await userEvent.press(link)

      expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledWith({
        type: 'FAQ_BONIFICATION_GENERIC',
      })
    })
  })
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

    const title = screen.getByText('Bonus sous conditions')

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

    const link = screen.getByText('Vérifier maintenant')

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

    const link = screen.queryByText('Vérifier maintenant')

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

    const title = screen.queryByText('Bonus sous conditions')

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

    const link = screen.queryByText('Vérifier maintenant')

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

    const link = screen.queryByText('Vérifier maintenant')

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

  it('should reset the banner state if the user enters the bonification funnel', async () => {
    const { result } = renderHook(() => useBonificationBannerVisibility())
    result.current.onCloseBanner() // simulates the user closing the banner

    await waitFor(() => {
      expect(result.current.hasClosedBonificationBanner).toBeTruthy() // we make sure the value is true after onCloseBanner()
    })

    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.eligible },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    render(<ProfileTutorialAgeInformationCredit />)

    const link = await screen.findByText('Vérifier maintenant')
    await userEvent.press(link)

    expect(result.current.hasClosedBonificationBanner).toBeFalsy()
  })

  it('should navigate to the bonification funnel', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.eligible },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    render(<ProfileTutorialAgeInformationCredit />)

    const link = await screen.findByText('Vérifier maintenant')
    await userEvent.press(link)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationExplanations',
    })
  })

  it('should navigate to the bonification refused', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: {
        ...beneficiaryUser,
        qfBonificationStatus: QFBonificationStatus.eligible,
        remainingBonusAttempts: 0,
      },
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    render(<ProfileTutorialAgeInformationCredit />)

    const link = await screen.findByText('Vérifier maintenant')
    await userEvent.press(link)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: {
        bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES,
      },
      screen: 'BonificationRefused',
    })
  })
})
