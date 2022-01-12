import React from 'react'

import { render } from 'tests/utils/web'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

const onPress = jest.fn()

describe('<ButtonWithLinearGradient />', () => {
  it('should render not disabled', () => {
    const renderAPI = render(
      <ButtonWithLinearGradient wording="Wording to display" onPress={onPress} isDisabled={false} />
    )
    const text = renderAPI.queryByText('Wording to display')

    expect(text?.closest('button')?.disabled).toBeFalsy()
    expect(text).toBeTruthy()
  })

  it('should render disabled', () => {
    const renderAPI = render(
      <ButtonWithLinearGradient wording="Wording to display" onPress={onPress} isDisabled={true} />
    )
    const text = renderAPI.queryByText('Wording to display')

    expect(text?.closest('button')?.disabled).toBeTruthy()
    expect(text).toBeTruthy()
  })
})
