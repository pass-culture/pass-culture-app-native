import React from 'react'

import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { RadioSelector } from './RadioSelector'

describe('<RadioSelector />', () => {
  it('should call press when pressing Spacebar', () => {
    const onPress = jest.fn()
    render(<RadioSelector label="label" onPress={onPress} checked={false} />)

    const container = screen.getByTestId('label')

    fireEvent.focus(container)
    fireEvent.keyDown(container, { key: 'Spacebar' })

    expect(onPress).toHaveBeenNthCalledWith(1)
  })

  it('should not call press when pressing Spacebar if disabled', () => {
    const onPress = jest.fn()
    render(<RadioSelector label="label" onPress={onPress} disabled checked={false} />)

    const container = screen.getByTestId('label')

    fireEvent.focus(container)
    fireEvent.keyDown(container, { key: 'Spacebar' })

    expect(onPress).not.toHaveBeenCalled()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const onPress = jest.fn()
      const { container } = render(<RadioSelector label="label" onPress={onPress} checked />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
