import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { computedTheme } from 'tests/computedTheme'
import { render, screen } from 'tests/utils'

import { BlackGradient } from './BlackGradient'

const defaultHeight = 32 // getSpacing(8)

describe('BlackGradient', () => {
  it('should apply default height if no height is provided', () => {
    renderBlackGradient()

    expect(screen.getByTestId('gradient')).toHaveStyle({
      height: defaultHeight,
    })
  })

  it('should apply a numeric height', () => {
    renderBlackGradient(50)

    expect(screen.getByTestId('gradient')).toHaveStyle({
      height: 50,
    })
  })

  it('should apply a valid percentage height', () => {
    renderBlackGradient('75%')

    expect(screen.getByTestId('gradient')).toHaveStyle({
      height: '75%',
    })
  })

  it('should apply default height for an invalid percentage', () => {
    renderBlackGradient('110%')

    expect(screen.getByTestId('gradient')).toHaveStyle({
      height: defaultHeight,
    })
  })

  it('should apply default height for a non-percentage string', () => {
    renderBlackGradient('invalid')

    expect(screen.getByTestId('gradient')).toHaveStyle({
      height: defaultHeight,
    })
  })
})

const renderBlackGradient = (height?: number | string) => {
  return render(
    <ThemeProvider theme={computedTheme}>
      <BlackGradient height={height} testID="gradient" />
    </ThemeProvider>
  )
}
