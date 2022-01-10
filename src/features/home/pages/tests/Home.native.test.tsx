import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { flushAllPromises, render } from 'tests/utils'

import { Home } from '../Home'

jest.mock('features/home/pages/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

useRoute.mockImplementation(() => ({ params: { entryId: 'specific_entry_id' } }))

let mockUserProfileInfo: Partial<UserProfileResponse> | undefined = undefined
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: mockUserProfileInfo })),
  useHomepageModules: () => [],
}))

describe('Home component', () => {
  afterEach(jest.clearAllMocks)
  beforeEach(() => {
    mockUserProfileInfo = {
      email: 'email@domain.ext',
      firstName: 'Jean',
      isBeneficiary: true,
      depositExpirationDate: '2023-02-16T17:16:04.735235',
      domainsCredit: {
        all: { initial: 50000, remaining: 49600 },
        physical: { initial: 20000, remaining: 0 },
        digital: { initial: 20000, remaining: 19600 },
      },
    }
  })

  it('should render correctly without login modal', async () => {
    mockUserProfileInfo = undefined
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { toJSON } = render(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should have a welcome message', () => {
    mockUserProfileInfo = undefined
    const { getByText } = render(<Home />)
    getByText('Bienvenue\u00a0!')
  })

  it('should have a personalized welcome message when user is logged in', () => {
    const { getByText } = render(<Home />)
    getByText('Bonjour Jean')
  })

  it('should show the available credit to the user - remaining', () => {
    const { getByText } = render(<Home />)
    getByText('Tu as 496\u00a0€ sur ton pass')
  })

  it('should show the available credit to the user - expired', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mockUserProfileInfo!.depositExpirationDate = '2020-02-16T17:16:04.735235'
    const { queryByText, getByText } = render(<Home />)
    expect(getByText('Ton crédit est expiré')).toBeTruthy()
    expect(queryByText('Tu as 496\u00a0€ sur ton pass')).toBeFalsy()
  })

  it('should show the available credit to the user - not logged in', () => {
    mockUserProfileInfo = undefined
    const { queryByText } = render(<Home />)
    expect(queryByText('Toute la culture à portée de main')).toBeTruthy()
  })

  it('should show the available credit to the user - not beneficiary', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mockUserProfileInfo!.isBeneficiary = false
    const { queryByText } = render(<Home />)
    expect(queryByText('Toute la culture à portée de main')).toBeTruthy()
  })

  it('should not have code push button', async () => {
    const { queryByText } = render(<Home />)
    expect(queryByText('Check update')).toBeFalsy()
  })

  it('should have CheatMenu button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const { queryByText } = render(<Home />)
    expect(queryByText('CheatMenu')).toBeTruthy()
  })

  it('should NOT have CheatMenu button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { queryByText } = render(<Home />)
    expect(queryByText('CheatMenu')).toBeFalsy()
  })
})

describe('Home component - Analytics', () => {
  const nativeEventMiddle = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1600 },
  }
  const nativeEventBottom = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  }

  it('should trigger logEvent "AllModulesSeen" when reaching the end', () => {
    const { getByTestId } = render(<Home />)
    const scrollView = getByTestId('homeBodyScrollView')

    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()

    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(0)
  })

  it('should trigger logEvent "AllModulesSeen" only once', () => {
    const { getByTestId } = render(<Home />)
    const scrollView = getByTestId('homeBodyScrollView')

    // 1st scroll to bottom => trigger
    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(0)

    jest.clearAllMocks()

    // 2nd scroll to bottom => NOT trigger
    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    flushAllPromises()
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
  })
})
