import React from 'react'

import { act, render, screen } from 'tests/utils'

import { DisplayPreference } from './DisplayPreference'

describe('debouncedLogChangeOrientationToggle', () => {
  it('should render correctly', () => {
    render(<DisplayPreference />)

    expect(screen).toMatchSnapshot()
  })

  it('should display correct subtitle', async () => {
    render(<DisplayPreference />)

    const subtitle = screen.getByText('L’affichage en mode paysage peut être moins optimal')
    await act(() => {
      expect(subtitle).toBeOnTheScreen()
    })
  })
})
