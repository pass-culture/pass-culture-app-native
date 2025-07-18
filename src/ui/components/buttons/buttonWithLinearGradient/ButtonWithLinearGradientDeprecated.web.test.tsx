import React from 'react'

import { render, screen } from 'tests/utils/web'

import { ButtonWithLinearGradientDeprecated } from './ButtonWithLinearGradientDeprecated'

const onPress = jest.fn()

describe('<ButtonWithLinearGradientDeprecated />', () => {
  it('should render not disabled', () => {
    render(<ButtonWithLinearGradientDeprecated wording="Wording to display" onPress={onPress} />)
    const text = screen.queryByText('Wording to display')

    expect(text?.closest('button')?.disabled).toBe(false)
    expect(text?.closest('button')?.type).toBe('button')
    expect(text).toBeInTheDocument()
  })

  it('should render disabled', () => {
    render(
      <ButtonWithLinearGradientDeprecated
        wording="Wording to display"
        onPress={onPress}
        isDisabled
      />
    )
    const text = screen.queryByText('Wording to display')

    expect(text?.closest('button')?.disabled).toBe(true)
    expect(text).toBeInTheDocument()
  })

  it('should render anchor tag without type if component is an anchor', () => {
    const href = 'https://example.link/'
    render(
      <ButtonWithLinearGradientDeprecated
        wording="Wording to display"
        href={href}
        onPress={onPress}
      />
    )
    const text = screen.queryByText('Wording to display')

    expect(text?.closest('a')?.href).toBe(href)
    expect(text?.closest('a')?.type).toBe('')
  })
})
