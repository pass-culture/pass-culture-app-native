import React from 'react'

import {
  ANIMATION_DURATION,
  PARTIAL_DESCRIPTION_HEIGHT,
  VenuePartialAccordionDescription,
} from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { act, fireEvent, render } from 'tests/utils'

const description = venueResponseSnap.description || ''
let MOCK_TOTAL_DESCRIPTION_HEIGHT = PARTIAL_DESCRIPTION_HEIGHT * 2

jest.mock('ui/hooks/useElementHeight', () => ({
  useElementHeight: jest.fn(() => ({
    onLayout: jest.fn(),
    height: MOCK_TOTAL_DESCRIPTION_HEIGHT,
  })),
}))

describe('VenuePartialAccordionDescription', () => {
  beforeEach(() => jest.useFakeTimers('legacy'))

  it("is closed by default and we don't see all the long description", () => {
    const { getByTestId } = render(<VenuePartialAccordionDescription description={description} />)
    const accordionBody = getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({
      height: PARTIAL_DESCRIPTION_HEIGHT,
      overflow: 'hidden',
    })
  })

  it('doesnt show description container when description is undefined', () => {
    const { queryByTestId } = render(<VenuePartialAccordionDescription description={undefined} />)
    expect(queryByTestId('descriptionContainer')).toBeNull()
  })

  it('we see all the description after pressing on the "voir plus" button and display "voir moins" button', async () => {
    const { getByTestId, getByText } = render(
      <VenuePartialAccordionDescription description={description} />
    )
    const accordionBody = getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({
      height: PARTIAL_DESCRIPTION_HEIGHT,
      overflow: 'hidden',
    })

    act(() => {
      fireEvent.press(getByText('voir plus'))
      jest.advanceTimersByTime(ANIMATION_DURATION)
    })

    getByText('voir moins')
    expect(accordionBody.props.style).not.toEqual({
      height: PARTIAL_DESCRIPTION_HEIGHT,
      overflow: 'hidden',
    })
  })

  it('correct arrow animation,', async () => {
    const { getByTestId, getByText } = render(
      <VenuePartialAccordionDescription description={description} />
    )
    const accordionArrow = getByTestId('accordionArrow')
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${2 * Math.PI}rad` })

    act(() => {
      fireEvent.press(getByText('voir plus'))
      jest.advanceTimersByTime(ANIMATION_DURATION)
    })

    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${(2 * Math.PI) / 2}rad` })
  })

  it('doesnt show "voir plus" button when is a short description', () => {
    MOCK_TOTAL_DESCRIPTION_HEIGHT = PARTIAL_DESCRIPTION_HEIGHT / 2
    const shortDescription = 'Description with less than 100 caracters'
    const { queryByText } = render(
      <VenuePartialAccordionDescription description={shortDescription} />
    )
    expect(queryByText('voir plus')).toBeNull()
  })

  it('show credit when credit is defined', () => {
    const credit = 'Picture credit'
    const { queryByTestId } = render(<VenuePartialAccordionDescription credit={credit} />)
    expect(queryByTestId('credit')).not.toBeNull()
  })

  it('doesnt show credit when credit is undefined', () => {
    const { queryByTestId } = render(<VenuePartialAccordionDescription />)
    expect(queryByTestId('credit')).toBeNull()
  })
})
