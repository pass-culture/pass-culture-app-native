import { render } from '@testing-library/react-native'
import React from 'react'

import { OfferPartialDescription } from '../OfferPartialDescription'

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua: https://google.com'

describe('OfferPartialDescription', () => {
  it('centers CTA when provided description is empty', () => {
    const { getByTestId } = render(<OfferPartialDescription id={123} description={''} />)
    const offerSeeMoreContainer = getByTestId('offerSeeMoreContainer')
    expect(offerSeeMoreContainer.props.style[0].alignSelf).toBe('center')
  })
  it('places CTA on flex-end when provided a description', () => {
    const { getByTestId } = render(<OfferPartialDescription id={123} description={description} />)
    const offerSeeMoreContainer = getByTestId('offerSeeMoreContainer')
    expect(offerSeeMoreContainer.props.style[0].alignSelf).toBe('flex-end')
  })
  it('renders externalLinks if http(s) url are present in the description', () => {
    const { queryByTestId } = render(<OfferPartialDescription id={123} description={description} />)
    expect(queryByTestId('externalSiteIcon')).toBeTruthy()
  })
  it("shouldn't render an empty line and a spacer when description is undefined", () => {
    const { queryByTestId } = render(<OfferPartialDescription id={123} description={undefined} />)
    expect(queryByTestId('offerPartialDescriptionBody')).toBeFalsy()
  })
})
