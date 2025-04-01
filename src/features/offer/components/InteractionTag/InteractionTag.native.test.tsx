import React from 'react'

import { InteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'

describe('<InteractionTag />', () => {
  it('should display the correct label', () => {
    render(<InteractionTag label="Recommended" backgroundColor={theme.colors.goldLight100} />)

    expect(screen.getByText('Recommended')).toBeOnTheScreen()
  })

  it('should apply the correct background color', () => {
    render(<InteractionTag label="Book Club" backgroundColor={theme.colors.skyBlueLight} />)

    expect(screen.getByTestId('interaction-tag')).toHaveStyle({
      backgroundColor: theme.colors.skyBlueLight,
    })
  })
})
