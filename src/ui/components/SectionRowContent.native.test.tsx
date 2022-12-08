import React from 'react'

import { render, fireEvent } from 'tests/utils'
import { Close } from 'ui/svg/icons/Close'

import { SectionRowContent } from './SectionRowContent'

const onPress = jest.fn()

describe('SectionRowContent', () => {
  it('should call onPress when "clickable" section row and user press the section', () => {
    const { getByText } = render(
      <SectionRowContent type="clickable" title="Clickable title" icon={Close} onPress={onPress} />
    )
    fireEvent.press(getByText('Clickable title'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render the next arrow icon when type is "navigable"', () => {
    const { queryByTestId } = render(
      <SectionRowContent type="navigable" title="navigable" icon={Close} onPress={onPress} />
    )
    expect(queryByTestId('section-row-navigable-icon')).toBeTruthy()
  })

  it('should not render the next arrow icon when type is "clickable"', () => {
    const { queryByTestId } = render(
      <SectionRowContent type="clickable" title="clickable" icon={Close} onPress={onPress} />
    )
    expect(queryByTestId('section-row-navigable-icon')).toBeFalsy()
  })
})
