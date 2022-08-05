import React from 'react'

import { render } from 'tests/utils'

import { CreditProgressBar, MINIMUM_PROGRESS_BAR_SIZE } from './CreditProgressBar'

const expectedProgress = 0.6
describe('<CreditProgressBar />', () => {
  it('should render properly', () => {
    const renderAPI = render(<CreditProgressBar progress={expectedProgress} />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should have the right length', () => {
    const expectedProgress = 0.6

    const { getByTestId } = render(<CreditProgressBar progress={expectedProgress} />)

    const progressBar = getByTestId('progress-bar')
    const style = progressBar.props.style[0]
    expect(style.flexGrow).toEqual(expectedProgress)
  })

  it('should have the right minimum length if credit not exhausted', () => {
    const expectedProgress = 0.01

    const { getByTestId } = render(<CreditProgressBar progress={expectedProgress} />)

    const progressBar = getByTestId('progress-bar')
    const style = progressBar.props.style[0]
    expect(style.flexGrow).toEqual(MINIMUM_PROGRESS_BAR_SIZE)
  })
})
