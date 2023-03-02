import React from 'react'
import { View } from 'react-native'

import { act, fireEvent, render } from 'tests/utils'

import { AccordionItem } from '../AccordionItem'

const Children = () => <View testID="accordion-child-view" />

const accordionTitle = 'accordion title'

describe('AccordionItem', () => {
  beforeAll(() => jest.useFakeTimers('legacy'))

  it("is closed by default - we don't see the children", () => {
    const accordion = renderAccordion()
    const accordionBody = accordion.getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({ height: 0, overflow: 'hidden' })
  })

  it('we see the children after pressing on the title', async () => {
    const accordion = renderAccordion()
    const accordionBody = accordion.getByTestId('accordionBody')
    const accordionBodyContainer = accordion.getByTestId('accordionBodyContainer')
    expect(accordionBody.props.style).toEqual({ height: 0, overflow: 'hidden' })
    expect(accordion.getByRole('button').props.accessibilityState.expanded).toBeFalsy()

    fireEvent(accordionBodyContainer, 'layout', { nativeEvent: { layout: { height: 30 } } })

    act(() => {
      fireEvent.press(accordion.getByText('accordion title'))
      jest.runAllTimers()
    })

    expect(accordionBody.props.style).toEqual({ height: 30, overflow: 'hidden' })
    expect(accordion.getByRole('button').props.accessibilityState.expanded).toBeTruthy()
  })

  it('correct arrow animation,', async () => {
    const accordion = renderAccordion()
    const accordionArrow = accordion.getByTestId('accordionArrow')
    // ArrowNext (right) + 90° => arrow facing up.
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${Math.PI / 2}rad` })

    act(() => {
      fireEvent.press(accordion.getByText('accordion title'))
      jest.runAllTimers()
    })

    // ArrowNext (right) + 270° => arrow facing down.
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${(3 * Math.PI) / 2}rad` })
  })
})

function renderAccordion() {
  return render(
    <AccordionItem title={accordionTitle}>
      <Children />
    </AccordionItem>
  )
}
