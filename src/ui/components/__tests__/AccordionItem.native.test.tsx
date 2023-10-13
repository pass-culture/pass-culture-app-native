import React from 'react'
import { View } from 'react-native'

import { act, fireEvent, render, screen } from 'tests/utils'

import { AccordionItem } from '../AccordionItem'

const Children = () => <View testID="accordion-child-view" />

const accordionTitle = 'accordion title'

jest.useFakeTimers({ legacyFakeTimers: true })

describe('AccordionItem', () => {
  it("should be closed by default - we don't see the children", () => {
    renderAccordion()
    const accordionBody = screen.getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({ height: 0, overflow: 'hidden' })
  })

  it('should display the children after pressing on the title', async () => {
    renderAccordion()
    expect(screen.queryByTestId('accordion-child-view')).not.toBeOnTheScreen()

    act(() => {
      fireEvent.press(screen.getByText('accordion title'))
      jest.runAllTimers()
    })

    expect(screen.getByTestId('accordion-child-view')).toBeOnTheScreen()
  })

  it('should expand for accessibility the accordion after pressing the title', async () => {
    renderAccordion()

    expect(screen.getByTestId('accordionTouchable')).toHaveAccessibilityState({ expanded: false })

    act(() => {
      fireEvent.press(screen.getByText('accordion title'))
      jest.runAllTimers()
    })

    expect(screen.getByTestId('accordionTouchable')).toHaveAccessibilityState({ expanded: true })
  })

  it('correct arrow animation,', async () => {
    renderAccordion()
    const accordionArrow = screen.getByTestId('accordionArrow')
    // ArrowNext (right) + 90° => arrow facing up.
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${Math.PI / 2}rad` })

    act(() => {
      fireEvent.press(screen.getByText('accordion title'))
      jest.runAllTimers()
    })

    // ArrowNext (right) + 270° => arrow facing down.
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${(3 * Math.PI) / 2}rad` })
  })
})

function renderAccordion() {
  render(
    <AccordionItem title={accordionTitle}>
      <Children />
    </AccordionItem>
  )
}
