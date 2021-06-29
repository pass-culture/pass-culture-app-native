import React from 'react'

import { render } from 'tests/utils/web'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('should render properly', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = ColorsEnum.PRIMARY

    const renderAPI = render(
      <ProgressBar color={expectedBackgroundColor} progress={expectedProgress} icon={Close} />
    )

    expect(renderAPI).toMatchSnapshot()
  })
  it('should have the right length and color', () => {
    const expectedProgress = 0.5
    const expectedBackgroundColor = 'rgb(235, 0, 85)'

    const { getByText, getByTestId } = render(
      <ProgressBar color={expectedBackgroundColor} progress={expectedProgress} icon={Close} />
    )

    const progressBar = getByTestId('progress-bar')
    const style = progressBar.style

    // expect(style).toEqual(expectedProgress)
    expect(style.flexGrow).toEqual(expectedProgress.toString())
    expect(style.backgroundColor).toEqual(expectedBackgroundColor)

    const progressBarIcon = getByText('progress-bar-icon-SVG-Mock')
    expect(progressBarIcon).toBeTruthy()
  })
})
