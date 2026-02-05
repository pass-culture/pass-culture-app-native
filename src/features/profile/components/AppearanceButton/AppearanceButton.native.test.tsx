import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { AppearanceButton } from './AppearanceButton'

jest.mock('libs/firebase/analytics/analytics')

const mockNavigate = jest.fn()
const mockMarkAppearanceTagSeen = jest.fn()

const user = userEvent.setup()
jest.useFakeTimers()

describe('AppearanceButton', () => {
  it('should render the button with tag when enableDarkModeGtm is true and tag not seen', () => {
    render(
      <AppearanceButton
        navigate={mockNavigate}
        enableDarkModeGtm
        hasSeenAppearanceTag={false}
        markAppearanceTagSeen={mockMarkAppearanceTagSeen}
      />
    )

    expect(screen.getByText('Apparence')).toBeTruthy()
    expect(screen.getByText('Nouveau')).toBeTruthy()
    expect(screen.getByLabelText('Apparence - Nouveau')).toBeTruthy()
  })

  it('should render the button without tag when enableDarkModeGtm is false', () => {
    render(
      <AppearanceButton
        navigate={mockNavigate}
        enableDarkModeGtm={false}
        hasSeenAppearanceTag={false}
        markAppearanceTagSeen={mockMarkAppearanceTagSeen}
      />
    )

    expect(screen.getByText('Apparence')).toBeTruthy()
    expect(screen.queryByText('Nouveau')).toBeNull()
    expect(screen.queryByLabelText('Apparence - Nouveau')).toBeNull()
  })

  it('should render the button without tag when tag has been seen', () => {
    render(
      <AppearanceButton
        navigate={mockNavigate}
        enableDarkModeGtm
        hasSeenAppearanceTag
        markAppearanceTagSeen={mockMarkAppearanceTagSeen}
      />
    )

    expect(screen.getByText('Apparence')).toBeTruthy()
    expect(screen.queryByText('Nouveau')).toBeNull()
    expect(screen.queryByLabelText('Apparence - Nouveau')).toBeNull()
  })

  it('should call markAppearanceTagSeen and navigate on press', async () => {
    render(
      <AppearanceButton
        navigate={mockNavigate}
        enableDarkModeGtm
        hasSeenAppearanceTag={false}
        markAppearanceTagSeen={mockMarkAppearanceTagSeen}
      />
    )

    await user.press(screen.getByText('Apparence'))

    expect(mockMarkAppearanceTagSeen).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('ProfileStackNavigator', { screen: 'Appearance' })
  })
})
