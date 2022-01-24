import React from 'react'

import { render } from 'tests/utils'
import { Close } from 'ui/svg/icons/Close'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('should render properly', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = ColorsEnum.PRIMARY

    const { toJSON } = render(
      <ProgressBar color={expectedBackgroundColor} progress={expectedProgress} icon={Close} />
    )

    expect(toJSON()).toMatchSnapshot()
  })
  it('should have the right length and color', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = ColorsEnum.PRIMARY

    const { getByText, getByTestId } = render(
      <ProgressBar color={expectedBackgroundColor} progress={expectedProgress} icon={Close} />
    )

    const progressBar = getByTestId('progress-bar')
    const style = progressBar.props.style
    expect(style.backgroundColor).toEqual(expectedBackgroundColor)
    expect(style.flexGrow).toEqual(expectedProgress)

    const progressBarIcon = getByText('progress-bar-icon-SVG-Mock')
    expect(progressBarIcon).toBeTruthy()
  })

  it('should have the right length and color when animated', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = ColorsEnum.PRIMARY

    const { getByText, getByTestId } = render(
      <ProgressBar
        color={expectedBackgroundColor}
        progress={expectedProgress}
        icon={Close}
        isAnimated
      />
    )

    const progressBar = getByTestId('progress-bar')
    const style = progressBar.props.style
    expect(style.backgroundColor).toEqual(expectedBackgroundColor)
    expect(style.flexGrow).toEqual(1)

    const progressBarIcon = getByText('progress-bar-icon-SVG-Mock')
    expect(progressBarIcon).toBeTruthy()
  })
})
