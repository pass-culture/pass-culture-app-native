import React from 'react'

import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { RadioSelector } from './RadioSelector'

describe('<RadioSelector />', () => {
  it('should call press when pressing Spacebar', () => {
    const onPress = jest.fn()
    render(<RadioSelector label="label" onPress={onPress} />)

    const container = screen.getByTestId('label')

    fireEvent.focus(container)
    fireEvent.keyDown(container, { key: 'Spacebar' })

    expect(onPress).toHaveBeenNthCalledWith(1)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const onPress = jest.fn()
      const { container } = render(<RadioSelector label="label" onPress={onPress} />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
