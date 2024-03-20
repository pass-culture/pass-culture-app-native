import React from 'react'

import { render, screen } from 'tests/utils'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

const onPress = jest.fn()

describe('<ButtonWithLinearGradient />', () => {
  it('should render not disabled', () => {
    const { toJSON } = render(
      <ButtonWithLinearGradient wording="Wording to display" onPress={onPress} />
    )

    expect(screen.getByText('Wording to display')).toBeOnTheScreen()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render disabled', () => {
    const { toJSON } = render(
      <ButtonWithLinearGradient wording="Wording to display" onPress={onPress} isDisabled />
    )

    expect(screen.getByText('Wording to display')).toBeOnTheScreen()
    expect(toJSON()).toMatchSnapshot()
  })
})
