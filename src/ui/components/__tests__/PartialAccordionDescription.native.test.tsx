import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { act, fireEvent, render } from 'tests/utils'
import { getSpacing } from 'ui/theme'

import { PartialAccordionDescription } from '../PartialAccordionDescription'

const description = venueResponseSnap.description || ''

describe('PartialAccordionDescription', () => {
  beforeAll(() => jest.useFakeTimers())

  it("is closed by default and we don't see all the long description", () => {
    const { getByTestId } = render(<PartialAccordionDescription description={description} />)
    const accordionBody = getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({ height: getSpacing(15), overflow: 'hidden' })
  })

  // TODO (Lucasbeneston) : Why the "voir plus" button is not displayed ?
  it.skip('we see all the description after pressing on the "voir plus" button', async () => {
    const { getByTestId, getByText } = render(
      <PartialAccordionDescription description={description} />
    )

    const accordionBody = getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({ height: getSpacing(15), overflow: 'hidden' })

    act(() => {
      fireEvent.press(getByText('voir plus'))
      jest.advanceTimersByTime(500)
    })

    expect(accordionBody.props.style).not.toEqual({ height: getSpacing(15), overflow: 'hidden' })
  })

  // TODO (Lucasbeneston) : Why the "voir plus" button is not displayed ?
  it.skip('correct arrow animation,', async () => {
    const { getByTestId, getByText } = render(
      <PartialAccordionDescription description={description} />
    )
    const accordionArrow = getByTestId('accordionArrow')
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${2 * Math.PI}rad` })

    act(() => {
      fireEvent.press(getByText('voir plus'))
      jest.advanceTimersByTime(500)
    })

    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${(2 * Math.PI) / 2}rad` })
  })
})
