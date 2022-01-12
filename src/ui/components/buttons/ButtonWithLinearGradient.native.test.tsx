import React from 'react'

import { render } from 'tests/utils'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

const onPress = jest.fn()

describe('<ButtonWithLinearGradient />', () => {
  it('should render not disabled', () => {
    const { toJSON, queryByText } = render(
      <ButtonWithLinearGradient wording="Wording to display" onPress={onPress} isDisabled={false} />
    )
    expect(queryByText('Wording to display')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render disabled', () => {
    const { toJSON, queryByText } = render(
      <ButtonWithLinearGradient wording="Wording to display" onPress={onPress} isDisabled={true} />
    )
    expect(queryByText('Wording to display')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})
