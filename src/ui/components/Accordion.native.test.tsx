import React from 'react'
import { View } from 'react-native'

import { act, renderAsync, screen, userEvent } from 'tests/utils'

import { Accordion } from './Accordion'

const Children = () => <View testID="accordion-child-view" />

const accordionTitle = 'accordion title'

const user = userEvent.setup()

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.useFakeTimers()

describe('Accordion', () => {
  it("should be closed by default - we don't see the children", async () => {
    await renderAccordion()
    const accordionBody = screen.getByTestId('accordionBody')

    expect(accordionBody.props.style).toEqual({ height: 0, overflow: 'hidden' })
  })

  it('should display the children after pressing on the title', async () => {
    await renderAccordion()

    expect(screen.queryByTestId('accordion-child-view')).not.toBeOnTheScreen()

    await user.press(screen.getByText('accordion title'))

    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('accordion-child-view')).toBeOnTheScreen()
  })

  it('should expand for accessibility the accordion after pressing the title', async () => {
    await renderAccordion()

    expect(screen.getByTestId('accordionTouchable')).toHaveAccessibilityState({ expanded: false })

    await user.press(screen.getByText('accordion title'))
    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('accordionTouchable')).toHaveAccessibilityState({ expanded: true })
  })

  it('correct arrow animation,', async () => {
    await renderAccordion()
    const accordionArrow = screen.getByTestId('accordionArrow')

    // ArrowNext (right) + 90° => arrow facing up.
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${Math.PI / 2}rad` })

    await user.press(screen.getByText('accordion title'))
    act(() => {
      jest.runAllTimers()
    })

    // ArrowNext (right) + 270° => arrow facing down.
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${(3 * Math.PI) / 2}rad` })
  })
})

const renderAccordion = () => {
  return renderAsync(
    <Accordion title={accordionTitle}>
      <Children />
    </Accordion>
  )
}
