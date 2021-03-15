import { render } from '@testing-library/react-native'
import React from 'react'

import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

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
    const style = progressBar.props.style[0]

    expect(style.flexGrow).toEqual(expectedProgress)
    expect(style.backgroundColor).toEqual(expectedBackgroundColor)

    const progressBarIcon = getByText('progress-bar-icon-SVG-Mock')
    expect(progressBarIcon).toBeTruthy()
  })
})
