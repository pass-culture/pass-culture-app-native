import React from 'react'

import { mockCompletedAchievements } from 'features/achievements/data/AchievementData'
import Achievements from 'features/achievements/pages/Achievements'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.useFakeTimers()

describe('<Achievements/>', () => {
  beforeEach(() => {
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        achievements: mockCompletedAchievements,
      },
      { persist: true } // in "should open modal when press an achievement" we useAuthContext in the Achievements page and in the hook useAchievementDetails
    )
  })

  it('should match snapshot', () => {
    render(<Achievements />)

    expect(screen).toMatchSnapshot()
  })

  it('should open modal when press an achievement', async () => {
    render(<Achievements />)

    const firstMovieBookingAchievement = screen.getByText('Mangeur de popcorns')
    await userEvent.setup().press(firstMovieBookingAchievement)

    expect(screen.getByText('Tu as réservé ta première séance de cinéma')).toBeOnTheScreen()
  })
})
