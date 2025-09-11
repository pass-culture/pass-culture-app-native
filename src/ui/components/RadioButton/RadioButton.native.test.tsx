import React from 'react'

import { render, screen } from 'tests/utils'
import { RadioButton } from 'ui/components/RadioButton/RadioButton'

const propsBase = {
  label: 'Je ne sais pas',
  onSelect: jest.fn(),
  isSelected: false,
}

describe('<RadioButton/>', () => {
  it('should display description when given', () => {
    const descriptionText = 'une description'
    render(<RadioButton {...propsBase} description={descriptionText} />)

    expect(screen.getByText(descriptionText)).toBeOnTheScreen()
  })

  it('should display asset when given', () => {
    const textAsset = '32\u00a0€'
    render(<RadioButton {...propsBase} asset={{ variant: 'text', text: textAsset }} />)

    expect(screen.getByText(textAsset)).toBeOnTheScreen()
  })
})
