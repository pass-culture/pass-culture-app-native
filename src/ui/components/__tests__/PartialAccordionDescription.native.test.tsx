import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { act, fireEvent, render } from 'tests/utils'
import { getSpacing } from 'ui/theme'

import { PartialAccordionDescription } from '../PartialAccordionDescription'

const description = venueResponseSnap.description || ''

describe('PartialAccordionDescription', () => {
  beforeAll(() => jest.useFakeTimers())

  it("is closed by default and we don't see all the long description", () => {
    const { getByTestId } = renderPartialAccordionDescription(description)
    const accordionBody = getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({ height: getSpacing(25), overflow: 'hidden' })
  })

  it('doesnt show "voir plus" button when is a short description', () => {
    const shortDescription = 'Description with less than 100 caracters'
    const { queryByText } = renderPartialAccordionDescription(shortDescription)
    expect(queryByText('voir plus')).toBeNull()
  })

  it('doesnt show description container when description is undefined', () => {
    const { queryByTestId } = renderPartialAccordionDescription(undefined)
    expect(queryByTestId('descriptionContainer')).toBeNull()
  })

  it('we see all the description after pressing on the "voir plus" button and display "voir moins" button', async () => {
    const { getByTestId, getByText } = renderPartialAccordionDescription(description)
    const accordionBody = getByTestId('accordionBody')
    expect(accordionBody.props.style).toEqual({ height: getSpacing(25), overflow: 'hidden' })

    act(() => {
      fireEvent.press(getByText('voir plus'))
      jest.advanceTimersByTime(500)
    })

    expect(getByText('voir moins'))
    expect(accordionBody.props.style).not.toEqual({ height: getSpacing(15), overflow: 'hidden' })
  })

  it('correct arrow animation,', async () => {
    const { getByTestId, getByText } = renderPartialAccordionDescription(description)
    const accordionArrow = getByTestId('accordionArrow')
    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${2 * Math.PI}rad` })

    act(() => {
      fireEvent.press(getByText('voir plus'))
      jest.advanceTimersByTime(500)
    })

    expect(accordionArrow.props.style.transform[0]).toEqual({ rotateZ: `${(2 * Math.PI) / 2}rad` })
  })
})

const renderPartialAccordionDescription = (description: string | undefined) => {
  const renderAPI = render(<PartialAccordionDescription description={description} />)
  const isLongDescription = 100
  if (description && description.length >= isLongDescription) {
    const descriptionContainer = renderAPI.getByTestId('descriptionContainer')
    fireEvent(descriptionContainer, 'layout', {
      nativeEvent: { layout: { height: getSpacing(26) } },
    })
  }
  return renderAPI
}
