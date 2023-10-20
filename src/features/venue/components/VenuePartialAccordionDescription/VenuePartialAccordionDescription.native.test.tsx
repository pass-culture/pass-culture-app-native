import React from 'react'

import {
  PARTIAL_DESCRIPTION_HEIGHT,
  VenuePartialAccordionDescription,
} from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { act, fireEvent, render, screen } from 'tests/utils'

const description = venueResponseSnap.description || ''
let MOCK_TOTAL_DESCRIPTION_HEIGHT = PARTIAL_DESCRIPTION_HEIGHT * 2

jest.mock('ui/hooks/useElementHeight', () => ({
  useElementHeight: jest.fn(() => ({
    onLayout: jest.fn(),
    height: MOCK_TOTAL_DESCRIPTION_HEIGHT,
  })),
}))

jest.useFakeTimers({ legacyFakeTimers: true })

describe('VenuePartialAccordionDescription', () => {
  it("is closed by default and we don't see all the long description", () => {
    render(<VenuePartialAccordionDescription description={description} />)
    const accordionBody = screen.getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({
      height: PARTIAL_DESCRIPTION_HEIGHT,
      overflow: 'hidden',
    })
  })

  it('doesnt show description container when description is undefined', () => {
    render(<VenuePartialAccordionDescription description={undefined} />)
    expect(screen.queryByTestId('descriptionContainer')).not.toBeOnTheScreen()
  })

  it('we see all the description after pressing on the "voir plus" button and display "voir moins" button', async () => {
    render(<VenuePartialAccordionDescription description={description} />)

    const accordionBody = screen.getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({
      height: PARTIAL_DESCRIPTION_HEIGHT,
      overflow: 'hidden',
    })

    act(() => {
      fireEvent.press(screen.getByText('voir plus'))
      jest.runAllTimers()
    })

    screen.getByText('voir moins')
    expect(accordionBody.props.style).not.toEqual({
      height: PARTIAL_DESCRIPTION_HEIGHT,
      overflow: 'hidden',
    })
  })

  it('correct arrow animation,', async () => {
    render(<VenuePartialAccordionDescription description={description} />)

    const accordionArrow = screen.getByTestId('accordionArrow')
    expect(accordionArrow.props.style.transform[0]).toEqual({
      rotateZ: `${2 * Math.PI}rad`,
    })

    act(() => {
      fireEvent.press(screen.getByText('voir plus'))
      jest.runAllTimers()
    })

    expect(accordionArrow.props.style.transform[0]).toEqual({
      rotateZ: `${(2 * Math.PI) / 2}rad`,
    })
  })

  it('doesnt show "voir plus" button when is a short description', () => {
    MOCK_TOTAL_DESCRIPTION_HEIGHT = PARTIAL_DESCRIPTION_HEIGHT / 2
    const shortDescription = 'Description with less than 100 caracters'

    render(<VenuePartialAccordionDescription description={shortDescription} />)

    expect(screen.queryByText('voir plus')).not.toBeOnTheScreen()
  })

  it('show credit when credit is defined', () => {
    const credit = 'Picture credit'
    render(<VenuePartialAccordionDescription credit={credit} />)
    expect(screen.queryByTestId('credit')).toBeOnTheScreen()
  })

  it('doesnt show credit when credit is undefined', () => {
    render(<VenuePartialAccordionDescription />)
    expect(screen.queryByTestId('credit')).not.toBeOnTheScreen()
  })
})
