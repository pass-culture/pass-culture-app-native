import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { computedTheme } from 'tests/computedTheme'
import { render, screen } from 'tests/utils'

import { BlackGradient } from './BlackGradient'

const defaultHeight = 32 // getSpacing(8)

describe('BlackGradient', () => {
  it('should apply default height if no height is provided', () => {
    renderBlackGradient()

    const gradientHeight = screen.getByTestId('gradient').props.style[0]

    expect(gradientHeight).toEqual({ height: defaultHeight })
  })

  it('should apply a numeric height', () => {
    renderBlackGradient(50)

    const gradientHeight = screen.getByTestId('gradient').props.style[0]

    expect(gradientHeight).toEqual({ height: 50 })
  })

  it('should apply a valid percentage height', () => {
    renderBlackGradient('75%')

    const gradientHeight = screen.getByTestId('gradient').props.style[0]

    expect(gradientHeight).toEqual({ height: '75%' })
  })

  it('should apply default height for an invalid percentage', () => {
    renderBlackGradient('110%')

    const gradientHeight = screen.getByTestId('gradient').props.style[0]

    expect(gradientHeight).toEqual({ height: defaultHeight })
  })

  it('should apply default height for a non-percentage string', () => {
    renderBlackGradient('invalid')

    const gradientHeight = screen.getByTestId('gradient').props.style[0]

    expect(gradientHeight).toEqual({ height: defaultHeight })
  })
})

const renderBlackGradient = (height?: number | string) => {
  return render(
    <ThemeProvider theme={computedTheme}>
      <BlackGradient height={height} testID="gradient" />
    </ThemeProvider>
  )
}
