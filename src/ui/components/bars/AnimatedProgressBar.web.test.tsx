import React from 'react'

import { render, screen } from 'tests/utils/web'
import { theme } from 'theme'
import { Close } from 'ui/svg/icons/Close'

import { AnimatedProgressBar } from './AnimatedProgressBar'

jest.mock('theme', () => ({
  theme: {
    colors: {
      primary: 'rgb(235, 0, 85)', // We need the RGB value of primary for these tests
    },
  },
}))

describe('AnimatedProgressBar', () => {
  it('should render properly', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = theme.colors.primary

    const renderAPI = render(
      <AnimatedProgressBar
        color={expectedBackgroundColor}
        progress={expectedProgress}
        icon={Close}
      />
    )

    expect(renderAPI).toMatchSnapshot()
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
    const style = progressBar.style

    expect(style.backgroundColor).toEqual(expectedBackgroundColor)
    expect(style.flexGrow).toEqual(`${expectedProgress}`)

    const progressBarIcon = screen.getByText('progress-bar-icon-SVG-Mock')
    expect(progressBarIcon).toBeTruthy()
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
    const style = progressBar.style

    expect(style.backgroundColor).toEqual(expectedBackgroundColor)
    expect(style.flexGrow).toEqual('1')

    const progressBarIcon = screen.getByText('progress-bar-icon-SVG-Mock')
    expect(progressBarIcon).toBeTruthy()
  })
})
