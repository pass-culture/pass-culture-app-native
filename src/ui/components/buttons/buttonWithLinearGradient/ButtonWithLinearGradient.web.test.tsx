import React from 'react'

import { render, screen } from 'tests/utils/web'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

const onPress = jest.fn()

describe('<ButtonWithLinearGradient />', () => {
  it('should render not disabled', () => {
    render(<ButtonWithLinearGradient wording="Wording to display" onPress={onPress} />)
    const text = screen.queryByText('Wording to display')

    expect(text?.closest('button')?.disabled).toBeFalsy()
    expect(text?.closest('button')?.type).toBe('button')
    expect(text).toBeTruthy()
  })

  it('should render disabled', () => {
    render(<ButtonWithLinearGradient wording="Wording to display" onPress={onPress} isDisabled />)
    const text = screen.queryByText('Wording to display')

    expect(text?.closest('button')?.disabled).toBeTruthy()
    expect(text).toBeTruthy()
  })

  it('should render anchor tag without type if component is an anchor', () => {
    const href = 'https://example.link/'
    render(<ButtonWithLinearGradient wording="Wording to display" href={href} onPress={onPress} />)
    const text = screen.queryByText('Wording to display')
    expect(text?.closest('a')?.href).toBe(href)
    expect(text?.closest('a')?.type).toBe('')
  })
})
