import React from 'react'

import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { RadioSelector } from './RadioSelector'

const onPress = jest.fn()

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<RadioSelector />', () => {
  it('should call press when pressing Spacebar', () => {
    render(
      <RadioSelector
        radioGroupLabel="radioGroupLabel"
        label="label"
        onPress={onPress}
        checked={false}
      />
    )

    const container = screen.getByText('label')

    fireEvent.focus(container)
    fireEvent.keyDown(container, { key: 'Spacebar' })

    expect(onPress).toHaveBeenNthCalledWith(1)
  })

  it('should not call press when pressing Spacebar if disabled', () => {
    render(
      <RadioSelector
        radioGroupLabel="radioGroupLabel"
        label="label"
        onPress={onPress}
        disabled
        checked={false}
      />
    )

    const container = screen.getByText('label')

    fireEvent.focus(container)
    fireEvent.keyDown(container, { key: 'Spacebar' })

    expect(onPress).not.toHaveBeenCalled()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <RadioSelector radioGroupLabel="radioGroupLabel" label="label" onPress={onPress} checked />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
