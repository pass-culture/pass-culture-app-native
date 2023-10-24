import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { Close } from 'ui/svg/icons/Close'

import { AnimatedProgressBar } from './AnimatedProgressBar'

describe('AnimatedProgressBar', () => {
  it('should render properly', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = theme.colors.primary

    const { toJSON } = render(
      <AnimatedProgressBar
        color={expectedBackgroundColor}
        progress={expectedProgress}
        icon={Close}
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should have the right length and color', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = theme.colors.primary

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
    const expectedBackgroundColor = theme.colors.primary

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
