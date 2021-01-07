import { render } from '@testing-library/react-native'
import React from 'react'
import { QueryClient } from 'react-query'

import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { OfferPartialDescription } from '../OfferPartialDescription'

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua: https://google.com'

describe('OfferPartialDescription', () => {
  it('centers CTA when provided description is empty', async () => {
    const { getByTestId } = await renderOfferDescription('')
    const offerSeeMoreContainer = getByTestId('offerSeeMoreContainer')
    expect(offerSeeMoreContainer.props.style[0].alignSelf).toBe('center')
  })
  it('places CTA on flex-end when provided a description', async () => {
    const { getByTestId } = await renderOfferDescription(description)
    const offerSeeMoreContainer = getByTestId('offerSeeMoreContainer')
    expect(offerSeeMoreContainer.props.style[0].alignSelf).toBe('flex-end')
  })
  it('renders externalLinks if http(s) url are present in the description', async () => {
    const { queryByTestId } = await renderOfferDescription(description)
    expect(queryByTestId('externalSiteIcon')).toBeTruthy()
  })
  it("shouldn't render an empty line and a spacer when description is undefined", async () => {
    const { queryByTestId } = await renderOfferDescription(undefined)
    expect(queryByTestId('offerPartialDescriptionBody')).toBeFalsy()
  })
  it("shouldn't render the SeeMore button if no content is on description page", async () => {
    const { queryByTestId } = render(
      reactQueryProviderHOC(
        <OfferPartialDescription id={offerId} description={undefined} />,
        (queryClient: QueryClient) => {
          queryClient.setQueryData(['offer', offerId], {
            ...offerResponseSnap,
            image: {},
            extraData: {},
          })
        }
      )
    )
    expect(queryByTestId('offerSeeMoreContainer')).toBeFalsy()
  })
})

const offerId = 123
const renderOfferDescription = async (description?: string) => {
  const setup = (queryClient: QueryClient) => {
    queryClient.removeQueries()
    queryClient.setQueryData(['offer', offerId], offerResponseSnap)
  }

  const wrapper = render(
    reactQueryProviderHOC(<OfferPartialDescription id={offerId} description={description} />, setup)
  )
  return wrapper
}
