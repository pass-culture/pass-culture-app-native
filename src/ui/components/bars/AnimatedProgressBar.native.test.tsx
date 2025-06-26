import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { Close } from 'ui/svg/icons/Close'

import { AnimatedProgressBar } from './AnimatedProgressBar'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

describe('AnimatedProgressBar', () => {
  it('should have the right length and color', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = theme.designSystem.color.background.brandPrimary

    render(
      <AnimatedProgressBar
        color={expectedBackgroundColor}
        progress={expectedProgress}
        icon={Close}
      />
    )

    const progressBar = screen.getByTestId('animated-progress-bar')
    const style = progressBar.props.style

    expect(style.backgroundColor).toEqual(expectedBackgroundColor)
    expect(style.flexGrow).toEqual(expectedProgress)

    const progressBarIcon = screen.getByText('progress-bar-icon-SVG-Mock')

    expect(progressBarIcon).toBeOnTheScreen()
  })

  it('should have the right length and color when animated', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = theme.designSystem.color.background.brandPrimary

    render(
      <AnimatedProgressBar
        color={expectedBackgroundColor}
        progress={expectedProgress}
        icon={Close}
        isAnimated
      />
    )

    const progressBar = screen.getByTestId('animated-progress-bar')
    const style = progressBar.props.style

    expect(style.backgroundColor).toEqual(expectedBackgroundColor)
    expect(style.flexGrow).toEqual(1)

    const progressBarIcon = screen.getByText('progress-bar-icon-SVG-Mock')

    expect(progressBarIcon).toBeOnTheScreen()
  })
})
