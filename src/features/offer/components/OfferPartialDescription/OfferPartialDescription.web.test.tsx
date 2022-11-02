import React from 'react'
import { QueryClient } from 'react-query'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { CustomRenderOptions, render } from 'tests/utils/web'

import { OfferPartialDescription } from '../OfferPartialDescription/OfferPartialDescription'

const defaultDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua: https://google.com'
const offerId = 123
type Setup = (queryClient: QueryClient) => void
const defaultSetup: Setup = (queryClient) => {
  queryClient.removeQueries()
  queryClient.setQueryData(['offer', offerId], offerResponseSnap)
}
type Params = {
  description?: string
  setup: Setup
  options?: CustomRenderOptions
}
const defaultParams: Params = {
  description: defaultDescription,
  setup: defaultSetup,
  options: undefined,
}

describe('OfferPartialDescription', () => {
  it('centers CTA when provided description is empty', () => {
    const { getByTestId } = renderOfferDescription({
      ...defaultParams,
      description: '',
    })
    const offerSeeMoreContainer = getByTestId('offerSeeMoreContainer')
    const { alignSelf } = offerSeeMoreContainer.style
    expect(alignSelf).toBe('center')
  })
  it('places CTA on flex-end when provided a description', () => {
    const { getByTestId } = renderOfferDescription(defaultParams)
    const offerSeeMoreContainer = getByTestId('offerSeeMoreContainer')
    const { alignSelf } = offerSeeMoreContainer.style
    expect(alignSelf).toBe('flex-end')
  })
  it('renders externalLinks if http(s) url are present in the description', () => {
    const { queryByTestId } = renderOfferDescription(defaultParams)
    expect(queryByTestId('externalSiteIcon')).toBeTruthy()
  })
  it("shouldn't render an empty line and a spacer when description is empty", () => {
    const { queryByTestId } = renderOfferDescription({
      ...defaultParams,
      description: undefined,
    })
    expect(queryByTestId('offerPartialDescriptionBody')).toBeFalsy()
  })
  describe('SeeMore button', () => {
    const setupWithNoDataInDescriptionPage: Setup = (queryClient) => {
      queryClient.setQueryData(['offer', offerId], {
        ...offerResponseSnap,
        image: {},
        extraData: {},
      })
    }

    it('should be rendered when there is some content on the description page', () => {
      const { queryByTestId } = renderOfferDescription(defaultParams)
      expect(queryByTestId('offerSeeMoreContainer')).toBeTruthy()
    })
    describe('should be rendered', () => {
      it('on phone when the description is ellipsed', () => {
        const { queryByTestId } = renderOfferDescription({
          ...defaultParams,
          setup: (queryClient) => {
            queryClient.setQueryData(['offer', offerId], {
              image: {},
              extraData: {},
            })
          },
          options: {
            theme: {
              isMobileViewport: true,
              isTabletViewport: false,
              isDesktopViewport: false,
            },
          },
        })
        expect(queryByTestId('offerSeeMoreContainer')).toBeTruthy()
      })
      it('when there is image on the description page', () => {
        const { queryByTestId } = renderOfferDescription({
          ...defaultParams,
          description: undefined,
          setup: (queryClient) => {
            queryClient.setQueryData(['offer', offerId], {
              image: offerResponseSnap.image,
              extraData: {},
            })
          },
        })
        expect(queryByTestId('offerSeeMoreContainer')).toBeTruthy()
      })
      it('when there is extraData on the description page', () => {
        const { queryByTestId } = renderOfferDescription({
          ...defaultParams,
          description: undefined,
          setup: (queryClient) => {
            queryClient.setQueryData(['offer', offerId], {
              image: {},
              extraData: { author: 'John Lang' },
            })
          },
        })
        expect(queryByTestId('offerSeeMoreContainer')).toBeTruthy()
      })
    })
    describe("shouldn't be rendered", () => {
      it('when there is no content on the description page', () => {
        const { queryByTestId } = renderOfferDescription({
          description: undefined,
          setup: setupWithNoDataInDescriptionPage,
        })
        expect(queryByTestId('offerSeeMoreContainer')).toBeFalsy()
      })
      it('on desktop when there is only description on the description page', () => {
        const { queryByTestId } = renderOfferDescription({
          ...defaultParams,
          setup: setupWithNoDataInDescriptionPage,
          options: {
            theme: {
              isMobileViewport: false,
              isTabletViewport: false,
              isDesktopViewport: true,
            },
          },
        })

        expect(queryByTestId('offerSeeMoreContainer')).toBeFalsy()
      })
    })
  })
})

const renderOfferDescription = ({ description, setup, options }: Params) => {
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferPartialDescription id={offerId} description={description} />,
      setup
    ),
    options
  )
  return wrapper
}
