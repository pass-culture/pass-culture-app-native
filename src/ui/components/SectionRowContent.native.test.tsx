import React from 'react'

import { render, fireEvent, screen } from 'tests/utils'
import { Close } from 'ui/svg/icons/Close'

import { SectionRowContent } from './SectionRowContent'

const onPress = jest.fn()

describe('SectionRowContent', () => {
  it('should call onPress when "clickable" section row and user press the section', () => {
    render(
      <SectionRowContent type="clickable" title="Clickable title" icon={Close} onPress={onPress} />
    )

    fireEvent.press(screen.getByText('Clickable title'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render the next arrow icon when type is "navigable"', () => {
    render(<SectionRowContent type="navigable" title="navigable" icon={Close} onPress={onPress} />)

    expect(screen.queryByTestId('section-row-navigable-icon')).toBeOnTheScreen()
  })

  it('should not render the next arrow icon when type is "clickable"', () => {
    render(<SectionRowContent type="clickable" title="clickable" icon={Close} onPress={onPress} />)

    expect(screen.queryByTestId('section-row-navigable-icon')).not.toBeOnTheScreen()
  })
})
